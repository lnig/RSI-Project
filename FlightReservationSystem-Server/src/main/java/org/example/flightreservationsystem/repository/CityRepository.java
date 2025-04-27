package org.example.flightreservationsystem.repository;

import org.example.flightreservationsystem.model.CityDTO;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CityRepository extends JpaRepository<CityDTO, Integer> {
    CityDTO findByCityNameAndCountry(String cityName, String country);
}