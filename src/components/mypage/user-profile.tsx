'use client';

import { useSuspenseQuery } from '@tanstack/react-query';
import { FaUserCircle } from 'react-icons/fa';
import { userProfileOption } from './user-profile-option';

const UserProfile = () => {
  const { data: user } = useSuspenseQuery(userProfileOption);

  return (
    <section>
      <h2 className="text-xl font-semibold mb-4 text-gray-800">내 정보</h2>
      <div className="bg-white p-6 rounded-lg shadow-md flex items-center space-x-6">
        <FaUserCircle
          size={80}
          className="text-gray-300"
        />
        <div>
          <p className="text-2xl font-bold text-gray-900">{user.name}</p>
          <p className="text-md text-gray-600">{user.email}</p>
        </div>
      </div>
    </section>
  );
};

export default UserProfile;
