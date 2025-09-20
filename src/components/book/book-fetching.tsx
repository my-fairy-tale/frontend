'use client';

import { useState, useEffect } from 'react';
import apiFetch from '@/lib/api';
import { ApiResponse, BookData } from '@/types/api';
import BookDisplay from './book-display'; // 실제 UI 컴포넌트

export default function BookFetching({ slug }: { slug: string }) {
  const [bookData, setBookData] = useState<BookData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const response = await apiFetch<ApiResponse<BookData>>(
          `/api/v1/books/${slug}`
        );

        if (response?.code === 'BOOK_2002' && response.data) {
          setBookData(response.data);
        } else {
          setError(response?.message || '책을 찾을 수 없습니다.');
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBook();
  }, [slug]); // slug가 바뀔 때마다 다시 fetching

  if (isLoading) return <div>책을 불러오는 중...</div>;
  if (error) return <div>오류: {error}</div>;
  if (!bookData) return <div>해당 책을 찾을 수 없습니다.</div>;

  return <BookDisplay bookData={bookData} />;
}
