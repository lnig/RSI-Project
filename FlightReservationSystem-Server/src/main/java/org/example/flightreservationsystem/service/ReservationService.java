package org.example.flightreservationsystem.service;

import org.example.flightreservationsystem.model.ReservationDTO;

import java.math.BigDecimal;
import java.util.List;

public interface ReservationService {
    ReservationDTO createReservation(ReservationDTO reservation);
    ReservationDTO getReservationById(Integer id);
    ReservationDTO getReservationByCode(String reservationCode);
    void cancelReservation(String reservationCode);
    BigDecimal calculateTotalPrice(Integer flightId, Integer seats);
}