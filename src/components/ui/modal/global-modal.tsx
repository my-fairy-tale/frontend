// components/GlobalModal.tsx
'use client';

import React from 'react';
import useModalStore from '@/store/use-modal-store';

const GlobalModal = () => {
  // 스토어에서 상태와 액션을 가져옵니다.
  const { isOpen, modalContent } = useModalStore();

  if (!isOpen) {
    return null; // 모달이 닫혀 있으면 아무것도 렌더링하지 않습니다.
  }

  return (
    <div
      className="w-full fixed px-8 inset-0 bg-black/50 flex justify-center items-center z-50"
      //onClick={closeModal} // 배경 클릭 시 모달 닫기 -> 이게 닫히게 되면 안될거 같음
    >
      <div
        className="w-full bg-white rounded-[1.25rem] p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()} // 모달 내부 클릭 시 닫히지 않도록 이벤트 전파 방지
      >
        {modalContent}
      </div>
    </div>
  );
};

export default GlobalModal;
