package com.backend.controller.Mechanic;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.backend.service.MechanicService.MechanicService;
import com.backend.util.AuthUtil;

import com.backend.dtos.MechanicDTOs.UpdateServiceDto;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.PostMapping;

@RestController
@RequestMapping("/mechanic")
public class MechanicController {

    private final MechanicService mechanicService;

    public MechanicController(MechanicService mechanicService) {
        this.mechanicService = mechanicService;
    }

    @GetMapping("/worklogs")
    public ResponseEntity<?> getWorkLogs() {
        Long userId = AuthUtil.getAuthenticatedUserId();
        if (userId == null) {
            return AuthUtil.unauthorizedResponse();
        }
        return ResponseEntity.ok(mechanicService.getWorkLogs(userId));
    }

    @GetMapping("/assigned-jobs")
    public ResponseEntity<?> getAssignedJobs() {
        Long userId = AuthUtil.getAuthenticatedUserId();
        if (userId == null) {
            return AuthUtil.unauthorizedResponse();
        }
        return ResponseEntity.ok(mechanicService.getAssignedJobs(userId));
    }

    @GetMapping("/parts")
    public ResponseEntity<?> getAllParts() {
        return ResponseEntity.ok(mechanicService.getAllParts());
    }

    @PutMapping("/{serviceId}/update")
    public ResponseEntity<?> updateService(
            @PathVariable Long serviceId,
            @Valid @RequestBody UpdateServiceDto updateDto) {

        Long userId = AuthUtil.getAuthenticatedUserId();
        if (userId == null) {
            return AuthUtil.unauthorizedResponse();
        }

        try {
            mechanicService.updateService(serviceId, updateDto);
            return ResponseEntity.ok("Service updated successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to update service: " + e.getMessage());
        }
    }

    @PostMapping("/{serviceId}/note")
    public ResponseEntity<?> addServiceNote(
            @PathVariable Long serviceId,
            @RequestBody String note) {

        Long userId = AuthUtil.getAuthenticatedUserId();
        if (userId == null) {
            return AuthUtil.unauthorizedResponse();
        }

        if (note == null || note.trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Note content is required");
        }

        try {
            mechanicService.addServiceNote(serviceId, userId, note);
            return ResponseEntity.ok("Note added successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to add note: " + e.getMessage());
        }
    }

}
