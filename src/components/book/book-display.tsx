'use client';

import { BookData } from '@/types/api';
import { useRef, useState } from 'react';
import BookPage from '@/components/book/book-page';

const BookDisplay = ({ bookData }: { bookData: BookData }) => {
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  if (bookData.pages.length === 0) {
    return <div>이 책에는 페이지가 없습니다.</div>;
  }

  const leftPage = bookData.pages[currentPageIndex];
  const rightPage =
    currentPageIndex + 1 < bookData.pages.length
      ? bookData.pages[currentPageIndex + 1]
      : null;

  const goToPreviousPage = () =>
    setCurrentPageIndex((prev) => Math.max(0, prev - 2));
  const goToNextPage = () =>
    setCurrentPageIndex((prev) =>
      Math.min(bookData.pages.length - 2, prev + 2)
    );

  const playTts = (audioUrl: string) => {
    if (audioRef.current) {
      const audioPlayer = audioRef.current;

      // 1. 만약 다른 오디오가 이미 재생 중이라면,
      if (!audioPlayer.paused && audioPlayer.src !== audioUrl) {
        // 현재 오디오를 멈추고 재생 시간을 처음으로 돌립니다.
        audioPlayer.pause();
        audioPlayer.currentTime = 0;
      }

      // 2. 새로운 오디오 URL을 설정합니다.
      audioPlayer.src = audioUrl;

      // 3. 오디오를 재생합니다.
      // play() 메소드는 Promise를 반환하므로, catch로 에러를 처리해주는 것이 좋습니다.
      // (예: 사용자가 상호작용하기 전에 자동재생을 시도할 때 발생하는 에러 등)
      audioPlayer
        .play()
        .catch((error) => console.error('오디오 재생에 실패했습니다:', error));
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
          className="bg-white text-gray-800 rounded-full w-12 h-12 md:w-14 md:h-14 text-3xl flex items-center justify-center shadow-lg transition hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
        >
          &lt;
        </button>

        {/* 책 페이지 영역 - 2. 크기 고정 및 레이아웃 안정화 */}
        <div className="flex-grow h-full grid grid-cols-1 md:grid-cols-2 gap-4 bg-white p-4 sm:p-6 rounded-2xl shadow-2xl border border-gray-200">
          <BookPage
            pageData={leftPage}
            position="left"
            onPlayAudio={playTts}
          />
          <BookPage
            pageData={rightPage}
            position="right"
            onPlayAudio={playTts}
          />
        </div>

        {/* 다음 페이지 버튼 */}
        <button
          onClick={goToNextPage}
          disabled={!rightPage || !bookData.pages[currentPageIndex + 2]} // 다음 펼칠 페이지가 있는지 확인
          className="bg-white text-gray-800 rounded-full w-12 h-12 md:w-14 md:h-14 text-3xl flex items-center justify-center shadow-lg transition hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
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
