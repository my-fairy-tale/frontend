import LoginForm from '@/components/auth/login-form';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';

export default async function LoginPage() {
  const session = await auth();
  if (session) {
    redirect('/'); // 이미 로그인 상태이면 홈으로
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <LoginForm />
    </div>
  );
}
