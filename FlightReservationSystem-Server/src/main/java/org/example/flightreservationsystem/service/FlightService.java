package org.example.flightreservationsystem.service;

import org.example.flightreservationsystem.model.FlightDTO;

import java.time.LocalDateTime;
import java.util.List;

public interface FlightService {
    FlightDTO getFlightById(Integer id);
    List<FlightDTO> findFlightsBetweenCities(Integer departureCityId, Integer arrivalCityId,
                                             LocalDateTime departureDate, LocalDateTime returnDate);
    boolean checkSeatAvailability(Integer flightId, Integer seatsRequested);
    void updateAvailableSeats(Integer flightId, Integer seatsReserved);
    FlightDTO getFlightByIdWithCities(Integer id);
    List<FlightDTO> findFlightsBetweenCitiesWithCities(Integer departureCityId, Integer arrivalCityId,
                                                       LocalDateTime departureDate, LocalDateTime returnDate);
    List<FlightDTO> getAllFlightsWithCities();
}