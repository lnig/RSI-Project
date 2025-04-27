package org.example.flightreservationsystem.model;

import jakarta.persistence.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "reservations")
public class ReservationDTO {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "RESERVATION_ID", nullable = false)
    private Integer id;

    @Column(name = "RESERVATION_CODE", nullable = false, length = 20)
    private String reservationCode;

    @Column(name = "PASSENGER_FIRSTNAME", nullable = false, length = 100)
    private String passengerFirstname;

    @Column(name = "PASSENGER_LASTNAME", nullable = false, length = 100)
    private String passengerLastname;

    @Column(name = "PASSENGER_EMAIL", nullable = false, length = 100)
    private String passengerEmail;

    @Column(name = "SEATS_RESERVED", nullable = false)
    private Integer seatsReserved;

    @Column(name = "TOTAL_PRICE", nullable = false, precision = 10, scale = 2)
    private BigDecimal totalPrice;

    @Column(name = "RESERVATION_DATE")
    private LocalDateTime reservationDate;

    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "FLIGHT_ID", nullable = false)
    private FlightDTO flight;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getReservationCode() {
        return reservationCode;
    }

    public void setReservationCode(String reservationCode) {
        this.reservationCode = reservationCode;
    }

    public String getPassengerFirstname() {
        return passengerFirstname;
    }

    public void setPassengerFirstname(String passengerFirstname) {
        this.passengerFirstname = passengerFirstname;
    }

    public String getPassengerLastname() {
        return passengerLastname;
    }

    public void setPassengerLastname(String passengerLastname) {
        this.passengerLastname = passengerLastname;
    }

    public String getPassengerEmail() {
        return passengerEmail;
    }

    public void setPassengerEmail(String passengerEmail) {
        this.passengerEmail = passengerEmail;
    }

    public Integer getSeatsReserved() {
        return seatsReserved;
    }

    public void setSeatsReserved(Integer seatsReserved) {
        this.seatsReserved = seatsReserved;
    }

    public BigDecimal getTotalPrice() {
        return totalPrice;
    }

    public void setTotalPrice(BigDecimal totalPrice) {
        this.totalPrice = totalPrice;
    }

    public LocalDateTime getReservationDate() {
        return reservationDate;
    }

    public void setReservationDate(LocalDateTime reservationDate) {
        this.reservationDate = reservationDate;
    }

    public FlightDTO getFlight() {
        return flight;
    }

    public void setFlight(FlightDTO flight) {
        this.flight = flight;
    }

}