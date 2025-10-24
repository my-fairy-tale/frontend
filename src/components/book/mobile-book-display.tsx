'use client';

import { BookData } from '@/types/api';
import { useEffect, useRef, useState } from 'react';
import BookPage from '@/components/book/book-page';

const MobileBookDisplay = ({ bookData }: { bookData: BookData }) => {
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  const minSwipeDistance = 50; //최소 스와이프 거리

  useEffect(() => {
    // 다음 페이지 미리 로드
    const preloadNextImages = (startIndex: number) => {
      const pagesToPreload = bookData.pages.slice(
        startIndex + 1,
        startIndex + 3
      );
      pagesToPreload.forEach((page) => {
        if (page.imageUrl) {
          const img = new Image();
          img.src = page.imageUrl;
        }
      });
    };

    preloadNextImages(currentPageIndex);
  }, [currentPageIndex, bookData.pages]);

  if (bookData.pages.length === 0) {
    return <div className="p-4 text-center">이 책에는 페이지가 없습니다.</div>;
  }

  const currentPage = bookData.pages[currentPageIndex];
  const isFirstPage = currentPageIndex === 0;
  const isLastPage = currentPageIndex === bookData.pages.length - 1;

  const goToPreviousPage = () => {
    if (!isFirstPage) {
      setCurrentPageIndex((prev) => prev - 1);
    }
  };

  const goToNextPage = () => {
    if (!isLastPage) {
      setCurrentPageIndex((prev) => prev + 1);
    }
  };

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(0); // 초기화
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe && !isLastPage) {
      goToNextPage();
    }
    if (isRightSwipe && !isFirstPage) {
      goToPreviousPage();
    }
  };

  const playTts = (audioUrl: string) => {
    if (audioRef.current) {
      const audioPlayer = audioRef.current;

      if (!audioPlayer.paused && audioPlayer.src !== audioUrl) {
        audioPlayer.pause();
        audioPlayer.currentTime = 0;
      }

      audioPlayer.src = audioUrl;
      audioPlayer
        .play()
        .catch((error) => console.error('오디오 재생 중 오류 발생:', error));
    }
  };

  return (
    <div className="w-full min-h-screen flex md:hidden flex-col bg-gray-100 pb-20">
      {/* 헤더 */}
      <div className="bg-white border-b border-gray-200 p-4 sticky top-0 z-10 shadow-sm">
        <h1 className="text-xl font-bold text-gray-800 text-center">
          {bookData.title}
        </h1>
      </div>

      {/* 페이지 컨텐츠 */}
      <div
        className="flex-1 flex items-center justify-center p-4"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        <div className="w-full max-w-md">
          <BookPage
            pageData={currentPage}
            position="left"
            onPlayAudio={playTts}
          />
        </div>
      </div>

      {/* 하단 내비게이션 */}
      <div className="fixed bottom-20 left-0 right-0 p-4">
        <div className="flex items-center justify-between max-w-md mx-auto">
          {/* 이전 페이지 버튼 */}
          <button
            onClick={goToPreviousPage}
            disabled={isFirstPage}
            className="bg-blue-500 text-white rounded-full w-12 h-12 flex items-center justify-center shadow-lg transition hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            <span className="text-xl">{'<'}</span>
          </button>

          {/* 현재 페이지 정보 */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-600">
              {currentPageIndex + 1} / {bookData.pages.length}
            </span>
            {/* 페이지 진행 상황 */}
            <div className="flex gap-1">
              {bookData.pages.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === currentPageIndex
                      ? 'bg-blue-500 w-6'
                      : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* 다음 페이지 */}
          <button
            onClick={goToNextPage}
            disabled={isLastPage}
            className="bg-blue-500 text-white rounded-full w-12 h-12 flex items-center justify-center shadow-lg transition hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            <span className="text-xl">{'>'}</span>
          </button>
        </div>
      </div>

      <audio
        ref={audioRef}
        controls
        className="hidden"
      />
    </div>
  );
};

export default MobileBookDisplay;
