import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { Plus, Trash2, Save, Bookmark, RefreshCw, Eye, EyeOff, AlertCircle, CheckCircle2, ArrowLeft } from 'lucide-react';
import Loading from '../components/Loading';

const StaffMenu = () => {
  const { user } = useAuth();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Fetch active menu
  const fetchMenu = async () => {
    if (!user?.canteenId) return;
    setLoading(true);
    try {
      const response = await api.get(`/menu/${user.canteenId}`);
      if (response.data.length > 0) {
        setRows(
          response.data.map((item) => ({
            name: item.name,
            price: item.price,
            isAvailable: item.isAvailable,
          }))
        );
      } 
    } catch (err) {
      console.error('Error fetching menu:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMenu();
  }, [user?.canteenId]);

  // Handle row changes
  const handleRowChange = (index, field, value) => {
    setRows((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  // Add new row
  const handleAddRow = () => {
    setRows((prev) => [...prev, { name: '', price: '', isAvailable: true }]);
  };

  // Delete row
  const handleDeleteRow = (index) => {
    if (rows.length === 1) {
      setRows([{ name: '', price: '', isAvailable: true }]);
    } else {
      setRows((prev) => prev.filter((_, i) => i !== index));
    }
  };

  // Save Today's Active Menu
  const handleSaveMenu = async () => {
    setMessage({ type: '', text: '' });
    setSaving(true);

    try {
      const response = await api.post('/menu/bulk', { items: rows });
      setMessage({ type: 'success', text: response.data.message });
      await fetchMenu();
    } catch (err) {
      setMessage({
        type: 'error',
        text: err.response?.data?.message || 'Failed to save menu items',
      });
    } finally {
      setSaving(false);
    }
  };

  // Save as Default Template
  const handleSaveAsDefault = async () => {
    setMessage({ type: '', text: '' });
    setSaving(true);
    try {
      const response = await api.post('/menu/default');
      setMessage({ type: 'success', text: response.data.message });
    } catch (err) {
      setMessage({
        type: 'error',
        text: err.response?.data?.message || 'Failed to save default template',
      });
    } finally {
      setSaving(false);
    }
  };

  // Use Default Template for Today
  const handleUseDefault = async () => {
    setMessage({ type: '', text: '' });
    setSaving(true);
    try {
      const response = await api.post('/menu/use-default');
      setMessage({ type: 'success', text: response.data.message });
      await fetchMenu();
    } catch (err) {
      setMessage({
        type: 'error',
        text: err.response?.data?.message || 'Failed to apply default menu',
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loading message="Loading menu manager..." />;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <Link
            to="/staff/dashboard"
            className="inline-flex items-center text-xs font-semibold text-gray-500 hover:text-orange-600 mb-2 transition"
          >
            <ArrowLeft className="w-3.5 h-3.5 mr-1" />
            <span>Back to Dashboard</span>
          </Link>
          <h1 className="text-2xl font-black text-gray-900">
            Bulk Menu Management
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Canteen: <span className="font-bold text-orange-600">{user?.canteenName}</span>
          </p>
        </div>

        {/* Action buttons for Default Template */}
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={handleUseDefault}
            disabled={saving}
            title="Load default daily template"
            className="bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold py-2 px-3 rounded-xl border border-gray-300 transition flex items-center space-x-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5 text-gray-600" />
            <span>Use Default Menu</span>
          </button>

          <button
            type="button"
            onClick={handleSaveAsDefault}
            disabled={saving}
            title="Save current menu as daily default"
            className="bg-amber-50 hover:bg-amber-100 text-amber-800 text-xs font-bold py-2 px-3 rounded-xl border border-amber-200 transition flex items-center space-x-1.5"
          >
            <Bookmark className="w-3.5 h-3.5 text-amber-600" />
            <span>Save as Default</span>
          </button>
        </div>
      </div>

      {/* Alerts */}
      {message.text && (
        <div
          className={`mb-6 p-4 rounded-2xl border flex items-center space-x-2 text-sm ${
            message.type === 'success'
              ? 'bg-green-50 border-green-200 text-green-800'
              : 'bg-red-50 border-red-200 text-red-800'
          }`}
        >
          {message.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
          )}
          <span>{message.text}</span>
        </div>
      )}

      {/* Main Bulk Table Card */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden mb-6">
        <div className="p-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
          <span className="text-xs font-bold uppercase tracking-wider text-gray-600">
            {previewMode ? 'Student Menu Preview' : "Today's Active Menu Table"}
          </span>

          <button
            type="button"
            onClick={() => setPreviewMode(!previewMode)}
            className="text-xs font-semibold text-gray-600 hover:text-orange-600 flex items-center space-x-1"
          >
            {previewMode ? (
              <>
                <EyeOff className="w-3.5 h-3.5" />
                <span>Edit Mode</span>
              </>
            ) : (
              <>
                <Eye className="w-3.5 h-3.5" />
                <span>Preview Menu</span>
              </>
            )}
          </button>
        </div>

        {previewMode ? (
          /* Preview Mode */
          <div className="p-6 divide-y divide-gray-100">
            {rows
              .filter((r) => r.name.trim() !== '')
              .map((r, i) => (
                <div key={i} className="py-3 flex justify-between items-center">
                  <div className="flex items-center space-x-3">
                    <span className="font-semibold text-gray-800">{r.name}</span>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full ${
                        r.isAvailable
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {r.isAvailable ? 'Available' : 'Unavailable'}
                    </span>
                  </div>
                  <span className="font-bold text-orange-600 text-base">₹{r.price}</span>
                </div>
              ))}
          </div>
        ) : (
          /* Edit Table */
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-semibold border-b border-gray-200">
                <tr>
                  <th className="py-3 px-4 w-12 text-center">#</th>
                  <th className="py-3 px-4">Food Name</th>
                  <th className="py-3 px-4 w-36">Price (₹)</th>
                  <th className="py-3 px-4 w-36 text-center">Available</th>
                  <th className="py-3 px-4 w-16 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {rows.map((row, index) => (
                  <tr key={index} className="hover:bg-gray-50/50 transition">
                    <td className="py-3 px-4 text-center text-xs text-gray-400 font-mono">
                      {index + 1}
                    </td>

                    {/* Food Name */}
                    <td className="py-3 px-4">
                      <input
                        type="text"
                        value={row.name}
                        onChange={(e) => handleRowChange(index, 'name', e.target.value)}
                        placeholder="e.g. Samosa, Burger"
                        className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                      />
                    </td>

                    {/* Price */}
                    <td className="py-3 px-4">
                      <div className="relative">
                        <span className="absolute left-3 top-2 text-gray-400 font-semibold">
                          ₹
                        </span>
                        <input
                          type="number"
                          min="1"
                          value={row.price}
                          onChange={(e) => handleRowChange(index, 'price', e.target.value)}
                          placeholder="0"
                          className="w-full pl-7 pr-3 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                        />
                      </div>
                    </td>

                    {/* Available Toggle */}
                    <td className="py-3 px-4 text-center">
                      <label className="inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={row.isAvailable}
                          onChange={(e) =>
                            handleRowChange(index, 'isAvailable', e.target.checked)
                          }
                          className="sr-only peer"
                        />
                        <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                        <span className="ms-2 text-xs font-semibold text-gray-700">
                          {row.isAvailable ? 'Yes' : 'No'}
                        </span>
                      </label>
                    </td>

                    {/* Delete row */}
                    <td className="py-3 px-4 text-center">
                      <button
                        type="button"
                        onClick={() => handleDeleteRow(index)}
                        title="Delete Row"
                        className="p-1.5 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Bottom Action Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <button
          type="button"
          onClick={handleAddRow}
          className="w-full sm:w-auto bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold py-2.5 px-4 rounded-xl text-sm transition flex items-center justify-center space-x-1.5 border border-gray-300"
        >
          <Plus className="w-4 h-4" />
          <span>+ Add Row</span>
        </button>

        <div className="flex space-x-3 w-full sm:w-auto">
          <button
            type="button"
            onClick={handleSaveMenu}
            disabled={saving}
            className="w-full sm:w-auto bg-orange-600 hover:bg-orange-700 active:scale-98 text-white font-bold py-2.5 px-6 rounded-xl text-sm shadow-sm transition flex items-center justify-center space-x-2"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving...' : 'Save Menu'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default StaffMenu;
