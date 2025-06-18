import React, { useState } from 'react';

const StarRating = ({ 
  maxStars = 5, 
  initialRating = 0, 
  onRatingChange = () => {}, 
  size = 24,
  readonly = false,
  showValue = true,
  className = ""
}) => {
  const [rating, setRating] = useState(initialRating);
  const [hoverRating, setHoverRating] = useState(0);

  const handleStarClick = (starIndex) => {
    if (readonly) return;
    
    const newRating = starIndex + 1;
    setRating(newRating);
    onRatingChange(newRating);
  };

  const handleStarHover = (starIndex) => {
    if (readonly) return;
    setHoverRating(starIndex + 1);
  };

  const handleMouseLeave = () => {
    if (readonly) return;
    setHoverRating(0);
  };

  const getStarFill = (starIndex) => {
    const currentRating = hoverRating || rating;
    return starIndex < currentRating;
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div 
        className="flex items-center gap-1"
        onMouseLeave={handleMouseLeave}
      >
        {[...Array(maxStars)].map((_, index) => (
          <button
            key={index}
            type="button"
            className={`transition-all duration-150 ${
              readonly 
                ? 'cursor-default' 
                : 'cursor-pointer hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-opacity-50 rounded'
            }`}
            onClick={() => handleStarClick(index)}
            onMouseEnter={() => handleStarHover(index)}
            disabled={readonly}
            aria-label={`Rate ${index + 1} out of ${maxStars} stars`}
          >
            <svg
              width={size}
              height={size}
              viewBox="0 0 24 24"
              className={`transition-colors duration-150 ${
                getStarFill(index)
                  ? 'fill-yellow-400 text-yellow-400'
                  : 'fill-none text-gray-300 hover:text-yellow-300'
              }`}
            >
              <path
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
              />
            </svg>
          </button>
        ))}
      </div>
      
      {showValue && (
        <span className="text-sm text-gray-600 ml-2">
          {rating} / {maxStars}
        </span>
      )}
    </div>
  );
};

// Demo component to showcase the star rating system
const StarRatingDemo = () => {
  const [productRating, setProductRating] = useState(3);
  const [serviceRating, setServiceRating] = useState(0);
  const [overallRating, setOverallRating] = useState(4);

  return (
    <div className="max-w-2xl mx-auto p-8 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
          Star Rating System
        </h1>
        
        <div className="space-y-8">
          {/* Interactive Rating */}
          <div className="border-b pb-6">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">
              Interactive Rating
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-gray-600 font-medium">Product Quality:</label>
                <StarRating
                  rating={productRating}
                  onRatingChange={setProductRating}
                  maxStars={5}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <label className="text-gray-600 font-medium">Customer Service:</label>
                <StarRating
                  rating={serviceRating}
                  onRatingChange={setServiceRating}
                  maxStars={5}
                />
              </div>
            </div>
          </div>

          {/* Different Sizes */}
          <div className="border-b pb-6">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">
              Different Sizes
            </h2>
            <div className="space-y-3">
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-600 w-16">Small:</span>
                <StarRating size={16} initialRating={3} />
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-600 w-16">Medium:</span>
                <StarRating size={24} initialRating={4} />
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-600 w-16">Large:</span>
                <StarRating size={32} initialRating={5} />
              </div>
            </div>
          </div>

          {/* Readonly Rating */}
          <div className="border-b pb-6">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">
              Read-only Display
            </h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Average Customer Rating:</span>
                <StarRating 
                  initialRating={4} 
                  readonly={true}
                  showValue={true}
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Expert Review:</span>
                <StarRating 
                  initialRating={5} 
                  readonly={true}
                  showValue={false}
                />
              </div>
            </div>
          </div>

          {/* Custom Max Stars */}
          <div className="border-b pb-6">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">
              Custom Scale (10 Stars)
            </h2>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Overall Experience:</span>
              <StarRating
                maxStars={10}
                rating={overallRating}
                onRatingChange={setOverallRating}
                size={20}
              />
            </div>
          </div>

          {/* Rating Summary */}
          <div className="bg-blue-50 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">
              Current Ratings Summary
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div className="bg-white rounded-lg p-4">
                <div className="text-2xl font-bold text-blue-600">{productRating}</div>
                <div className="text-sm text-gray-600">Product Quality</div>
              </div>
              <div className="bg-white rounded-lg p-4">
                <div className="text-2xl font-bold text-green-600">{serviceRating}</div>
                <div className="text-sm text-gray-600">Customer Service</div>
              </div>
              <div className="bg-white rounded-lg p-4">
                <div className="text-2xl font-bold text-purple-600">{overallRating}/10</div>
                <div className="text-sm text-gray-600">Overall Experience</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StarRatingDemo;