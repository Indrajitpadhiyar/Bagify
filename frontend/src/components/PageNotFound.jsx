import React from 'react';
import { Link } from 'react-router-dom';

const PageNotFound = () => {
    return (
        <div className="min-h-screen bg-orange-600 flex items-center justify-center text-white overflow-hidden">
            <div className="text-center px-6">
                {/* 404 with glitch effect */}
                <h1
                    className="text-9xl md:text-[12rem] font-black tracking-widest mb-4 glitch"
                    data-text="404"
                >
                    404
                </h1>

                {/* Page Not Found with glitch effect */}
                <h2
                    className="text-4xl md:text-6xl font-bold mb-8 glitch"
                    data-text="Page Not Found"
                >
                    Page Not Found
                </h2>

                <p className="text-lg md:text-2xl max-w-2xl mx-auto mb-10 opacity-90">
                    Sorry, the page you're looking for doesn't exist. It might have been moved or deleted.
                </p>

                <Link
                   to={"/"}
                    className="inline-block px-10 py-5 bg-white text-orange-600 font-bold text-xl rounded-lg hover:bg-orange-100 transition duration-300 shadow-lg"
                >
                    Go Back Home
                </Link>
            </div>
        </div>
    );
};

export default PageNotFound;