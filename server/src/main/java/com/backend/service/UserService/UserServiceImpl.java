package com.backend.service.UserService;

import java.util.List;
import java.util.stream.Collectors;

import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.backend.custom_exceptions.OperationNotAllowedException;
import com.backend.custom_exceptions.ResourceNotFoundException;
import com.backend.dtos.UserDTO.UpdateUserDto;
import com.backend.dtos.UserDTO.UserDto;
import com.backend.dtos.UserDTO.MechanicDTO;
import com.backend.dtos.UserDTO.MechanicListDto;
import com.backend.entity.Role;
import com.backend.entity.User;
import com.backend.repository.ServiceRepository;
import com.backend.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@Transactional
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final ServiceRepository serviceRepository;
    private final ModelMapper modelMapper;

    @Override
    public List<UserDto> getAllUsers() {
        List<User> users = userRepository.findAll();
        return users.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    @Override
    public UserDto getUserById(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));
        return convertToDto(user);
    }

    @Override
    public UserDto getCurrentUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));
        return convertToDto(user);
    }

    @Override
    public UserDto updateUser(Long userId, UpdateUserDto updateUserDto) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        if (updateUserDto.getName() != null && !updateUserDto.getName().trim().isEmpty()) {
            user.setName(updateUserDto.getName());
        }
        if (updateUserDto.getPhone() != null && !updateUserDto.getPhone().trim().isEmpty()) {
            user.setPhone(updateUserDto.getPhone());
        }

        User updatedUser = userRepository.save(user);
        return convertToDto(updatedUser);
    }

    private UserDto convertToDto(User user) {
        UserDto dto = modelMapper.map(user, UserDto.class);
        dto.setId(user.getId().toString());
        dto.setRole(user.getRole().name());
        return dto;
    }

    @Override
    public List<MechanicDTO> getAllMechanics() {
        return userRepository.findByRole(Role.MECHANIC)
                .stream()
                .map(user -> {
                    MechanicDTO dto = new MechanicDTO();
                    dto.setMechanicId(user.getId());
                    dto.setName(user.getName());
                    return dto;
                })
                .collect(Collectors.toList());
    }
    
    @Override
    public List<MechanicListDto> getMechanicsForAdmin() {

        List<User> mechanics = userRepository.findByRole(Role.MECHANIC);

        return mechanics.stream().map(mechanic -> {

            long assignedJobs =
                    serviceRepository.countByMechanic_Id(mechanic.getId());

            String status = assignedJobs > 0 ? "Active" : "Inactive";

            return new MechanicListDto(
                    mechanic.getId(),
                    mechanic.getName(),
                    mechanic.getEmail(),
                    mechanic.getPhone(),
                    status,
                    assignedJobs
            );

        }).collect(Collectors.toList());
    }

    @Override
    public void deleteMechanic(Long mechanicId) {

        User user = userRepository.findById(mechanicId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found with id: " + mechanicId));

        if (user.getRole() != Role.MECHANIC) {
            throw new OperationNotAllowedException(
                    "Only mechanics can be deleted using this operation"
            );
        }

        long assignedJobs =
                serviceRepository.countByMechanic_Id(mechanicId);

        if (assignedJobs > 0) {
            throw new OperationNotAllowedException(
                    "Mechanic has assigned services and cannot be deleted"
            );
        }

        userRepository.delete(user);
    }
}
