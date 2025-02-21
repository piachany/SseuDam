package com.taba7_2.sseudam.repository;

import com.taba7_2.sseudam.model.RankAccount;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RankAccountRepository extends JpaRepository<RankAccount, String> {

    // ✅ 특정 사용자 UID로 랭킹 정보 조회
    Optional<RankAccount> findByUid(String uid);

    // ✅ 현재 월 기준 TOP 3 조회 (랭킹 동적 계산)
    @Query(value = """
        SELECT uid, nickname, apartment_id, month, monthly_points, accumulated_points,
               RANK() OVER (PARTITION BY month ORDER BY monthly_points DESC) AS ranking
        FROM rank_accounts
        WHERE month = :currentMonth
        LIMIT 3
    """, nativeQuery = true)
    List<Object[]> findTop3ByMonth(@Param("currentMonth") int currentMonth);

    // ✅ 특정 아파트의 랭킹 조회 (랭킹 동적 계산)
    @Query(value = """
        SELECT uid, nickname, apartment_id, month, monthly_points, accumulated_points,
               RANK() OVER (PARTITION BY month ORDER BY monthly_points DESC) AS ranking
        FROM rank_accounts
        WHERE apartment_id = :apartmentId AND month = :currentMonth
    """, nativeQuery = true)
    List<Object[]> findByApartmentIdAndMonth(@Param("apartmentId") Long apartmentId, @Param("currentMonth") int currentMonth);

    // ✅ 월별 획득 포인트 조회
    @Query(value = """
        SELECT month, SUM(monthly_points) as total_points
        FROM rank_accounts
        WHERE uid = :userUid
        GROUP BY month
        ORDER BY month ASC
    """, nativeQuery = true)
    List<Object[]> getMonthlyPointsByUser(@Param("userUid") String userUid);

    @Query(value = """
    SELECT uid, nickname, apartment_id, month, monthly_points, accumulated_points,
           RANK() OVER (PARTITION BY month ORDER BY monthly_points DESC) AS ranking
    FROM rank_accounts
    WHERE month = :currentMonth
""", nativeQuery = true)
    List<Object[]> findAllByMonth(@Param("currentMonth") int currentMonth);
}