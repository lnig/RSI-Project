package org.example.flightreservationsystem.service;

import org.example.flightreservationsystem.model.Reservation;

import java.math.BigDecimal;
import java.util.List;

public interface ReservationService {
    Reservation createReservation(Reservation reservation);
    Reservation getReservationById(Integer id);
    Reservation getReservationByCode(String reservationCode);
    List<Reservation> getAllReservations();
    Reservation updateReservation(Integer id, Reservation reservation);
    void cancelReservation(String reservationCode);
    BigDecimal calculateTotalPrice(Integer flightId, Integer seats);
}