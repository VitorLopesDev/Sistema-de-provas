package com.sistemadeprovas.repository;

import com.sistemadeprovas.entity.Turma;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface TurmaRepository extends JpaRepository<Turma, Long> {
    Optional<Turma> findByCodigo(String codigo);
    List<Turma> findByProfessorId(Long professorId);
}
