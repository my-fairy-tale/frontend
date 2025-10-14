'use client';

import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { UserProfileData } from '@/types/api';
import useModalStore from '@/store/use-modal-store';
import useUserStore from '@/store/use-user-store';
import { formatPhoneNumber, validatePhoneNumber } from '@/lib/phone-utils';

interface PhoneNumberModalProps {
  onConfirm: () => void;
}

const PhoneNumberModal = ({ onConfirm }: PhoneNumberModalProps) => {
  const { data: session, update } = useSession();
  const { closeModal } = useModalStore();
  const { updateUserPhoneNumber } = useUserStore();
  const queryClient = useQueryClient();
  const [name, setName] = useState(session?.user?.name || '');
  const [phoneNumber, setPhoneNumber] = useState('');

  const { mutate: updateProfile, isPending } = useMutation({
    mutationFn: async ({
      name,
      phoneNumber,
    }: {
      name: string;
      phoneNumber: string;
    }) => {
      if (!session?.accessToken) {
        throw new Error('인증 정보가 없습니다.');
      }

      const backendUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/members/me`;
      const response = await fetch(backendUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session?.accessToken}`,
        },
        body: JSON.stringify({ name, phoneNumber }),
      });

      if (!response.ok) {
        throw new Error('프로필 업데이트에 실패했습니다.');
      }

      const data = await response.json();
      return data.data;
    },
    onMutate: async () => {
      await queryClient.cancelQueries({
        queryKey: ['members-me'],
      });
      const previousUser = queryClient.getQueryData<UserProfileData>([
        'members-me',
      ]);
      queryClient.setQueryData<UserProfileData>(['members-me'], (old) => {
        if (!old) return old;
        return { ...old, name, phoneNumber };
      });

      return { previousUser };
    },
    onError: (err) => {
      console.error('프로필 업데이트 실패:', err);
      alert('프로필 업데이트에 실패했습니다. 다시 시도해주세요.');
    },
    onSuccess: () => {
      updateUserPhoneNumber(phoneNumber);
      alert('프로필 업데이트 성공!');
    },
    onSettled: async () => {
      queryClient.invalidateQueries({
        queryKey: ['members-me'],
      });
      await update({ isNewUser: false });
      closeModal();
    },
  });

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    setPhoneNumber(formatted);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate name
    if (!name.trim()) {
      alert('이름을 입력해주세요.');
      return;
    }

    if (name.trim().length < 2 || name.trim().length > 20) {
      alert('이름은 2자 이상 20자 이하로 입력해주세요.');
      return;
    }

    // Validate phone number
    if (!phoneNumber.trim()) {
      alert('전화번호를 입력해주세요.');
      return;
    }

    if (!validatePhoneNumber(phoneNumber)) {
      alert('올바른 전화번호 형식이 아닙니다. (예: 010-1234-5678)');
      return;
    }

    updateProfile({ name: name.trim(), phoneNumber: phoneNumber.trim() });
    onConfirm();
  };

  return (
    <div className="bg-white rounded-lg p-6 w-full max-w-md">
      <h2 className="text-2xl font-bold text-gray-900 mb-2">회원 정보 입력</h2>
      <p className="text-gray-600 mb-6">
        서비스 이용을 위해 추가 정보를 입력해주세요.
      </p>

      <form
        onSubmit={handleSubmit}
        className="space-y-4"
      >
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            이름
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="홍길동"
            maxLength={20}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isPending}
          />
        </div>

        <div>
          <label
            htmlFor="phoneNumber"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            전화번호
          </label>
          <input
            id="phoneNumber"
            type="tel"
            value={phoneNumber}
            onChange={handlePhoneChange}
            placeholder="010-1234-5678"
            maxLength={13}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isPending}
          />
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="w-full px-4 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isPending ? '등록 중...' : '등록하기'}
        </button>
      </form>
    </div>
  );
};

export default PhoneNumberModal;
