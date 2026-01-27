package com.backend.controller;

import com.backend.dtos.AdminDTOs.MechanicDTO;
import com.backend.service.AdminService.AdminService;
import com.backend.util.AuthUtil;
import lombok.RequiredArgsConstructor;

import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/admin")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;

    // ✅ Get all service requests
    @GetMapping("/services")
    public ResponseEntity<?> getAllServices() {
        Long adminId = AuthUtil.getAuthenticatedUserId();
        if (adminId == null) {
            return AuthUtil.unauthorizedResponse();
        }

        return ResponseEntity.ok(adminService.getAllServices());
    }
    
    @GetMapping("/mechanics")
    public ResponseEntity<?> getAllMechanics() {
    	Long adminId = AuthUtil.getAuthenticatedUserId();
        if (adminId == null) {
            return AuthUtil.unauthorizedResponse();
        }
        return ResponseEntity.ok(adminService.getAllMechanics());
    }
    
    /* ================= ACCEPT SERVICE ================= */
    // NEW → PENDING

    @PutMapping("/services/{serviceId}/accept")
    public ResponseEntity<?> acceptService(@PathVariable Long serviceId) {

        Long adminId = AuthUtil.getAuthenticatedUserId();
        if (adminId == null) {
            return AuthUtil.unauthorizedResponse();
        }

        adminService.acceptService(serviceId);

        return ResponseEntity.ok("Service accepted successfully");
    }

    /* ================= ASSIGN MECHANIC ================= */
    // PENDING → ONGOING

    @PutMapping("/services/{serviceId}/assign/{mechanicId}")
    public ResponseEntity<?> assignMechanic(
            @PathVariable Long serviceId,
            @PathVariable Long mechanicId) {

        Long adminId = AuthUtil.getAuthenticatedUserId();
        if (adminId == null) {
            return AuthUtil.unauthorizedResponse();
        }

        adminService.assignMechanic(serviceId, mechanicId);

        return ResponseEntity.ok("Mechanic assigned successfully");
    }

    /* ================= REJECT SERVICE ================= */

    @PutMapping("/services/{serviceId}/reject")
    public ResponseEntity<?> rejectService(
            @PathVariable Long serviceId,
            @RequestBody Map<String, String> body) {

        Long adminId = AuthUtil.getAuthenticatedUserId();
        if (adminId == null) {
            return AuthUtil.unauthorizedResponse();
        }

        String reason = body.get("reason");
        adminService.rejectService(serviceId, reason);

        return ResponseEntity.ok("Service rejected successfully");
    }

    @GetMapping("/feedback")
    public ResponseEntity<?> getAllFeedback() {

        Long adminId = AuthUtil.getAuthenticatedUserId();
        if (adminId == null) {
            return AuthUtil.unauthorizedResponse();
        }

        return ResponseEntity.ok(adminService.getAllFeedback());
    }
}

