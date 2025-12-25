"use client";

import React, { useState, useRef, useEffect, FormEvent } from 'react';
import { getHoroscope } from '@/lib/horoscope';
import { HoroscopeFormData, HoroscopeResult } from '@/types';
import PlanetBackground from '@/components/PlanetBackground';

export default function Home() {
    // --- Chat State ---
    const [step, setStep] = useState<number>(0); // 0=Name, 1=DoB, 2=ToB, 3=Place, 4=Loading, 5=Done
    const [messages, setMessages] = useState<Message[]>([
        { id: 0, sender: "bot", text: "வணக்கம். ஜாதகக் கணிப்பிற்காக உங்கள் பெயரைத் தெரிவியுங்கள். (Welcome. Please tell me your name for horoscope prediction.)" }
    ]);
    const [inputValue, setInputValue] = useState("");
    const [isTyping, setIsTyping] = useState(false);

    // Moon Phase Animation State
    const [moonPhase, setMoonPhase] = useState("☽");

    // Data Accumulation
    const [formData, setFormData] = useState<HoroscopeFormData>({
        name: "",
        dob: "",
        tob: "",
        birthPlace: "",
    });

    // Result Data State for Cinematic Transition
    const [resultData, setResultData] = useState<HoroscopeResult | null>(null);

    const chatEndRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to bottom
    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, isTyping]);

    // Handle Input Change & Typing State
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value);
        if (e.target.value.length > 0) {
            setIsTyping(true);

            // Clear previous timeout if exists (debouncing logic not strictly needed for this visual effect but good practice)
        } else {
            setIsTyping(false);
        }
    };

    // Moon Phase Animation Effect
    useEffect(() => {
        const phases = ['🌑', '🌒', '🌓', '🌔', '🌕', '🌖', '🌗', '🌘'];
        let i = 0;
        const interval = setInterval(() => {
            setMoonPhase(phases[i]);
            i = (i + 1) % phases.length;
        }, 800);
        return () => clearInterval(interval);
    }, []);

    const handleSend = async (e?: FormEvent) => {
        if (e) e.preventDefault();
        if (!inputValue.trim()) return;

        const userText = inputValue.trim();

        // Add user message
        const newMessageId = messages.length + 1;
        setMessages(prev => [...prev, { id: newMessageId, sender: "user", text: userText }]);
        setInputValue(""); // Clear input
        setIsTyping(false); // Stop typing visual immediately

        // Process logic based on step

        // STEP 0: Name -> Ask DOB
        if (step === 0) {
            setFormData(prev => ({ ...prev, name: userText }));
            // Bot thinks
            setTimeout(() => {
                setMessages(prev => [...prev, { id: prev.length + 1, sender: "bot", text: "நன்றி. தயவுசெய்து உங்கள் பிறந்த தேதியை கூறுங்கள். (Thank you. Please tell me your Date of Birth.)" }]);
                setStep(1);
            }, 1000);
        }
        // STEP 1: DOB -> Ask TOB
        else if (step === 1) {
            setFormData(prev => ({ ...prev, dob: userText }));
            setTimeout(() => {
                setMessages(prev => [...prev, { id: prev.length + 1, sender: "bot", text: "பிறந்த நேரத்தை தெரிவியுங்கள். (Please tell me your Time of Birth.)" }]);
                setStep(2);
            }, 1000);
        }
        // STEP 2: TOB -> Ask Place
        else if (step === 2) {
            setFormData(prev => ({ ...prev, tob: userText }));
            setTimeout(() => {
                setMessages(prev => [...prev, { id: prev.length + 1, sender: "bot", text: "நீங்கள் பிறந்த இடத்தின் பெயரை குறிப்பிடுங்கள். (Please mention your Place of Birth.)" }]);
                setStep(3);
            }, 1000);
        }
        // STEP 3: Place -> Fetch Data
        else if (step === 3) {
            const finalData = { ...formData, birthPlace: userText };
            setFormData(finalData);

            // Loading Message
            setTimeout(() => {
                setMessages(prev => [...prev, { id: prev.length + 1, sender: "bot", text: "🔄 ஜாதகம் கணிக்கப்பட்டுக் கொண்டிருக்கிறது… தயவுசெய்து காத்திருக்கவும். (Generating horoscope... Please wait.)" }]);
                setStep(4); // Loading state

                // Fetch API
                fetchHoroscope(finalData);
            }, 1000);
        }
    };

    const fetchHoroscope = async (data: HoroscopeFormData) => {
        try {
            const result = await getHoroscope(data);

            // Artificial delay for suspense
            setTimeout(() => {
                setResultData(result);
                setStep(5); // Trigger cinematic transition
            }, 3000);

        } catch (err) {
            console.error(err);
            setMessages(prev => [...prev, { id: prev.length + 1, sender: "bot", text: "Sorry, something went wrong. Please reload and try again." }]);
        }
    };

    // Input type helper
    const getInputType = () => {
        if (step === 1) return "date";
        if (step === 2) return "time";
        return "text";
    };

    const getPlaceholder = () => {
        if (step === 0) return "Type your name...";
        if (step === 3) return "City, Country...";
        return "Type here...";
    };

    return (
        <div className="relative min-h-screen text-white overflow-hidden font-sans">
            {/* CSS Background Scene - Reacts to typing */}
            <PlanetBackground isTyping={isTyping} />

            {/* Main Chat Interface - Fades out when Step 5 (Result) is reached */}
            <main className={`main-wrapper transition-all duration-1000 ${step === 5 ? 'fade-out' : ''}`}>
                <header className="header">
                    <h1>✨ ஜோதிடர் (Astrologer) ✨</h1>
                    <div className="planet-progress">
                        {/* Sun: Name (Step 0) */}
                        <span className={`planet-step ${step === 0 ? 'active' : step > 0 ? 'completed' : ''} text-2xl`}>☉</span>
                        {/* Moon: DOB (Step 1) - Animated Phase */}
                        <span className={`planet-step ${step === 1 ? 'active' : step > 1 ? 'completed' : ''} text-2xl`}>{moonPhase}</span>
                        {/* Mars: TOB (Step 2) */}
                        <span className={`planet-step ${step === 2 ? 'active' : step > 2 ? 'completed' : ''} text-2xl`}>♂</span>
                        {/* Venus: Place (Step 3) */}
                        <span className={`planet-step ${step === 3 ? 'active' : step > 3 ? 'completed' : ''} text-2xl`}>♀</span>
                        {/* Jupiter: Loading/Result (Step 4+) */}
                        <span className={`planet-step ${step >= 4 ? 'active' : ''} text-2xl`}>♃</span>
                    </div>
                </header>

                <div className="chat-container">
                    {messages.map((msg) => (
                        <div key={msg.id} className={`message ${msg.sender} `}>
                            {msg.text}
                        </div>
                    ))}

                    {/* Bot Typing Indicator (Logic already existed, re-using CSS) */}
                    {step === 4 && (
                        <div className="typing-indicator">
                            <span>🔮 ஜோதிடர் ஆராய்கிறார் (Analyzing)...</span>
                            <div className="typing-dots">
                                <div className="dot"></div>
                                <div className="dot"></div>
                                <div className="dot"></div>
                            </div>
                        </div>
                    )}

                    <div ref={chatEndRef} />
                </div>

                {/* Input Area - Hidden if step 4 (Loading) or 5 (Done) */}
                {step < 4 && (
                    <form className="input-area" onSubmit={handleSend}>
                        <input
                            type={getInputType()}
                            className="input-field"
                            value={inputValue}
                            onChange={handleInputChange}
                            placeholder={getPlaceholder()}
                            autoFocus
                        />
                        <button type="submit" className="send-btn" disabled={!inputValue}>
                            <svg viewBox="0 0 24 24" className="send-icon"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"></path></svg>
                        </button>
                    </form>
                )}
            </main>

            {/* Cinematic Result View - Slides in when Step 5 is reached */}
            {step === 5 && resultData && (
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

                        <button className="restart-btn" onClick={() => window.location.reload()}>
                            Start Over ↻
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

// Add Message type definition here or import it if better
interface Message {
    id: number;
    sender: "bot" | "user";
    text?: string;
    isResult?: boolean;
    resultData?: HoroscopeResult | null;
}
