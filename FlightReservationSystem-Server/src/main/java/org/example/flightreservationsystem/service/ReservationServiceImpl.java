package org.example.flightreservationsystem.service;

import org.example.flightreservationsystem.model.Flight;
import org.example.flightreservationsystem.model.Reservation;
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
    private final FlightService flightService;

    public ReservationServiceImpl(ReservationRepository reservationRepository,
                                  FlightRepository flightRepository,
                                  FlightService flightService) {
        this.reservationRepository = reservationRepository;
        this.flightRepository = flightRepository;
        this.flightService = flightService;
    }

    @Override
    public Reservation createReservation(Reservation reservation) {
        if (!flightService.checkSeatAvailability(reservation.getFlight().getId(), reservation.getSeatsReserved())) {
            throw new IllegalStateException("Not enough seats available");
        }

        // Generate unique reservation code
        reservation.setReservationCode(generateReservationCode());

        // Calculate total price
        BigDecimal totalPrice = calculateTotalPrice(reservation.getFlight().getId(), reservation.getSeatsReserved());
        reservation.setTotalPrice(totalPrice);

        // Set reservation date
        reservation.setReservationDate(LocalDateTime.now());

        // Save reservation
        Reservation savedReservation = reservationRepository.save(reservation);

        // Update available seats
        flightService.updateAvailableSeats(reservation.getFlight().getId(), reservation.getSeatsReserved());

        return savedReservation;
    }

    @Override
    public Reservation getReservationById(Integer id) {
        return reservationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Reservation not found with id: " + id));
    }

    @Override
    public Reservation getReservationByCode(String reservationCode) {
        return reservationRepository.findByReservationCode(reservationCode);
    }

    @Override
    public List<Reservation> getAllReservations() {
        return reservationRepository.findAll();
    }

    @Override
    public Reservation updateReservation(Integer id, Reservation reservation) {
        Reservation existingReservation = getReservationById(id);

        // Handle seat changes
        int seatDifference = reservation.getSeatsReserved() - existingReservation.getSeatsReserved();
        if (seatDifference != 0) {
            if (!flightService.checkSeatAvailability(reservation.getFlight().getId(), seatDifference)) {
                throw new IllegalStateException("Not enough seats available for update");
            }
            flightService.updateAvailableSeats(reservation.getFlight().getId(), -seatDifference);
        }

        // Update fields
        existingReservation.setPassengerFirstname(reservation.getPassengerFirstname());
        existingReservation.setPassengerLastname(reservation.getPassengerLastname());
        existingReservation.setPassengerEmail(reservation.getPassengerEmail());
        existingReservation.setSeatsReserved(reservation.getSeatsReserved());
        existingReservation.setTotalPrice(calculateTotalPrice(reservation.getFlight().getId(), reservation.getSeatsReserved()));

        return reservationRepository.save(existingReservation);
    }

    @Override
    public void cancelReservation(String reservationCode) {
        if (reservationCode == null || reservationCode.isBlank()) {
            throw new IllegalArgumentException("Reservation code cannot be null or empty");
        }

        Reservation reservation = reservationRepository.findByReservationCode(reservationCode);

        // Zwróć miejsca do puli dostępnych
        Flight flight = reservation.getFlight();
        flight.setAvailableSeats(flight.getAvailableSeats() + reservation.getSeatsReserved());
        flightRepository.save(flight);

        // Usuń rezerwację
        reservationRepository.delete(reservation);
    }

    @Override
    public BigDecimal calculateTotalPrice(Integer flightId, Integer seats) {
        Flight flight = flightRepository.findById(flightId)
                .orElseThrow(() -> new RuntimeException("Flight not found"));
        return flight.getBasePrice().multiply(BigDecimal.valueOf(seats));
    }

    private String generateReservationCode() {
        return UUID.randomUUID().toString().substring(0, 8).toUpperCase();
    }
}