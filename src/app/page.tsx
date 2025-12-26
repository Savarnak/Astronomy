"use client";

import React, { useState } from 'react';
import { getHoroscope } from '@/lib/horoscope';
import { HoroscopeFormData, HoroscopeResult } from '@/types';
import PlanetBackground from '@/components/PlanetBackground';

export default function Home() {
    // --- State ---
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [resultData, setResultData] = useState<HoroscopeResult | null>(null);

    // Form State
    const [formData, setFormData] = useState<HoroscopeFormData>({
        name: "",
        dob: "",
        tob: "",
        birthPlace: "",
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setError(null); // Clear error on type
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        // Validation
        if (!formData.name.trim()) {
            setError("Please enter your name.");
            return;
        }

        const dobDate = new Date(formData.dob);
        const today = new Date();
        if (dobDate > today) {
            setError("Date of Birth cannot be in the future.");
            return;
        }

        setIsLoading(true);

        // Artificial delay for cinematic effect
        setTimeout(async () => {
            try {
                const result = await getHoroscope(formData);
                setResultData(result);
                setIsLoading(false);
            } catch (err) {
                console.error(err);
                setIsLoading(false);
                setError("Something went wrong. Please check your inputs or try again.");
            }
        }, 1500);
    };

    return (
        <div className="relative min-h-screen text-white overflow-hidden font-sans">
            {/* CSS Background Scene */}
            <PlanetBackground isTyping={false} />

            {/* Main Form Interface - Centered Overlay */}
            {!resultData && (
                <div className="form-overlay transition-all duration-500">
                    <main className={`result-card-cinematic !opacity-100 !transform-none !animate-none !text-left ${isLoading ? 'blur-sm scale-95 opacity-50' : ''}`}>
                        <header className="header mb-8 text-center">
                            <h1>ஜோதிடர் (Astrologer) ✨</h1>
                        </header>

                        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                            {/* Name */}
                            <div className="input-group">
                                <label className="input-label">Name (பெயர்)</label>
                                <input
                                    type="text"
                                    name="name"
                                    required
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    className="input-field"
                                    placeholder="Enter your name..."
                                />
                            </div>

                            {/* DOB & TOB Row */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="input-group">
                                    <label className="input-label">Date (பிறந்த தேதி)</label>
                                    <input
                                        type="date"
                                        name="dob"
                                        required
                                        value={formData.dob}
                                        onChange={handleInputChange}
                                        className="input-field"
                                    />
                                </div>
                                <div className="input-group">
                                    <label className="input-label">Time (பிறந்த நேரம்)</label>
                                    <input
                                        type="time"
                                        name="tob"
                                        required
                                        value={formData.tob}
                                        onChange={handleInputChange}
                                        className="input-field"
                                    />
                                </div>
                            </div>

                            {/* Place */}
                            <div className="input-group">
                                <label className="input-label">Place (பிறந்த இடம்)</label>
                                <input
                                    type="text"
                                    name="birthPlace"
                                    required
                                    value={formData.birthPlace}
                                    onChange={handleInputChange}
                                    className="input-field"
                                    placeholder="City"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="restart-btn mt-6 w-full bg-gradient-to-r from-[#ffd700] to-[#daa520] !text-black border-none hover:scale-105 shadow-lg shadow-gold/20 flex items-center justify-center gap-2"
                            >
                                {isLoading ? (
                                    <>
                                        <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin"></span>
                                        ஜாதகம் கணிக்கப்பட்டுக் கொண்டிருக்கிறது…
                                    </>
                                ) : "Generate Horoscope (ஜாதகம் கணிக்க)"}
                            </button>

                            {/* Error Message */}
                            {error && (
                                <div className="text-red-400 text-sm text-center bg-red-900/20 p-2 rounded-lg border border-red-500/30 animate-pulse">
                                    ⚠️ {error}
                                </div>
                            )}
                        </form>
                    </main>
                </div>
            )}


            {/* Loading Indicator Overlay */}
            {isLoading && (
                <div className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none">
                    <div className="typing-indicator bg-black/50 p-4 rounded-full backdrop-blur-md border border-white/10">
                        <span>🔮 ஜோதிடர் ஆராய்கிறார் (Analyzing)</span>
                        <div className="typing-dots">
                            <div className="dot"></div>
                            <div className="dot"></div>
                            <div className="dot"></div>
                        </div>
                    </div>
                </div>
            )}

            {/* Cinematic Result View - Slides in when Result is ready */}
            {resultData && (
                <div className="result-view-container">
                    <div className="result-card-cinematic">
                        <div className="result-title">✨ ஜாதக விளக்கம் ✨</div>
                        <div className="result-subtitle">Horoscope Report</div>

                        <div className="cinematic-row">
                            <span className="cinematic-label">👤 பெயர் (Name)</span>
                            <span className="cinematic-val">{resultData.name}</span>
                        </div>
                        <div className="cinematic-row">
                            <span className="cinematic-label">☉ ராசி (Raasi)</span>
                            <span className="cinematic-val">{resultData.raasi}</span>
                        </div>
                        <div className="cinematic-row">
                            <span className="cinematic-label">☽ நட்சத்திரம் (Star)</span>
                            <span className="cinematic-val">{resultData.natchathiram}</span>
                        </div>
                        <div className="cinematic-row">
                            <span className="cinematic-label">↑ லக்னம் (Lagnam)</span>
                            <span className="cinematic-val">{resultData.lagnam}</span>
                        </div>
                        <div className="cinematic-row">
                            <span className="cinematic-label">📍 அகலம் (Lat)</span>
                            <span className="cinematic-val">{resultData.latitude}</span>
                        </div>
                        <div className="cinematic-row">
                            <span className="cinematic-label">📍 நீளம் (Long)</span>
                            <span className="cinematic-val">{resultData.longitude}</span>
                        </div>

                        <button className="restart-btn" onClick={() => { setResultData(null); setFormData({ name: "", dob: "", tob: "", birthPlace: "" }); }}>
                            Start Over (மற்றொரு ஜாதகம் பார்க்க) ↻
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

