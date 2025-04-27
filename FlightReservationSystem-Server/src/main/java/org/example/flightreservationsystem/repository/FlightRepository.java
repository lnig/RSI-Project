package org.example.flightreservationsystem.repository;

import org.example.flightreservationsystem.model.FlightDTO;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface FlightRepository extends JpaRepository<FlightDTO, Integer> {
    @Query("SELECT f FROM FlightDTO f WHERE " +
            "f.departureCity.cityName = :departureCity AND " +
            "f.arrivalCity.cityName = :arrivalCity AND " +
            "f.departureDatetime >= :startDate AND " +
            "f.departureDatetime < :endDate AND " +
            "f.availableSeats >= :requiredSeats")
    List<FlightDTO> findAvailableFlights(
            @Param("departureCity") String departureCity,
            @Param("arrivalCity") String arrivalCity,
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate,
            @Param("requiredSeats") int requiredSeats);

    List<FlightDTO> findByDepartureCityIdAndArrivalCityId(Integer departureCityId, Integer arrivalCityId);

    List<FlightDTO> findByDepartureCityIdAndArrivalCityIdAndDepartureDatetimeBetween(Integer departureCityId, Integer arrivalCityId, LocalDateTime departureDate, LocalDateTime returnDate);
}