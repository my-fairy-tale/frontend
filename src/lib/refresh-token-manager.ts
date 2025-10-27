/**
 * RefreshTokenManager
 *
 * 여러 요청이 동시에 토큰 갱신을 시도할 때 발생하는 Race Condition을 방지합니다.
 * 진행 중인 갱신이 있으면 같은 Promise를 재사용하여 중복 요청을 막습니다.
 */
class RefreshTokenManager {
  private static promise: Promise<unknown> | null = null;
  private static lastRefreshTime = 0;

  /** 동일 refresh 재시도 최소 간격 (2초) */
  private static MIN_REFRESH_INTERVAL = 2000;

  /** refresh 최대 대기 시간 (30초) */
  private static MAX_WAIT_TIME = 30000;

  /**
   * Refresh 요청을 관리하며 중복을 방지합니다.
   *
   * @template T - 갱신 함수의 반환 타입
   * @param refreshFn - 실제 토큰 갱신 함수
   * @returns 갱신된 토큰 Promise
   *
   * @example
   * const token = await RefreshTokenManager.getRefreshPromise(() =>
   *   refreshAccessToken(oldToken)
   * );
   */
  static async getRefreshPromise<T>(refreshFn: () => Promise<T>): Promise<T> {
    const now = Date.now();

    // 진행 중인 refresh가 있으면 대기
    if (this.promise) {
      const timeSinceLastRefresh = now - this.lastRefreshTime;

      console.log('⏳ Refresh already in progress, waiting...', {
        timeSinceLastRefresh: `${timeSinceLastRefresh}ms`,
      });

      // 너무 오래 걸리면 타임아웃 처리
      if (timeSinceLastRefresh > this.MAX_WAIT_TIME) {
        console.warn('⚠️ Previous refresh timed out, starting new one');
        this.promise = null;
      } else {
        // 기존 promise 반환 (중복 요청 차단)
        return this.promise as Promise<T>;
      }
    }

    console.log('🔄 Starting new token refresh');
    this.lastRefreshTime = now;

    // 새로운 refresh 시작
    this.promise = refreshFn()
      .then((result) => {
        console.log('✅ Token refresh completed successfully');
        return result;
      })
      .catch((error) => {
        console.error('❌ Token refresh failed:', error);
        throw error;
      })
      .finally(() => {
        // 일정 시간 후 promise 초기화 (다음 갱신 허용)
        setTimeout(() => {
          this.promise = null;
        }, this.MIN_REFRESH_INTERVAL);
      });

    return this.promise as Promise<T>;
  }

  /**
   * 강제로 상태를 초기화합니다.
   * 주로 테스트나 디버깅 용도로 사용됩니다.
   */
  static reset() {
    this.promise = null;
    this.lastRefreshTime = 0;
    console.log('🔄 RefreshTokenManager reset');
  }

  /**
   * 현재 진행 중인 refresh가 있는지 확인합니다.
   */
  static isRefreshing(): boolean {
    return this.promise !== null;
  }
}

export default RefreshTokenManager;
