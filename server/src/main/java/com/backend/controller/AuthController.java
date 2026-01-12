package com.backend.controller;

import com.backend.dtos.AuthDTOs.AuthRequest;
import com.backend.dtos.AuthDTOs.AuthResponse;
import com.backend.dtos.AuthDTOs.RegisterRequest;
import com.backend.entity.Role;
import com.backend.entity.User;
import com.backend.security.jwt.JwtService;
import com.backend.service.AuthService.AuthService;

import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@AllArgsConstructor

public class AuthController {

        private final AuthenticationManager authenticationManager;
        private final JwtService jwtService;
        private final AuthService authService;

        @PostMapping("/login")
        public AuthResponse login(@RequestBody AuthRequest request) {

                Authentication authentication = authenticationManager.authenticate(
                                new UsernamePasswordAuthenticationToken(
                                                request.getEmail(),
                                                request.getPassword()));

                SecurityContextHolder.getContext()
                                .setAuthentication(authentication);

                String token = jwtService.generateToken(request.getEmail());
                // Extract role from authenticated user
                User user = authService.getUserByEmail(request.getEmail());
                String role = user.getRole().name(); // ADMIN / MECHANIC / CUSTOMER
                return new AuthResponse(
                                token,
                                role);
        }

        @PostMapping("/register")
        public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
                String message = authService.registerUser(request);
                return ResponseEntity.ok(message);
        }
}
