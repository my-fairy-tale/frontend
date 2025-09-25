import MyBookList from '@/components/book/my-book-list';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { getQueryClient } from '@/lib/get-query-client';
import { userProfileOption } from '../../components/mypage/user-profile-option';
import UserProfile from '../../components/mypage/user-profile';

export default function MyPage() {
  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(userProfileOption);
  const dehydratedState = dehydrate(queryClient);

  return (
    <main className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
      <h1 className="text-3xl font-bold mb-8 text-gray-900">마이페이지</h1>

      <div className="space-y-10">
        {/* 사용자 프로필 섹션 */}
        <HydrationBoundary state={dehydratedState}>
          <UserProfile />
        </HydrationBoundary>

        {/* 내가 만든 책 목록 섹션 */}
        <MyBookList />
      </div>
    </main>
  );
}
