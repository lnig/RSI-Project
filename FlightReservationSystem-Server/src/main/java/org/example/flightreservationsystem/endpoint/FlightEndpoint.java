package org.example.flightreservationsystem.endpoint;

import org.example.flightreservationsystem.model.CityDTO;
import org.example.flightreservationsystem.model.FlightDTO;
import org.example.flightreservationsystem.service.FlightService;
import org.example.flightreservationsystem.wsdl.*;
import org.springframework.ws.server.endpoint.annotation.Endpoint;
import org.springframework.ws.server.endpoint.annotation.PayloadRoot;
import org.springframework.ws.server.endpoint.annotation.RequestPayload;
import org.springframework.ws.server.endpoint.annotation.ResponsePayload;

import javax.xml.datatype.DatatypeFactory;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.GregorianCalendar;
import java.util.List;

@Endpoint
public class FlightEndpoint {
    private static final String NAMESPACE_URI = "http://example.org/flightreservationsystem";

    private final FlightService flightService;

    public FlightEndpoint(FlightService flightService) {
        this.flightService = flightService;
    }

    @PayloadRoot(namespace = NAMESPACE_URI, localPart = "getFlightRequest")
    @ResponsePayload
    public GetFlightResponse getFlight(@RequestPayload GetFlightRequest request) {
        GetFlightResponse response = new GetFlightResponse();
        try {
            response.setFlight(convertToWsdlFlight(flightService.getFlightByIdWithCities(request.getId())));
        } catch (Exception e) {
            throw new RuntimeException("Error processing flight request: " + e.getMessage(), e);
        }
        return response;
    }

    @PayloadRoot(namespace = NAMESPACE_URI, localPart = "getAllFlightsRequest")
    @ResponsePayload
    public GetAllFlightsResponse getAllFlights(@RequestPayload GetAllFlightsRequest request) {
        GetAllFlightsResponse response = new GetAllFlightsResponse();
        try {
            List<FlightDTO> flights = flightService.getAllFlightsWithCities();
            flights.forEach(flight -> response.getFlights().add(convertToWsdlFlight(flight)));
        } catch (Exception e) {
            throw new RuntimeException("Error getting all flights: " + e.getMessage(), e);
        }
        return response;
    }

    @PayloadRoot(namespace = NAMESPACE_URI, localPart = "searchFlightsRequest")
    @ResponsePayload
    public SearchFlightsResponse searchFlights(@RequestPayload SearchFlightsRequest request) {
        SearchFlightsResponse response = new SearchFlightsResponse();
        try {
            LocalDateTime departureDate = request.getDepartureDate() != null ?
                request.getDepartureDate().toGregorianCalendar().toZonedDateTime().toLocalDateTime() :
                null;

            LocalDateTime returnDate = request.getReturnDate() != null ?
                request.getReturnDate().toGregorianCalendar().toZonedDateTime().toLocalDateTime() :
                null;

            if (departureDate == null) {
                throw new IllegalArgumentException("Departure date is required");
            }

            List<FlightDTO> flights = flightService.findFlightsBetweenCitiesWithCities(
                request.getDepartureCityId(),
                request.getArrivalCityId(),
                departureDate,
                returnDate
            );

            flights.forEach(flight -> response.getFlights().add(convertToWsdlFlight(flight)));
        } catch (Exception e) {
            throw new RuntimeException("Error searching flights: " + e.getMessage(), e);
        }
        return response;
    }

    private Flight convertToWsdlFlight(FlightDTO flight) {
        Flight wsdlFlight = new Flight();
        wsdlFlight.setId(flight.getId());
        wsdlFlight.setFlightCode(flight.getFlightCode());
        wsdlFlight.setDepartureCity(convertToWsdlCity(flight.getDepartureCity()));
        wsdlFlight.setArrivalCity(convertToWsdlCity(flight.getArrivalCity()));

        try {
            GregorianCalendar departureGregorian = GregorianCalendar.from(
                    flight.getDepartureDatetime().atZone(ZoneId.systemDefault()));
            GregorianCalendar arrivalGregorian = GregorianCalendar.from(
                    flight.getArrivalDatetime().atZone(ZoneId.systemDefault()));

            wsdlFlight.setDepartureDatetime(
                    DatatypeFactory.newInstance().newXMLGregorianCalendar(departureGregorian));
            wsdlFlight.setArrivalDatetime(
                    DatatypeFactory.newInstance().newXMLGregorianCalendar(arrivalGregorian));
        } catch (Exception e) {
            throw new RuntimeException("Error converting dates for flight " + flight.getId(), e);
        }

        wsdlFlight.setTotalSeats(flight.getTotalSeats());
        wsdlFlight.setAvailableSeats(flight.getAvailableSeats());
        wsdlFlight.setBasePrice(flight.getBasePrice());

        return wsdlFlight;
    }

    private City convertToWsdlCity(CityDTO city) {
        if (city == null) return null;

        City wsdlCity = new City();
        wsdlCity.setId(city.getId());
        wsdlCity.setCityName(city.getCityName());
        wsdlCity.setCountry(city.getCountry());
        return wsdlCity;
    }
}