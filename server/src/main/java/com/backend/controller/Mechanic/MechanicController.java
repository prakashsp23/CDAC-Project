package com.backend.controller.Mechanic;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.backend.service.MechanicService.MechanicService;
import com.backend.util.AuthUtil;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/mechanic")
@RequiredArgsConstructor
public class MechanicController {
 
    private final MechanicService mechanicService;


    @GetMapping("/worklogs")
    public ResponseEntity<?> getWorkLogs() {
        Long userId=AuthUtil.getAuthenticatedUserId();
        if (userId == null) {
            return AuthUtil.unauthorizedResponse();
        }
        return ResponseEntity.ok(mechanicService.getWorkLogs(userId));
    }
}
