package org.example.flightreservationsystem.service.impl;

import org.example.flightreservationsystem.model.City;
import org.example.flightreservationsystem.repository.CityRepository;
import org.example.flightreservationsystem.service.CityService;
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
    public City addCity(City city) {
        return cityRepository.save(city);
    }

    @Override
    public City getCityById(Integer id) {
        return cityRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("City not found with id: " + id));
    }

    @Override
    public List<City> getAllCities() {
        return cityRepository.findAll();
    }

    @Override
    public City updateCity(Integer id, City city) {
        City existingCity = getCityById(id);
        existingCity.setCityName(city.getCityName());
        existingCity.setCountry(city.getCountry());
        return cityRepository.save(existingCity);
    }

    @Override
    public void deleteCity(Integer id) {
        cityRepository.deleteById(id);
    }
}