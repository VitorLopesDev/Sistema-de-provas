package com.sistemadeprovas.repository;

import com.sistemadeprovas.entity.Prova;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProvaRepository extends JpaRepository<Prova, Long> {
    List<Prova> findByTurmaId(Long turmaId);
    List<Prova> findByTurmaProfessorId(Long professorId);
}
