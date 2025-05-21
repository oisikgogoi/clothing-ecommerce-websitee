



const CardPlaceholder = () => {

    // Render skeleton loader when isLoading is true
    return (
      <div className="bg-white rounded-xl shadow-md overflow-hidden m-4 w-64 flex flex-col animate-pulse">
        {/* Skeleton for Product Image */}
        <div className="w-full h-64 bg-gray-200 rounded-t-xl"></div>

        {/* Skeleton for Card Content */}
        <div className="p-4 flex flex-col items-start flex-grow">
          {/* Skeleton for Product Title */}
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
          {/* Skeleton for Product Price */}
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
          {/* Skeleton for Add to Cart Button */}
          <div className="mt-auto h-10 bg-gray-200 rounded-md w-full"></div>
        </div>
      </div>
    );
  }

  export default CardPlaceholder