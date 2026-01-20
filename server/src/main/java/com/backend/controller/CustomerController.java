package com.backend.controller;

import com.backend.dtos.CustomerDTOs.AddCar;
import com.backend.entity.Car;
import com.backend.service.CustomerService.CustomerService;
import com.backend.util.AuthUtil;
import org.springframework.http.ResponseEntity;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/customer")
@RequiredArgsConstructor
public class CustomerController {

    private final CustomerService customerService;

    @PostMapping("/addVehicle")
    public ResponseEntity<?> AddCar(@RequestBody AddCar car){
        Long userId = AuthUtil.getAuthenticatedUserId();
        if (userId == null) {
            return AuthUtil.unauthorizedResponse();
        }

        Car res = customerService.addCar(car, userId);
        return res != null ?
                ResponseEntity.ok("Vehicle Has Been Added Successfully")
                : ResponseEntity.badRequest().body("Vehicle Has Not Been Added");
    }
}
