// store/useModalStore.ts

import { create } from 'zustand';
import { ReactNode } from 'react';

// 스토어의 상태와 액션을 정의하는 인터페이스
interface ModalState {
  isOpen: boolean;
  modalContent: ReactNode | null; // React 컴포넌트나 null을 저장
  openModal: (content: ReactNode) => void;
  closeModal: () => void;
}

const useModalStore = create<ModalState>((set) => ({
  // 초기 상태
  isOpen: false,
  modalContent: null,

  // 모달을 여는 액션
  openModal: (content) => set({ isOpen: true, modalContent: content }),

  // 모달을 닫는 액션
  closeModal: () => set({ isOpen: false, modalContent: null }),
}));

export default useModalStore;
