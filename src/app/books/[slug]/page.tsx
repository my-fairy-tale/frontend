import BookDisplay from '@/components/book/book-display';
import useAuthStore from '@/store/useAuthStore';

// --- 타입 정의 및 데이터 가져오는 함수 (이전과 동일) ---
interface BookPage {
  pageNumber: number;
  text: string;
  imageUrl: string;
  ttsUrl: string;
}

interface BookData {
  id: string;
  title: string;
  pages: BookPage[];
}

async function getBookData(slug: string): Promise<BookData | null> {
  //상단에 use client 추가 or 분리
  const { accessToken } = useAuthStore();
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${accessToken}`,
  };
  const response = await fetch('/api/v1/books/' + slug, {
    headers: headers,
  });

  if (!response.ok) {
    alert('동화책 정보를 불러오지 못했어요. 다시 시도해 주세요.');
    return null;
  } else {
    console.log('동화책 정보 요청 성공:', await response.json());
  }

  const data = await response.json();
  // swagger 에 따라 data parsing

  // ... (이전과 동일한 로직, UI 구현을 위한 임시 데이터 반환) ...
  if (slug === 'the-little-prince') {
    return {
      id: 'the-little-prince',
      title: '어린 왕자 (Tailwind UI)',
      pages: [
        {
          pageNumber: 0,
          text: '📖 표지 페이지입니다 📖',
          imageUrl: '/images/cover.png',
          ttsUrl: '/tts/cover.mp3',
        },
        {
          pageNumber: 1,
          text: '옛날 옛적에, 아주 작은 별에 어린 왕자가 살고 있었어요.',
          imageUrl: '/images/prince1.png',
          ttsUrl: '/tts/prince1.mp3',
        },
        {
          pageNumber: 2,
          text: '그 별에는 아름다운 장미꽃 한 송이가 피어 있었죠.',
          imageUrl: '/images/rose.png',
          ttsUrl: '/tts/rose.mp3',
        },
        {
          pageNumber: 3,
          text: '어린 왕자는 매일 장미꽃을 소중히 보살폈어요.',
          imageUrl: '/images/watering.png',
          ttsUrl: '/tts/watering.mp3',
        },
        {
          pageNumber: 4,
          text: '하지만 장미꽃은 너무나도 변덕스러웠답니다.',
          imageUrl: '/images/moody-rose.png',
          ttsUrl: '/tts/moody-rose.mp3',
        },
        {
          pageNumber: 5,
          text: '결국 왕자는 별을 떠나 다른 행성들을 여행하기로 결심했어요.',
          imageUrl: '/images/leaving-planet.png',
          ttsUrl: '/tts/leaving-planet.mp3',
        },
        {
          pageNumber: 6,
          text: '세상을 여행하며 여러 사람들을 만나게 됩니다.',
          imageUrl: '/images/traveler.png',
          ttsUrl: '/tts/traveler.mp3',
        },
        {
          pageNumber: 7,
          text: '마지막 페이지입니다. 동화책을 마치겠습니다.',
          imageUrl: '/images/the-end.png',
          ttsUrl: '/tts/the-end.mp3',
        },
      ],
    };
  }
  return null;
}
// -----------------------------------------------------------------

// 서버 컴포넌트: 데이터 페칭 담당
export default async function BookViewerPage({
  params,
}: {
  params: { slug: string };
}) {
  const bookData = await getBookData(params.slug);

  if (!bookData) {
    return (
      <main className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-2xl text-gray-500 text-center">
          해당 동화책을 찾을 수 없어요. 😢
        </div>
      </main>
    );
  }

  return <BookDisplay bookData={bookData} />;
}
