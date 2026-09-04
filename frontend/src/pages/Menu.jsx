import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import { useCart } from '../context/CartContext';
import FoodRow from '../components/FoodRow';
import Loading from '../components/Loading';
import { Store, ShoppingBag, ArrowLeft, ArrowRight, AlertTriangle, CheckCircle2 } from 'lucide-react';

const Menu = () => {
  const { id: canteenId } = useParams();
  const [canteen, setCanteen] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addedNotice, setAddedNotice] = useState(null);

  const {
    cartItems,
    canteen: currentCartCanteen,
    addToCart,
    totalItems,
    totalAmount,
    canteenConflict,
    resolveConflictAndAdd,
    closeConflictModal,
  } = useCart();

  useEffect(() => {
    const fetchMenuAndCanteen = async () => {
      try {
        const [canteenRes, menuRes] = await Promise.all([
          api.get(`/canteens/${canteenId}`),
          api.get(`/menu/${canteenId}`),
        ]);
        setCanteen(canteenRes.data);
        setMenuItems(menuRes.data);
      } catch (error) {
        console.error('Error fetching menu:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMenuAndCanteen();
  }, [canteenId]);

  const handleAddToCart = (item) => {
    if (!canteen) return;
    const res = addToCart(item, { _id: canteen._id, name: canteen.name });
    if (res.success) {
      setAddedNotice(`Added "${item.name}" to cart`);
      setTimeout(() => setAddedNotice(null), 2000);
    }
  };

  if (loading) return <Loading message="Loading canteen menu..." />;

  if (!canteen) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h2 className="text-xl font-bold text-gray-800">Canteen Not Found</h2>
        <Link to="/student/canteens" className="mt-4 inline-block text-orange-600 font-bold">
          ← Back to Canteens
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24">
      {/* Back Button */}
      <Link
        to="/student/canteens"
        className="inline-flex items-center text-sm font-semibold text-gray-500 hover:text-orange-600 mb-6 transition"
      >
        <ArrowLeft className="w-4 h-4 mr-1.5" />
        <span>Back to Canteens</span>
      </Link>

      {/* Canteen Header Card */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="w-14 h-14 bg-orange-100 text-orange-600 rounded-2xl flex items-center justify-center flex-shrink-0">
            <Store className="w-8 h-8" />
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-orange-600 bg-orange-50 px-2 py-0.5 rounded">
              Today's Menu
            </span>
            <h1 className="text-2xl font-black text-gray-900 mt-1">{canteen.name}</h1>
            <p className="text-xs text-gray-500 mt-0.5">
              Select your items and proceed to choose a pickup slot
            </p>
          </div>
        </div>

        {totalItems > 0 && currentCartCanteen?._id === canteen._id && (
          <Link
            to="/student/cart"
            className="inline-flex items-center space-x-2 bg-orange-600 hover:bg-orange-700 text-white font-bold py-2.5 px-5 rounded-xl text-sm shadow-sm transition"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>View Cart ({totalItems})</span>
          </Link>
        )}
      </div>

      {/* Toast Notification */}
      {addedNotice && (
        <div className="fixed bottom-20 left-1/2 transform -translate-x-1/2 z-50 bg-gray-900 text-white text-xs font-semibold px-4 py-2.5 rounded-full shadow-lg flex items-center space-x-2 animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-green-400" />
          <span>{addedNotice}</span>
        </div>
      )}

      {/* Menu Table / Food Rows */}
      <div className="space-y-3">
        {menuItems.length > 0 ? (
          menuItems.map((item) => {
            const inCart = cartItems.find((ci) => ci._id === item._id);
            return (
              <FoodRow
                key={item._id}
                item={item}
                onAddToCart={handleAddToCart}
                inCartQuantity={inCart ? inCart.quantity : 0}
              />
            );
          })
        ) : (
          <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center text-gray-500">
            <p className="text-base font-bold">No menu items published yet today.</p>
            <p className="text-xs text-gray-400 mt-1">
              Please check back shortly or browse other campus canteens.
            </p>
          </div>
        )}
      </div>

      {/* Floating Bottom Cart Bar */}
      {totalItems > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-xl z-30">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500">
                Ordering from: <span className="font-bold text-gray-800">{currentCartCanteen?.name}</span>
              </p>
              <p className="text-base font-black text-gray-900">
                {totalItems} item{totalItems > 1 ? 's' : ''} • <span className="text-orange-600">₹{totalAmount}</span>
              </p>
            </div>
            <Link
              to="/student/cart"
              className="flex items-center space-x-2 bg-orange-600 hover:bg-orange-700 text-white font-bold py-2.5 px-6 rounded-xl shadow-sm transition"
            >
              <span>Review Cart & Slot</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      )}

      {/* Single Canteen Conflict Modal */}
      {canteenConflict && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-gray-200 text-center">
            <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-gray-900">Single Canteen Order Rule</h3>
            <p className="text-sm text-gray-600 mt-2">
              Your cart currently has items from{' '}
              <span className="font-bold text-gray-800">{canteenConflict.currentCanteen}</span>.
            </p>
            <p className="text-xs text-gray-500 mt-2 bg-amber-50 p-3 rounded-xl border border-amber-200">
              You can only order from one canteen at a time. Do you want to clear your previous cart and start an order from{' '}
              <span className="font-bold text-orange-600">{canteenConflict.newCanteen}</span>?
            </p>

            <div className="mt-6 flex space-x-3">
              <button
                type="button"
                onClick={closeConflictModal}
                className="flex-1 py-2.5 border border-gray-300 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 transition"
              >
                Keep Current Cart
              </button>
              <button
                type="button"
                onClick={resolveConflictAndAdd}
                className="flex-1 py-2.5 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-sm font-bold shadow-sm transition"
              >
                Clear & Switch
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Menu;
