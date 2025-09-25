import { auth, signOut } from '@/auth';
import { logoutAction } from '@/lib/server-action';
import Link from 'next/link';

const HeaderLoginButton = async () => {
  const session = await auth();

  return (
    <div className="flex items-center ml-8">
      {session?.user ? (
        <form action={logoutAction}>
          <button
            type="submit"
            className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-red-600 hover:bg-red-700"
          >
            로그아웃
          </button>
        </form>
      ) : (
        <Link
          href="/auth/login"
          className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700"
        >
          로그인
        </Link>
      )}
    </div>
  );
};

export default HeaderLoginButton;
