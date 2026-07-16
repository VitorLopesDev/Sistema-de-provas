package com.sistemadeprovas.repository;

import com.sistemadeprovas.entity.Questao;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface QuestaoRepository extends JpaRepository<Questao, Long> {
    List<Questao> findByProvaIdOrderByOrdemAsc(Long provaId);
}
