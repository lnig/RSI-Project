package org.example.flightreservationsystem.service;

import org.example.flightreservationsystem.model.CityDTO;

import java.util.List;

public interface CityService {
    CityDTO getCityById(Integer id);
}