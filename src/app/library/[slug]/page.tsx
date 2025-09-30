import BookDetailInfo from '@/components/library/book-detail-info';
import BookReviews from '@/components/library/book-reviews';
import LoadingSkeleton from '@/components/ui/loading-skeleton';
import { getQueryClient } from '@/lib/get-query-client';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { Suspense } from 'react';

export default async function LibraryDetailPage(props: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await props.params;
  const queryClient = getQueryClient();

  try {
    //await queryClient.prefetchQuery();
  } catch (err) {
    console.log('book prefetch failed', err);
  }

  const dehydratedState = dehydrate(queryClient);

  return (
    <main>
      <Suspense fallback={<LoadingSkeleton />}>
        <HydrationBoundary state={dehydratedState}>
          <BookDetailInfo bookId={slug} />
        </HydrationBoundary>
      </Suspense>
      <div className="mt-12">
        <Suspense>
          <HydrationBoundary state={dehydratedState}>
            <BookReviews bookId={slug} />
          </HydrationBoundary>
        </Suspense>
      </div>
    </main>
  );
}
