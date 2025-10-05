'use client';

import { getQueryClient } from '@/lib/get-query-client';
import useUserStore from '@/store/use-user-store';
import { ApiResponse, UserProfileData } from '@/types/api';
import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';

const VOICE_MODELS = [
  { id: 'alloy', name: 'Alloy' },
  { id: 'echo', name: 'Echo' },
  { id: 'fable', name: 'Fable' },
  { id: 'onyx', name: 'Onyx' },
  { id: 'nova', name: 'Nova' },
  { id: 'shimmer', name: 'Shimmer' },
  { id: 'ash', name: 'Ash' },
  { id: 'ballad', name: 'Ballad' },
  { id: 'coral', name: 'Coral' },
  { id: 'sage', name: 'Sage' },
  { id: 'verse', name: 'Verse' },
];

const ChoosePreferenceVoice = ({
  voiceModel,
  ttsSpeed: initialTtsSpeed,
  accessToken,
}: {
  voiceModel?: string;
  ttsSpeed?: number;
  accessToken?: string;
}) => {
  const queryClient = getQueryClient();
  const { updateVoiceModel, updateTtsSpeed: updateStoreTtsSpeed } = useUserStore();
  const [selectedVoice, setSelectedVoice] = useState(
    voiceModel || VOICE_MODELS[0].id
  );
  const [ttsSpeed, setTtsSpeed] = useState(initialTtsSpeed || 1.0);

  const { mutate: patchVoicePreference, isPending } = useMutation({
    mutationFn: async ({
      newVoiceModel,
      newTtsSpeed,
    }: {
      newVoiceModel: string;
      newTtsSpeed: number;
    }) => {
      if (!accessToken) {
        throw new Error('인증 정보가 없습니다.');
      }

      const backendUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/members/voice-preference`;
      const response = await fetch(backendUrl, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          defaultTtsVoice: newVoiceModel,
          defaultTtsSpeed: newTtsSpeed,
        }),
      });
      if (!response.ok) {
        throw new Error('Failed to update voice preference');
      }

      const data: ApiResponse<null> = await response.json();
      return data.data;
    },
    onMutate: async ({ newVoiceModel, newTtsSpeed }) => {
      await queryClient.cancelQueries({
        queryKey: ['members-me'],
      });
      const previousUser = queryClient.getQueryData<UserProfileData>([
        'members-me',
      ]);
      queryClient.setQueryData<UserProfileData>(['members-me'], (old) => {
        if (!old) return old;
        return { ...old, voiceModel: newVoiceModel, ttsSpeed: newTtsSpeed };
      });
      return { previousUser };
    },
    onError: (err, variables, context) => {
      if (context?.previousUser) {
        queryClient.setQueryData(['members-me'], context.previousUser);
      }
      console.error('Voice preference update failed:', err);
      alert('음성 설정 업데이트에 실패했습니다. 다시 시도해주세요.');
    },
    onSuccess: () => {
      alert('음성 설정이 성공적으로 업데이트되었습니다.');
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ['members-me'],
      });
      updateVoiceModel(selectedVoice);
      updateStoreTtsSpeed(ttsSpeed);
    },
  });

  const handleSubmit = () => {
    patchVoicePreference({
      newVoiceModel: selectedVoice,
      newTtsSpeed: ttsSpeed,
    });
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Choose Voice Preference</h2>

      <div className="flex flex-col gap-2">
        <label
          htmlFor="voice-select"
          className="text-sm font-medium"
        >
          Voice Model
        </label>
        <select
          id="voice-select"
          value={selectedVoice}
          onChange={(e) => setSelectedVoice(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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

      <div className="flex flex-col gap-2">
        <label
          htmlFor="tts-speed"
          className="text-sm font-medium"
        >
          TTS Speed: {ttsSpeed.toFixed(1)}x
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
        />
        <div className="flex justify-between text-xs text-gray-500">
          <span>0.5x</span>
          <span>2.0x</span>
        </div>
      </div>

      <button
        type="button"
        onClick={handleSubmit}
        disabled={isPending}
        className={`w-full px-4 py-2 text-white font-medium rounded-lg transition-colors ${
          isPending
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-blue-500 hover:bg-blue-600'
        }`}
      >
        {isPending ? '저장 중...' : '저장'}
      </button>
    </div>
  );
};

export default ChoosePreferenceVoice;
