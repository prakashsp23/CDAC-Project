package com.backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.backend.service.DashboardService.DashboardService;
import com.backend.util.AuthUtil;
import com.backend.util.ResponseBuilder;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/admin/dashboard")
@RequiredArgsConstructor
public class AdminDashboardController {

    private final DashboardService dashboardService;

    @GetMapping
    public ResponseEntity<?> getDashboard() {

        Long adminId = AuthUtil.getAuthenticatedUserId();
        if (adminId == null) {
            return AuthUtil.unauthorizedResponse();
        }

        return ResponseBuilder.success(
                "Dashboard data retrieved successfully",
                dashboardService.getDashboardData()
        );
    }
}
