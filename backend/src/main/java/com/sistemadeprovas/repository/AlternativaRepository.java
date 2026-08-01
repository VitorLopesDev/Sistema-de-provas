package com.sistemadeprovas.repository;

import com.sistemadeprovas.entity.Alternativa;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AlternativaRepository extends JpaRepository<Alternativa, Long> {
    List<Alternativa> findByQuestaoId(Long questaoId);
}
