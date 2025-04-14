package org.example.flightreservationsystem.repository;

import org.example.flightreservationsystem.model.Reservation;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ReservationRepository extends JpaRepository<Reservation, Integer> {
    Reservation findByReservationCode(String reservationCode);
    boolean existsByReservationCode(String reservationCode);
}