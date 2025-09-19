'use client';

import apiFetch from '@/lib/api';
import useAuthStore from '@/store/useAuthStore';
import { ApiResponse, BookSummary, MyBooksData } from '@/types/api';
import { useState, useEffect } from 'react';

function MyBookList() {
  const [books, setBooks] = useState<BookSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMyBooks = async () => {
      try {
        // 내가 만든 책 목록을 요청하는 API
        const myBooksData = await apiFetch<ApiResponse<MyBooksData>>(
          '/api/v1/books/my?status=COMPLETED&page=0&size=5',
          {
            method: 'GET',
          }
        );
        if (myBooksData) {
          setBooks(myBooksData.data?.books || []);
        }
      } catch (error) {
        console.error('내가 만든 책 목록을 가져오는데 실패했습니다.', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchMyBooks();
  }, []);

  return (
    <section>
      <h2 className="text-xl font-semibold mb-4 text-gray-800">내가 만든 책</h2>
      {isLoading ? (
        <p>책 목록을 불러오는 중...</p>
      ) : books.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
          {books.map((book) => (
            <div
              key={book.id}
              className="bg-white rounded-lg shadow-md overflow-hidden"
            >
              <img
                src={book.thumbnailUrl || 'https://via.placeholder.com/150x200'}
                alt={book.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="font-bold text-gray-800 truncate">
                  {book.title}
                </h3>
                {/* <p className="text-sm text-gray-600">{book.author}</p> */}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-10 px-6 bg-gray-50 rounded-lg">
          <p className="text-gray-600">아직 만든 책이 없습니다.</p>
        </div>
      )}
    </section>
  );
}

// 사용자 정보 타입 정의
interface UserProfileData {
  name: string;
  email: string;
  profileImageUrl?: string;
}

function UserProfile() {
  const [user, setUser] = useState<UserProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        // 서버에 자신의 프로필 정보를 요청하는 API
        const profileData = await apiFetch<ApiResponse<UserProfileData>>(
          '/api/v1/members/me',
          {
            method: 'GET',
          }
        );
        setUser(profileData?.data || null);
      } catch (error) {
        console.error('프로필 정보를 가져오는데 실패했습니다.', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUserProfile();
  }, []);

  if (isLoading) {
    return (
      <div className="bg-gray-100 p-6 rounded-lg animate-pulse h-[150px]"></div>
    );
  }

  return (
    <section>
      <h2 className="text-xl font-semibold mb-4 text-gray-800">내 정보</h2>
      <div className="bg-white p-6 rounded-lg shadow-md flex items-center space-x-6">
        <img
          src={user?.profileImageUrl || 'https://via.placeholder.com/80'}
          alt="Profile"
          className="w-20 h-20 rounded-full object-cover"
        />
        <div>
          <p className="text-2xl font-bold text-gray-900">{user?.name}</p>
          <p className="text-md text-gray-600">{user?.email}</p>
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
