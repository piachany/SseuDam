package com.taba7_2.sseudam.service;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
public class UserService {

    private final JdbcTemplate jdbcTemplate;

    public UserService(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public Map<String, Object> getUserData(String uid) {
        String sql = "SELECT email, points, rank FROM users WHERE uid = ?";
        return jdbcTemplate.queryForMap(sql, uid);
    }
}