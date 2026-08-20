package com.sistemadeprovas.repository;

import com.sistemadeprovas.entity.Assunto;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AssuntoRepository extends JpaRepository<Assunto, Long> {
    List<Assunto> findByDisciplinaId(Long disciplinaId);
}