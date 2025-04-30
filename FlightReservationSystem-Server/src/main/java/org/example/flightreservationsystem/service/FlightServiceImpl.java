package org.example.flightreservationsystem.service;

import org.example.flightreservationsystem.model.FlightDTO;
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
    public FlightDTO getFlightById(Integer id) {
        return flightRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Flight not found with id: " + id));
    }

    @Override
    public List<FlightDTO> findFlightsBetweenCities(Integer departureCityId, Integer arrivalCityId,
                                                    LocalDateTime departureDate, LocalDateTime returnDate) {
        if (departureDate == null) {
            return flightRepository.findByDepartureCityIdAndArrivalCityId(departureCityId, arrivalCityId);
        }
        return flightRepository.findByDepartureCityIdAndArrivalCityIdAndDepartureDatetimeBetween(
                departureCityId, arrivalCityId, departureDate, returnDate);
    }

    @Override
    public boolean checkSeatAvailability(Integer flightId, Integer seatsRequested) {
        FlightDTO flight = getFlightById(flightId);
        return flight.getAvailableSeats() >= seatsRequested;
    }

    @Override
    public void updateAvailableSeats(Integer flightId, Integer seatsReserved) {
        FlightDTO flight = getFlightById(flightId);
        int newAvailableSeats = flight.getAvailableSeats() - seatsReserved;
        if (newAvailableSeats < 0) {
            throw new IllegalStateException("Not enough seats available");
        }
        flight.setAvailableSeats(newAvailableSeats);
        flightRepository.save(flight);
    }

    @Override
    public FlightDTO getFlightByIdWithCities(Integer id) {
        FlightDTO flight = flightRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Flight not found with id: " + id));

        flight.getDepartureCity().getId();
        flight.getArrivalCity().getId();
        return flight;
    }

    @Override
    public List<FlightDTO> findFlightsBetweenCitiesWithCities(Integer departureCityId, Integer arrivalCityId,
                                                              LocalDateTime departureDate, LocalDateTime returnDate) {
        List<FlightDTO> flights = findFlightsBetweenCities(departureCityId, arrivalCityId, departureDate, returnDate);

        flights.forEach(flight -> {
            flight.getDepartureCity().getId();
            flight.getArrivalCity().getId();
        });
        return flights;
    }

    @Override
    public List<FlightDTO> getAllFlightsWithCities() {
        List<FlightDTO> flights = flightRepository.findAll();

        flights.forEach(flight -> {
            flight.getDepartureCity().getId();
            flight.getArrivalCity().getId();
        });
        return flights;
    }

}