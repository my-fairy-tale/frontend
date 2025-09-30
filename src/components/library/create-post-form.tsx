'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { useInfiniteQuery } from '@tanstack/react-query';
import { fetchMyBooks } from '../book/my-book-list';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

export default function CreatePostForm() {
  const router = useRouter();
  const { data: session } = useSession();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 사용자의 책 목록 (임시 데이터)
  const [myBookstemp] = useState([
    {
      id: 'book-1',
      title: '숲 속의 모험',
      thumbnailUrl: '/book_placeholder.jpg',
      pageCount: 12,
    },
    {
      id: 'book-2',
      title: '용감한 토끼',
      thumbnailUrl: '/book_placeholder.jpg',
      pageCount: 8,
    },
    {
      id: 'book-3',
      title: '마법의 성',
      thumbnailUrl: '/book_placeholder.jpg',
      pageCount: 15,
    },
    {
      id: 'book-1',
      title: '숲 속의 모험',
      thumbnailUrl: '/book_placeholder.jpg',
      pageCount: 12,
    },
    {
      id: 'book-1',
      title: '숲 속의 모험',
      thumbnailUrl: '/book_placeholder.jpg',
      pageCount: 12,
    },
    {
      id: 'book-1',
      title: '숲 속의 모험',
      thumbnailUrl: '/book_placeholder.jpg',
      pageCount: 12,
    },
  ]);

  const {
    data: myBooks,
    error,
    fetchNextPage,
    hasNextPage,
    isLoading,
    isError,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ['myBooksInfinite'],
    queryFn: async ({ pageParam = 0 }) => {
      if (!session?.accessToken) {
        throw new Error('인증 정보가 없습니다.');
      }
      return await fetchMyBooks({
        pageParam: pageParam,
        accessToken: session.accessToken,
      });
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      if (!lastPage.isLast) {
        return lastPage.currentPage + 1;
      }
      return undefined;
    },
  });
  const [selectedBookId, setSelectedBookId] = useState('');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const scrollRef = useRef<HTMLDivElement>(null);

  // Scroll observer to fetch next page
  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    const handleScroll = () => {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainer;
      const scrollPercentage = (scrollLeft + clientWidth) / scrollWidth;

      // Fetch next page when scrolled 80% to the right
      if (scrollPercentage > 0.8 && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    };

    scrollContainer.addEventListener('scroll', handleScroll);
    return () => scrollContainer.removeEventListener('scroll', handleScroll);
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 400;
      const newScrollLeft =
        scrollRef.current.scrollLeft +
        (direction === 'left' ? -scrollAmount : scrollAmount);
      scrollRef.current.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth',
      });
    }
  };

  // Flatten all books from infinite query pages
  const allBooks = myBooks?.pages.flatMap((page) => page.books) ?? [];

  const handleBookSelect = (bookId: string) => {
    const book = allBooks.find((b) => b.id === bookId);
    setSelectedBookId(bookId);
    if (book) {
      setTitle(book.title);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedBookId) {
      alert('게시할 책을 선택해주세요.');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/v1/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session?.accessToken}`,
        },
        body: JSON.stringify({
          bookId: selectedBookId,
          title,
          content,
        }),
      });

      if (!response.ok) {
        throw new Error('게시글 등록에 실패했습니다.');
      }

      // 임시: 2초 딜레이
      await new Promise((resolve) => setTimeout(resolve, 2000));

      alert('책이 성공적으로 게시되었습니다!');
      router.push('/community');
      router.refresh();
    } catch (error) {
      console.error('게시 실패:', error);
      alert('게시에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white w-full rounded-lg shadow-lg p-8"
    >
      {/* 책 선택 */}
      <div className="mb-8 relative">
        <label className="block text-lg font-semibold text-gray-900 mb-4">
          게시할 책 선택 <span className="text-red-500">*</span>
        </label>

        {isLoading ? (
          <div className="text-center py-10 bg-gray-50 rounded-lg">
            <p className="text-gray-600">책 목록을 불러오는 중...</p>
          </div>
        ) : isError ? (
          <div className="text-center py-10 bg-gray-50 rounded-lg">
            <p className="text-red-600">책 목록을 불러오는데 실패했습니다.</p>
          </div>
        ) : allBooks.length === 0 ? (
          <div className="text-center py-10 bg-gray-50 rounded-lg">
            <p className="text-gray-600 mb-4">아직 만든 책이 없습니다.</p>
            <a
              href="/books/create"
              className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              동화책 만들기
            </a>
          </div>
        ) : (
          <>
            {/* 책 목록 - 가로 스크롤 */}
            <div
              ref={scrollRef}
              className="flex gap-4 overflow-x-auto scrollbar-hide px-12 py-2"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {allBooks.map((book, index) => (
                <button
                  key={`${book.id}-${index}`}
                  type="button"
                  onClick={() => handleBookSelect(book.id)}
                  className={`relative flex-shrink-0 w-40 aspect-[3/4] rounded-lg overflow-hidden border-4 transition-all ${
                    selectedBookId === book.id
                      ? 'border-blue-500 shadow-lg scale-105'
                      : 'border-transparent hover:border-gray-300'
                  }`}
                >
                  <Image
                    src={book.thumbnailUrl}
                    alt={book.title}
                    fill
                    className="object-cover"
                  />
                  {selectedBookId === book.id && (
                    <div className="absolute inset-0 bg-blue-500 bg-opacity-20 flex items-center justify-center">
                      <div className="bg-white rounded-full p-2">
                        <svg
                          className="w-8 h-8 text-blue-500"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                    </div>
                  )}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-2">
                    <p className="text-white text-sm font-semibold line-clamp-1">
                      {book.title}
                    </p>
                  </div>
                </button>
              ))}

              {/* Loading indicator for fetching next page */}
              {isFetchingNextPage && (
                <div className="flex-shrink-0 w-40 aspect-[3/4] flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* 제목 */}
      <div className="mb-6">
        <label
          htmlFor="title"
          className="block text-lg font-semibold text-gray-900 mb-2"
        >
          게시글 제목 <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="동화책의 제목을 입력하세요"
          required
          maxLength={100}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <p className="text-sm text-gray-500 mt-1">{title.length}/100</p>
      </div>

      {/* 설명 */}
      <div className="mb-8">
        <label
          htmlFor="description"
          className="block text-lg font-semibold text-gray-900 mb-2"
        >
          동화책 소개 <span className="text-red-500">*</span>
        </label>
        <textarea
          id="description"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="이 동화책에 대해 소개해주세요. 어떤 이야기인지, 어떤 점이 특별한지 등을 자유롭게 작성해보세요."
          required
          maxLength={500}
          rows={6}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
        />
        <p className="text-sm text-gray-500 mt-1">{content.length}/500</p>
      </div>

      {/* 미리보기 */}
      {selectedBookId && title && content && (
        <div className="mb-8 p-6 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">미리보기</h3>
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <h4 className="font-bold text-gray-900 mb-2">{title}</h4>
            <p className="text-gray-700 text-sm leading-relaxed">{content}</p>
          </div>
        </div>
      )}

      {/* 버튼 */}
      <div className="flex gap-4">
        <button
          type="submit"
          disabled={isSubmitting || !selectedBookId}
          className={`flex-1 py-3 rounded-lg font-semibold transition-colors ${
            isSubmitting || !selectedBookId
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          {isSubmitting ? '게시 중...' : '게시하기'}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          disabled={isSubmitting}
          className="px-8 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-colors disabled:opacity-50"
        >
          취소
        </button>
      </div>
    </form>
  );
}
