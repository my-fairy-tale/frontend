/**
 * Throttle 함수: 일정 시간 동안 함수 호출을 제한
 * @param func 실행할 함수
 * @param delay 지연 시간 (밀리초)
 * @returns throttled 함수
 */
export function throttle<T extends (...args: unknown[]) => unknown>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let lastCall = 0;

  return function (this: unknown, ...args: Parameters<T>) {
    const now = Date.now();

    if (now - lastCall >= delay) {
      lastCall = now;
      func.apply(this, args);
    }
  };
}
