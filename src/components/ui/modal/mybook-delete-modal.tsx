'use client';

import useModalStore from '@/store/use-modal-store';

interface MyBookDeleteModalProps {
  title: string;
  onConfirm: () => void;
  isLoading?: boolean;
}

const MyBookDeleteModal = ({
  title,
  onConfirm,
  isLoading = false,
}: MyBookDeleteModalProps) => {
  const { closeModal } = useModalStore();

  const handleConfirm = () => {
    onConfirm();
  };

  const handleCancel = () => {
    closeModal();
  };

  return (
    <div className="bg-white p-6 max-w-sm">
      <h3 className="text-lg font-bold text-gray-900 mb-2">책 삭제 확인</h3>
      <p className="text-gray-700 mb-6">
        &quot;{title}&quot;을(를) 삭제하시겠습니까?
        <br />이 작업은 되돌릴 수 없습니다.
      </p>
      <div className="flex gap-3">
        <button
          type="button"
          onClick={handleConfirm}
          disabled={isLoading}
          className="flex-1 bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50 font-semibold"
        >
          {isLoading ? '삭제 중...' : '삭제'}
        </button>
        <button
          type="button"
          onClick={handleCancel}
          disabled={isLoading}
          className="flex-1 bg-gray-200 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors disabled:opacity-50 font-semibold"
        >
          취소
        </button>
      </div>
    </div>
  );
};

export default MyBookDeleteModal;
