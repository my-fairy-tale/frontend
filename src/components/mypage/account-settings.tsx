'use client';

import { useCallback } from 'react';
import { signOut } from 'next-auth/react';
import useModalStore from '@/store/use-modal-store';
import useUserStore from '@/store/use-user-store';
import UserWithdrawModal from '@/components/ui/modal/user-withdraw-modal';
import ApiFetch from '@/lib/api';

interface AccountSettingsProps {
  accessToken?: string;
}

const AccountSettings = ({ accessToken }: AccountSettingsProps) => {
  const { openModal, closeModal } = useModalStore();
  const { clearUser } = useUserStore();

  const handleWithdrawConfirm = useCallback(async () => {
    try {
      if (!accessToken) {
        throw new Error('인증 정보가 없습니다.');
      }

      await ApiFetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/members/me`,
        {
          method: 'DELETE',
        },
        accessToken
      );

      closeModal();
      alert('회원 탈퇴가 완료되었습니다. 그동안 이용해주셔서 감사합니다.');

      // Clear user store before signing out
      clearUser();

      // Sign out and redirect to home
      await signOut({ callbackUrl: '/' });
    } catch (error) {
      console.error('회원 탈퇴 실패:', error);
      alert('회원 탈퇴에 실패했습니다. 다시 시도해주세요.');
      throw error;
    }
  }, [accessToken, closeModal, clearUser]);

  const handleWithdrawClick = useCallback(() => {
    openModal(
      <UserWithdrawModal
        onConfirm={handleWithdrawConfirm}
        onCancel={closeModal}
      />,
      { size: 'lg' }
    );
  }, [openModal, closeModal, handleWithdrawConfirm]);

  return (
    <section>
      <h2 className="text-xl font-semibold mb-4 text-gray-800">계정 설정</h2>
      <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-red-500">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">위험 구역</h3>
        <p className="text-sm text-gray-600 mb-4">
          회원 탈퇴 시 모든 데이터가 영구적으로 삭제되며 복구할 수 없습니다.
        </p>
        <button
          onClick={handleWithdrawClick}
          className="px-4 py-2 rounded-lg font-medium transition-colors bg-red-600 text-white hover:bg-red-700"
        >
          회원 탈퇴
        </button>
      </div>
    </section>
  );
};

export default AccountSettings;
