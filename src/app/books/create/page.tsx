'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import useAuthStore from '@/store/useAuthStore';

interface CreateBookPageProps {
  originalText: string;
  targetAge: number;
  theme: string;
  style: string;
}

const CreateBookPage = () => {
  const [story, setStory] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { accessToken } = useAuthStore();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);

    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    };
    const body: CreateBookPageProps = {
      originalText: story,
      targetAge: 5,
      theme: 'ADVENTURE',
      style: 'CARTOON',
    };

    const response = await fetch('/api/v1/books/generate', {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(body),
    });
    if (!response.ok) {
      alert('동화책 생성에 실패했어요. 다시 시도해 주세요.');
      setIsLoading(false);
      return;
    } else {
      // 동화책 생성 요청 성공
      console.log('동화책 생성 요청 성공');
    }

    await new Promise((resolve) => setTimeout(resolve, 2000));

    const data = await response.json();
    const newBookId = data;
    setIsLoading(false);
    alert('나만의 동화책이 짠! 하고 만들어졌어요!');
    router.push(`/books/${newBookId}`);
  };

  return (
    <main className="p-8 md:p-12 max-w-4xl mx-auto">
      <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-2">
        새 동화책 만들기 🎨
      </h1>
      <p className="text-gray-600 mb-8">
        상상 속 이야기를 마음껏 적어주세요. 각 문단이 동화책의 한 페이지가
        됩니다.
      </p>

      <form onSubmit={handleSubmit}>
        <textarea
          value={story}
          onChange={(e) => setStory(e.target.value)}
          placeholder="옛날 옛적에 용감한 토끼가 살았어요.&#10;&#10;토끼는 당근을 아주 좋아했답니다."
          className="w-full min-h-[300px] p-4 text-base border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition disabled:bg-gray-100"
          disabled={isLoading}
        />
        <p className="text-gray-500 text-sm mt-2">
          엔터(Enter) 두 번으로 페이지를 나눌 수 있어요.
        </p>

        <button
          type="submit"
          disabled={isLoading}
          className="mt-6 w-full md:w-auto py-3 px-8 text-lg font-semibold bg-green-500 text-white rounded-lg shadow-md hover:bg-green-600 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {isLoading ? '동화책을 만드는 중...' : '마법 같은 동화책 만들기 ✨'}
        </button>
      </form>
    </main>
  );
};

export default CreateBookPage;
