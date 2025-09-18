import { useCallback, useState } from 'react';

// ElevenLabs API 문서: https://elevenlabs.io/docs/developer-guides/
interface UseTextToSpeechOptions {
  modelId: string; // 사용할 모델 ID
  voiceId: string; // ElevenLabs의 음성 ID
  stability?: number; // 음성 안정성 (0~1)
  similarityBoost?: number; // 원본 음성과의 유사도 (0~1)
  styleExaggeration?: number; // 스타일 과장도
  useSpeakerBoost?: boolean; // 스피커 부스트 사용 여부
  playbackRate?: number; // 재생 속도
  onStart?: () => void; // 재생 시작 콜백
  onEnd?: () => void; // 재생 종료 콜백
  onError?: (error: Error) => void; // 에러 처리 콜백
}

export const useTextToSpeech = ({
  modelId,
  voiceId,
  stability,
  similarityBoost,
  styleExaggeration,
  useSpeakerBoost,
  playbackRate,
  onStart,
  onEnd,
  onError,
}: UseTextToSpeechOptions) => {
  // 상태 관리
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(
    null
  );

  // 재생 중지 함수
  const stopSpeech = useCallback(() => {
    if (audioElement) {
      audioElement.pause();
      setIsPlaying(false);
      onEnd?.();
    }
  }, [audioElement, onEnd]);

  // 텍스트를 음성으로 변환하고 재생하는 핵심 함수
  const speakText = useCallback(
    async (text: string) => {
      // 이미 재생 중이면 중지
      if (isPlaying) {
        stopSpeech();
        return;
      }

      try {
        setIsPlaying(true);
        onStart?.();

        // ElevenLabs API 호출
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_ELEVENLABS_API_ENDPOINT}text-to-speech/${voiceId}/stream`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'xi-api-key': process.env.NEXT_PUBLIC_ELEVENLABS_API_KEY || '',
            },
            body: JSON.stringify({
              text,
              voice_settings: {
                stability: stability || 0.5,
                similarity_boost: similarityBoost || 0.75,
                style: styleExaggeration || 0,
                use_speaker_boost: useSpeakerBoost || false,
              },
              model_id: modelId,
            }),
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        // 스트림 리더 생성
        const reader = response.body?.getReader();
        if (!reader) throw new Error('스트림 리더를 생성할 수 없습니다');

        // MediaSource 설정
        const mediaSource = new MediaSource();
        const audio = new Audio(URL.createObjectURL(mediaSource));
        setAudioElement(audio);

        // MediaSource 이벤트 처리
        mediaSource.addEventListener('sourceopen', async () => {
          const sourceBuffer = mediaSource.addSourceBuffer('audio/mpeg');
          const chunks: Uint8Array[] = [];

          // SourceBuffer의 업데이트 완료를 기다리는 헬퍼 함수
          const waitForUpdateEnd = () => {
            return new Promise<void>((resolve) => {
              if (!sourceBuffer.updating) {
                resolve();
              } else {
                sourceBuffer.addEventListener('updateend', () => resolve(), {
                  once: true,
                });
              }
            });
          };

          try {
            // 청크 단위로 데이터를 받아서 처리
            while (true) {
              const { done, value } = await reader.read();
              if (done) break;

              chunks.push(value);

              // 이전 업데이트가 완료될 때까지 대기
              if (sourceBuffer.updating) {
                await waitForUpdateEnd();
              }
              sourceBuffer.appendBuffer(value);

              // 첫 번째 청크가 도착하면 재생 시작
              if (chunks.length === 1) {
                audio.play().catch((error) => {
                  onError?.(new Error('오디오 재생 실패: ' + error.message));
                });
              }
            }

            // 모든 업데이트가 완료될 때까지 대기 후 스트림 종료
            await waitForUpdateEnd();
            if (!sourceBuffer.updating) {
              mediaSource.endOfStream();
            }
          } catch (error) {
            console.error('스트리밍 에러:', error);
            onError?.(
              error instanceof Error ? error : new Error('스트리밍 실패')
            );
          }
        });

        // 오디오 이벤트 핸들러 설정
        audio.onended = () => {
          setIsPlaying(false);
          setAudioElement(null);
          onEnd?.();
        };

        audio.onerror = () => {
          setIsPlaying(false);
          onError?.(new Error('오디오 재생 실패'));
        };
      } catch (error) {
        setIsPlaying(false);
        onError?.(error instanceof Error ? error : new Error('음성 생성 실패'));
      }
    },
    [isPlaying, onError, stopSpeech]
  );

  // 훅에서 반환하는 값들
  return {
    isPlaying, // 현재 재생 상태
    speakText, // 텍스트를 음성으로 변환하여 재생하는 함수
    stopSpeech, // 재생을 중지하는 함수
  };
};
