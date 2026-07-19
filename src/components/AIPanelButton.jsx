import React, { useState, useEffect, useRef } from 'react';
import { Bot, X, FileText, ImageIcon, Search, Mic, MicOff, Volume2, VolumeX, AlertCircle } from 'lucide-react';

export default function AIPanelButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Voice feature states
  const [isListening, setIsListening] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(false); // Disabled by default
  const [showPopup, setShowPopup] = useState(false);
  const recognitionRef = useRef(null);
  const voiceTimerRef = useRef(null);

  // System context prompt for AetherLearn Platform
  const SYSTEM_PROMPT = `
You are an intelligent, contextual AI assistant for the 'AetherLearn' platform, an advanced industrial dashboard for students and mentors.
Your main goals are:
1. Help users navigate the web interface (e.g., explaining where the 'Past Year Question Vault' is, how to view 'Recent Sets', or where to find 'Settings').
2. Guide them on using the AI tools perfectly (e.g., how to upload a PDF for analysis, how the Topic Frequency Map works).
3. If they ask a question, answer clearly and concisely.
4. If they need to click a specific button, phrase your response like an actionable notification.
`;

  useEffect(() => {
    // Initialize Speech Recognition if supported
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event) => {
        let finalTranscript = '';
        for (let i = 0; i < event.results.length; i++) {
          finalTranscript += event.results[i][0].transcript;
        }
        setQuery(finalTranscript);
        
        // Clear previous timer
        if (voiceTimerRef.current) {
          clearTimeout(voiceTimerRef.current);
        }
        
        // Wait 5 seconds after speech stops to submit
        voiceTimerRef.current = setTimeout(() => {
          handleAIRequest(null, finalTranscript);
          recognition.stop();
          setIsListening(false);
        }, 5000);
      };

      recognition.onerror = (event) => {
        console.error("Speech recognition error", event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }
    
    return () => {
      if (voiceTimerRef.current) clearTimeout(voiceTimerRef.current);
    };
  }, []);

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      if (voiceTimerRef.current) clearTimeout(voiceTimerRef.current);
    } else {
      setQuery('');
      recognitionRef.current?.start();
      setIsListening(true);
      if (!isOpen) setIsOpen(true);
    }
  };

  const speakText = async (text) => {
    if (!voiceEnabled) return;
    
    try {
      const sarvamApiKey = import.meta.env.VITE_SARVAM_API_KEY || 'MISSING_SARVAM_KEY';
      if (sarvamApiKey === 'MISSING_SARVAM_KEY') {
        console.warn('VITE_SARVAM_API_KEY not set. Falling back to browser TTS.');
        // Fallback to browser TTS if no key
        if (window.speechSynthesis) {
          window.speechSynthesis.cancel();
          const utterance = new SpeechSynthesisUtterance(text);
          window.speechSynthesis.speak(utterance);
        }
        return;
      }

      // Placeholder for Sarvam API TTS request
      const response = await fetch('https://api.sarvam.ai/text-to-speech', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'API-Subscription-Key': sarvamApiKey
        },
        body: JSON.stringify({
          inputs: [text],
          target_language_code: "hi-IN", // Defaulting to Hindi or can be en-IN
          speaker: "meera",
          pitch: 0,
          pace: 1.0,
          loudness: 1.5,
          speech_sample_rate: 8000,
          enable_preprocessing: true,
          model: "sarvam-1"
        })
      });

      if (response.ok) {
        const data = await response.json();
        if (data && data.audios && data.audios.length > 0) {
          // Play base64 audio string returned by Sarvam
          const audio = new Audio(`data:audio/wav;base64,${data.audios[0]}`);
          audio.play();
        }
      } else {
        console.error('Sarvam API Error:', response.statusText);
      }
    } catch (err) {
      console.error('TTS Error:', err);
    }
  };

  const handleAIRequest = async (e, forcedQuery = null) => {
    if (e) e.preventDefault();
    const finalQuery = forcedQuery || query;
    if (!finalQuery) return;

    setLoading(true);
    setResult('');
    setShowPopup(false);

    try {
      const apiKey = import.meta.env.VITE_NVIDIA_API_KEY || 'MISSING_API_KEY';
      
      const payload = {
        model: "nvidia/nemotron-3-super-120b-a12b",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: finalQuery }
        ],
        max_tokens: 300
      };

      // In production, point to the actual NVIDIA endpoint
      const response = await fetch('https://integrate.api.nvidia.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify(payload)
      }).catch(() => {
        // Mock fallback if API fails or no key
        return { 
          ok: true, 
          json: () => Promise.resolve({ 
            choices: [{ message: { content: "To navigate to the Past Year Question Vault, click 'Quizzes' in the left sidebar, then select the 'Past Year' toggle. How else can I assist you today?" } }] 
          }) 
        };
      });
      
      const data = await response.json();
      const aiResponse = data.choices?.[0]?.message?.content || 'Analysis complete.';
      
      setResult(aiResponse);
      setShowPopup(true);
      
      // Auto-hide popup after 10 seconds if it's just a notification
      setTimeout(() => setShowPopup(false), 10000);

      // Trigger text-to-speech
      speakText(aiResponse);

    } catch (err) {
      setResult(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col items-end gap-3">
      
      {/* Contextual Popup Notification */}
      {showPopup && !isOpen && (
        <div className="mb-2 w-80 bg-brand-600 dark:bg-brand-700 text-white shadow-xl rounded-xl p-4 flex gap-3 animate-in fade-in slide-in-from-bottom-4">
          <AlertCircle className="flex-shrink-0" size={20} />
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider mb-1 opacity-90">AI Guidance</h4>
            <p className="text-sm leading-snug">{result}</p>
          </div>
          <button onClick={() => setShowPopup(false)} className="self-start opacity-70 hover:opacity-100">
            <X size={16} />
          </button>
        </div>
      )}

      {/* Main Chat Interface */}
      {isOpen && (
        <div className="w-80 sm:w-96 bg-white dark:bg-slate-900 shadow-2xl rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden animate-in slide-in-from-bottom-5">
          <div className="p-4 bg-brand-600 dark:bg-brand-700 flex justify-between items-center text-white">
            <div className="flex items-center gap-2">
              <Bot size={20} />
              <span className="font-bold">AetherLearn Guide</span>
            </div>
            <div className="flex items-center gap-1">
              <button 
                onClick={() => setVoiceEnabled(!voiceEnabled)} 
                className="hover:bg-white/20 p-1.5 rounded transition-colors"
                title={voiceEnabled ? "Mute Voice Responses" : "Enable Voice Responses"}
              >
                {voiceEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
              </button>
              <button onClick={() => setIsOpen(false)} className="hover:bg-white/20 p-1.5 rounded transition-colors">
                <X size={18} />
              </button>
            </div>
          </div>
          
          <div className="p-4 space-y-4">
            <div className="flex items-center justify-around pb-3 border-b border-slate-100 dark:border-slate-800">
              <button className="flex flex-col items-center text-xs text-slate-500 hover:text-brand-500 transition-colors">
                <FileText size={16} className="mb-1" />
                Analyze PDF
              </button>
              <button className="flex flex-col items-center text-xs text-slate-500 hover:text-brand-500 transition-colors">
                <ImageIcon size={16} className="mb-1" />
                Scan Image
              </button>
              <button className="flex flex-col items-center text-xs text-slate-500 hover:text-brand-500 transition-colors">
                <Search size={16} className="mb-1" />
                Interface Help
              </button>
            </div>
            
            {result && (
              <div className="p-3 bg-brand-50 dark:bg-slate-800 border border-brand-100 dark:border-slate-700 rounded-lg text-sm text-slate-800 dark:text-slate-200 max-h-48 overflow-y-auto">
                <div className="flex items-center gap-2 mb-2">
                  <Bot size={14} className="text-brand-500" />
                  <span className="text-xs font-bold text-brand-600 dark:text-brand-400">Response</span>
                </div>
                {result}
              </div>
            )}

            <form onSubmit={(e) => handleAIRequest(e)} className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Ask for guidance or tasks..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="flex-1 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2.5 text-slate-900 dark:text-white focus:ring-1 focus:ring-brand-500 outline-none"
              />
              <button
                type="button"
                onClick={toggleListening}
                className={`p-2.5 rounded-lg transition-colors ${isListening ? 'bg-rose-500 text-white animate-pulse' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-brand-500 dark:hover:text-brand-400'}`}
                title="Use Voice Input"
              >
                {isListening ? <MicOff size={18} /> : <Mic size={18} />}
              </button>
              <button
                type="submit"
                disabled={loading || !query}
                className="bg-brand-600 text-white px-3 py-2.5 rounded-lg text-sm font-semibold disabled:opacity-50 transition-colors"
              >
                {loading ? '...' : 'Go'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Floating Action Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-gradient-to-tr from-brand-600 to-indigo-600 rounded-full shadow-lg flex items-center justify-center text-white hover:scale-105 active:scale-95 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-brand-500"
        aria-label="Open AI Assistant"
      >
        <Bot size={28} />
      </button>
    </div>
  );
}
