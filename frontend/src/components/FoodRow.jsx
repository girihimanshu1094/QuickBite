import React from 'react';
import { Plus, Check, XCircle } from 'lucide-react';

const FoodRow = ({ item, onAddToCart, inCartQuantity = 0 }) => {
  return (
    <div className="flex items-center justify-between p-4 bg-white border border-gray-100 rounded-xl hover:border-orange-200 hover:shadow-sm transition">
      {/* Food Info */}
      <div className="flex-1">
        <div className="flex items-center space-x-3">
          <h3 className="text-base font-semibold text-gray-800">{item.name}</h3>
          {item.isAvailable ? (
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-200">
              <span className="w-1.5 h-1.5 mr-1.5 bg-green-500 rounded-full"></span>
              Available
            </span>
          ) : (
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-50 text-red-600 border border-red-200">
              <XCircle className="w-3 h-3 mr-1" />
              Unavailable
            </span>
          )}
        </div>
        <div className="mt-1">
          <span className="text-lg font-bold text-orange-600">₹{item.price}</span>
        </div>
      </div>

      {/* Action Button */}
      <div>
        {item.isAvailable ? (
          <button
            onClick={() => onAddToCart(item)}
            className="flex items-center space-x-1 bg-orange-600 hover:bg-orange-700 active:scale-95 text-white text-sm font-medium px-4 py-2 rounded-lg shadow-sm transition"
          >
            <Plus className="w-4 h-4" />
            <span>{inCartQuantity > 0 ? `Add (${inCartQuantity})` : 'Add to Cart'}</span>
          </button>
        ) : (
          <button
            disabled
            className="bg-gray-100 text-gray-400 text-sm font-medium px-4 py-2 rounded-lg cursor-not-allowed"
          >
            Out of Stock
          </button>
        )}
      </div>
    </div>
  );
};

export default FoodRow;
