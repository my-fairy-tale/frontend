import { BookPage as BookPageData } from '@/types/api';
import Image from 'next/image';
import { memo, useCallback } from 'react';

interface BookPageProps {
  pageData: BookPageData | null;
  position: 'left' | 'right';
  onPlayAudio: (audioUrl: string) => void;
}

function BookPage({ pageData, position, onPlayAudio }: BookPageProps) {
  const handlePageClick = useCallback(() => {
    // pageData가 있고 audioUrl이 있을 때만 부모의 함수를 호출
    if (pageData?.audioUrl) {
      onPlayAudio(pageData.audioUrl);
    }
  }, [pageData, onPlayAudio]);

  if (!pageData) {
    // 오른쪽 페이지가 없을 때 보여줄 UI
    return (
      <div className="aspect-[3/4] bg-gray-50 rounded-lg flex items-center justify-center p-6 text-gray-500 shadow-inner">
        <p>동화책의 마지막입니다. 😊</p>
      </div>
    );
  }

  return (
    <div
      className="aspect-[3/4] bg-white rounded-lg p-4 sm:p-6 shadow-inner border border-gray-200 flex flex-col relative overflow-hidden"
      onClick={handlePageClick}
    >
      {/* 이미지 영역 */}
      <div className="flex-grow-[3] flex items-center justify-center mb-4">
        <Image
          src={pageData.imageUrl}
          alt={`Page ${pageData.pageNumber}`}
          width={1024}
          height={1024}
          className="max-w-full max-h-full object-contain rounded-md"
        />
      </div>
      {/* 텍스트 영역 */}
      <div className="flex-grow-[2] flex items-center justify-center">
        <p className="text-sm sm:text-lg text-center text-gray-700 leading-relaxed">
          {pageData.content}
        </p>
      </div>
      {/* 페이지 번호 */}
      <span
        className={`absolute bottom-4 text-sm text-gray-400 ${
          position === 'left' ? 'left-6' : 'right-6'
        }`}
      >
        {pageData.pageNumber}
      </span>
    </div>
  );
}

export default memo(BookPage);
