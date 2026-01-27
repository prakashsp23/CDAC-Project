package com.backend.service.AdminService;


import java.util.List;


import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


import com.backend.dtos.MechanicDTOs.MechanicDTO;
import com.backend.entity.Role;

import com.backend.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@Transactional
@RequiredArgsConstructor
public class AdminServiceImpl implements AdminService {

        
        private final UserRepository userRepository;

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
                                .toList();
        }


}
