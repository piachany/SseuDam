package com.taba7_2.sseudam.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.util.Date;

@Getter
@Setter
@Entity
@Table(name = "users")  // ✅ users 테이블과 매핑
public class User {

    @Id
    @Column(name = "uid", length = 50, nullable = false)
    private String uid;  // ✅ Firebase UID를 PK로 설정

    @Column(name = "username", nullable = false, unique = true, length = 50)
    private String username;

    @Column(name = "nickname", nullable = false, length = 50)
    private String nickname;

    @Column(name = "email", nullable = false, unique = true, length = 100)
    private String email;

    @Column(name = "profile_image")
    private String profileImage;

    @Column(name = "email_verified")
    private boolean emailVerified;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "created_at", updatable = false)
    private Date createdAt = new Date();

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "updated_at")
    private Date updatedAt = new Date();

    @Enumerated(EnumType.STRING)
    @Column(name = "role", length = 10)
    private Role role = Role.USER;

    @Column(name = "apartment_id")
    private Long apartmentId;

    @Column(name = "location", length = 255)
    private String location;

    // ✅ 추가: 로그인할 때마다 업데이트할 필드
    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "last_login")
    private Date lastLogin;

    // ✅ 기본 생성자
    public User() {
        this.lastLogin = null;  // 처음엔 NULL로 설정
    }

    // ✅ 생성자 (필요하면 사용)
    public User(String uid, String username, String nickname, String email, String profileImage, boolean emailVerified, Role role, Long apartmentId, String location) {
        this.uid = uid;
        this.username = username;
        this.nickname = nickname;
        this.email = email;
        this.profileImage = profileImage;
        this.emailVerified = emailVerified;
        this.role = role;
        this.apartmentId = apartmentId;
        this.location = location;
        this.lastLogin = null;  // 기본적으로 NULL
    }
}