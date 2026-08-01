package com.sistemadeprovas.repository;

import com.sistemadeprovas.entity.TentativaProva;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface TentativaProvaRepository extends JpaRepository<TentativaProva, Long> {
    List<TentativaProva> findByProvaId(Long provaId);
    Optional<TentativaProva> findByProvaIdAndAlunoId(Long provaId, Long alunoId);
}
