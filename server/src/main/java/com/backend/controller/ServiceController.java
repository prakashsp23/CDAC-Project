package com.backend.controller;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.backend.aop.annotation.Admin;
import com.backend.aop.annotation.Customer;
import com.backend.aop.annotation.Mechanic;
import com.backend.aop.annotation.RequireAnyRole;
import com.backend.dtos.ServiceDTO.CreateServiceDto;
import com.backend.dtos.ServiceDTO.ServiceDto;
import com.backend.dtos.ServiceDTO.UpdateServiceDto;
import com.backend.entity.Role;
import com.backend.entity.ServiceStatus;
import com.backend.service.ServiceService.ServiceService;
import com.backend.util.AuthUtil;
import com.backend.util.ResponseBuilder;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/service")
@RequiredArgsConstructor
public class ServiceController {

    private final ServiceService serviceService;

    @Customer
    @PostMapping
    public ResponseEntity<?> createService(@Valid @RequestBody CreateServiceDto createDto) {
        Long userId = AuthUtil.getAuthenticatedUserId();
        ServiceDto createdService = serviceService.createService(createDto, userId);
        return ResponseBuilder.success("Service request created successfully", createdService);
    }

    @Customer
    @GetMapping
    public ResponseEntity<?> getMyServices() {
        Long userId = AuthUtil.getAuthenticatedUserId();
        List<ServiceDto> services = serviceService.getMyServices(userId);
        return ResponseBuilder.success("Your services retrieved successfully", services);
    }

    @Admin
    @GetMapping("/all")
    public ResponseEntity<?> getAllServices() {
        return ResponseBuilder.success("All services retrieved successfully", serviceService.getAllServices());
    }

    // @RequireAnyRole
    @GetMapping("/{serviceId}")
    public ResponseEntity<?> getServiceById(@PathVariable Long serviceId) {
        ServiceDto service = serviceService.getServiceById(serviceId);
        return ResponseBuilder.success("Service retrieved successfully", service);
    }

    @Customer
    @GetMapping("/ongoing")
    public ResponseEntity<?> getOngoingService() {
        Long userId = AuthUtil.getAuthenticatedUserId();
        List<ServiceDto> ongoingServices = serviceService.getMyServices(userId)
                .stream()
                .filter(s -> s.getStatus() == ServiceStatus.ONGOING.toString()
                        || s.getStatus() == ServiceStatus.ACCEPTED.toString())
                .collect(Collectors.toList());
        return ResponseBuilder.success("Ongoing services retrieved successfully", ongoingServices);
    }

    @Customer
    @GetMapping("/completed")
    public ResponseEntity<?> getCompletedService() {
        Long userId = AuthUtil.getAuthenticatedUserId();
        List<ServiceDto> completedServices = serviceService.getMyCompletedServicesWithoutFeedback(userId);
        return ResponseBuilder.success("Completed services retrieved successfully", completedServices);
    }

    @Admin
    @PutMapping("/{serviceId}/accept")
    public ResponseEntity<?> acceptService(@PathVariable Long serviceId) {
        serviceService.acceptService(serviceId);
        return ResponseBuilder.success("Service accepted successfully", null);
    }

    @Admin
    @PutMapping("/{serviceId}/assign/{mechanicId}")
    public ResponseEntity<?> assignMechanic(
            @PathVariable Long serviceId,
            @PathVariable Long mechanicId) {
        serviceService.assignMechanic(serviceId, mechanicId);
        return ResponseBuilder.success("Mechanic assigned successfully", null);
    }

    @Admin
    @PutMapping("/{serviceId}/reject")
    public ResponseEntity<?> rejectService(
            @PathVariable Long serviceId,
            @RequestBody Map<String, String> body) {
        serviceService.rejectService(serviceId, body.get("reason"));
        return ResponseBuilder.success("Service rejected successfully", null);
    }

    @Mechanic
    @GetMapping("/mechanic/worklogs")
    public ResponseEntity<?> getWorkLogs() {
        Long userId = AuthUtil.getAuthenticatedUserId();
        return ResponseEntity.ok(serviceService.getMechanicWorkHistory(userId));
    }

    @Mechanic
    @GetMapping("/mechanic/assigned-jobs")
    public ResponseEntity<?> getAssignedJobs() {
        Long userId = AuthUtil.getAuthenticatedUserId();
        return ResponseEntity.ok(serviceService.getMechanicAssignedJobs(userId));
    }

    @Mechanic
    @PutMapping("/{serviceId}/update-execution")
    public ResponseEntity<?> updateServiceExecution(
            @PathVariable Long serviceId,
            @Valid @RequestBody UpdateServiceDto updateDto) {

        Long userId = AuthUtil.getAuthenticatedUserId();
        if (userId == null) {
            return AuthUtil.unauthorizedResponse();
        }

        serviceService.updateServiceExecution(serviceId, updateDto);
        return ResponseBuilder.success("Service updated successfully", null);
    }

    @Mechanic
    @PostMapping("/{serviceId}/note")
    public ResponseEntity<?> addServiceNote(
            @PathVariable Long serviceId,
            @RequestBody String note) {

        Long userId = AuthUtil.getAuthenticatedUserId();
        if (note == null || note.trim().isEmpty()) {
            throw new IllegalArgumentException("Note content is required");
        }

        serviceService.addServiceNote(serviceId, userId, note);
        return ResponseBuilder.success("Note added successfully", null);
    }

}
