package com.backend.service.PartService;

import java.util.List;
import com.backend.dtos.PartDTOs.PartDto;

public interface PartService {
    List<PartDto> getAllParts();
}
