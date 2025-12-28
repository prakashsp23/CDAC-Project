package com.backend.service;

import com.backend.dtos.RegisterRequest;
import com.backend.entity.User;

import java.util.Optional;

public interface AuthService {
    public String registerUser(RegisterRequest request) ;

    User getUserByEmail(String email);
}
