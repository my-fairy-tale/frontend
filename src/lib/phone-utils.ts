/**
 * 전화번호를 010-1234-5678 형식으로 포맷팅합니다.
 * @param value - 포맷팅할 전화번호 문자열
 * @returns 포맷팅된 전화번호
 */
export function formatPhoneNumber(value: string): string {
  // 숫자만 추출
  const numbers = value.replace(/\D/g, '');

  // 길이에 따라 포맷팅
  if (numbers.length <= 3) {
    return numbers;
  } else if (numbers.length <= 7) {
    return `${numbers.slice(0, 3)}-${numbers.slice(3)}`;
  } else {
    return `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(
      7,
      11
    )}`;
  }
}

/**
 * 전화번호 형식이 올바른지 검증합니다.
 * @param phoneNumber - 검증할 전화번호
 * @returns 유효하면 true, 아니면 false
 */
export function validatePhoneNumber(phoneNumber: string): boolean {
  const phoneRegex = /^01[0-9]-?[0-9]{3,4}-?[0-9]{4}$/;
  return phoneRegex.test(phoneNumber.trim());
}
