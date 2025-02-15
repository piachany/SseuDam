package com.taba7_2.sseudam.repository;

import com.taba7_2.sseudam.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserRepository extends JpaRepository<User, String> {

    // ✅ 등록된 모든 아파트 ID 리스트 조회 (중복 제거)
    @Query("SELECT DISTINCT u.apartmentId FROM User u WHERE u.apartmentId IS NOT NULL")
    List<Long> findDistinctApartmentIds();
}