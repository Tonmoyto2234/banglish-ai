import React, { useState } from 'react';
import { GoogleGenAI } from '@google/genai';
import { ArrowRight, ArrowDown, Copy, Check, Sparkles, Loader2, Languages } from 'lucide-react';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const SYSTEM_INSTRUCTION = `You are an advanced Bangla-to-Banglish transliteration AI.

Your task is to convert Bengali text into Banglish (Romanized Bangla) while preserving the original pronunciation and meaning.

Rules you must follow:
1. Convert Bengali script into Roman letters based on natural Banglish typing style used by Bangladeshi people on social media and chat.
2. Maintain pronunciation accuracy rather than literal letter conversion.
3. Do not translate the meaning. Only convert the script.
4. Keep punctuation, emojis, and numbers exactly as they are.
5. If the sentence already contains English words, keep them unchanged.
6. Use common Banglish spelling that people naturally use.

Return ONLY the Banglish text. Do not explain anything.`;

export default function App() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleTransliterate = async () => {
    if (!input.trim()) return;
    
    setIsLoading(true);
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: input,
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
          temperature: 0.1, // Low temperature for more deterministic transliteration
        },
      });
      
      setOutput(response.text || '');
      setCopied(false);
    } catch (error) {
      console.error('Transliteration error:', error);
      setOutput('An error occurred during transliteration. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!output) return;
    try {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 font-sans selection:bg-emerald-200 selection:text-emerald-900">
      {/* Header */}
      <header className="bg-white border-b border-stone-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 text-emerald-600">
            <Languages className="w-6 h-6" />
            <h1 className="font-semibold text-lg tracking-tight text-stone-800">Banglish Converter</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="text-center mb-10">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-stone-900 mb-3">
            Bangla to Banglish
          </h2>
          <p className="text-stone-500 max-w-2xl mx-auto text-sm sm:text-base">
            Instantly convert Bengali text into natural, social-media friendly Romanized Banglish.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-stone-200 overflow-hidden flex flex-col md:flex-row">
          
          {/* Input Section */}
          <div className="flex-1 p-4 sm:p-6 flex flex-col">
            <div className="flex items-center justify-between mb-3">
              <label htmlFor="bangla-input" className="text-sm font-medium text-stone-500 uppercase tracking-wider">
                Bengali Input
              </label>
            </div>
            <textarea
              id="bangla-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="এখানে বাংলা টেক্সট লিখুন... (e.g., কেমন আছেন?)"
              className="flex-1 w-full min-h-[200px] md:min-h-[300px] resize-none bg-transparent border-0 p-0 text-lg sm:text-xl focus:ring-0 placeholder:text-stone-300"
              dir="auto"
            />
          </div>

          {/* Divider & Convert Button (Desktop) */}
          <div className="hidden md:flex flex-col items-center justify-center border-x border-stone-100 bg-stone-50/50 px-4">
            <button
              onClick={handleTransliterate}
              disabled={isLoading || !input.trim()}
              className="w-12 h-12 rounded-full bg-emerald-600 text-white flex items-center justify-center hover:bg-emerald-700 disabled:opacity-50 disabled:hover:bg-emerald-600 transition-colors shadow-sm"
              title="Convert to Banglish"
            >
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <ArrowRight className="w-5 h-5" />}
            </button>
          </div>

          {/* Divider & Convert Button (Mobile) */}
          <div className="md:hidden relative h-14 bg-stone-50 border-y border-stone-100 flex items-center justify-center">
            <button
              onClick={handleTransliterate}
              disabled={isLoading || !input.trim()}
              className="absolute w-12 h-12 rounded-full bg-emerald-600 text-white flex items-center justify-center hover:bg-emerald-700 disabled:opacity-50 disabled:hover:bg-emerald-600 transition-colors shadow-md z-10"
            >
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <ArrowDown className="w-5 h-5" />}
            </button>
          </div>

          {/* Output Section */}
          <div className="flex-1 p-4 sm:p-6 flex flex-col bg-stone-50/30">
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-medium text-stone-500 uppercase tracking-wider">
                Banglish Output
              </label>
              <button
                onClick={handleCopy}
                disabled={!output}
                className="text-stone-400 hover:text-stone-600 disabled:opacity-30 transition-colors flex items-center gap-1.5 text-sm font-medium"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span className="text-emerald-600">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
            <div className="flex-1 relative">
              {isLoading ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-stone-400 gap-3">
                  <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
                  <p className="text-sm font-medium animate-pulse">Converting...</p>
                </div>
              ) : output ? (
                <div className="w-full h-full text-lg sm:text-xl text-stone-800 whitespace-pre-wrap break-words">
                  {output}
                </div>
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-stone-300 gap-2">
                  <Sparkles className="w-8 h-8 opacity-50" />
                  <p className="text-sm">Translation will appear here</p>
                </div>
              )}
            </div>
          </div>
          
        </div>
      </main>
    </div>
  );
}
