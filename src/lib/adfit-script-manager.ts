type LoadCallback = () => void;

class AdfitScriptManager {
  private script: HTMLScriptElement | null = null;
  private refCount = 0;
  private isLoaded = false;
  private loadCallbacks: LoadCallback[] = [];
  private readonly scriptSrc = '//t1.daumcdn.net/kas/static/ba.min.js';

  /**
   * 스크립트를 로드하고 참조 카운트를 증가시킵니다.
   * @param callback 스크립트 로드 완료 후 실행할 콜백 (선택사항)
   */
  load(callback?: LoadCallback): void {
    this.refCount++;

    // 콜백이 있으면 처리
    if (callback) {
      if (this.isLoaded) {
        // 이미 로드 완료됨 - 즉시 실행
        callback();
      } else {
        // 로드 대기 중 - 큐에 추가
        this.loadCallbacks.push(callback);
      }
    }

    // 스크립트가 이미 있으면 생성하지 않음
    if (this.script) return;

    // DOM에서 기존 스크립트 찾기 (다른 곳에서 추가했을 수도 있음)
    this.script = document.querySelector<HTMLScriptElement>(
      `script[src="${this.scriptSrc}"]`
    );

    if (!this.script) {
      // 스크립트가 없으면 새로 생성
      this.script = document.createElement('script');
      this.script.src = this.scriptSrc;
      this.script.async = true;

      // 로드 완료 시 콜백 실행
      this.script.onload = () => {
        this.isLoaded = true;
        // 대기 중인 모든 콜백 실행
        this.loadCallbacks.forEach((cb) => cb());
        this.loadCallbacks = [];
      };

      // 에러 처리
      this.script.onerror = () => {
        console.error('카카오 애드핏 스크립트 로드 실패');
        this.isLoaded = false;
        this.loadCallbacks = [];
      };

      document.body.appendChild(this.script);
    } else {
      // 스크립트는 DOM에 있지만 로드 완료 여부 확인
      if ('adfit' in window) {
        this.isLoaded = true;
        if (callback) callback();
      } else {
        // 스크립트가 로딩 중일 수 있으므로 onload 리스너 추가
        const onExistingScriptLoad = () => {
          this.isLoaded = true;
          this.loadCallbacks.forEach((cb) => cb());
          this.loadCallbacks = [];
        };

        if (this.script.onload) {
          // 기존 onload 래핑
          const originalOnload = this.script.onload;
          this.script.onload = (ev) => {
            if (typeof originalOnload === 'function') {
              originalOnload.call(this.script, ev);
            }
            onExistingScriptLoad();
          };
        } else {
          this.script.onload = onExistingScriptLoad;
        }
      }
    }
  }

  /**
   * 참조 카운트를 감소시키고 광고를 정리합니다.
   * 모든 참조가 사라지면 스크립트를 DOM에서 제거합니다.
   * @param adUnit 정리할 광고 유닛 ID
   */
  unload(adUnit: string): void {
    this.refCount--;

    // adfit.destroy 호출하여 광고 정리
    const globalAdfit = 'adfit' in window ? window.adfit : null;
    if (globalAdfit && globalAdfit.destroy) {
      globalAdfit.destroy(adUnit);
    }

    // 모든 참조가 사라지면 스크립트 제거
    if (this.refCount === 0 && this.script) {
      if (this.script.parentNode) {
        this.script.parentNode.removeChild(this.script);
      }
      this.script = null;
      this.isLoaded = false;
      this.loadCallbacks = [];
    }

    // 참조 카운트가 음수가 되지 않도록 보호
    if (this.refCount < 0) {
      console.warn('AdfitScriptManager: refCount가 음수입니다. 리셋합니다.');
      this.refCount = 0;
    }
  }

  /**
   * 현재 참조 카운트를 반환합니다.
   * @returns 현재 참조 카운트
   */
  getRefCount(): number {
    return this.refCount;
  }

  /**
   * 스크립트 로드 완료 여부를 반환합니다.
   * @returns 로드 완료 여부
   */
  isScriptLoaded(): boolean {
    return this.isLoaded;
  }

  /**
   * 대기 중인 콜백 수를 반환합니다.
   * @returns 대기 중인 콜백 수
   */
  getPendingCallbacksCount(): number {
    return this.loadCallbacks.length;
  }
}

// 싱글톤 인스턴스 export
export const adfitScriptManager = new AdfitScriptManager();

// TypeScript 타입 선언
declare global {
  interface Window {
    adfit?: {
      destroy?: (unit: string) => void;
    };
  }
}
