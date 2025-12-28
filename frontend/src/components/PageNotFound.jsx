import React from 'react';

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

                <a
                    href="/"
                    className="inline-block px-10 py-5 bg-white text-orange-600 font-bold text-xl rounded-lg hover:bg-orange-100 transition duration-300 shadow-lg"
                >
                    Go Back Home
                </a>
            </div>

            {/* Tailwind + Custom CSS for Glitch Animation */}
            <style jsx>{`
        .glitch {
          position: relative;
          color: white;
          text-shadow: 
            0.05em 0 0 #ff5722,
            -0.03em -0.04em 0 #fff,
            0.025em 0.05em 0 #ff9800;
          animation: glitch-skew 3s infinite linear alternate-reverse;
        }

        .glitch::before,
        .glitch::after {
          content: attr(data-text);
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          color: white;
          opacity: 0.8;
        }

        .glitch::before {
          animation: glitch-anim1 2.5s infinite linear alternate-reverse;
          clip-path: polygon(0 0, 100% 0, 100% 45%, 0 45%);
          transform: translate(-0.02em, -0.01em);
        }

        .glitch::after {
          animation: glitch-anim2 3s infinite linear alternate-reverse;
          clip-path: polygon(0 60%, 100% 60%, 100% 100%, 0 100%);
          transform: translate(0.02em, 0.01em);
        }

        @keyframes glitch-skew {
          0% {
            text-shadow: 
              0.05em 0 0 #ff5722,
              -0.05em -0.025em 0 #fff,
              -0.025em 0.05em 0 #ff9800;
          }
          15% {
            text-shadow: 
              -0.05em -0.025em 0 #ff5722,
              0.025em 0.025em 0 #fff,
              -0.05em -0.05em 0 #ff9800;
          }
          50% {
            text-shadow: 
              0.025em 0.05em 0 #ff5722,
              0.05em 0 0 #fff,
              0 -0.05em 0 #ff9800;
          }
          100% {
            text-shadow: 
              -0.025em 0 0 #ff5722,
              -0.025em -0.025em 0 #fff,
              -0.025em -0.05em 0 #ff9800;
          }
        }

        @keyframes glitch-anim1 {
          0%, 15%, 100% { transform: translate(0); }
          30% { transform: translate(-5px, 5px); }
          60% { transform: translate(5px, -5px); }
        }

        @keyframes glitch-anim2 {
          0%, 70%, 100% { transform: translate(0); }
          20% { transform: translate(-8px, 8px); }
          80% { transform: translate(8px, -8px); }
        }

        @media (max-width: 768px) {
          .glitch {
            font-size: 5rem !important;
          }
        }
      `}</style>
        </div>
    );
};

export default PageNotFound;