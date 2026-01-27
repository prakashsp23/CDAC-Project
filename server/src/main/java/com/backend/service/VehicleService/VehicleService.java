package com.backend.service.VehicleService;

import java.util.List;

import com.backend.dtos.CarDTOs.AddCar;
import com.backend.dtos.CarDTOs.CarResponse;
import com.backend.dtos.CarDTOs.UpdateCar;

public interface VehicleService {

    public List<CarResponse> getVehicle(Long userId);

    public CarResponse addCar(AddCar car, Long userId);

    public CarResponse updateCar(Long carId, UpdateCar carData, Long userId);

    public void deleteCar(Long carId, Long userId);

}
