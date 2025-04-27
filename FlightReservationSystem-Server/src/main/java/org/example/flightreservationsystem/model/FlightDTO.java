package org.example.flightreservationsystem.model;

import jakarta.persistence.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "flights")
public class FlightDTO {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "FLIGHT_ID", nullable = false)
    private Integer id;

    @Column(name = "FLIGHT_CODE", nullable = false, length = 10)
    private String flightCode;

    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "DEPARTURE_CITY_ID", nullable = false)
    private CityDTO departureCity;

    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "ARRIVAL_CITY_ID", nullable = false)
    private CityDTO arrivalCity;

    @Column(name = "DEPARTURE_DATETIME", nullable = false)
    private LocalDateTime departureDatetime;

    @Column(name = "ARRIVAL_DATETIME", nullable = false)
    private LocalDateTime arrivalDatetime;

    @Column(name = "TOTAL_SEATS", nullable = false)
    private Integer totalSeats;

    @Column(name = "AVAILABLE_SEATS", nullable = false)
    private Integer availableSeats;

    @Column(name = "BASE_PRICE", nullable = false, precision = 10, scale = 2)
    private BigDecimal basePrice;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getFlightCode() {
        return flightCode;
    }

    public void setFlightCode(String flightCode) {
        this.flightCode = flightCode;
    }

    public CityDTO getDepartureCity() {
        return departureCity;
    }

    public void setDepartureCity(CityDTO departureCity) {
        this.departureCity = departureCity;
    }

    public CityDTO getArrivalCity() {
        return arrivalCity;
    }

    public void setArrivalCity(CityDTO arrivalCity) {
        this.arrivalCity = arrivalCity;
    }

    public LocalDateTime getDepartureDatetime() {
        return departureDatetime;
    }

    public void setDepartureDatetime(LocalDateTime departureDatetime) {
        this.departureDatetime = departureDatetime;
    }

    public LocalDateTime getArrivalDatetime() {
        return arrivalDatetime;
    }

    public void setArrivalDatetime(LocalDateTime arrivalDatetime) {
        this.arrivalDatetime = arrivalDatetime;
    }

    public Integer getTotalSeats() {
        return totalSeats;
    }

    public void setTotalSeats(Integer totalSeats) {
        this.totalSeats = totalSeats;
    }

    public Integer getAvailableSeats() {
        return availableSeats;
    }

    public void setAvailableSeats(Integer availableSeats) {
        this.availableSeats = availableSeats;
    }

    public BigDecimal getBasePrice() {
        return basePrice;
    }

    public void setBasePrice(BigDecimal basePrice) {
        this.basePrice = basePrice;
    }

}