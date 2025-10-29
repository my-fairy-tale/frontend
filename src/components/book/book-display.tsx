'use client';

import { BookData } from '@/types/api';
import { useEffect, useRef, useState } from 'react';
import BookPage from '@/components/book/book-page';
import AdBannersWrapper from '../ad/ad-banners-wrapper';

// 2. 전체화면 아이콘 SVG 추가
export const FullscreenEnterIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />
  </svg>
);
export const FullscreenExitIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3" />
  </svg>
);

const BookDisplay = ({ bookData }: { bookData: BookData }) => {
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  // --- 👇 전체화면 기능을 위한 코드 추가 ---
  const fullscreenContainerRef = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    console.log('🔍 Preload Debug:', {
      currentPageIndex,
      currentPages: `[${currentPageIndex}, ${currentPageIndex + 1}]`,
      preloadStart: currentPageIndex + 2,
      preloadEnd: currentPageIndex + 2 + 4,
      timestamp: new Date().toISOString(),
    });

    // 현재 페이지 이후의 이미지들을 미리 로드합니다.
    const preloadNextImages = (startIndex: number) => {
      // 예를 들어, 다음 4개 페이지의 이미지를 미리 로드
      const pagesToPreload = bookData.pages.slice(
        startIndex + 2,
        startIndex + 4
      );

      pagesToPreload.forEach((page, idx) => {
        if (page.imageUrl) {
          const pageIndex = startIndex + idx;
          const img = new Image();
          const startTime = performance.now();

          console.log(`⏳ Start preloading [${pageIndex}]:`, page.imageUrl);

          img.onload = () => {
            const loadTime = performance.now() - startTime;
            console.log(`✅ Preload complete [${pageIndex}]:`, {
              url: page.imageUrl,
              loadTime: `${loadTime.toFixed(0)}ms`,
            });
          };

          img.onerror = () => {
            const loadTime = performance.now() - startTime;
            console.error(`❌ Preload failed [${pageIndex}]:`, {
              url: page.imageUrl,
              loadTime: `${loadTime.toFixed(0)}ms`,
            });
          };

          img.src = page.imageUrl;
        }
      });
    };

    // 현재 페이지 인덱스가 변경될 때마다 다음 이미지들을 미리 불러옵니다.
    preloadNextImages(currentPageIndex + 2);
  }, [currentPageIndex, bookData.pages]);

  const toggleFullscreen = () => {
    const elem = fullscreenContainerRef.current;
    if (!elem) return;

    if (!document.fullscreenElement) {
      elem.requestFullscreen().catch((err) => {
        alert(
          `전체 화면 모드를 시작할 수 없습니다: ${err.message} (${err.name})`
        );
      });
    } else {
      document.exitFullscreen();
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () =>
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  if (bookData.pages.length === 0) {
    return <div>이 책에는 페이지가 없습니다.</div>;
  }

  const leftPage = bookData.pages[currentPageIndex];
  const rightPage =
    currentPageIndex + 1 < bookData.pages.length
      ? bookData.pages[currentPageIndex + 1]
      : null;

  // 다음 페이지 (미리 렌더링용)
  const nextLeftPage = bookData.pages[currentPageIndex + 2] || null;
  const nextRightPage = bookData.pages[currentPageIndex + 3] || null;

  // 이전 페이지 (미리 렌더링용)
  const prevLeftPage = bookData.pages[currentPageIndex - 2] || null;
  const prevRightPage = bookData.pages[currentPageIndex - 1] || null;

  const goToPreviousPage = () => {
    if (isAnimating) return; // 애니메이션 중 중복 클릭 방지

    setIsAnimating(true);

    // fade out
    setTimeout(() => {
      // 페이지 변경 (이미지 로딩 시작)
      setCurrentPageIndex((prev) => Math.max(0, prev - 2));

      // 짧은 딜레이 후 fade in (이미지 로딩 시간 확보)
      setTimeout(() => {
        setIsAnimating(false);
      }, 100);
    }, 150);
  };

  const goToNextPage = () => {
    if (isAnimating) return; // 애니메이션 중 중복 클릭 방지

    setIsAnimating(true);

    // fade out
    setTimeout(() => {
      // 페이지 변경 (이미지 로딩 시작)
      setCurrentPageIndex((prev) =>
        Math.min(bookData.pages.length - 2, prev + 2)
      );

      // 짧은 딜레이 후 fade in (이미지 로딩 시간 확보)
      setTimeout(() => {
        setIsAnimating(false);
      }, 100);
    }, 150);
  };

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
      <div
        ref={fullscreenContainerRef}
        className="w-full h-auto relative hidden md:flex flex-col items-center justify-center bg-gray-100 p-4"
      >
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

          {/* 책 페이지 영역 - relative 컨테이너 */}
          <div className="flex-grow h-full relative">
            {/* 현재 페이지 (visible) */}
            <div
              className={`
                grid grid-cols-1 md:grid-cols-2 gap-4 bg-white p-4 sm:p-6 rounded-2xl shadow-2xl border border-gray-200
                transition-all duration-200 ease-in-out
                ${isAnimating ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}
              `}
            >
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

            {/* 다음 페이지 미리 렌더링 (hidden) */}
            {(nextLeftPage || nextRightPage) && (
              <div className="absolute top-0 left-0 opacity-0 pointer-events-none -z-10 w-full h-full">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 sm:p-6">
                  <BookPage
                    pageData={nextLeftPage}
                    position="left"
                    onPlayAudio={playTts}
                  />
                  <BookPage
                    pageData={nextRightPage}
                    position="right"
                    onPlayAudio={playTts}
                  />
                </div>
              </div>
            )}

            {/* 이전 페이지 미리 렌더링 (hidden) */}
            {(prevLeftPage || prevRightPage) && (
              <div className="absolute top-0 left-0 opacity-0 pointer-events-none -z-10 w-full h-full">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 sm:p-6">
                  <BookPage
                    pageData={prevLeftPage}
                    position="left"
                    onPlayAudio={playTts}
                  />
                  <BookPage
                    pageData={prevRightPage}
                    position="right"
                    onPlayAudio={playTts}
                  />
                </div>
              </div>
            )}
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
        <button
          onClick={toggleFullscreen}
          className="absolute bottom-0 right-0 mb-4 mr-4 bg-white text-gray-800 rounded-full w-12 h-12 md:w-14 md:h-14 flex items-center justify-center shadow-lg transition hover:bg-gray-200 flex-shrink-0"
        >
          {isFullscreen ? <FullscreenExitIcon /> : <FullscreenEnterIcon />}
        </button>

        <audio
          ref={audioRef}
          controls
          className="hidden"
        />
      </div>
      <AdBannersWrapper />
    </>
  );
};

export default BookDisplay;
