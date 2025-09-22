'use client';

import apiFetch from '@/lib/api';
import useAuthStore from '@/store/useAuthStore';
import { ApiResponse } from '@/types/api';
import { useState, useEffect } from 'react';
import MyBookList from '@/components/book/my-book-list';
import { FaUserCircle } from 'react-icons/fa';
import { useQuery } from '@tanstack/react-query';

interface UserProfileData {
  name: string;
  email: string;
  profileImageUrl?: string;
}

const fetchUserProfile = async () => {
  const response = await apiFetch<ApiResponse<UserProfileData>>(
    '/api/v1/members/me'
  );
  if (!response?.data) {
    throw new Error('프로필 정보를 불러올 수 없습니다.');
  }
  return response.data;
};

function UserProfile() {
  const {
    data: user,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['userProfile', 'me'], // 이 쿼리를 식별하는 고유한 키
    queryFn: fetchUserProfile, // 데이터를 가져오는 함수
  });

  // 초기 로딩 상태
  if (isLoading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md animate-pulse h-[128px]">
        <div className="flex items-center space-x-6">
          <div className="w-20 h-20 bg-gray-300 rounded-full"></div>
          <div className="space-y-4 flex-grow">
            <div className="h-6 bg-gray-300 rounded w-1/2"></div>
            <div className="h-4 bg-gray-300 rounded w-3/4"></div>
          </div>
        </div>
      </div>
    );
  }

  // 에러 발생 상태
  if (isError) {
    return (
      <div className="bg-red-50 p-6 rounded-lg text-red-700">
        프로필 정보를 불러오는 데 실패했습니다: {error.message}
      </div>
    );
  }

  if (!user) {
    return (
      <div className="bg-red-50 p-6 rounded-lg text-red-700">
        존재하지 않는 user입니다.
      </div>
    );
  }

  return (
    <section>
      <h2 className="text-xl font-semibold mb-4 text-gray-800">내 정보</h2>
      <div className="bg-white p-6 rounded-lg shadow-md flex items-center space-x-6">
        {user.profileImageUrl ? (
          <img
            src={user.profileImageUrl}
            alt="Profile"
            className="w-20 h-20 rounded-full object-cover"
          />
        ) : (
          <FaUserCircle
            size={80}
            className="text-gray-300"
          />
        )}
        <div>
          <p className="text-2xl font-bold text-gray-900">{user.name}</p>
          <p className="text-md text-gray-600">{user.email}</p>
        </div>
      </div>
    </section>
  );
}

export default function MyPage() {
  const { accessToken } = useAuthStore();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Hydration 오류 방지 및 로그인 상태 확인
  if (!isMounted) {
    return <div className="p-8">페이지를 불러오는 중...</div>; // 또는 스켈레톤 UI
  }

  if (!accessToken) {
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
        <UserProfile />

        {/* 내가 만든 책 목록 섹션 */}
        <MyBookList />
      </div>
    </main>
  );
}
