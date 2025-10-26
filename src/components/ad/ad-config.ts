/**
 * 카카오 애드핏 광고 설정
 */

export const AD_UNITS = {
  /** PC 배너 광고 (728x90) */
  PC_BANNER: 'DAN-QyqLwiahlSFDhmcA',

  /** 모바일 배너 광고 (320x50) */
  MOBILE_BANNER: 'DAN-hc06tiFHsYYdon85',

  /** 사이드바 광고 (160x600) */
  SIDEBAR_BANNER: 'DAN-8Fa5mGlEZJyUwI0K',
} as const;

export const AD_SIZES = {
  /** PC 배너 크기 (728x90) */
  PC_BANNER: {
    width: 728,
    height: 90,
  },

  /** 모바일 배너 크기 (320x50) */
  MOBILE_BANNER: {
    width: 320,
    height: 50,
  },

  /** 사이드바 배너 크기 (160x600) */
  SIDEBAR_BANNER: {
    width: 160,
    height: 600,
  },
} as const;

/**
 * 광고 설정을 하나의 객체로 통합
 */
export const AD_CONFIG = {
  PC_BANNER: {
    adUnit: AD_UNITS.PC_BANNER,
    ...AD_SIZES.PC_BANNER,
  },
  MOBILE_BANNER: {
    adUnit: AD_UNITS.MOBILE_BANNER,
    ...AD_SIZES.MOBILE_BANNER,
  },
  SIDEBAR_BANNER: {
    adUnit: AD_UNITS.SIDEBAR_BANNER,
    ...AD_SIZES.SIDEBAR_BANNER,
  },
} as const;

// 타입 export
export type AdUnitKey = keyof typeof AD_UNITS;
export type AdSizeKey = keyof typeof AD_SIZES;
export type AdConfigKey = keyof typeof AD_CONFIG;
