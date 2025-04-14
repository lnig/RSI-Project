package org.example.flightreservationsystem.service;

import org.example.flightreservationsystem.model.City;

import java.util.List;

public interface CityService {
    City addCity(City city);
    City getCityById(Integer id);
    List<City> getAllCities();
    City updateCity(Integer id, City city);
    void deleteCity(Integer id);
}