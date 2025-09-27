import { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import ItemsPage from './ItemsPage';
import Cookie from 'js-cookie';
import { useNavigate } from "react-router-dom";

function AllitemsPage() {
  const [data, setData] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [selectedOption, setSelectedOption] = useState('All');
  const [pageNum, setPageNum] = useState(1);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchData = async (selectedOption, pageNum) => {
    try {
      const res = await axios.post('http://localhost:8000/pageChange', {
        selectedOption,
        pageNum
      });

      if (res.data === 'fail to reach') {
        toast.error('Something went wrong');
      } else {
        setData(res.data.allProducts);
        setTotalItems(res.data.totalItems);
      }
    } catch (e) {
      toast.error('Something went wrong in AllitemsPage');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(selectedOption, pageNum);
  }, [selectedOption, pageNum]);

  const handleTypeChange = (e) => {
    setSelectedOption(e.target.value);
    setPageNum(1);
  };

  const prev = () => {
    if (pageNum > 1) setPageNum(pageNum - 1);
  };

  const next = () => {
    if (pageNum < Math.ceil(totalItems / 12)) setPageNum(pageNum + 1);
  };

  const logOUt = () => {
    Cookie.remove('email');
    toast.success('Log Out successful');
    navigate('/');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] bg-gray-100">
        <div className="flex space-x-2 animate-pulse">
          <div className="w-3 h-12 bg-orange-400 rounded"></div>
          <div className="w-3 h-12 bg-orange-500 rounded"></div>
          <div className="w-3 h-12 bg-orange-600 rounded"></div>
          <div className="w-3 h-12 bg-orange-500 rounded"></div>
          <div className="w-3 h-12 bg-orange-400 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-orange-50 min-h-screen text-gray-800">
      {/* Category Selection */}
      <div className="flex flex-wrap items-center justify-between p-4 bg-white shadow-md mb-6">
        <div className="flex items-center gap-3">
          <h2 className="font-semibold text-lg text-orange-700">Select Category:</h2>
          <select
            value={selectedOption}
            onChange={handleTypeChange}
            className="border border-orange-300 text-gray-800 bg-white px-3 py-1 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400 transition"
          >
            <option>All</option>
            <option>pizza</option>
            <option>cool drink</option>
            <option>milk shakes</option>
            <option>veg/non-veg puffs</option>
            <option>veg/non-veg rolls</option>
            <option>shavarma</option>
            <option>veg/non veg fried rice</option>
            <option>non veg biryani</option>
            <option>veg biryani</option>
          </select>
        </div>

        <button
          onClick={logOUt}
          className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-md transition"
        >
          Log Out
        </button>
      </div>

      {/* Items Grid */}
      <section className="px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.isArray(data) &&
            data.map((item, index) => (
              <div
                key={index}
                className="bg-white shadow-md rounded-lg overflow-hidden transition-transform transform hover:scale-105"
              >
                <ItemsPage
                  _id={item._id}
                  name={item.name}
                  type={item.type}
                  price={item.price}
                  stocks={item.stocks}
                  image={item.image}
                  allRatings={item.allRatings}
                  allReviews={item.allReviews}
                />
              </div>
            ))}
        </div>

        <p className="mt-6 text-center text-sm text-gray-600">
          Total Items: <span className="font-semibold">{totalItems}</span>
        </p>
      </section>

      {/* Pagination */}
      <div className="flex justify-center items-center gap-4 mt-10 pb-10">
        <button
          disabled={pageNum <= 1}
          onClick={prev}
          className={`px-4 py-2 rounded-md text-white ${pageNum <= 1 ? 'bg-gray-400 cursor-not-allowed' : 'bg-orange-500 hover:bg-orange-600'}`}
        >
          Prev
        </button>

        <p className="text-sm text-orange-700 font-medium">
          Page: {pageNum}/{Math.ceil(totalItems / 12)}
        </p>

        <button
          disabled={pageNum >= Math.ceil(totalItems / 12)}
          onClick={next}
          className={`px-4 py-2 rounded-md text-white ${pageNum >= Math.ceil(totalItems / 12) ? 'bg-gray-400 cursor-not-allowed' : 'bg-orange-500 hover:bg-orange-600'}`}
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default AllitemsPage;
