package com.backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "parts")
@AttributeOverride(name="id",column = @Column(name="part_id"))
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
// @ToString(exclude = {"serviceParts"})
public class Part extends BaseEntity{

//    @Id
//    @GeneratedValue(strategy = GenerationType.IDENTITY)
//    private Long partId;

    private String partName;
    private String description;
    private Double unitPrice;
    private String status;

    // Bidirectional: Part is used in many ServiceParts
    // @OneToMany(mappedBy = "part")
    // private List<ServicePart> serviceParts = new ArrayList<>();
}
