import React from "react";
import styles from "./TrashLoading.module.css";

interface TrashLoadingProps {
  isLoading: boolean;
  loadingText?: string;
}

const TrashLoading: React.FC<TrashLoadingProps> = ({
  isLoading,
  loadingText = "재활용 쓰레기 분석 중...",
}) => {
  return (
    <div className={`${styles.container} ${!isLoading ? styles.fade_out : ""}`}>
      {/* CCTV */}
      <div className={styles.cctv}>
        <div className={styles.cctv_light}></div>
      </div>

      {/* 쓰레기통 */}
      <div className={styles.trash_can}>
        <div className={styles.trash_lid}></div>
      </div>

      {/* 분석 진행 문구 */}
      <div className={styles.loading_text}>{loadingText}</div>
    </div>
  );
};

export default TrashLoading;
