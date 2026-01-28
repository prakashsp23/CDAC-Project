package com.backend.service.PartService;

import java.util.List;

import com.backend.dtos.PartDTOs.CreatePartDto;
import com.backend.dtos.PartDTOs.PartDto;
import com.backend.dtos.PartDTOs.UpdatePartDto;

public interface PartService {
    List<PartDto> getAllParts();


    PartDto createPart(CreatePartDto dto);

    PartDto updatePart(Long id, UpdatePartDto dto);
    
    void deletePart(Long id);

}
