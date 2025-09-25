'use client';

import { useState, useEffect } from 'react';
import MyBookList from '@/components/book/my-book-list';
import { dehydrate, HydrationBoundary, useQuery } from '@tanstack/react-query';
import { getQueryClient } from '@/lib/get-query-client';
import { userProfileOption } from './user-profile-option';
import UserProfile from './user-profile';
import { auth } from '@/auth';

export default async function MyPage() {
  const session = await auth();
  const [isMounted, setIsMounted] = useState(false);
  const queryClient = getQueryClient();

  void queryClient.prefetchQuery(userProfileOption);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Hydration 오류 방지 및 로그인 상태 확인
  if (!isMounted) {
    return <div className="p-8">페이지를 불러오는 중...</div>; // 또는 스켈레톤 UI
  }

  if (!session) {
    return (
      <div className="p-8 text-center">
        <p>로그인이 필요한 페이지입니다.</p>
        {/* 로그인 페이지로 보내는 링크나 버튼을 여기에 추가할 수 있습니다. */}
      </div>
    );
  }

  return (
    <main className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
      <h1 className="text-3xl font-bold mb-8 text-gray-900">마이페이지</h1>

      <div className="space-y-10">
        {/* 사용자 프로필 섹션 */}
        <HydrationBoundary state={dehydrate(queryClient)}>
          <UserProfile />
        </HydrationBoundary>

        {/* 내가 만든 책 목록 섹션 */}
        <MyBookList />
      </div>
    </main>
  );
}
