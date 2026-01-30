package com.backend.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.backend.aop.annotation.Admin;
import com.backend.dtos.UserDTO.UpdateUserDto;
import com.backend.dtos.UserDTO.UserDto;
import com.backend.service.UserService.UserService;
import com.backend.util.AuthUtil;
import com.backend.util.ResponseBuilder;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/user")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping
    public ResponseEntity<?> getAllUsers() {
        List<UserDto> users = userService.getAllUsers();
        return ResponseBuilder.success("Users retrieved successfully", users);
    }

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser() {
        Long userId = AuthUtil.getAuthenticatedUserId();
        if (userId == null) {
            return AuthUtil.unauthorizedResponse();
        }
        UserDto user = userService.getCurrentUser(userId);
        return ResponseBuilder.success("User retrieved successfully", user);
    }

    @GetMapping("/{userId}")
    public ResponseEntity<?> getUserById(@PathVariable Long userId) {
        UserDto user = userService.getUserById(userId);
        return ResponseBuilder.success("User retrieved successfully", user);
    }

    @PutMapping("/me")
    public ResponseEntity<?> updateCurrentUser(@RequestBody UpdateUserDto updateUserDto) {
        Long userId = AuthUtil.getAuthenticatedUserId();
        if (userId == null) {
            return AuthUtil.unauthorizedResponse();
        }

        UserDto updatedUser = userService.updateUser(userId, updateUserDto);
        return ResponseBuilder.success("User updated successfully", updatedUser);
    }

    @Admin
    @GetMapping("/mechanics")
    public ResponseEntity<?> getAllMechanics() {
        return ResponseBuilder.success("Mechanics retrieved successfully", userService.getAllMechanics());
    }
    
    
    //admin - mechanic table
    @Admin
    @GetMapping("/mechanics/admin")
    public ResponseEntity<?> getMechanicsForAdmin() {
        return ResponseBuilder.success(
                "Mechanics retrieved successfully",
                userService.getMechanicsForAdmin()
        );
    }
    
  @Admin
    @DeleteMapping("/mechanics/{id}")
    public ResponseEntity<?> deleteMechanic(@PathVariable Long id) {

        userService.deleteMechanic(id);

        return ResponseBuilder.success(
                "Mechanic deleted successfully",
                null
        );
    }

}
