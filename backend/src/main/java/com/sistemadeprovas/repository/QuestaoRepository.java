package com.sistemadeprovas.repository;

import com.sistemadeprovas.entity.Questao;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface QuestaoRepository extends JpaRepository<Questao, Long> {
    List<Questao> findByAssuntoId(Long assuntoId);
    List<Questao> findByAssuntoDisciplinaId(Long disciplinaId);
    List<Questao> findByAssuntoDisciplinaProfessorId(Long professorId);
}