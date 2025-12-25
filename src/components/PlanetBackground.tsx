"use client";

import React, { useEffect, useState } from 'react';

interface PlanetBackgroundProps {
    isTyping?: boolean;
}

const PlanetBackground: React.FC<PlanetBackgroundProps> = ({ isTyping = false }) => {
    const [stars, setStars] = useState<{ id: number; left: string; top: string; animDelay: string; type: 'tiny' | 'glow' | 'sparkle' }[]>([]);
    const [zodiacs, setZodiacs] = useState<{ id: number; symbol: string; left: string; top: string; animDelay: string; fontSize: string }[]>([]);

    useEffect(() => {
        // Generate varied stars and sparkles
        const starCount = 150; // Increased density
        const newStars = Array.from({ length: starCount }).map((_, i) => {
            const rand = Math.random();
            let type: 'tiny' | 'glow' | 'sparkle' = 'tiny';
            if (rand > 0.95) type = 'sparkle'; // 5% sparkles
            else if (rand > 0.8) type = 'glow'; // 15% glow

            return {
                id: i,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animDelay: `${Math.random() * 5}s`,
                type
            };
        });
        setStars(newStars);

        // Zodiac symbols with varied sizes
        const symbols = ['♈', '♉', '♊', '♋', '♌', '♍', '♎', '♏', '♐', '♑', '♒', '♓'];
        const newZodiacs = symbols.map((symbol, i) => ({
            id: i,
            symbol,
            left: `${Math.random() * 90 + 5}%`,
            top: `${Math.random() * 90 + 5}%`,
            animDelay: `${Math.random() * 10 + 5}s`,
            fontSize: `${Math.random() * 3 + 3}rem`
        }));
        setZodiacs(newZodiacs);

        // Parallax Effect
        const handleMouseMove = (e: MouseEvent) => {
            const x = (e.clientX / window.innerWidth) - 0.5;
            const y = (e.clientY / window.innerHeight) - 0.5;

            document.documentElement.style.setProperty('--mouse-x', `${x * 20}px`);
            document.documentElement.style.setProperty('--mouse-y', `${y * 20}px`);
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    return (
        <div className="planet-background">
            {/* Layer 0: Nebula (CSS) */}

            {/* Layer 1: Zodiacs (Deep Background) */}
            {zodiacs.map(z => (
                <div
                    key={z.id}
                    className="zodiac-symbol"
                    style={{
                        left: z.left,
                        top: z.top,
                        fontSize: z.fontSize,
                        animationDelay: z.animDelay,
                        opacity: isTyping ? 0.35 : 0.05,
                        transform: isTyping ? 'scale(1.1) rotate(5deg)' : 'scale(1) rotate(0deg)',
                        transition: 'opacity 0.6s ease, transform 4s ease'
                    }}
                >
                    {z.symbol}
                </div>
            ))}

            {/* Layer 2: Stars */}
            {stars.map(s => (
                <div
                    key={s.id}
                    className={`star-particle star-${s.type}`}
                    style={{
                        left: s.left,
                        top: s.top,
                        animationDelay: s.animDelay
                    }}
                />
            ))}

            {/* Layer 3: Planets with Depth & Parallax */}

            {/* SATURN - Far (Top Center) */}
            <div className="planet-container saturn-container parallax-layer-1 planet-far">
                <img
                    src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c7/Saturn_during_Equinox.jpg/800px-Saturn_during_Equinox.jpg"
                    alt="Saturn"
                    className="planet saturn"
                />
            </div>

            {/* JUPITER - Mid (Bottom Left) */}
            <div className="planet-container jupiter-container parallax-layer-2 planet-mid">
                <img
                    src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2b/Jupiter_and_its_shrunken_Great_Red_Spot.jpg/600px-Jupiter_and_its_shrunken_Great_Red_Spot.jpg"
                    alt="Jupiter"
                    className="planet jupiter"
                />
            </div>

            {/* EARTH - Near (Top Right) */}
            <div className="planet-container earth-container parallax-layer-3 planet-near">
                <img
                    src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/97/The_Earth_seen_from_Apollo_17.jpg/600px-The_Earth_seen_from_Apollo_17.jpg"
                    alt="Earth"
                    className="planet earth"
                />
            </div>

            {/* MARS - Mid (Bottom Left-ish) */}
            <div className="planet-container mars-container parallax-layer-2 planet-mid">
                <img
                    src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/02/OSIRIS_Mars_true_color.jpg/600px-OSIRIS_Mars_true_color.jpg"
                    alt="Mars"
                    className="planet mars"
                />
            </div>

            <div className="overlay-gradient"></div>
        </div>
    );
};

export default PlanetBackground;
