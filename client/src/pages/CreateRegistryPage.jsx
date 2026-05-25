import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../lib/supabaseClient';
import toast from 'react-hot-toast';
import Footer from '../components/Footer';

export default function CreateRegistryPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    occasion: '',
    goal_amount: '',
    investment_type: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      toast.error('Please login first');
      navigate('/login');
      return;
    }

    setLoading(true);

    try {
      // Insert into database
      const { data, error } = await supabase
        .from('registries')
        .insert([
          {
            user_id: user.id,
            title: formData.title,
            description: formData.description,
            occasion: formData.occasion,
            goal_amount: parseFloat(formData.goal_amount),
            investment_type: formData.investment_type,
            is_public: true,
            status: 'active'
          }
        ])
        .select();

      if (error) throw error;

      toast.success('Registry created successfully!');
      navigate(`/registry/${data[0].id}`);
    } catch (error) {
      toast.error(error.message);
      console.error('Error creating registry:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="bg-gradient-to-r from-emerald-600 to-blue-600 text-white py-12">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-2">Create Your Registry</h1>
          <p className="text-lg opacity-90">Start your investment journey</p>
        </div>
      </div>

      <section className="py-20 bg-gray-50">
        <div className="max-w-2xl mx-auto px-4">
          <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-8">
            {/* Title */}
            <div className="mb-6">
              <label className="block text-gray-900 font-semibold mb-2">Registry Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g., Our Dream Wedding"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-600 outline-none"
                required
              />
            </div>

            {/* Description */}
            <div className="mb-6">
              <label className="block text-gray-900 font-semibold mb-2">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Tell your story..."
                rows="4"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-600 outline-none"
              ></textarea>
            </div>

            {/* Occasion */}
            <div className="mb-6">
              <label className="block text-gray-900 font-semibold mb-2">Occasion</label>
              <select
                name="occasion"
                value={formData.occasion}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-600 outline-none"
                required
              >
                <option value="">Select occasion</option>
                <option value="wedding">Wedding</option>
                <option value="graduation">Graduation</option>
                <option value="baby">Baby Arrival</option>
                <option value="business">Business Launch</option>
                <option value="birthday">Birthday</option>
              </select>
            </div>

            {/* Goal Amount */}
            <div className="mb-6">
              <label className="block text-gray-900 font-semibold mb-2">Goal Amount (₦)</label>
              <input
                type="number"
                name="goal_amount"
                value={formData.goal_amount}
                onChange={handleChange}
                placeholder="e.g., 500000"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-600 outline-none"
                required
              />
            </div>

            {/* Investment Type */}
            <div className="mb-8">
              <label className="block text-gray-900 font-semibold mb-2">Investment Type</label>
              <select
                name="investment_type"
                value={formData.investment_type}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-600 outline-none"
                required
              >
                <option value="">Select investment type</option>
                <option value="stocks">Stocks & ETFs</option>
                <option value="savings">High-Yield Savings</option>
                <option value="crypto">Cryptocurrency</option>
                <option value="business">Business Capital</option>
              </select>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-600 text-white font-bold py-3 rounded-lg hover:bg-emerald-700 disabled:opacity-50 transition"
            >
              {loading ? 'Creating...' : 'Create Registry'}
            </button>
          </form>
        </div>
      </section>

      <Footer />
    </div>
  );
}