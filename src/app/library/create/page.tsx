import CreatePostForm from '@/components/library/create-post-form';

const CreatePostPage = () => {
  return (
    <main className="max-w-3xl w-full mx-auto p-6 md:p-8 my-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">책 게시하기</h1>
        <p className="text-gray-600">
          내가 만든 동화책을 다른 사람들과 공유해보세요
        </p>
      </div>

      <CreatePostForm />
    </main>
  );
};

export default CreatePostPage;
