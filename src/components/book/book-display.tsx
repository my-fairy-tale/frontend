'use client';

import { BookData } from '@/types/api';
import Image from 'next/image';
import { useRef, useState } from 'react';

const BookDisplay = ({ bookData }: { bookData: BookData }) => {
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  const leftPage = bookData.pages[currentPageIndex];
  const rightPage =
    currentPageIndex + 1 < bookData.pages.length
      ? bookData.pages[currentPageIndex + 1]
      : null;

  const goToPreviousPage = () =>
    setCurrentPageIndex((prev) => Math.max(0, prev - 2));
  const goToNextPage = () =>
    setCurrentPageIndex((prev) =>
      Math.min(bookData.pages.length - 1, prev + 2)
    );

  const playTts = (ttsUrl: string) => {
    if (audioRef.current) {
      audioRef.current.src = ttsUrl;
      audioRef.current
        .play()
        .catch((e) => console.error('오디오 재생 실패:', e));
    }
  };

  return (
    <>
      <h1 className="text-3xl md:text-5xl font-bold text-gray-800 mb-8 text-center">
        {bookData.title}
      </h1>

      <div className="flex items-center gap-2 sm:gap-6 w-full max-w-7xl">
        {/* 이전 페이지 버튼 */}
        <button
          onClick={goToPreviousPage}
          disabled={currentPageIndex === 0}
          className="bg-white text-gray-800 rounded-full w-12 h-12 md:w-14 md:h-14 text-3xl flex items-center justify-center shadow-lg transition hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          &lt;
        </button>

        {/* 책 페이지 영역 */}
        <div className="flex-grow grid grid-cols-1 md:grid-cols-2 gap-4 bg-white p-4 sm:p-6 rounded-2xl shadow-2xl border border-gray-200">
          {/* 왼쪽 페이지 */}
          <div
            // onClick={() => leftPage && playTts(leftPage.ttsUrl)}
            className="aspect-[3/4] border border-gray-200 rounded-lg p-4 sm:p-6 flex flex-col items-center justify-between bg-white shadow-inner cursor-pointer relative"
          >
            <Image
              src={leftPage.imageUrl}
              alt={`Page ${leftPage.pageNumber}`}
              className="max-w-full max-h-[70%] object-contain rounded-md"
            />
            <p className="text-base sm:text-lg text-center text-gray-700 leading-relaxed flex-grow flex items-center justify-center pt-4">
              {leftPage.content}
            </p>
            <span className="absolute bottom-4 left-6 text-sm text-gray-400">
              {leftPage.pageNumber}
            </span>
          </div>

          {/* 오른쪽 페이지 */}
          <div
            // onClick={() => rightPage && playTts(rightPage.ttsUrl)}
            className="aspect-[3/4] border border-gray-200 rounded-lg p-4 sm:p-6 flex flex-col items-center justify-between bg-white shadow-inner cursor-pointer relative"
          >
            {rightPage ? (
              <>
                <Image
                  src={rightPage.imageUrl}
                  alt={`Page ${rightPage.pageNumber}`}
                  className="max-w-full max-h-[70%] object-contain rounded-md"
                />
                <p className="text-base sm:text-lg text-center text-gray-700 leading-relaxed flex-grow flex items-center justify-center pt-4">
                  {rightPage.content}
                </p>
                <span className="absolute bottom-4 right-6 text-sm text-gray-400">
                  {rightPage.pageNumber}
                </span>
              </>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                <p>동화책의 마지막입니다. 😊</p>
              </div>
            )}
          </div>
        </div>

        {/* 다음 페이지 버튼 */}
        <button
          onClick={goToNextPage}
          disabled={!rightPage}
          className="bg-white text-gray-800 rounded-full w-12 h-12 md:w-14 md:h-14 text-3xl flex items-center justify-center shadow-lg transition hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          &gt;
        </button>
      </div>

      <audio
        ref={audioRef}
        controls
        className="hidden"
      />
    </>
  );
};

export default BookDisplay;
