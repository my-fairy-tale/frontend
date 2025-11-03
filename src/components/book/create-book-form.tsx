// /components/book/CreateBookForm.tsx

'use client';

import { useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ApiResponse,
  CreateBookData,
  CreateBookPageProps,
  BookTheme,
  BookStyle,
  BookThemeLabels,
  BookStyleLabels,
} from '@/types/api';
import Notification from '@/components/ui/notification';
import { useSession } from 'next-auth/react';
import useUserStore from '@/store/use-user-store';
import { VOICE_MODELS } from '@/lib/voice-models';
import ApiFetch from '@/lib/api';

export default function CreateBookForm() {
  const { data: session } = useSession();
  const { user } = useUserStore();
  const [formData, setFormData] = useState({ title: '', story: '' });
  const [targetAge, setTargetAge] = useState(7);
  const [theme, setTheme] = useState<BookTheme>(BookTheme.ADVENTURE);
  const [style, setStyle] = useState<BookStyle>(BookStyle.CARTOON);
  const [voiceModel, setVoiceModel] = useState(
    user?.voicePreference || VOICE_MODELS[0].id
  );
  const [ttsSpeed, setTtsSpeed] = useState(user?.ttsSpeed || 1.0);
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState({ message: '', type: '' });
  const router = useRouter();

  const handleChange = useCallback((
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleSubmit = useCallback(async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setNotification({ message: '', type: '' }); // 이전 알림 초기화

    const body: CreateBookPageProps = {
      title: formData.title, // title 추가
      originalText: formData.story,
      targetAge,
      theme,
      style,
      voiceModel,
      ttsSpeed,
    };

    try {
      if (!session?.accessToken) {
        throw new Error('인증 정보가 없습니다.');
      }

      const backendUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/books/generate`;
      const data = await ApiFetch<ApiResponse<CreateBookData>>(
        backendUrl,
        {
          method: 'POST',
          body: JSON.stringify(body),
        },
        session.accessToken
      );

      if (data?.code === 'BOOK_2001' && data.data) {
        setNotification({
          message:
            '나만의 동화책이 만들어지고 있어요! 잠시 후 마이페이지에서 확인해주세요.',
          type: 'success',
        });
        setTimeout(() => router.push('/mypage'), 2000); // 2초 후 페이지 이동
      } else {
        throw new Error(data?.message || '알 수 없는 오류가 발생했습니다.');
      }
    } catch (error) {
      setNotification({
        message: `${error}` || '동화책 생성에 실패했어요. 다시 시도해 주세요.',
        type: 'error',
      });
    } finally {
      setIsLoading(false); // 성공/실패 여부와 관계없이 로딩 상태 해제
    }
  }, [formData, targetAge, theme, style, voiceModel, ttsSpeed, session?.accessToken, router]);

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-6">
        <label
          htmlFor="title"
          className="block text-lg font-medium text-gray-700 mb-2"
        >
          동화책 이름
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="예: 용감한 토끼의 당근 찾기 모험"
          className="w-full p-3 text-base border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition disabled:bg-gray-100"
          disabled={isLoading}
          required
        />
      </div>

      <div className="mb-6">
        <label
          htmlFor="story"
          className="block text-lg font-medium text-gray-700 mb-2"
        >
          이야기 내용
        </label>
        <textarea
          id="story"
          name="story"
          value={formData.story}
          onChange={handleChange}
          placeholder="옛날 옛적에 용감한 토끼가 살았어요.&#10;&#10;토끼는 당근을 아주 좋아했답니다."
          className="w-full min-h-[300px] p-4 text-base border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition disabled:bg-gray-100"
          disabled={isLoading}
          required
        />
        <p className="text-gray-500 text-sm mt-2">
          엔터(Enter) 두 번으로 페이지를 나눌 수 있어요.
        </p>
      </div>

      <div className="mb-6">
        <label
          htmlFor="targetAge"
          className="block text-lg font-medium text-gray-700 mb-2"
        >
          대상 연령: {targetAge}세
        </label>
        <input
          id="targetAge"
          type="range"
          min="3"
          max="12"
          step="1"
          value={targetAge}
          onChange={(e) => setTargetAge(parseInt(e.target.value))}
          className="w-full"
          disabled={isLoading}
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>3세</span>
          <span>12세</span>
        </div>
      </div>

      <div className="mb-6">
        <label
          htmlFor="theme"
          className="block text-lg font-medium text-gray-700 mb-2"
        >
          테마
        </label>
        <select
          id="theme"
          value={theme}
          onChange={(e) => setTheme(e.target.value as BookTheme)}
          className="w-full p-3 text-base border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition disabled:bg-gray-100"
          disabled={isLoading}
        >
          {Object.entries(BookThemeLabels).map(([value, label]) => (
            <option
              key={value}
              value={value}
            >
              {label}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-6">
        <label
          htmlFor="style"
          className="block text-lg font-medium text-gray-700 mb-2"
        >
          스타일
        </label>
        <select
          id="style"
          value={style}
          onChange={(e) => setStyle(e.target.value as BookStyle)}
          className="w-full p-3 text-base border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition disabled:bg-gray-100"
          disabled={isLoading}
        >
          {Object.entries(BookStyleLabels).map(([value, label]) => (
            <option
              key={value}
              value={value}
            >
              {label}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-6">
        <label
          htmlFor="voice-model"
          className="block text-lg font-medium text-gray-700 mb-2"
        >
          음성 모델
        </label>
        <select
          id="voice-model"
          value={voiceModel}
          onChange={(e) => setVoiceModel(e.target.value)}
          className="w-full p-3 text-base border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition disabled:bg-gray-100"
          disabled={isLoading}
        >
          {VOICE_MODELS.map((voice) => (
            <option
              key={voice.id}
              value={voice.id}
            >
              {voice.name}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-6">
        <label
          htmlFor="tts-speed"
          className="block text-lg font-medium text-gray-700 mb-2"
        >
          음성 속도: {ttsSpeed.toFixed(1)}x
        </label>
        <input
          id="tts-speed"
          type="range"
          min="0.5"
          max="2.0"
          step="0.1"
          value={ttsSpeed}
          onChange={(e) => setTtsSpeed(parseFloat(e.target.value))}
          className="w-full"
          disabled={isLoading}
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>0.5x</span>
          <span>2.0x</span>
        </div>
      </div>

      {notification.message && (
        <Notification
          message={notification.message}
          type={notification.type as 'success' | 'error'}
        />
      )}

      <button
        type="submit"
        disabled={isLoading || !formData.title || !formData.story}
        className="w-full md:w-auto py-3 px-8 text-lg font-semibold bg-green-500 text-white rounded-lg shadow-md hover:bg-green-600 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        {isLoading ? '동화책을 만드는 중...' : '마법 같은 동화책 만들기 ✨'}
      </button>
    </form>
  );
}
