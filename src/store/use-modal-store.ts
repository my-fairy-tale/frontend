// store/useModalStore.ts

import { create } from 'zustand';
import { ReactNode } from 'react';

export type ModalSize = 'sm' | 'md' | 'lg' | 'xl' | 'full';

export interface ModalOptions {
  size?: ModalSize;
  closeOnBackdropClick?: boolean;
}

// 스토어의 상태와 액션을 정의하는 인터페이스
interface ModalState {
  isOpen: boolean;
  modalContent: ReactNode | null; // React 컴포넌트나 null을 저장
  modalOptions: ModalOptions;
  openModal: (content: ReactNode, options?: ModalOptions) => void;
  closeModal: () => void;
}

const defaultOptions: ModalOptions = {
  size: 'md',
  closeOnBackdropClick: false,
};

const useModalStore = create<ModalState>((set) => ({
  // 초기 상태
  isOpen: false,
  modalContent: null,
  modalOptions: defaultOptions,

  // 모달을 여는 액션
  openModal: (content, options = {}) =>
    set({
      isOpen: true,
      modalContent: content,
      modalOptions: { ...defaultOptions, ...options },
    }),

  // 모달을 닫는 액션
  closeModal: () =>
    set({ isOpen: false, modalContent: null, modalOptions: defaultOptions }),
}));

export default useModalStore;
