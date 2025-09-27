import React from "react";
import { Link } from "react-router-dom"; 

function ItemsPage(props) {
    return (
        <div>
            <Link to={`/product/${props._id}`}>
                <a className="flex relative h-48 justify-center rounded overflow-hidden">
                    <img
                        className="object-contain w-full h-full block"
                        src={props.image?.[0] || ''}
                        alt=""
                    />
                </a>
                <div className="mt-4">
                    <h3 className="text-gray-500 text-xs tracking-widest mb-1">
                        Type: {props.type}
                    </h3>
                    <h3 className="text-gray-900 tracking-widest mb-1 text-lg font-medium">
                        {props.name}
                    </h3>
                    <p className="mt-1">Rs {props.price}.00</p>

                    {props.stocks > 0 ? (
                        <p className="mt-1 text-white bg-green-500 w-fit px-2 rounded-lg">
                            In Stock
                        </p>
                    ) : (
                        <p className="mt-1 text-white bg-red-500 w-fit px-2 rounded-lg">
                            Out of Stock
                        </p>
                    )}
                </div>
            </Link>
        </div>
    );
}

export default ItemsPage;
