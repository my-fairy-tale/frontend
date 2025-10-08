'use client';

import { useState } from 'react';
import { FaExclamationTriangle } from 'react-icons/fa';

interface UserWithdrawModalProps {
  onConfirm: () => Promise<void>;
  onCancel: () => void;
}

const UserWithdrawModal = ({ onConfirm, onCancel }: UserWithdrawModalProps) => {
  const [step, setStep] = useState<1 | 2>(1);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFirstConfirm = () => {
    setStep(2);
  };

  const handleFinalConfirm = async () => {
    setIsProcessing(true);
    try {
      await onConfirm();
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-center mb-4">
        <div className="bg-red-100 rounded-full p-3">
          <FaExclamationTriangle className="w-8 h-8 text-red-600 pb-1" />
        </div>
      </div>

      {step === 1 ? (
        <>
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-4">
            회원 탈퇴
          </h2>
          <div className="space-y-3 w-full mb-6">
            <p className="text-gray-700">정말로 회원 탈퇴하시겠습니까?</p>
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-sm text-red-800 font-semibold mb-2">
                ⚠️ 탈퇴 시 삭제되는 데이터:
              </p>
              <ul className="text-sm text-red-700 space-y-1 list-disc list-inside">
                <li>모든 동화책 및 콘텐츠</li>
                <li>리뷰 및 좋아요 기록</li>
                <li>개인 정보 및 설정</li>
                <li>계정 복구 불가능</li>
              </ul>
            </div>
          </div>
          <div className="flex gap-3">
            <button
              onClick={onCancel}
              className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 font-medium rounded-lg hover:bg-gray-300 transition-colors"
            >
              취소
            </button>
            <button
              onClick={handleFirstConfirm}
              className="flex-1 px-4 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors"
            >
              다음
            </button>
          </div>
        </>
      ) : (
        <>
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-4">
            최종 확인
          </h2>
          <div className="space-y-3 w-full mb-6">
            <p className="text-gray-700 font-semibold">마지막 확인입니다.</p>
            <p className="text-gray-600">
              탈퇴하시면 모든 동화책과 데이터가{' '}
              <span className="text-red-600 font-bold">영구적으로 삭제</span>
              됩니다.
            </p>
            <p className="text-gray-600">정말 탈퇴하시겠습니까?</p>
          </div>
          <div className="flex justify-between gap-3">
            <button
              onClick={() => setStep(1)}
              disabled={isProcessing}
              className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 font-medium rounded-lg hover:bg-gray-300 transition-colors disabled:opacity-50"
            >
              이전
            </button>
            <button
              onClick={handleFinalConfirm}
              disabled={isProcessing}
              className="flex-1 px-4 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
            >
              {isProcessing ? '처리 중...' : '탈퇴하기'}
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default UserWithdrawModal;
