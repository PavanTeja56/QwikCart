import { useParams } from "react-router-dom";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import ItemsPage from "./ItemsPage"; 

function SearchResult() {
    const { query } = useParams();
    const [results, setResults] = useState([]);
    const [loading,setLoading]=useState(true);

    useEffect(() => {
        axios.post('http://localhost:8000/search', { query })
            .then(res => {
                console.log("Search Results:", res.data);
                setResults(res.data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                toast.error('Error fetching search results');
                setLoading(false);
            });
    }, [query]);

    if(loading){
    return <div className="cart-empty">
    <div className="loader">
      <div className="bar"></div>
      <div className="bar"></div>
      <div className="bar"></div>
      <div className="bar"></div>
      <div className="bar"></div>
    </div>
    </div>;
  }

    return (
        <div className="p-4">
            <h2 className="text-2xl font-semibold mb-4">
                Search Results for "<span className="text-blue-500">{query}</span>"
            </h2>

            {results.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {results.map(item => (
                        <div key={item._id} className="border p-2 rounded shadow">
                            <ItemsPage
                                name={item.name}
                                price={item.price}
                                type={item.type}
                                image={item.image}
                                stocks={item.stocks}
                            />
                        </div>
                    ))}
                </div>
            ) : (
                // <p>No results found.</p>
                <div className="not-found">
                    <h1 className="h1-msg">Oops! Soryyy......😞</h1>
                    <h4 className="h4-msg">We haven't found that item</h4>
                    <p className="p-msg">Try searching another products</p>
                </div>
            )}
        </div>
    );
}

export default SearchResult;
