package com.backend.controller;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.backend.dtos.ServiceDTO.CreateServiceDto;
import com.backend.dtos.ServiceDTO.ServiceDto;
import com.backend.entity.ServiceStatus;
import com.backend.service.ServiceService.ServiceService;
import com.backend.util.AuthUtil;
import com.backend.util.ResponseBuilder;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/service")
@RequiredArgsConstructor
public class ServiceController {

    private final ServiceService serviceService;

    @PostMapping
    public ResponseEntity<?> createService(@RequestBody CreateServiceDto createDto) {
        Long userId = AuthUtil.getAuthenticatedUserId();
        if (userId == null) {
            return AuthUtil.unauthorizedResponse();
        }

        ServiceDto createdService = serviceService.createService(createDto, userId);
        return ResponseBuilder.success("Service request created successfully", createdService);
    }

    @GetMapping
    public ResponseEntity<?> getMyServices() {
        Long userId = AuthUtil.getAuthenticatedUserId();
        if (userId == null) {
            return AuthUtil.unauthorizedResponse();
        }

        List<ServiceDto> services = serviceService.getMyServices(userId);
        return ResponseBuilder.success("Your services retrieved successfully", services);
    }

    @GetMapping("/all")
    public ResponseEntity<?> getAllServices() {
        List<ServiceDto> services = serviceService.getAllServices();
        return ResponseBuilder.success("All services retrieved successfully", services);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getServiceById(@PathVariable Long id) {
        ServiceDto service = serviceService.getServiceById(id);
        return ResponseBuilder.success("Service retrieved successfully", service);
    }

    @GetMapping("/ongoing")
    public ResponseEntity<?> getOngoingService() {
        Long userId = AuthUtil.getAuthenticatedUserId();
        if (userId == null) {
            return AuthUtil.unauthorizedResponse();
        }
        List<ServiceDto> ongoingServices = serviceService.getMyServices(userId)
                .stream()
                .filter(s -> s.getStatus() == ServiceStatus.ONGOING.toString()
                        || s.getStatus() == ServiceStatus.PENDING.toString())
                .collect(Collectors.toList());
        return ResponseBuilder.success("Ongoing services retrieved successfully", ongoingServices);
    }

    @GetMapping("/completed")
    public ResponseEntity<?> getCompletedService() {
        Long userId = AuthUtil.getAuthenticatedUserId();
        if (userId == null) {
            return AuthUtil.unauthorizedResponse();
        }
        List<ServiceDto> completedServices = serviceService.getMyServices(userId)
                .stream()
                .filter(s -> s.getStatus() == ServiceStatus.COMPLETED.toString())
                .collect(Collectors.toList());
        return ResponseBuilder.success("Completed services retrieved successfully", completedServices);
    }
}
