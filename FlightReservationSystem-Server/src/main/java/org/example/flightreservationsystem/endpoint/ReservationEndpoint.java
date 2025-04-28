package org.example.flightreservationsystem.endpoint;

import com.sun.istack.ByteArrayDataSource;
import jakarta.activation.DataHandler;
import jakarta.activation.DataSource;
import jakarta.xml.ws.soap.MTOM;
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
import org.springframework.ws.soap.server.endpoint.annotation.SoapAction;

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

            if (reservation.getFlight() != null) {
                reservation.getFlight().getId();
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
    @MTOM(enabled = true, threshold = 1024)
    public GetReservationPdfResponse getReservationPdf(@RequestPayload GetReservationPdfRequest request) {
        GetReservationPdfResponse response = new GetReservationPdfResponse();

        try {
            ReservationDTO reservation = reservationService.getReservationByCode(request.getReservationCode());
            if (reservation == null) {
                throw new RuntimeException("Reservation not found with code: " + request.getReservationCode());
            }

            byte[] pdfBytes = pdfGenerationService.generateReservationPdf(reservation);

            DataSource dataSource = new ByteArrayDataSource(pdfBytes, "application/pdf");
            DataHandler dataHandler = new DataHandler(dataSource);

            response.setPdfData(dataHandler);
            response.setFileName("Reservation_" + reservation.getReservationCode() + ".pdf");
            response.setSuccess(true);
        } catch (Exception e) {
            response.setSuccess(false);
            response.setMessage("Error generating PDF: " + e.getMessage());
        }

        return response;
    }

    private Reservation mapReservation(ReservationDTO reservation) {
        Reservation soapReservation = new Reservation();

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

        if (reservation.getFlight() != null) {
            FlightDTO flight = reservation.getFlight();
            Flight soapFlight = new Flight();

            soapFlight.setId(flight.getId());
            soapFlight.setFlightCode(flight.getFlightCode());

            if (flight.getDepartureCity() != null) {
                CityDTO departureCity = flight.getDepartureCity();
                City soapDepartureCity = new City();

                soapDepartureCity.setId(departureCity.getId());
                soapDepartureCity.setCityName(departureCity.getCityName());
                soapDepartureCity.setCountry(departureCity.getCountry());
                soapFlight.setDepartureCity(soapDepartureCity);
            }

            if (flight.getArrivalCity() != null) {
                CityDTO arrivalCity = flight.getArrivalCity();
                City soapArrivalCity = new City();

                soapArrivalCity.setId(arrivalCity.getId());
                soapArrivalCity.setCityName(arrivalCity.getCityName());
                soapArrivalCity.setCountry(arrivalCity.getCountry());
                soapFlight.setArrivalCity(soapArrivalCity);
            }

            try {
                if (flight.getDepartureDatetime() != null) {
                    XMLGregorianCalendar departureDatetime = convertToXmlGregorianCalendar(flight.getDepartureDatetime());
                    soapFlight.setDepartureDatetime(departureDatetime);
                }

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