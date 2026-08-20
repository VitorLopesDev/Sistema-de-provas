package com.sistemadeprovas.repository;

import com.sistemadeprovas.entity.ProvaQuestao;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProvaQuestaoRepository extends JpaRepository<ProvaQuestao, Long> {
    List<ProvaQuestao> findByProvaIdOrderByOrdemAsc(Long provaId);
    List<ProvaQuestao> findByQuestaoId(Long questaoId);
}