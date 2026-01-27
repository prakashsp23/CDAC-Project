package com.backend.service.AuthService;

import com.backend.dtos.AuthDTOs.RegisterRequest;
import com.backend.entity.User;

import java.util.Optional;

public interface AuthService {
    public User registerUser(RegisterRequest request);

    User getUserByEmail(String email);
}
