package org.example.flightreservationsystem.service;

import org.example.flightreservationsystem.model.CityDTO;
import org.example.flightreservationsystem.repository.CityRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class CityServiceImpl implements CityService {

    private final CityRepository cityRepository;

    public CityServiceImpl(CityRepository cityRepository) {
        this.cityRepository = cityRepository;
    }

    @Override
    public CityDTO getCityById(Integer id) {
        return cityRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("City not found with id: " + id));
    }
}