package org.example.flightreservationsystem.service;

import org.example.flightreservationsystem.model.CityDTO;

import java.util.List;

public interface CityService {
    CityDTO addCity(CityDTO city);
    CityDTO getCityById(Integer id);
    List<CityDTO> getAllCities();
    CityDTO updateCity(Integer id, CityDTO city);
    void deleteCity(Integer id);
}