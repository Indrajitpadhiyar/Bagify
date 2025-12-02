'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion'; // eslint-disable-line no-unused-vars

const Loading = () => {
    const [showTagline, setShowTagline] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setShowTagline(true), 4000);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="fixed inset-0 bg-white flex items-center justify-center overflow-hidden">
            {/* BACKGROUND: Soft Mesh + Breathing Gradient */}
            <div className="absolute inset-0">
                <motion.div
                    className="absolute inset-0 bg-gradient-to-br from-orange-50/50 via-white to-teal-50/50"
                    animate={{ backgroundPosition: ['0% 0%', '100% 100%'] }}
                    transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                    style={{ backgroundSize: "300% 300%" }}
                />
                <svg className="w-full h-full opacity-15">
                    <pattern id="dots" x="0" y="0" width="120" height="120" patternUnits="userSpaceOnUse">
                        <circle cx="60" cy="60" r="1.5" fill="#f97316" opacity="0.4" />
                        <circle cx="30" cy="90" r="1" fill="#0d9488" opacity="0.4" />
                    </pattern>
                    <rect width="100%" height="100%" fill="url(#dots)" />
                </svg>
            </div>

            {/* LOGO CONTAINER */}
            <motion.div
                initial={{ scale: 0.75, opacity: 0, rotateY: -10 }}
                animate={{ scale: 1, opacity: 1, rotateY: 0 }}
                transition={{ duration: 1.2, ease: "easeOut" }}
                className="relative z-10"
            >
                <svg width="360" height="300" viewBox="0 0 360 300" className="drop-shadow-2xl">
                    <defs>
                        {/* Logo Gradient */}
                        <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#0d9488">
                                <animate attributeName="offset" values="0;0.6;0" dur="4s" repeatCount="indefinite" />
                            </stop>
                            <stop offset="100%" stopColor="#f97316">
                                <animate attributeName="offset" values="1;0.4;1" dur="4s" repeatCount="indefinite" />
                            </stop>
                        </linearGradient>

                        {/* Shine Gradient */}
                        <linearGradient id="shine" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#ffffff" stopOpacity="0" />
                            <stop offset="40%" stopColor="#ffffff" stopOpacity="0.9" />
                            <stop offset="60%" stopColor="#ffffff" stopOpacity="0.9" />
                            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
                        </linearGradient>
                    </defs>

                    {/* BAG HANDLE */}
                    <motion.path
                        d="M100 90 Q180 25 260 90"
                        stroke="url(#logoGradient)"
                        strokeWidth="7"
                        fill="none"
                        strokeLinecap="round"
                        initial={{ pathLength: 0, pathOffset: 1 }}
                        animate={{ pathLength: 1, pathOffset: 0 }}
                        transition={{ duration: 1.4, ease: "easeInOut" }}
                    />

                    {/* BAG BODY */}
                    <motion.path
                        d="M88 100 H272 V175 H88 Z"
                        stroke="url(#logoGradient)"
                        strokeWidth="7"
                        fill="none"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 1.3, delay: 1.2 }}
                    />

                    {/* DOTS */}
                    <motion.circle
                        cx="112" cy="112" r="7"
                        fill="url(#logoGradient)"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 2.4, type: "spring", stiffness: 500 }}
                    />
                    <motion.circle
                        cx="248" cy="112" r="7"
                        fill="url(#logoGradient)"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 2.5, type: "spring", stiffness: 500 }}
                    />

                    {/* TEXT: Bagify – EK WORD MEIN */}
                    <motion.text
                        x="70"
                        y="210"
                        fontFamily="system-ui, -apple-system, sans-serif"
                        fontWeight="800"
                        fontSize="82"
                        fill="#1e293b"
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 2.7, duration: 0.8, type: "spring", stiffness: 300 }}
                    >
                        {/* B a g i */}
                        <tspan fill="#1e293b">B</tspan>
                        <tspan fill="#1e293b">a</tspan>
                        <tspan fill="#1e293b">g</tspan>
                        <tspan fill="#1e293b">i</tspan>
                        {/* F y – Orange */}
                        <tspan fill="#f97316" fontWeight="900">F</tspan>
                        <tspan fill="#f97316" fontWeight="900">y</tspan>

                        {/* SHINE ON FULL WORD */}
                        <animateTransform
                            attributeName="transform"
                            type="translate"
                            values="-100,0; 460,0; -100,0"
                            dur="2s"
                            begin="3.5s"
                            repeatCount="indefinite"
                        />
                        <rect
                            x="60" y="135" width="240" height="100"
                            fill="url(#shine)"
                            opacity="0.8"
                        />
                    </motion.text>
                </svg>

                {/* TAGLINE – Typing Effect */}
                {showTagline && (
                    <motion.p
                        className="text-center text-gray-600 text-lg mt-12 font-light tracking-widest"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1 }}
                    >
                        {'Loading products...'.split('').map((char, i) => (
                            <motion.span
                                key={i}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: i * 0.06 }}
                            >
                                {char}
                            </motion.span>
                        ))}
                    </motion.p>
                )}
            </motion.div>

            {/* FLOATING GLOW ORBS */}
            {[...Array(5)].map((_, i) => (
                <motion.div
                    key={i}
                    className="absolute w-3 h-3 rounded-full"
                    style={{
                        background: i % 2 === 0 ? "#f97316" : "#0d9488",
                        filter: "blur(3px)",
                        boxShadow: "0 0 15px currentColor"
                    }}
                    initial={{
                        x: (i - 2.5) * 180,
                        y: 450,
                        opacity: 0
                    }}
                    animate={{
                        y: -450,
                        opacity: [0, 0.7, 0],
                        scale: [0, 1.8, 0]
                    }}
                    transition={{
                        duration: 4,
                        delay: 2.8 + i * 0.4,
                        repeat: Infinity,
                        ease: "easeOut"
                    }}
                />
            ))}
        </div>
    );
};

export default Loading;