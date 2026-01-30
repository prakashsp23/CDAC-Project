package com.backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.backend.aop.annotation.Admin;
import com.backend.aop.annotation.RequireAnyRole;
import com.backend.dtos.PartDTOs.CreatePartDto;
import com.backend.dtos.PartDTOs.PartDto;
import com.backend.dtos.PartDTOs.UpdatePartDto;
import com.backend.entity.Role;
import com.backend.service.PartService.PartService;
import com.backend.util.ResponseBuilder;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/parts")
@RequiredArgsConstructor
public class PartController {

    private final PartService partService;

    /* ===================== GET ALL PARTS ===================== */
    @RequireAnyRole({Role.ADMIN, Role.MECHANIC})
    @GetMapping
    public ResponseEntity<?> getAllParts() {
        return ResponseBuilder.success(
                "Parts retrieved successfully",
                partService.getAllParts()
        );
    }

    /* ===================== CREATE PART ===================== */
    @Admin
    @PostMapping
    public ResponseEntity<?> createPart(@Valid @RequestBody CreatePartDto dto) {
        PartDto createdPart = partService.createPart(dto);
        return ResponseBuilder.success(
                "Part created successfully",
                createdPart
        );
    }

    /* ===================== UPDATE PART ===================== */
    @Admin
    @PutMapping("/{id}")
    public ResponseEntity<?> updatePart(
            @PathVariable Long id,
            @Valid @RequestBody UpdatePartDto dto) {
        PartDto updatedPart = partService.updatePart(id, dto);
        return ResponseBuilder.success(
                "Part updated successfully",
                updatedPart
        );
    }

    /* ===================== DELETE PART ===================== */
    @Admin
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletePart(@PathVariable Long id) {
        partService.deletePart(id);
        return ResponseBuilder.success("Part deleted successfully", null);
    }
}
