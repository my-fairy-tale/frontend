'use client';

interface DeletePostModalProps {
  title: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const DeletePostModal = ({
  title,
  onConfirm,
  onCancel,
}: DeletePostModalProps) => {
  return (
    <div className="p-6">
      <h3 className="text-lg font-bold text-gray-900 mb-2">게시글 삭제 확인</h3>
      <p className="text-gray-700 mb-6">
        &quot;{title}&quot; 게시글을 삭제하시겠습니까?
        <br />이 작업은 되돌릴 수 없습니다.
      </p>
      <div className="flex gap-3">
        <button
          type="button"
          onClick={onConfirm}
          className="flex-1 bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition-colors font-semibold"
        >
          삭제
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 bg-gray-200 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors font-semibold"
        >
          취소
        </button>
      </div>
    </div>
  );
};

export default DeletePostModal;
