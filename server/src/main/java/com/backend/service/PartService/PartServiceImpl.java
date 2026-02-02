package com.backend.service.PartService;

import java.util.ArrayList;
import java.util.List;

import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import com.backend.custom_exceptions.ResourceNotFoundException;
import com.backend.dtos.PartDTOs.CreatePartDto;
import com.backend.dtos.PartDTOs.PartDto;
import com.backend.dtos.PartDTOs.UpdatePartDto;
import com.backend.entity.Part;
import com.backend.repository.PartRepository;
import com.backend.repository.ServicePartRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@Transactional
@RequiredArgsConstructor
public class PartServiceImpl implements PartService {

    private final PartRepository partRepo;
    private final ModelMapper modelMapper;
    private final ServicePartRepository servicePartRepository;


    @Override
    public List<PartDto> getAllParts() {
        List<Part> parts = partRepo.findAll();
        List<PartDto> result = new ArrayList<>();

        for (Part p : parts) {
            PartDto dto = new PartDto(
                p.getId(),                     // from BaseEntity
                p.getPartName(),
                p.getDescription(),
                p.getUnitPrice(),
                p.getStockQuantity(),
                p.getStockQuantity() != null && p.getStockQuantity() > 0
                    ? "In Stock"
                    : "Out of Stock"
            );
            result.add(dto);
        }
        return result;
    }

    

    @Override
    public PartDto createPart(CreatePartDto dto) {
    	 Part part = modelMapper.map(dto, Part.class);

         Part saved = partRepo.save(part);
         return modelMapper.map(saved, PartDto.class);
    }
    
    
    // ================= UPDATE / EDIT =================
    @Override
    public PartDto updatePart(Long id, UpdatePartDto dto) {

        Part part = partRepo.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Part not found with id: " + id));

        // skipNullEnabled=true in ModelMapper config handles partial update
        modelMapper.map(dto, part);

        Part updated = partRepo.save(part);
        return modelMapper.map(updated, PartDto.class);
    }
    
    @Override
    public void deletePart(Long id) {

        Part part = partRepo.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Part not found with id: " + id));

        if (servicePartRepository.existsByPart_Id(id)) {
            throw new IllegalStateException(
                    "Part is already used in services and cannot be deleted"
            );
        }

        partRepo.delete(part);
    }
}
