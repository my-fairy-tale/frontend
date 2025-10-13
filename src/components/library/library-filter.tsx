'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useTransition } from 'react';

interface LibraryFilterProps {
  currentSort?: string;
}

const LibraryFilter = ({ currentSort }: LibraryFilterProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const sortOptions = [
    { value: 'latest', label: '최신순' },
    { value: 'popular', label: '인기순' },
    { value: 'views', label: '조회순' },
    { value: 'likes', label: '좋아요순' },
  ];

  const handleSortChange = (sort: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('sort', sort);

    startTransition(() => {
      router.push(`/library?${params.toString()}`);
    });
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow-md w-full p-4 mb-6 flex flex-wrap gap-4 items-center justify-between">
        <div className="flex flew-row gap-3">
          {sortOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => handleSortChange(option.value)}
              disabled={isPending}
              className={`px-4 py-2 max-md:text-xs rounded-lg transition-colors font-medium ${
                currentSort === option.value
                  ? 'bg-blue-500 text-white hover:bg-blue-600'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              } ${isPending ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>
    </>
  );
};

export default LibraryFilter;
