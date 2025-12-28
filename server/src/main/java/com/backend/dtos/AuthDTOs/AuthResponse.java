package com.backend.dtos;

import com.backend.entity.Role;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@AllArgsConstructor
public class AuthResponse {
    private String token;
    private String role;
}
