import Link from 'next/link';
import { useState } from 'react';

interface BookThumbnailProps {
  id: string;
  thumbnailUrl: string;
  title: string;
  isPublic: 'PUBLIC' | 'PRIVATE'; // 공개 여부
  // onStatusChange: (bookId: string, newStatus: boolean) => Promise<void>; // 상태 변경 API 호출 함수
}

const BookThumbnail = ({
  id,
  thumbnailUrl,
  title,
  isPublic: initialIsPublic,
}: // onStatusChange,
BookThumbnailProps) => {
  // const [isPublic, setIsPublic] = useState(initialIsPublic);
  // const [isLoading, setIsLoading] = useState(false);

  // // 2. 토글 클릭 이벤트 핸들러
  // const handleToggleClick = async (
  //   event: React.MouseEvent<HTMLButtonElement>
  // ) => {
  //   // Link 컴포넌트의 페이지 이동 이벤트를 막음
  //   event.preventDefault();
  //   event.stopPropagation();

  //   setIsLoading(true);
  //   const newStatus = !isPublic;

  //   // 3. 낙관적 업데이트: API 호출 전에 UI를 먼저 변경하여 빠른 피드백 제공
  //   setIsPublic(newStatus);

  //   try {
  //     // 부모로부터 받은 함수를 통해 실제 API 호출
  //     await onStatusChange(id, newStatus);
  //   } catch (error) {
  //     console.error('상태 변경에 실패했습니다:', error);
  //     // 4. API 호출 실패 시, UI를 원래 상태로 되돌림
  //     setIsPublic(!newStatus);
  //     alert('상태 변경에 실패했습니다. 다시 시도해주세요.');
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };
  return (
    <Link
      className="bg-white rounded-lg shadow-md overflow-hidden"
      href={`/books/${id}`}
    >
      <img
        src={thumbnailUrl || 'https://via.placeholder.com/150x200'}
        alt={title}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h3 className="font-bold text-gray-800 truncate">{title}</h3>
        {/* <p className="text-sm text-gray-600">{book.author}</p> */}
      </div>
    </Link>
  );
};

export default BookThumbnail;
