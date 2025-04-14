package org.example.flightreservationsystem.repository;

import org.example.flightreservationsystem.model.City;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CityRepository extends JpaRepository<City, Integer> {
    City findByCityNameAndCountry(String cityName, String country);
}