'use client';

import apiFetch from '@/lib/api';
import { ApiResponse, BookSummary, MyBooksData } from '@/types/api';
import { useEffect, useState } from 'react';
import BookThumbnail from './book-thumbnail';

const MyBookList = () => {
  const [books, setBooks] = useState<BookSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMyBooks = async () => {
      try {
        // 내가 만든 책 목록을 요청하는 API
        const myBooksData = await apiFetch<ApiResponse<MyBooksData>>(
          '/api/v1/books/my?status=COMPLETED&page=0&size=10',
          {
            method: 'GET',
          }
        );
        if (myBooksData) {
          setBooks(myBooksData.data?.books || []);
        }
      } catch (error) {
        console.error('내가 만든 책 목록을 가져오는데 실패했습니다.', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchMyBooks();
  }, []);

  return (
    <section>
      <h2 className="text-xl font-semibold mb-4 text-gray-800">내가 만든 책</h2>
      {isLoading ? (
        <p>책 목록을 불러오는 중...</p>
      ) : books.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
          {books.map((book) => (
            <BookThumbnail
              key={book.id}
              id={book.id}
              thumbnailUrl={book.thumbnailUrl}
              title={book.title}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-10 px-6 bg-gray-50 rounded-lg">
          <p className="text-gray-600">아직 만든 책이 없습니다.</p>
        </div>
      )}
    </section>
  );
};

export default MyBookList;
