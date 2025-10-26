'use client';

import { useEffect, useState } from 'react';

/**
 * CSS 미디어 쿼리를 리액트 훅으로 사용할 수 있게 해주는 커스텀 훅
 *
 * @param query - CSS 미디어 쿼리 문자열 (예: '(max-width: 768px)')
 * @returns 미디어 쿼리가 매칭되는지 여부 (boolean | null)
 *          - true: 미디어 쿼리 매칭됨
 *          - false: 미디어 쿼리 매칭되지 않음
 *          - null: 초기 렌더링 (SSR 대응)
 *
 * @example
 * const isMobile = useMediaQuery('(max-width: 767px)');
 * if (isMobile === null) return null; // SSR 대응
 * return isMobile ? <MobileView /> : <DesktopView />;
 */
export const useMediaQuery = (query: string): boolean | null => {
  const [matches, setMatches] = useState<boolean | null>(null);

  useEffect(() => {
    const mediaQuery = window.matchMedia(query);

    const handleChange = (e: MediaQueryListEvent | MediaQueryList) => {
      setMatches(e.matches);
    };

    // 초기값 설정
    handleChange(mediaQuery);

    // 이벤트 리스너 등록
    mediaQuery.addEventListener('change', handleChange);

    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, [query]);

  return matches;
};

/**
 * 모바일 화면인지 확인하는 헬퍼 훅
 * Tailwind의 md breakpoint (768px)를 기준으로 함
 *
 * @returns 모바일 화면 여부 (boolean | null)
 *
 * @example
 * const isMobile = useIsMobile();
 * if (isMobile === null) return null;
 * return isMobile ? <MobileLayout /> : <DesktopLayout />;
 */
export const useIsMobile = (): boolean | null => {
  return useMediaQuery('(max-width: 767px)');
};

/**
 * 태블릿 화면인지 확인하는 헬퍼 훅
 * Tailwind의 md ~ lg breakpoint (768px ~ 1023px)를 기준으로 함
 *
 * @returns 태블릿 화면 여부 (boolean | null)
 */
export const useIsTablet = (): boolean | null => {
  return useMediaQuery('(min-width: 768px) and (max-width: 1023px)');
};

/**
 * 데스크톱 화면인지 확인하는 헬퍼 훅
 * Tailwind의 lg breakpoint (1024px) 이상을 기준으로 함
 *
 * @returns 데스크톱 화면 여부 (boolean | null)
 */
export const useIsDesktop = (): boolean | null => {
  return useMediaQuery('(min-width: 1024px)');
};
