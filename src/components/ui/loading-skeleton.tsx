const LoadingSkeleton = () => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
      {[...Array(10)].map((_, i) => (
        <div
          key={i}
          className="animate-pulse"
        >
          <div className="bg-gray-300 aspect-[3/4] rounded-lg mb-3"></div>
          <div className="bg-gray-300 h-4 rounded mb-2"></div>
          <div className="bg-gray-300 h-3 rounded w-2/3"></div>
        </div>
      ))}
    </div>
  );
};

export default LoadingSkeleton;
