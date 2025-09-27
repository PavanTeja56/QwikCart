import { useState } from "react";
import { toast } from 'react-toastify';
import Cookie from 'js-cookie';
import { useNavigate } from "react-router-dom";

function AdminPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    type: '',
    price: null,
    stocks: null,
    description: ''
  });

  const [image, setImage] = useState('');
  const [allImages, setAllImages] = useState([]);

  const imageChange = (e) => setImage(e.target.value);

  const imageSubmit = () => {
    if (image === '') {
      toast.error('Image URL cannot be empty');
    } else if (allImages.length >= 6) {
      toast.error('Max 6 images allowed');
    } else {
      setAllImages([image, ...allImages]);
      setImage('');
    }
  };

  const logOut = () => {
    Cookie.remove('email');
    navigate('/');
  };

  const handleChange = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8000/adminUpdate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, image: allImages })
      });

      const data = await response.json();
      if (data === 'pass') {
        toast.success('Product uploaded');
        setForm({ name: '', type: '', price: '', stocks: '', description: '' });
        setAllImages([]);
      } else {
        toast.error('Upload failed');
      }
    } catch (err) {
      console.error('error:', err);
      toast.error('Something went wrong');
    }
  };

  return (
    <div className="min-h-screen bg-orange-50 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-3xl bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-orange-700 mb-6 text-center">Admin Dashboard</h2>

        <form onSubmit={handleChange} className="space-y-4">
          <input
            type="text"
            placeholder="Item Name"
            name="name"
            value={form.name}
            onChange={(e) => setForm({ ...form, [e.target.name]: e.target.value })}
            required
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400"
          />

          <select
            name="type"
            value={form.type}
            onChange={(e) => setForm({ ...form, [e.target.name]: e.target.value })}
            required
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400"
          >
            <option value="" disabled>Select type</option>
            <option value="veg biryani">Veg Biryani</option>
            <option value="pizza">Pizza</option>
            <option value="cool drink">Cool Drink</option>
            <option value="milk shakes">Milk Shakes</option>
            <option value="veg/non-veg puffs">Veg/Non-Veg Puffs</option>
            <option value="veg/non-veg rolls">Veg/Non-Veg Rolls</option>
            <option value="shavarma">Shavarma</option>
            <option value="veg/non veg fried rice">veg/non veg fried rice</option>
            <option value="non veg biryani">Non Veg Biryani</option>
          </select>

          <input
            type="number"
            placeholder="Price"
            name="price"
            value={form.price}
            onChange={(e) => setForm({ ...form, [e.target.name]: e.target.value })}
            required
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400"
          />

          <input
            type="number"
            placeholder="Stocks"
            name="stocks"
            value={form.stocks}
            onChange={(e) => setForm({ ...form, [e.target.name]: e.target.value })}
            required
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400"
          />

          <input
            type="text"
            placeholder="Canteen Name"
            name="description"
            value={form.description}
            onChange={(e) => setForm({ ...form, [e.target.name]: e.target.value })}
            required
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400"
          />

          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Image URL"
              value={image}
              onChange={imageChange}
              className="flex-grow px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
            <button
              type="button"
              onClick={imageSubmit}
              className="bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-700 transition"
            >
              Add Image
            </button>
          </div>

          {/* Preview Images */}
          {allImages.length > 0 && (
            <div className="grid grid-cols-3 gap-4 mt-4">
              {allImages.map((img, index) => (
                <div key={index} className="border p-2 rounded shadow-sm">
                  <img
                    src={img}
                    alt={`preview-${index}`}
                    className="w-full h-32 object-cover rounded"
                  />
                </div>
              ))}
            </div>
          )}

          <div className="flex gap-4 justify-center mt-6">
            <button
              type="submit"
              className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition"
            >
              Submit
            </button>
            <button
              type="button"
              onClick={logOut}
              className="bg-red-600 text-white px-6 py-2 rounded-md hover:bg-red-700 transition"
            >
              Logout
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AdminPage;
