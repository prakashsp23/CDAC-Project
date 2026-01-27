package com.backend.controller;

import com.backend.dtos.AuthDTOs.AuthRequest;
import com.backend.dtos.AuthDTOs.AuthResponse;
import com.backend.dtos.AuthDTOs.RegisterRequest;
import com.backend.dtos.UserDTO.UserDto;
import com.backend.entity.User;
import com.backend.security.jwt.JwtService;
import com.backend.service.AuthService.AuthService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import java.time.LocalDateTime;

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
        public ResponseEntity<AuthResponse> login(@RequestBody AuthRequest request) {

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                request.getEmail(),
                        request.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);

        User user = authService.getUserByEmail(request.getEmail());
        String token = jwtService.generateToken(user);

        UserDto userDto = UserDto.builder()
                .id(user.getId().toString())
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole().name().toLowerCase())
                .phone(user.getPhone())
                .build();

        AuthResponse response = AuthResponse.builder()
                .success(true)
                .message("User logged in successfully")
                .user(userDto)
                .token(token)
                .build();

        return ResponseEntity.ok(response);
        }

        @PostMapping("/register")
        public ResponseEntity<AuthResponse> register(@RequestBody RegisterRequest request) {
                User user = authService.registerUser(request);
                String token = jwtService.generateToken(user);

                UserDto userDto = UserDto.builder()
                        .id(user.getId().toString())
                        .name(user.getName())
                        .email(user.getEmail())
                        .role(user.getRole().name().toLowerCase())
                        .phone(user.getPhone())
                        .build();

                AuthResponse response = AuthResponse.builder()
                        .success(true)
                        .message("User registered successfully")
                        .user(userDto)
                        .token(token)
                        .build();

                return ResponseEntity.ok(response);
        }
}
