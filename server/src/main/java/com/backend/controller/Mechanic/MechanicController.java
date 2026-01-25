package com.backend.controller.Mechanic;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.backend.service.MechanicService.MechanicService;
import com.backend.util.AuthUtil;

import lombok.RequiredArgsConstructor;



@RestController
@RequestMapping("/mechanic")
public class MechanicController {
 
    private final MechanicService mechanicService;
    
    public MechanicController(MechanicService mechanicService) {
        this.mechanicService = mechanicService;
    }

    @GetMapping("/worklogs")
    public ResponseEntity<?> getWorkLogs() {
        Long userId=AuthUtil.getAuthenticatedUserId();
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
}

