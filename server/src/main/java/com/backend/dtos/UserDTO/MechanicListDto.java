package com.backend.dtos.UserDTO;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class MechanicListDto {

    private Long id;
    private String name;
    private String email;
    private String phone;
    private String status;      // "Active" or "Inactive"
    private Long assignedJobs;
}
