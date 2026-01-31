package com.backend.service.UserService;

import java.util.List;

import com.backend.dtos.UserDTO.UpdateUserDto;
import com.backend.dtos.UserDTO.UserDto;
import com.backend.dtos.UserDTO.ChangePasswordDto;
import com.backend.dtos.UserDTO.MechanicDTO;
import com.backend.dtos.UserDTO.MechanicListDto;

public interface UserService {

    public List<UserDto> getAllUsers();

    public UserDto getUserById(Long userId);

    public UserDto getCurrentUser(Long userId);

    public UserDto updateUser(Long userId, UpdateUserDto updateUserDto);

    List<MechanicDTO> getAllMechanics();

    // admin mechanics management
    List<MechanicListDto> getMechanicsForAdmin();

    void deleteMechanic(Long mechanicId);

    void changePassword(Long userId, ChangePasswordDto changePasswordDto);

}
