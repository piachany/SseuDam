package com.taba7_2.sseudam.repository;

import com.taba7_2.sseudam.model.RankAccount;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface RankAccountRepository extends JpaRepository<RankAccount, String> {

    // ✅ 전체 사용자 월별 랭킹 조회 (내림차순 정렬)
    List<RankAccount> findByMonthOrderByMonthlyPointsDesc(int month);

    // ✅ 특정 아파트 사용자만 월별 랭킹 조회 (내림차순 정렬)
    List<RankAccount> findByMonthAndApartmentIdOrderByMonthlyPointsDesc(int month, Long apartmentId);
}