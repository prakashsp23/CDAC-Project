package com.backend.controller;

import com.backend.dtos.AuthDTOs.AuthRequest;
import com.backend.dtos.AuthDTOs.AuthResponse;
import com.backend.dtos.AuthDTOs.RegisterRequest;
import com.backend.entity.User;
import com.backend.security.jwt.JwtService;
import com.backend.service.AuthService.AuthService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor

public class AuthController {

        private final AuthenticationManager authenticationManager;
        private final JwtService jwtService;
        private final AuthService authService;

        @PostMapping("/login")
        public ResponseEntity<?> login(@Valid @RequestBody AuthRequest request) {
                try{
                    Authentication authentication = authenticationManager.authenticate(
                                new UsernamePasswordAuthenticationToken(
                                                request.getEmail(),
                                                request.getPassword()));

                SecurityContextHolder.getContext()
                                .setAuthentication(authentication);

                // Extract role from authenticated user
                User user = authService.getUserByEmail(request.getEmail());
                String token = jwtService.generateToken(user);
                // System.out.println(token);
                // System.out.println(jwtService.extractUserId(token));
                String role = user.getRole().name(); // ADMIN / MECHANIC / CUSTOMER
                return ResponseEntity.ok(new AuthResponse(
                                token,
                                role));
                } catch (BadCredentialsException e) {
                        return ResponseEntity.badRequest().body("Invalid Email or Password");
                }
                
        }

        @PostMapping("/register")
        public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest request) {
                String message = authService.registerUser(request);
                return ResponseEntity.ok(message);
        }
}
