package com.backend.controller;

import com.backend.dtos.CustomerDTOs.AddCar;
import com.backend.dtos.CustomerDTOs.FeedbackReq;
import com.backend.entity.Car;
import com.backend.service.CustomerService.CustomerService;
import com.backend.util.AuthUtil;
import org.springframework.http.ResponseEntity;
import lombok.RequiredArgsConstructor;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/customer")
@RequiredArgsConstructor
public class CustomerController {

    private final CustomerService customerService;

    // Include all services history of a user
    @GetMapping("/myServices")
    public ResponseEntity<?> getMyServices() {
        Long userId = AuthUtil.getAuthenticatedUserId();
        if (userId == null) {
            return AuthUtil.unauthorizedResponse();
        }
        return ResponseEntity.ok(customerService.getMyServices(userId));
    }

    @GetMapping("/getOngoingService")
    public ResponseEntity<?> getOngoingService() {
        Long userId = AuthUtil.getAuthenticatedUserId();
        if (userId == null) {
            return AuthUtil.unauthorizedResponse();
        }
        return ResponseEntity.ok(customerService.getOngoingService(userId));
    }

    // Incomplete
    @GetMapping("/allServices")
    public ResponseEntity<?> getAllServices() {
        return ResponseEntity.ok(customerService.getAllServices());
    }

    @GetMapping("/getVehicle")
    public ResponseEntity<?> getVehicle() {
        Long userId = AuthUtil.getAuthenticatedUserId();
        if (userId == null) {
            return AuthUtil.unauthorizedResponse();
        }
        return ResponseEntity.ok(customerService.getVehicle(userId));
    }

    @PostMapping("/addVehicle")
    public ResponseEntity<?> AddCar(@RequestBody AddCar car) {
        Long userId = AuthUtil.getAuthenticatedUserId();
        if (userId == null) {
            return AuthUtil.unauthorizedResponse();
        }

        Car res = customerService.addCar(car, userId);
        return res != null ? ResponseEntity.ok("Vehicle Has Been Added Successfully")
                : ResponseEntity.badRequest().body("Vehicle Has Not Been Added");
    }

    @DeleteMapping("/deleteVehicle")
    public ResponseEntity<?> deleteCar(@RequestParam Long carId) {
        Long userId = AuthUtil.getAuthenticatedUserId();
        if (userId == null) {
            return AuthUtil.unauthorizedResponse();
        }

        customerService.deleteCar(carId, userId);
        return ResponseEntity.ok("Vehicle Has Been Deleted Successfully");
    }

    @GetMapping("/myFeedbacks")
    public ResponseEntity<?> getMyFeedbacks() {
        Long userId = AuthUtil.getAuthenticatedUserId();
        if (userId == null) {
            return AuthUtil.unauthorizedResponse();
        }
        return ResponseEntity.ok(customerService.getMyFeedbacks(userId));
    }

    @GetMapping("/completedServicesForFeedback")
    public ResponseEntity<?> getCompletedServicesForFeedback() {
        Long userId = AuthUtil.getAuthenticatedUserId();
        if (userId == null) {
            return AuthUtil.unauthorizedResponse();
        }
        return ResponseEntity.ok(customerService.getCompletedServices(userId));
    }

    @PostMapping("/submitFeedback")
    public ResponseEntity<?> submitFeedback(@RequestBody FeedbackReq feedbackReq) {
        Long userId = AuthUtil.getAuthenticatedUserId();
        if (userId == null) {
            return AuthUtil.unauthorizedResponse();
        }
        return ResponseEntity.ok(customerService.submitFeedback(feedbackReq, userId));
    }
}
