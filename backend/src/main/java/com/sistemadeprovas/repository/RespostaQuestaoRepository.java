package com.sistemadeprovas.repository;

import com.sistemadeprovas.entity.RespostaQuestao;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RespostaQuestaoRepository extends JpaRepository<RespostaQuestao, Long> {
    List<RespostaQuestao> findByTentativaId(Long tentativaId);
    List<RespostaQuestao> findByQuestaoId(Long questaoId);
}