package com.taba7_2.sseudam.repository;

import com.taba7_2.sseudam.model.MaterialSuccess;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface MaterialSuccessRepository extends JpaRepository<MaterialSuccess, Long> {
    Optional<MaterialSuccess> findByUidAndMaterial(String uid, String material);
}
