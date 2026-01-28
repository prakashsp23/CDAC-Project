package com.backend.service.PartService;

import java.util.ArrayList;
import java.util.List;

import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import com.backend.dtos.PartDTOs.PartDto;
import com.backend.entity.Part;
import com.backend.repository.PartRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@Transactional
@RequiredArgsConstructor
public class PartServiceImpl implements PartService {

    private final PartRepository partRepo;
    private final ModelMapper modelMapper;

    @Override
    public List<PartDto> getAllParts() {
        List<PartDto> partDtos = new ArrayList<>();
        List<Part> parts = partRepo.findAll();

        for (Part p : parts) {
            PartDto dto = modelMapper.map(p, PartDto.class);
            partDtos.add(dto);
        }

        return partDtos;
    }
}
