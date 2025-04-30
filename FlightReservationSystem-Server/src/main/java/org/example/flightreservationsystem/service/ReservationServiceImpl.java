package org.example.flightreservationsystem.service;

import org.example.flightreservationsystem.model.FlightDTO;
import org.example.flightreservationsystem.model.ReservationDTO;
import org.example.flightreservationsystem.repository.FlightRepository;
import org.example.flightreservationsystem.repository.ReservationRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@Transactional
public class ReservationServiceImpl implements ReservationService {

    private final ReservationRepository reservationRepository;
    private final FlightRepository flightRepository;

    public ReservationServiceImpl(ReservationRepository reservationRepository,
                                  FlightRepository flightRepository) {
        this.reservationRepository = reservationRepository;
        this.flightRepository = flightRepository;
    }

    @Override
    public ReservationDTO createReservation(ReservationDTO reservation) {
        if (reservation == null || reservation.getFlight() == null || reservation.getSeatsReserved() == null) {
            throw new IllegalArgumentException("Invalid reservation data");
        }

        FlightDTO flight = flightRepository.findById(reservation.getFlight().getId())
                .orElseThrow(() -> new RuntimeException("Flight not found with id: " + reservation.getFlight().getId()));

        if (flight.getAvailableSeats() < reservation.getSeatsReserved()) {
            throw new IllegalStateException("Not enough seats available");
        }

        String reservationCode;
        do {
            reservationCode = generateReservationCode();
        } while (reservationRepository.existsByReservationCode(reservationCode));

        reservation.setReservationCode(reservationCode);

        BigDecimal totalPrice = flight.getBasePrice().multiply(BigDecimal.valueOf(reservation.getSeatsReserved()));
        reservation.setTotalPrice(totalPrice);

        reservation.setReservationDate(LocalDateTime.now());

        flight.setAvailableSeats(flight.getAvailableSeats() - reservation.getSeatsReserved());
        flightRepository.save(flight);

        return reservationRepository.save(reservation);
    }

    @Override
    public ReservationDTO getReservationById(Integer id) {
        return reservationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Reservation not found with id: " + id));
    }

    @Override
    public ReservationDTO getReservationByCode(String reservationCode) {
        return reservationRepository.findByReservationCode(reservationCode);
    }

    @Override
    public void cancelReservation(String reservationCode) {
        if (reservationCode == null || reservationCode.isBlank()) {
            throw new IllegalArgumentException("Reservation code cannot be null or empty");
        }

        ReservationDTO reservation = reservationRepository.findByReservationCode(reservationCode);
        if (reservation == null) {
            throw new RuntimeException("Reservation not found with code: " + reservationCode);
        }

        FlightDTO flight = reservation.getFlight();
        if (flight != null) {
            flight.setAvailableSeats(flight.getAvailableSeats() + reservation.getSeatsReserved());
            flightRepository.save(flight);
        }

        reservationRepository.delete(reservation);
    }

        @Override
    public BigDecimal calculateTotalPrice(Integer flightId, Integer seats) {
        FlightDTO flight = flightRepository.findById(flightId)
                .orElseThrow(() -> new RuntimeException("Flight not found"));
        return flight.getBasePrice().multiply(BigDecimal.valueOf(seats));
    }

    private String generateReservationCode() {
        return UUID.randomUUID().toString().replace("-", "").substring(0, 8).toUpperCase();
    }
}