package com.backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.backend.dtos.PartDTOs.CreatePartDto;
import com.backend.dtos.PartDTOs.PartDto;
import com.backend.dtos.PartDTOs.UpdatePartDto;
import com.backend.service.PartService.PartService;
import com.backend.util.AuthUtil;
import com.backend.util.ResponseBuilder;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/parts")
@RequiredArgsConstructor
public class PartController {

    private final PartService partService;

    @GetMapping
    public ResponseEntity<?> getAllParts() {
        return ResponseEntity.ok(partService.getAllParts());
    }
    
    @PostMapping
    public ResponseEntity<?> createPart(@Valid @RequestBody CreatePartDto dto) {
        Long userId = AuthUtil.getAuthenticatedUserId();
        if (userId == null) {
            return AuthUtil.unauthorizedResponse();
        }

        PartDto createdPart = partService.createPart(dto);
        return ResponseBuilder.success("Part created successfully", createdPart);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<?> updatePart(
            @PathVariable Long id,
            @Valid @RequestBody UpdatePartDto dto) {

        Long userId = AuthUtil.getAuthenticatedUserId();
        if (userId == null) {
            return AuthUtil.unauthorizedResponse();
        }

        PartDto updatedPart = partService.updatePart(id, dto);
        return ResponseBuilder.success("Part updated successfully", updatedPart);
    }
    
    
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletePart(@PathVariable Long id) {

        partService.deletePart(id);

        return ResponseBuilder.success(
                "Part deleted successfully",
                null
        );
    }
}
