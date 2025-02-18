package com.taba7_2.sseudam.repository;

import com.taba7_2.sseudam.model.AIAnalysisResult;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface AIAnalysisResultRepository extends JpaRepository<AIAnalysisResult, String> {
    List<AIAnalysisResult> findByUidOrderByCreatedAtDesc(String uid);
    List<AIAnalysisResult> findByMaterial(String material);
    List<AIAnalysisResult> findByApartmentId(Long apartmentId);
}