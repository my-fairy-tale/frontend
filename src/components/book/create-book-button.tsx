'use client';

import useUserStore from '@/store/use-user-store';
import Link from 'next/link';

const CreateBookButton = () => {
  const { user } = useUserStore();
  const canCreate = user?.canCreateBookToday ?? true;

  if (!canCreate) {
    return (
      <div className="inline-flex flex-col items-center gap-2">
        <button
          disabled
          className="inline-block text-lg py-3 px-6 bg-gray-400 text-gray-200 font-semibold rounded-lg shadow-md cursor-not-allowed"
        >
          + 새 동화책 만들러 가기
        </button>
        <span className="text-sm text-red-600 font-medium">
          오늘은 더 이상 책을 만들 수 없습니다
        </span>
      </div>
    );
  }

  return (
    <Link
      href="/books/create"
      className="inline-block text-lg py-3 px-6 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-transform transform hover:scale-105"
    >
      + 새 동화책 만들러 가기
    </Link>
  );
};

export default CreateBookButton;
