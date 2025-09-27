import { bookDetailOption } from '@/components/book/book-detail-option';
import BookFetching from '@/components/book/book-fetching';
import { getQueryClient } from '@/lib/get-query-client';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';

// 서버 컴포넌트: 데이터 페칭 담당
export default async function BookViewerPage(props: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await props.params;
  const queryClient = getQueryClient();

  try {
    await queryClient.prefetchQuery(bookDetailOption(slug));
  } catch (err) {
    console.log('book prefetch failed', err);
  }

  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydratedState}>
      <BookFetching slug={slug} />
    </HydrationBoundary>
  );
}
