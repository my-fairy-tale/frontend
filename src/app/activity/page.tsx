import RecentBooks from '@/components/activity/recent-books';
import BookmarkedPosts from '@/components/activity/bookmarked-posts';
import MyReviews from '@/components/activity/my-reviews';
import { getQueryClient } from '@/lib/get-query-client';
import { auth } from '@/auth';
import { recentBookOption } from '@/components/activity/recent-books-option';
import { bookmarkedPostsOption } from '@/components/activity/bookmarked-posts-option';
import { myReviewsOption } from '@/components/activity/my-reviews-option';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';

const ActivityPage = async () => {
  const queryClient = getQueryClient();
  const session = await auth();

  try {
    await Promise.all([
      queryClient.prefetchInfiniteQuery(
        bookmarkedPostsOption(session?.accessToken)
      ),
      queryClient.prefetchQuery(recentBookOption(session?.accessToken)),
      queryClient.prefetchInfiniteQuery(myReviewsOption(session?.accessToken)),
    ]);
  } catch (err) {
    console.error('activity page prefetch failed', err);
  }

  const dehydratedState = dehydrate(queryClient);

  return (
    <main className="max-w-7xl mx-auto p-6 md:p-8 my-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-3">내 활동</h1>
        <p className="text-lg text-gray-600">
          최근 본 책, 북마크한 게시물, 작성한 리뷰를 확인하세요
        </p>
      </div>

      <div className="space-y-12">
        <HydrationBoundary state={dehydratedState}>
          <RecentBooks />
          <BookmarkedPosts />
          <MyReviews />
        </HydrationBoundary>
      </div>
    </main>
  );
};

export default ActivityPage;
