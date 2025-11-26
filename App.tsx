import React, { useState, useRef, useEffect } from 'react';
import { ShieldLogo } from './components/ShieldLogo';
import { PaymentGate } from './components/PaymentGate';
import { AnalysisResult } from './components/AnalysisResult';
import { analyzeMedia } from './services/geminiService';
import { MediaAnalysis } from './types';

// Type definition for Web Speech API
declare global {
  interface Window {
    webkitSpeechRecognition: any;
    SpeechRecognition: any;
  }
}

export default function App() {
  // Initialize state from local storage so users don't have to pay again if they refresh
  const [isPaid, setIsPaid] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('safemedia_access') === 'true';
    }
    return false;
  });

  const [inputValue, setInputValue] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isLoading, setIsListeningLoading] = useState(false);
  const [currentAnalysis, setCurrentAnalysis] = useState<MediaAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const resultsRef = useRef<HTMLDivElement>(null);

  // Check for Stripe redirect success parameter on mount
  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    if (query.get('success') === 'true') {
      setIsPaid(true);
      localStorage.setItem('safemedia_access', 'true');
      // Clean up the URL so the user doesn't see the query param
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  // Scroll helper - scroll to top of results
  const scrollToResult = () => {
    if (resultsRef.current) {
      resultsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Submission handler
  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputValue.trim()) return;

    setIsListeningLoading(true);
    setError(null);
    setCurrentAnalysis(null);

    try {
      const data = await analyzeMedia(inputValue);
      setCurrentAnalysis(data);
      setInputValue('');
      // Wait for render then scroll
      setTimeout(scrollToResult, 100);
    } catch (err) {
      setError("Could not analyze media. Please try again later or check your connection.");
    } finally {
      setIsListeningLoading(false);
    }
  };

  // Voice Input Logic
  const toggleVoiceInput = () => {
    if (isListening) {
      setIsListening(false);
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Voice input is not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInputValue(transcript);
      // Optional: Auto-submit on voice end
      // handleSubmit(); 
    };

    recognition.start();
  };

  if (!isPaid) {
    return <PaymentGate />;
  }

  return (
    <div className="min-h-screen bg-[#0a192f] text-white flex flex-col font-sans">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-navy-900/80 backdrop-blur-md border-b border-navy-700">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ShieldLogo className="w-8 h-8 text-white" />
            <div className="flex items-baseline gap-2">
              <span className="font-bold text-xl tracking-tight">SAFEMEDIA</span>
              <span className="text-xs text-navy-300">A GoodMedia product</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-5xl mx-auto p-4 flex flex-col">
        
        {/* Welcome / Empty State */}
        {!currentAnalysis && !isLoading && (
          <div className="flex-1 flex flex-col items-center justify-center text-center space-y-6 py-20">
            <div className="w-24 h-24 bg-navy-800 rounded-full flex items-center justify-center mb-4 ring-4 ring-navy-700/50">
              <ShieldLogo className="w-12 h-12 text-navy-200" />
            </div>
            <p className="text-2xl md:text-3xl font-bold text-white max-w-2xl leading-tight">
              Welcome to SAFEMEDIA, input any media to gain detailed insight into whether it is safe to watch.
            </p>
          </div>
        )}

        {/* Analysis Output */}
        {currentAnalysis && (
          <div ref={resultsRef} className="py-8 scroll-mt-20">
            <AnalysisResult data={currentAnalysis} />
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="flex-1 flex flex-col items-center justify-center py-20">
            <div className="relative w-20 h-20 mb-8">
              <div className="absolute inset-0 border-4 border-navy-700 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-white rounded-full border-t-transparent animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <ShieldLogo className="w-8 h-8 text-white opacity-50" />
              </div>
            </div>
            <h3 className="text-xl font-semibold text-white animate-pulse">Analyzing Content...</h3>
            <p className="text-navy-300 mt-2">Checking global ratings and content databases</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="p-4 mb-8 bg-red-500/10 border border-red-500/50 rounded-xl text-red-200 text-center">
            {error}
          </div>
        )}
      </main>

      {/* Sticky Input Footer */}
      <div className="sticky bottom-0 z-40 bg-gradient-to-t from-[#0a192f] via-[#0a192f] to-transparent pb-6 pt-12 px-4">
        <div className="max-w-3xl mx-auto">
          <form onSubmit={handleSubmit} className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-200"></div>
            <div className="relative flex items-center bg-navy-800 rounded-2xl border border-navy-600 shadow-2xl">
              <button
                type="button"
                onClick={toggleVoiceInput}
                className={`p-4 rounded-l-2xl transition-colors ${
                  isListening ? 'text-red-400 bg-red-400/10' : 'text-navy-300 hover:text-white hover:bg-navy-700'
                }`}
                title="Voice Input"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {isListening ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                  )}
                </svg>
              </button>
              
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder={isListening ? "Listening..." : "Type the title of a movie, book, show, song, or any other media"}
                className="flex-1 bg-transparent border-none text-white placeholder-navy-400 focus:ring-0 py-4 px-2"
              />
              
              <button
                type="submit"
                disabled={!inputValue.trim() || isLoading}
                className="p-4 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:text-cyan-300 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </form>
          <p className="text-center text-xs text-navy-500 mt-3">
            SAFEMEDIA AI can make mistakes. Verify important information.
          </p>
        </div>
      </div>
    </div>
  );
}