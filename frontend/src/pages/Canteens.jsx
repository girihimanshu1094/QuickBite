import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { Utensils, Store, ArrowRight, Search } from 'lucide-react';
import Loading from '../components/Loading';

const Canteens = () => {
  const [canteens, setCanteens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchCanteens = async () => {
      try {
        const response = await api.get('/canteens');
        setCanteens(response.data);
      } catch (error) {
        console.error('Error fetching canteens:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCanteens();
  }, []);

  const filteredCanteens = canteens.filter((c) =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <Loading message="Loading college canteens..." />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900">
            College Canteens
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Choose a canteen to view today's menu and pre-order food
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative max-w-xs w-full">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search canteens..."
            className="w-full pl-9 pr-4 py-2 bg-white border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 transition"
          />
        </div>
      </div>

      {/* Canteen Cards Grid */}
      {filteredCanteens.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filteredCanteens.map((canteen) => (
            <div
              key={canteen._id}
              className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:border-orange-500 hover:shadow-md transition card-hover flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-2xl flex items-center justify-center mb-4">
                  <Store className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">{canteen.name}</h3>
                <p className="text-xs text-green-600 font-medium mt-1">
                  ● Taking orders now
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-gray-100">
                <Link
                  to={`/student/canteens/${canteen._id}/menu`}
                  className="w-full bg-orange-50 hover:bg-orange-600 text-orange-700 hover:text-white font-bold py-2.5 px-4 rounded-xl text-sm transition flex items-center justify-center space-x-2"
                >
                  <span>View Menu</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
          <Store className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-gray-700">No Canteens Found</h3>
          <p className="text-xs text-gray-500 mt-1">
            Try a different search keyword or check back later.
          </p>
        </div>
      )}
    </div>
  );
};

export default Canteens;
