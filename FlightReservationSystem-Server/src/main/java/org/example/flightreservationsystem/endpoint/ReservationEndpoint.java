package org.example.flightreservationsystem.endpoint;

import org.example.flightreservationsystem.model.CityDTO;
import org.example.flightreservationsystem.model.FlightDTO;
import org.example.flightreservationsystem.model.ReservationDTO;
import org.example.flightreservationsystem.service.FlightService;
import org.example.flightreservationsystem.service.PdfGenerationService;
import org.example.flightreservationsystem.service.ReservationService;
import org.example.flightreservationsystem.wsdl.*;
import org.springframework.ws.server.endpoint.annotation.Endpoint;
import org.springframework.ws.server.endpoint.annotation.PayloadRoot;
import org.springframework.ws.server.endpoint.annotation.RequestPayload;
import org.springframework.ws.server.endpoint.annotation.ResponsePayload;

import javax.xml.datatype.DatatypeFactory;
import javax.xml.datatype.XMLGregorianCalendar;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.GregorianCalendar;

@Endpoint
public class ReservationEndpoint {
    private static final String NAMESPACE_URI = "http://example.org/flightreservationsystem";

    private final ReservationService reservationService;
    private final FlightService flightService;
    private final PdfGenerationService pdfGenerationService;

    public ReservationEndpoint(ReservationService reservationService, FlightService flightService, PdfGenerationService pdfGenerationService) {
        this.reservationService = reservationService;
        this.flightService = flightService;
        this.pdfGenerationService = pdfGenerationService;
    }

    @PayloadRoot(namespace = NAMESPACE_URI, localPart = "createReservationRequest")
    @ResponsePayload
    public CreateReservationResponse createReservation(@RequestPayload CreateReservationRequest request) {
        CreateReservationResponse response = new CreateReservationResponse();

        // Pobierz pełne dane o locie
        FlightDTO flight = flightService.getFlightById(request.getFlightId());
        if (flight == null) {
            throw new RuntimeException("Flight not found with id: " + request.getFlightId());
        }

        ReservationDTO reservation = new ReservationDTO();
        reservation.setPassengerFirstname(request.getPassengerFirstname());
        reservation.setPassengerLastname(request.getPassengerLastname());
        reservation.setPassengerEmail(request.getPassengerEmail());
        reservation.setSeatsReserved(request.getSeatsReserved());
        reservation.setFlight(flight);

        ReservationDTO createdReservation = reservationService.createReservation(reservation);
        response.setReservation(mapReservation(createdReservation));
        return response;
    }

    @PayloadRoot(namespace = NAMESPACE_URI, localPart = "getReservationByCodeRequest")
    @ResponsePayload
    public GetReservationByCodeResponse getReservationByCode(@RequestPayload GetReservationByCodeRequest request) {
        GetReservationByCodeResponse response = new GetReservationByCodeResponse();
        try {
            ReservationDTO reservation = reservationService.getReservationByCode(request.getReservationCode());
            if (reservation == null) {
                throw new RuntimeException("Reservation not found with code: " + request.getReservationCode());
            }

            // Wymuś załadowanie powiązanego Flight jeśli jest LAZY
            if (reservation.getFlight() != null) {
                reservation.getFlight().getId(); // To wymusza załadowanie jeśli jest LAZY
            }

            response.setReservation(mapReservation(reservation));
        } catch (Exception e) {
            throw new RuntimeException("Error getting reservation: " + e.getMessage(), e);
        }
        return response;
    }

    @PayloadRoot(namespace = NAMESPACE_URI, localPart = "cancelReservationRequest")
    @ResponsePayload
    public CancelReservationResponse cancelReservation(@RequestPayload CancelReservationRequest request) {
        CancelReservationResponse response = new CancelReservationResponse();

        try {
            reservationService.cancelReservation(request.getReservationCode());
            response.setSuccess(true);
            response.setMessage("Reservation canceled successfully");
        } catch (Exception e) {
            response.setSuccess(false);
            response.setMessage("Error canceling reservation: " + e.getMessage());
        }

        return response;
    }

