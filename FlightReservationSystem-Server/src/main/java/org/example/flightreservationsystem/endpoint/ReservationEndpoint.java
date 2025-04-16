package org.example.flightreservationsystem.endpoint;

import org.example.flightreservationsystem.model.Flight;
import org.example.flightreservationsystem.model.Reservation;
import org.example.flightreservationsystem.service.ReservationService;
import org.example.flightreservationsystem.wsdl.*;
import org.springframework.ws.server.endpoint.annotation.Endpoint;
import org.springframework.ws.server.endpoint.annotation.PayloadRoot;
import org.springframework.ws.server.endpoint.annotation.RequestPayload;
import org.springframework.ws.server.endpoint.annotation.ResponsePayload;

import javax.xml.datatype.DatatypeFactory;
import javax.xml.datatype.XMLGregorianCalendar;
import java.time.LocalDateTime;

@Endpoint
public class ReservationEndpoint {
    private static final String NAMESPACE_URI = "http://example.org/flightreservationsystem";

    private final ReservationService reservationService;

    public ReservationEndpoint(ReservationService reservationService) {
        this.reservationService = reservationService;
    }

    @PayloadRoot(namespace = NAMESPACE_URI, localPart = "createReservationRequest")
    @ResponsePayload
    public CreateReservationResponse createReservation(@RequestPayload CreateReservationRequest request) {
        CreateReservationResponse response = new CreateReservationResponse();

        Reservation reservation = new Reservation();
        reservation.setPassengerFirstname(request.getPassengerFirstname());
        reservation.setPassengerLastname(request.getPassengerLastname());
        reservation.setPassengerEmail(request.getPassengerEmail());
        reservation.setSeatsReserved(request.getSeatsReserved());
        
        Flight flight = new Flight();
        flight.setId(request.getFlightId());
        reservation.setFlight(flight);

        Reservation createdReservation = reservationService.createReservation(reservation);
        response.setReservation(mapReservation(createdReservation));
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

    private org.example.flightreservationsystem.wsdl.Reservation mapReservation(Reservation reservation) {
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
            XMLGregorianCalendar reservationDate = DatatypeFactory.newInstance()
                    .newXMLGregorianCalendar(reservation.getReservationDate().toString());
            soapReservation.setReservationDate(reservationDate);
        } catch (Exception e) {
            throw new RuntimeException("Error converting reservation date", e);
        }

        // Map flight if needed
        if (reservation.getFlight() != null) {
            org.example.flightreservationsystem.wsdl.Flight soapFlight =
                    new org.example.flightreservationsystem.wsdl.Flight();
            soapFlight.setId(reservation.getFlight().getId());
            soapReservation.setFlight(soapFlight);
        }

        return soapReservation;
    }
}