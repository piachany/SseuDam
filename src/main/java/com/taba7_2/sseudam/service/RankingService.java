package com.taba7_2.sseudam.service;

import com.taba7_2.sseudam.dto.RankingDto;
import com.taba7_2.sseudam.dto.RankingResponseDto;
import com.taba7_2.sseudam.model.RankAccount;
import com.taba7_2.sseudam.repository.RankAccountRepository;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class RankingService {

    private final RankAccountRepository rankAccountRepository;
    private final FirebaseAuthService firebaseAuthService;

    public RankingService(RankAccountRepository rankAccountRepository, FirebaseAuthService firebaseAuthService) {
        this.rankAccountRepository = rankAccountRepository;
        this.firebaseAuthService = firebaseAuthService;
    }

    /**
     * ✅ 특정 아파트의 사용자 중심 랭킹 조회 (월별)
     */
    public RankingResponseDto getRankingsForUser(String authorizationHeader, int month, Long apartmentId) {
        String uid = firebaseAuthService.getUidFromToken(authorizationHeader);

        // ✅ apartment_id가 제공되었으면 해당 아파트의 사용자만 필터링
        List<RankAccount> filteredRankings = (apartmentId != null) ?
                rankAccountRepository.findByMonthAndApartmentIdOrderByMonthlyPointsDesc(month, apartmentId) :
                rankAccountRepository.findByMonthOrderByMonthlyPointsDesc(month);

        Optional<RankAccount> userRankOptional = filteredRankings.stream()
                .filter(rank -> rank.getUid().equals(uid))
                .findFirst();

        if (userRankOptional.isEmpty()) {
            return new RankingResponseDto(null, null, null, filteredRankings.stream().map(this::convertToRankingDto).collect(Collectors.toList()));
        }

        RankAccount userRank = userRankOptional.get();
        int userIndex = filteredRankings.indexOf(userRank);

        RankAccount aboveUser = (userIndex > 0) ? filteredRankings.get(userIndex - 1) : null;
        RankAccount belowUser = (userIndex < filteredRankings.size() - 1) ? filteredRankings.get(userIndex + 1) : null;

        return new RankingResponseDto(
                convertToRankingDto(userRank),
                (aboveUser != null) ? convertToRankingDto(aboveUser) : null,
                (belowUser != null) ? convertToRankingDto(belowUser) : null,
                filteredRankings.stream().map(this::convertToRankingDto).collect(Collectors.toList())
        );
    }

    /**
     * ✅ `RankAccount` 엔터티를 `RankingDto`로 변환
     */
    private RankingDto convertToRankingDto(RankAccount rankAccount) {
        return new RankingDto(
                rankAccount.getUid(),
                rankAccount.getNickname(),
                rankAccount.getMonthlyPoints(),
                rankAccount.getAccumulatedPoints(),
                rankAccount.getRanking(),
                rankAccount.getTier()
        );
    }
}