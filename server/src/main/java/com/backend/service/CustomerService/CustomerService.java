package com.backend.service.CustomerService;

import com.backend.dtos.CustomerDTOs.AddCar;
import com.backend.entity.Car;

public interface CustomerService {
    public Car addCar(AddCar car, Long userId);
}
