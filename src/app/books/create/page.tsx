import CreateBookForm from '@/components/book/create-book-form';

const CreateBookPage = () => {
  return (
    <div className="p-8 md:p-12 max-w-4xl mx-auto">
      <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-2">
        새 동화책 만들기 🎨
      </h1>
      <p className="text-gray-600 mb-8">
        상상 속 이야기를 마음껏 적어주세요. 각 문단이 동화책의 한 페이지가
        됩니다.
      </p>

      <CreateBookForm />
    </div>
  );
};

export default CreateBookPage;
