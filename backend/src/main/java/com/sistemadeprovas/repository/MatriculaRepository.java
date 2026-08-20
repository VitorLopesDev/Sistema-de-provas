package com.sistemadeprovas.repository;

import com.sistemadeprovas.entity.Matricula;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MatriculaRepository extends JpaRepository<Matricula, Long> {
    List<Matricula> findByAlunoId(Long alunoId);
    List<Matricula> findByTurmaId(Long turmaId);
    boolean existsByAlunoIdAndTurmaId(Long alunoId, Long turmaId);
}
