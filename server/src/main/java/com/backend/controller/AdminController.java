package com.backend.controller;

import com.backend.service.AdminService.AdminService;
import com.backend.util.AuthUtil;
import lombok.RequiredArgsConstructor;


import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/admin")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;
    @GetMapping("/mechanics")
    public ResponseEntity<?> getAllMechanics() {
    	Long adminId = AuthUtil.getAuthenticatedUserId();
        if (adminId == null) {
            return AuthUtil.unauthorizedResponse();
        }
        return ResponseEntity.ok(adminService.getAllMechanics());
    }
 
}

