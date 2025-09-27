import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { getQueryClient } from '@/lib/get-query-client';
import { userProfileOption } from '../../components/mypage/user-profile-option';
import UserProfile from '../../components/mypage/user-profile';
import MyBookList from '@/components/book/my-book-list';
import { myBookOption } from '@/components/mypage/my-book-option';

export default async function MyPage() {
  const queryClient = getQueryClient();

  try {
    await Promise.all([
      queryClient.prefetchQuery(userProfileOption),
      queryClient.prefetchInfiniteQuery(myBookOption),
    ]);
  } catch (err) {
    console.error('userprofile prefetch failed', err);
  }

  const dehydratedState = dehydrate(queryClient);

  return (
    <main className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
      <h1 className="text-3xl font-bold mb-8 text-gray-900">마이페이지</h1>

      <div className="space-y-10">
        <HydrationBoundary state={dehydratedState}>
          <UserProfile />
          <MyBookList />
        </HydrationBoundary>
      </div>
    </main>
  );
}
