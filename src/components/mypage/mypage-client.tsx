// /components/mypage/MyPageClient.tsx (새 파일)
'use client';

import MyBookList from '@/components/book/my-book-list';
import UserProfile from '@/components/mypage/user-profile'; // UserProfile 컴포넌트 경로

export default function MyPageClient() {
  return (
    <div className="space-y-10">
      {/* 사용자 프로필 섹션 */}
      <UserProfile />

      {/* 내가 만든 책 목록 섹션 */}
    </div>
  );
}
