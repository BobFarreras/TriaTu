import { useState, useEffect, useRef, useCallback } from 'react';

// ... (Les interfícies es mantenen igual que abans) ...
// ... Copia les interfícies de l'anterior resposta si cal ...

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
  message: string;
}

interface SpeechRecognitionEvent {
  resultIndex: number;
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionResultList {
  length: number;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  isFinal: boolean;
  [index: number]: SpeechRecognitionAlternative;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onend: (() => void) | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
  onstart: (() => void) | null;
}

interface IWindow extends Window {
  SpeechRecognition?: new () => SpeechRecognition;
  webkitSpeechRecognition?: new () => SpeechRecognition;
}

export function useSpeechToText() {
  const [isListening, setIsListening] = useState(false);
  
  // ✅ transcript: Només tindrà el resultat FINAL (per guardar-ho)
  const [transcript, setTranscript] = useState(''); 
  
  // ✅ interimTranscript: Tindrà el text "en viu" (per mostrar-ho)
  const [interimTranscript, setInterimTranscript] = useState(''); 

  const recognitionRef = useRef<SpeechRecognition | null>(null);

  useEffect(() => {
    const win = window as unknown as IWindow;
    if (typeof window === 'undefined') return;

    const SpeechRecognitionConstructor = win.SpeechRecognition || win.webkitSpeechRecognition;

    if (!SpeechRecognitionConstructor) return;

    const recognition = new SpeechRecognitionConstructor();
    recognition.continuous = true;
    recognition.interimResults = true; // Això permet veure el text mentre parles
    recognition.lang = 'ca-ES';

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => {
        setIsListening(false);
        setInterimTranscript(''); // Netegem el text fantasma en acabar
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
        if (event.error === 'no-speech') {
            setIsListening(false);
            return;
        }
        console.warn("Error micro:", event.error);
        setIsListening(false);
    };

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let finalStr = '';
      let interimStr = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          finalStr += result[0].transcript;
        } else {
          interimStr += result[0].transcript;
        }
      }

      // Si tenim text final, l'enviem al transcript principal
      if (finalStr) {
        setTranscript(finalStr);
        setInterimTranscript(''); // Reset del parcial
      } else {
        // Si no, actualitzem el parcial perquè es vegi a l'input
        setInterimTranscript(interimStr);
      }
    };

    recognitionRef.current = recognition;

    return () => {
      if (recognitionRef.current) recognitionRef.current.stop();
    };
  }, []);

  const startListening = useCallback(() => {
    if (recognitionRef.current && !isListening) {
      try {
        recognitionRef.current.start();
      } catch (e) { console.error(e); }
    }
  }, [isListening]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) recognitionRef.current.stop();
  }, []);

  const clearTranscript = useCallback(() => setTranscript(''), []);

  // ✅ Retornem també l'interimTranscript
  return { isListening, transcript, interimTranscript, startListening, stopListening, clearTranscript };
}