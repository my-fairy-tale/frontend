import LoadingSkeleton from '@/components/ui/loading-skeleton';
import Link from 'next/link';
import { FaPlus } from 'react-icons/fa';

export default function LibraryLoading() {
  return (
    <main className="w-5xl mx-auto flex flex-col items-center gap-8 p-6 md:p-8">
      <div className="w-full flex items-end justify-between">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-3">동화 광장</h1>
          <p className="text-lg text-gray-600 max-md:hidden">
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

      <LoadingSkeleton />
    </main>
  );
}
