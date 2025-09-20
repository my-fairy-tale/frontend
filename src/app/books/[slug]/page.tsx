import BookFetching from '@/components/book/book-fetching';

// 서버 컴포넌트: 데이터 페칭 담당
export default async function BookViewerPage(props: {
  params: { slug: string };
}) {
  const { slug } = await props.params;

  return <BookFetching slug={slug} />;
}
