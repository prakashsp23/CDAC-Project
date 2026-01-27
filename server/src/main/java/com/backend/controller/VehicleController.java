package com.backend.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.backend.dtos.CarDTOs.AddCar;
import com.backend.dtos.CarDTOs.CarResponse;
import com.backend.dtos.CarDTOs.UpdateCar;
import com.backend.service.VehicleService.VehicleService;
import com.backend.util.AuthUtil;
import com.backend.util.ResponseBuilder;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/vehicle")
@RequiredArgsConstructor
public class VehicleController {

    private final VehicleService vehicleService;

    @GetMapping
    public ResponseEntity<?> getVehicles() {
        Long userId = AuthUtil.getAuthenticatedUserId();
        if (userId == null) {
            return AuthUtil.unauthorizedResponse();
        }
        List<CarResponse> vehicles = vehicleService.getVehicle(userId);
        return ResponseBuilder.success("Vehicles retrieved successfully", vehicles);
    }

    @PostMapping
    public ResponseEntity<?> addVehicle(@RequestBody AddCar car) {
        Long userId = AuthUtil.getAuthenticatedUserId();
        if (userId == null) {
            return AuthUtil.unauthorizedResponse();
        }

        CarResponse savedCar = vehicleService.addCar(car, userId);
        return ResponseBuilder.success("Vehicle added successfully", savedCar);
    }

    @PutMapping("/{carId}")
    public ResponseEntity<?> updateVehicle(@PathVariable Long carId, @RequestBody UpdateCar carData) {
        Long userId = AuthUtil.getAuthenticatedUserId();
        if (userId == null) {
            return AuthUtil.unauthorizedResponse();
        }

        CarResponse updatedCar = vehicleService.updateCar(carId, carData, userId);
        return ResponseBuilder.success("Vehicle updated successfully", updatedCar);
    }

    @DeleteMapping("/{carId}")
    public ResponseEntity<?> deleteVehicle(@PathVariable Long carId) {
        Long userId = AuthUtil.getAuthenticatedUserId();
        if (userId == null) {
            return AuthUtil.unauthorizedResponse();
        }

        vehicleService.deleteCar(carId, userId);
        return ResponseBuilder.success("Vehicle deleted successfully", null);
    }
}
