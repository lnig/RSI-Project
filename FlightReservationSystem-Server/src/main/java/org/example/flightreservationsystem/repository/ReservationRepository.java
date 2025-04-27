package org.example.flightreservationsystem.repository;

import org.example.flightreservationsystem.model.ReservationDTO;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ReservationRepository extends JpaRepository<ReservationDTO, Integer> {
    ReservationDTO findByReservationCode(String reservationCode);
    boolean existsByReservationCode(String reservationCode);
}