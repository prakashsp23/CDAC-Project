package com.backend.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "mechanic_notes")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class MechanicNote {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long noteId;

    @ManyToOne
    @JoinColumn(name = "service_id")
    private Service service;

    @ManyToOne
    @JoinColumn(name = "mechanic_id")
    private User mechanic;

    private String notes;
}
