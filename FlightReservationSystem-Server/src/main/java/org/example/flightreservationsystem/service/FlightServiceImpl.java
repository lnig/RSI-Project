package org.example.flightreservationsystem.service;

import org.example.flightreservationsystem.model.Flight;
import org.example.flightreservationsystem.repository.FlightRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@Transactional
public class FlightServiceImpl implements FlightService {

    private final FlightRepository flightRepository;

    public FlightServiceImpl(FlightRepository flightRepository) {
        this.flightRepository = flightRepository;
    }

    @Override
    public Flight addFlight(Flight flight) {
        if (flight.getArrivalDatetime().isBefore(flight.getDepartureDatetime())) {
            throw new IllegalArgumentException("Arrival date cannot be before departure date");
        }
        flight.setAvailableSeats(flight.getTotalSeats()); // Initialize available seats
        return flightRepository.save(flight);
    }

    @Override
    public Flight getFlightById(Integer id) {
        return flightRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Flight not found with id: " + id));
    }

    @Override
    public List<Flight> getAllFlights() {
        return flightRepository.findAll();
    }

    @Override
    public Flight updateFlight(Integer id, Flight flight) {
        Flight existingFlight = getFlightById(id);
        existingFlight.setFlightCode(flight.getFlightCode());
        existingFlight.setDepartureCity(flight.getDepartureCity());
        existingFlight.setArrivalCity(flight.getArrivalCity());
        existingFlight.setDepartureDatetime(flight.getDepartureDatetime());
        existingFlight.setArrivalDatetime(flight.getArrivalDatetime());
        existingFlight.setBasePrice(flight.getBasePrice());

        // When updating total seats, also adjust available seats
        int seatDifference = flight.getTotalSeats() - existingFlight.getTotalSeats();
        existingFlight.setTotalSeats(flight.getTotalSeats());
        existingFlight.setAvailableSeats(existingFlight.getAvailableSeats() + seatDifference);

        return flightRepository.save(existingFlight);
    }

    @Override
    public void deleteFlight(Integer id) {
        flightRepository.deleteById(id);
    }

    @Override
    public List<Flight> findFlightsBetweenCities(Integer departureCityId, Integer arrivalCityId,
                                                 LocalDateTime departureDate, LocalDateTime returnDate) {
        if (departureDate == null) {
            return flightRepository.findByDepartureCityIdAndArrivalCityId(departureCityId, arrivalCityId);
        }
        return flightRepository.findByDepartureCityIdAndArrivalCityIdAndDepartureDatetimeBetween(
                departureCityId, arrivalCityId, departureDate, returnDate);
    }

    @Override
    public boolean checkSeatAvailability(Integer flightId, Integer seatsRequested) {
        Flight flight = getFlightById(flightId);
        return flight.getAvailableSeats() >= seatsRequested;
    }

    @Override
    public void updateAvailableSeats(Integer flightId, Integer seatsReserved) {
        Flight flight = getFlightById(flightId);
        int newAvailableSeats = flight.getAvailableSeats() - seatsReserved;
        if (newAvailableSeats < 0) {
            throw new IllegalStateException("Not enough seats available");
        }
        flight.setAvailableSeats(newAvailableSeats);
        flightRepository.save(flight);
    }

    @Override
    public Flight getFlightByIdWithCities(Integer id) {
        Flight flight = flightRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Flight not found with id: " + id));
        // Initialize cities
        flight.getDepartureCity().getId();
        flight.getArrivalCity().getId();
        return flight;
    }

    @Override
    public List<Flight> findFlightsBetweenCitiesWithCities(Integer departureCityId, Integer arrivalCityId,
                                                           LocalDateTime departureDate, LocalDateTime returnDate) {
        List<Flight> flights = findFlightsBetweenCities(departureCityId, arrivalCityId, departureDate, returnDate);
        // Initialize cities for each flight
        flights.forEach(flight -> {
            flight.getDepartureCity().getId();
            flight.getArrivalCity().getId();
        });
        return flights;
    }

    @Override
    public List<Flight> getAllFlightsWithCities() {
        List<Flight> flights = flightRepository.findAll();
        // Initialize cities for each flight to avoid LazyInitializationException
        flights.forEach(flight -> {
            flight.getDepartureCity().getId(); // Trigger loading
            flight.getArrivalCity().getId();   // Trigger loading
        });
        return flights;
    }

}