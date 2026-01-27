package com.backend.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "mechanic_notes")
@AttributeOverride(name="id",column = @Column(name="note_id"))
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class MechanicNote extends BaseEntity{

//    @Id
//    @GeneratedValue(strategy = GenerationType.IDENTITY)
//    private Long noteId;

    @ManyToOne
    @JoinColumn(name = "service_id")
    private Services service;

    @ManyToOne
    @JoinColumn(name = "mechanic_id")
    private User mechanic;

    private String notes;
}
