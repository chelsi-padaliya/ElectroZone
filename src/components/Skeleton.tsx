export const ProductCardSkeleton = () => (
  <div className="animate-pulse">
    <div className="bg-gray-200 rounded-lg h-48 mb-3" />
    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
    <div className="h-3 bg-gray-200 rounded w-1/2" />
  </div>
);

export const ProductDetailSkeleton = () => (
  <div className="animate-pulse grid grid-cols-1 md:grid-cols-2 gap-16">
    <div>
      <div className="bg-gray-200 rounded-lg h-96 mb-4" />
      <div className="grid grid-cols-4 gap-4">
        {[1,2,3,4].map(i => <div key={i} className="bg-gray-200 rounded-lg h-20" />)}
      </div>
    </div>
    <div>
      <div className="h-8 bg-gray-200 rounded w-3/4 mb-4" />
      <div className="h-4 bg-gray-200 rounded w-1/2 mb-6" />
      <div className="h-20 bg-gray-200 rounded mb-6" />
      <div className="h-10 bg-gray-200 rounded w-1/3" />
    </div>
  </div>
);
