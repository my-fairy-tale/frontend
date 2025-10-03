'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { FaUserCircle } from 'react-icons/fa';
import { MdEdit, MdCheck, MdClose } from 'react-icons/md';
import { useState, useEffect } from 'react';
import { userProfileOption } from './user-profile-option';
import useUserStore from '@/store/use-user-store';
import { useSession } from 'next-auth/react';
import { UserProfileData } from '@/types/api';

const UserProfile = () => {
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  const {
    data: user,
    isLoading,
    isError,
    error,
  } = useQuery(userProfileOption(session?.accessToken));
  const { user: storedUser, setUser } = useUserStore();
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState('');
  const [newPhoneNumber, setNewPhoneNumber] = useState('');

  const { mutate: updateProfile } = useMutation({
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
    onMutate: async ({ name, phoneNumber }) => {
      await queryClient.cancelQueries({
        queryKey: userProfileOption(session?.accessToken).queryKey,
      });
      const previousUser = queryClient.getQueryData<UserProfileData>([
        userProfileOption(session?.accessToken).queryKey,
      ]);
      queryClient.setQueryData<UserProfileData>(
        userProfileOption(session?.accessToken).queryKey,
        (old) => {
          if (!old) return old;
          return { ...old, name, phoneNumber };
        }
      );
      setIsEditing(false);

      return { previousUser };
    },
    onError: (err, variables, context) => {
      if (context?.previousUser) {
        queryClient.setQueryData(
          userProfileOption(session?.accessToken).queryKey,
          context.previousUser
        );
      }
      console.error('프로필 업데이트 실패:', err);
      alert('프로필 업데이트에 실패했습니다. 다시 시도해주세요.');
      setIsEditing(true);
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: userProfileOption(session?.accessToken).queryKey,
      });
    },
  });

  useEffect(() => {
    if (user) {
      setUser(user);
    }
  }, [user, setUser]);

  if (isLoading) return <p>사용자 정보를 불러오는 중입니다...</p>;
  if (isError)
    return <p>사용자 정보를 불러오는데 실패했습니다: {String(error)}</p>;
  if (!user) return <p>사용자 정보를 찾을 수 없습니다.</p>;

  const handleEditClick = () => {
    setNewName(user.name);
    setNewPhoneNumber(user.phoneNumber || '');
    setIsEditing(true);
  };

  const handleSave = async () => {
    // Validate name
    if (!newName.trim()) {
      alert('이름을 입력해주세요.');
      return;
    }

    if (newName.trim().length < 2 || newName.trim().length > 20) {
      alert('이름은 2자 이상 20자 이하로 입력해주세요.');
      return;
    }

    // Validate phone number if provided
    if (newPhoneNumber.trim()) {
      const phoneRegex = /^01[0-9]-?[0-9]{3,4}-?[0-9]{4}$/;
      if (!phoneRegex.test(newPhoneNumber.trim())) {
        alert('올바른 전화번호 형식이 아닙니다. (예: 010-1234-5678)');
        return;
      }
    }

    updateProfile({ name: newName.trim(), phoneNumber: newPhoneNumber.trim() });
  };

  const handleCancel = () => {
    setIsEditing(false);
    setNewName('');
    setNewPhoneNumber('');
  };

  const displayName = storedUser?.name || user.name;

  return (
    <section>
      <h2 className="text-xl font-semibold mb-4 text-gray-800">내 정보</h2>
      <div className="bg-white p-6 rounded-lg shadow-md flex items-center space-x-6">
        <FaUserCircle
          size={80}
          className="text-gray-300"
        />
        <div className="flex-1">
          {isEditing ? (
            <div className="space-y-3">
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="text-2xl font-bold text-gray-900 border-b-2 border-blue-500 focus:outline-none w-full"
                placeholder="닉네임을 입력하세요"
              />
              <input
                type="tel"
                value={newPhoneNumber}
                onChange={(e) => setNewPhoneNumber(e.target.value)}
                className="text-md text-gray-700 border-b-2 border-blue-500 focus:outline-none w-full"
                placeholder="전화번호를 입력하세요"
              />
              <div className="flex space-x-2">
                <button
                  onClick={handleSave}
                  className="p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
                >
                  <MdCheck size={20} />
                </button>
                <button
                  onClick={handleCancel}
                  className="p-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition"
                >
                  <MdClose size={20} />
                </button>
              </div>
            </div>
          ) : (
            <div>
              <div className="flex items-center space-x-3">
                <p className="text-2xl font-bold text-gray-900">
                  {displayName}
                </p>
                <button
                  onClick={handleEditClick}
                  className="text-blue-500 hover:text-blue-700 transition"
                >
                  <MdEdit size={20} />
                </button>
              </div>
              <p className="text-md text-gray-600 mt-1">{user.email}</p>
              {user.phoneNumber && (
                <p className="text-md text-gray-600 mt-1">{user.phoneNumber}</p>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default UserProfile;
