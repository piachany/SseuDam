package com.taba7_2.sseudam.repository;

import com.taba7_2.sseudam.model.MonthlyPoints;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface MonthlyPointsRepository extends JpaRepository<MonthlyPoints, Long> {

    @Query(value = """
        SELECT month, monthly_points
        FROM monthly_points
        WHERE uid = :userUid
        ORDER BY month ASC
    """, nativeQuery = true)
    List<Object[]> findMonthlyPointsByUser(@Param("userUid") String userUid);
}