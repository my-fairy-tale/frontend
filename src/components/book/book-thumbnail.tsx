import Link from 'next/link';

const BookThumbnail = ({
  id,
  thumbnailUrl,
  title,
}: {
  id: string;
  thumbnailUrl: string;
  title: string;
}) => {
  return (
    <Link
      className="bg-white rounded-lg shadow-md overflow-hidden"
      href={`/books/${id}`}
    >
      <img
        src={thumbnailUrl || 'https://via.placeholder.com/150x200'}
        alt={title}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h3 className="font-bold text-gray-800 truncate">{title}</h3>
        {/* <p className="text-sm text-gray-600">{book.author}</p> */}
      </div>
    </Link>
  );
};

export default BookThumbnail;