    @PayloadRoot(namespace = NAMESPACE_URI, localPart = "getReservationPdfRequest")
    @ResponsePayload
    public GetReservationPdfResponse getReservationPdf(@RequestPayload GetReservationPdfRequest request) {
        GetReservationPdfResponse response = new GetReservationPdfResponse();

        try {
            ReservationDTO reservation = reservationService.getReservationByCode(request.getReservationCode());
            if (reservation == null) {
                throw new RuntimeException("Reservation not found with code: " + request.getReservationCode());
            }

            byte[] pdfBytes = pdfGenerationService.generateReservationPdf(reservation);
            response.setPdfData(pdfBytes);
            response.setFileName("Reservation_" + reservation.getReservationCode() + ".pdf");
            response.setSuccess(true);
        } catch (Exception e) {
            response.setSuccess(false);
            response.setMessage("Error generating PDF: " + e.getMessage());
        }

        return response;
    }

    private org.example.flightreservationsystem.wsdl.Reservation mapReservation(ReservationDTO reservation) {
        org.example.flightreservationsystem.wsdl.Reservation soapReservation =
                new org.example.flightreservationsystem.wsdl.Reservation();

        soapReservation.setId(reservation.getId());
        soapReservation.setReservationCode(reservation.getReservationCode());
        soapReservation.setPassengerFirstname(reservation.getPassengerFirstname());
        soapReservation.setPassengerLastname(reservation.getPassengerLastname());
        soapReservation.setPassengerEmail(reservation.getPassengerEmail());
        soapReservation.setSeatsReserved(reservation.getSeatsReserved());
        soapReservation.setTotalPrice(reservation.getTotalPrice());

        try {
            if (reservation.getReservationDate() != null) {
                XMLGregorianCalendar reservationDate = convertToXmlGregorianCalendar(reservation.getReservationDate());
                soapReservation.setReservationDate(reservationDate);
            }
        } catch (Exception e) {
            throw new RuntimeException("Error converting reservation date", e);
        }

        // Map full flight details
        if (reservation.getFlight() != null) {
            FlightDTO flight = reservation.getFlight();
            org.example.flightreservationsystem.wsdl.Flight soapFlight =
                    new org.example.flightreservationsystem.wsdl.Flight();

            soapFlight.setId(flight.getId());
            soapFlight.setFlightCode(flight.getFlightCode());

            // Map departure city
            if (flight.getDepartureCity() != null) {
                CityDTO departureCity = flight.getDepartureCity();
                org.example.flightreservationsystem.wsdl.City soapDepartureCity =
                        new org.example.flightreservationsystem.wsdl.City();
                soapDepartureCity.setId(departureCity.getId());
                soapDepartureCity.setCityName(departureCity.getCityName());
                soapDepartureCity.setCountry(departureCity.getCountry());
                soapFlight.setDepartureCity(soapDepartureCity);
            }

            // Map arrival city
            if (flight.getArrivalCity() != null) {
                CityDTO arrivalCity = flight.getArrivalCity();
                org.example.flightreservationsystem.wsdl.City soapArrivalCity =
                        new org.example.flightreservationsystem.wsdl.City();
                soapArrivalCity.setId(arrivalCity.getId());
                soapArrivalCity.setCityName(arrivalCity.getCityName());
                soapArrivalCity.setCountry(arrivalCity.getCountry());
                soapFlight.setArrivalCity(soapArrivalCity);
            }

            try {
                // Map departure datetime
                if (flight.getDepartureDatetime() != null) {
                    XMLGregorianCalendar departureDatetime = convertToXmlGregorianCalendar(flight.getDepartureDatetime());
                    soapFlight.setDepartureDatetime(departureDatetime);
                }

                // Map arrival datetime
                if (flight.getArrivalDatetime() != null) {
                    XMLGregorianCalendar arrivalDatetime = convertToXmlGregorianCalendar(flight.getArrivalDatetime());
                    soapFlight.setArrivalDatetime(arrivalDatetime);
                }
            } catch (Exception e) {
                throw new RuntimeException("Error converting flight dates", e);
            }

            soapFlight.setTotalSeats(flight.getTotalSeats());
            soapFlight.setAvailableSeats(flight.getAvailableSeats());
            soapFlight.setBasePrice(flight.getBasePrice());

            soapReservation.setFlight(soapFlight);
        }

        return soapReservation;
    }

    private XMLGregorianCalendar convertToXmlGregorianCalendar(LocalDateTime localDateTime) throws Exception {
        GregorianCalendar gCalendar = GregorianCalendar.from(localDateTime.atZone(ZoneId.systemDefault()));
        return DatatypeFactory.newInstance().newXMLGregorianCalendar(gCalendar);
    }
}