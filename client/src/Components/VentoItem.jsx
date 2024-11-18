import React from 'react';
import { Link } from 'react-router-dom';

const VentoItem = ({to,title}) => {
    return (
        <Link to={to} className="flex items-center justify-center w-40 h-40 mb-8 transition-transform duration-300 ease-in-out bg-white rounded-xl hover:scale-105 active:scale-95">
            <div
                className="flex flex-col items-center text-center "
            >
                <p className="px-4 mt-2 text-2xl text-gray-600">{title}</p>
            </div>
        </Link>
    );
};

export default VentoItem;
