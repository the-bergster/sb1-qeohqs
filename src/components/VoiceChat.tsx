import React, { useState, useCallback, useRef } from 'react';
import { Mic, Square, Volume2 } from 'lucide-react';
import toast from 'react-hot-toast';

interface VoiceChatProps {
  context: string;
  prepId: string;
}

export default function VoiceChat({ context }: VoiceChatProps) {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);

  const startListening = useCallback(async () => {
    try {
      // Request microphone permission
      await navigator.mediaDevices.getUserMedia({ audio: true });

      // Initialize speech recognition
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognitionRef.current = recognition;

      recognition.continuous = true;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onresult = async (event) => {
        const transcript = event.results[event.results.length - 1][0].transcript;
        console.log('User said:', transcript);

        // Simple response logic
        let response = "I'm sorry, I didn't understand that.";
        
        if (transcript.toLowerCase().includes('hello') || transcript.toLowerCase().includes('hi')) {
          response = "Hello! How can I help you prepare for your meeting?";
        } else if (transcript.toLowerCase().includes('background')) {
          response = "Let me tell you about their background based on the context provided.";
        } else if (transcript.toLowerCase().includes('experience')) {
          response = "I can share information about their professional experience.";
        }

        // Speak the response
        const utterance = new SpeechSynthesisUtterance(response);
        synthRef.current = window.speechSynthesis;
        setIsSpeaking(true);
        
        utterance.onend = () => {
          setIsSpeaking(false);
        };
        
        synthRef.current.speak(utterance);
      };

      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        toast.error('Speech recognition error occurred');
        setIsListening(false);
      };

      recognition.start();
      setIsListening(true);
      toast.success('Voice chat started');
    } catch (error) {
      console.error('Failed to start voice chat:', error);
      toast.error('Failed to start voice chat');
    }
  }, []);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
      toast.success('Voice chat ended');
    }
    
    if (synthRef.current && isSpeaking) {
      synthRef.current.cancel();
      setIsSpeaking(false);
    }
  }, [isSpeaking]);

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Volume2 className="text-[#E86C1F]" />
          Voice Assistant
        </h3>
        
        <div className="flex items-center gap-2">
          <button
            onClick={isListening ? stopListening : startListening}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
              isListening
                ? 'bg-red-600 text-white hover:bg-red-700'
                : 'bg-[#E86C1F] text-white hover:bg-[#D65A0D]'
            }`}
          >
            {isListening ? (
              <>
                <Square size={20} />
                Stop Voice Chat
              </>
            ) : (
              <>
                <Mic size={20} />
                Start Voice Chat
              </>
            )}
          </button>
        </div>
      </div>

      <div className="text-center p-4 rounded-lg bg-gray-50">
        {isListening ? (
          <p className="text-gray-600">
            {isSpeaking ? 'Assistant is speaking...' : 'Listening...'}
          </p>
        ) : (
          <p className="text-gray-600">
            Click "Start Voice Chat" to begin a conversation
          </p>
        )}
      </div>
    </div>
  );
}