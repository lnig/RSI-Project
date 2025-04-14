package org.example.flightreservationsystem.service;

import org.example.flightreservationsystem.model.Flight;

import java.time.LocalDateTime;
import java.util.List;

public interface FlightService {
    Flight addFlight(Flight flight);
    Flight getFlightById(Integer id);
    List<Flight> getAllFlights();
    Flight updateFlight(Integer id, Flight flight);
    void deleteFlight(Integer id);
    List<Flight> findFlightsBetweenCities(Integer departureCityId, Integer arrivalCityId,
                                          LocalDateTime departureDate, LocalDateTime returnDate);
    boolean checkSeatAvailability(Integer flightId, Integer seatsRequested);
    void updateAvailableSeats(Integer flightId, Integer seatsReserved);
    Flight getFlightByIdWithCities(Integer id);
    List<Flight> findFlightsBetweenCitiesWithCities(Integer departureCityId, Integer arrivalCityId,
                                                    LocalDateTime departureDate, LocalDateTime returnDate);
    List<Flight> getAllFlightsWithCities();
}