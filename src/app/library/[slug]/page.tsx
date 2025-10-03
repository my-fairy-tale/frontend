import { auth } from '@/auth';
import BookDetailInfo from '@/components/library/book-detail-info';
import BookReviews from '@/components/library/book-reviews';
import { libraryDetailBookOption } from '@/components/library/library-detail-book-option';
import { libraryDetailLikeOption } from '@/components/library/library-detail-like-option';
import { libraryDetailReviewOption } from '@/components/library/library-detail-review-option';
import { getQueryClient } from '@/lib/get-query-client';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';

export default async function LibraryDetailPage(props: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await props.params;
  const queryClient = getQueryClient();
  const session = await auth();

  try {
    await queryClient.prefetchQuery(libraryDetailBookOption(slug));
    if (session?.accessToken) {
      await queryClient.prefetchQuery(libraryDetailLikeOption(slug));
    }
    await queryClient.prefetchInfiniteQuery(libraryDetailReviewOption(slug));
  } catch (err) {
    console.log('book prefetch failed', err);
  }

  const dehydratedState = dehydrate(queryClient);

  return (
    <main>
      <HydrationBoundary state={dehydratedState}>
        <BookDetailInfo slug={slug} />
        <BookReviews slug={slug} />
      </HydrationBoundary>
    </main>
  );
}
