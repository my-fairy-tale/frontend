import LibraryBookList from '@/components/library/library-book-list';
import LibraryFilter from '@/components/library/library-filter';
import LoadingSkeleton from '@/components/ui/loading-skeleton';
import Link from 'next/link';
import { Suspense } from 'react';
import { FaPlus } from 'react-icons/fa';
import { getQueryClient } from '@/lib/get-query-client';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { libraryBookOption } from '@/components/library/library-book-option';

export default async function LibraryPage({
  searchParams,
}: {
  searchParams: Promise<{ sort?: string }>;
}) {
  const params = await searchParams;
  const sort = params?.sort || 'latest';

  const queryClient = getQueryClient();

  try {
    await queryClient.prefetchInfiniteQuery(libraryBookOption(sort));
  } catch (err) {
    console.error('library books prefetch failed', err);
  }

  const dehydratedState = dehydrate(queryClient);

  return (
    <main className="max-w-7xl mx-auto p-6 md:p-8 my-8">
      <div className="mb-6 flex items-end justify-between">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-3">동화 광장</h1>
          <p className="text-lg text-gray-600">
            다양한 사람들이 만든 멋진 동화책을 구경하고, 리뷰를 남겨보세요
          </p>
        </div>

        <Link
          href="/library/create"
          className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold shadow-lg hover:shadow-xl"
        >
          <FaPlus />책 게시하기
        </Link>
      </div>

      <LibraryFilter currentSort={sort} />

      <HydrationBoundary state={dehydratedState}>
        <Suspense fallback={<LoadingSkeleton />}>
          <LibraryBookList currentSort={sort} />
        </Suspense>
      </HydrationBoundary>
    </main>
  );
}
