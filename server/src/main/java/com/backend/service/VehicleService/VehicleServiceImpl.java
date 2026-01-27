package com.backend.service.VehicleService;

import java.util.ArrayList;
import java.util.List;

import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.backend.custom_exceptions.ResourceNotFoundException;
import com.backend.dtos.CarDTOs.AddCar;
import com.backend.dtos.CarDTOs.CarResponse;
import com.backend.dtos.CarDTOs.UpdateCar;
import com.backend.entity.Car;
import com.backend.entity.User;
import com.backend.repository.CarRepository;
import com.backend.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@Transactional
@RequiredArgsConstructor
public class VehicleServiceImpl implements VehicleService {

    private final CarRepository carRepository;
    private final UserRepository userRepository;
    private final ModelMapper modelMapper;

    @Override
    public List<CarResponse> getVehicle(Long userId) {
        List<Car> cars = carRepository.findByOwner_Id(userId);
        List<CarResponse> carResponses = new ArrayList<>();
        for (Car car : cars) {
            CarResponse carResponse = modelMapper.map(car, CarResponse.class);
            carResponses.add(carResponse);
        }
        return carResponses;
    }

    @Override
    public CarResponse addCar(AddCar carData, Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new NullPointerException());
        Car car = modelMapper.map(carData, Car.class);
        car.setOwner(user);
        Car savedCar = carRepository.save(car);
        return modelMapper.map(savedCar, CarResponse.class);
    }

    @Override
    public CarResponse updateCar(Long carId, UpdateCar carData, Long userId) {
        Car car = carRepository.findById(carId)
                .orElseThrow(() -> new ResourceNotFoundException("Vehicle not found with id: " + carId));

        if (car.getOwner() == null || !car.getOwner().getId().equals(userId)) {
            throw new SecurityException("Unauthorized to update this vehicle");
        }

        // Update car fields
        if (carData.getRegNumber() != null) {
            car.setRegNumber(carData.getRegNumber());
        }
        if (carData.getBrand() != null) {
            car.setBrand(carData.getBrand());
        }
        if (carData.getModel() != null) {
            car.setModel(carData.getModel());
        }
        if (carData.getYear() != null) {
            car.setYear(carData.getYear());
        }

        Car savedCar = carRepository.save(car);
        CarResponse carResponse = modelMapper.map(savedCar, CarResponse.class);
        return carResponse;
    }

    @Override
    public void deleteCar(Long carId, Long userId) {
        Car car = carRepository.findById(carId)
                .orElseThrow(() -> new ResourceNotFoundException("Vehicle not found with id: " + carId));

        if (car.getOwner() == null || !car.getOwner().getId().equals(userId)) {
            throw new SecurityException("Unauthorized to delete this vehicle");
        }

        car.setOwner(null); // Remove owner before delete to avoid constraint issues

        carRepository.delete(car);
    }

}
