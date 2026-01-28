package com.backend.service.UserService;

import java.util.List;

import com.backend.dtos.UserDTO.UpdateUserDto;
import com.backend.dtos.UserDTO.UserDto;
import com.backend.dtos.UserDTO.MechanicDTO;

public interface UserService {

    public List<UserDto> getAllUsers();

    public UserDto getUserById(Long userId);

    public UserDto getCurrentUser(Long userId);

    public UserDto updateUser(Long userId, UpdateUserDto updateUserDto);

    List<MechanicDTO> getAllMechanics();

}
