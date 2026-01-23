'use client'

import { RefObject, useEffect, useRef } from 'react';
import { EditorData } from '../types';
import { useSpeechToText } from '@/hooks/useSpeechToText';
// Importem els sub-components
import { SuggestionChips } from './input/SuggestionChips';
import { InputHeader } from './input/InputHeader';
import { HighlightedContent } from '../steps/list/HighlightedContent';

interface Props {
  data: EditorData;
  currentText: string;
  onChangeText: (text: string) => void;
  onSave: () => void;
  onCancel: () => void;
  isEditing: boolean;
  textareaRef: RefObject<HTMLTextAreaElement | null>;
  labels: {
    new_step_title: string;
    new_step_desc: string;
    placeholder: string;
    [key: string]: string
  };
}

export function StepsInput({ data, currentText, onChangeText, onSave, onCancel, isEditing, textareaRef, labels }: Props) {

  const { isListening, transcript, interimTranscript, startListening, stopListening, clearTranscript } = useSpeechToText();
  const ignoreNextTranscriptRef = useRef(false);

  // Gestió de Veu
  useEffect(() => {
    if (transcript) {
      if (ignoreNextTranscriptRef.current) {
        ignoreNextTranscriptRef.current = false;
        clearTranscript();
        return;
      }
      insertToken(transcript + ' ');
      clearTranscript();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [transcript]);

  // Gestió de Tecles
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSave();
    }
    if (e.key === 'Escape' && isEditing) {
      onCancel();
    }
  };

  // Lògica d'inserció de text (el cursor màgic)
  const insertToken = (token: string) => {
    const wasListening = isListening;
    if (wasListening) {
      ignoreNextTranscriptRef.current = true;
      stopListening();
      clearTranscript();
    }
    const textarea = textareaRef.current;
    const liveText = wasListening && interimTranscript
      ? `${currentText}${currentText && !currentText.endsWith(' ') ? ' ' : ''}${interimTranscript}`
      : currentText;
    const baseText = wasListening ? liveText : (textarea?.value ?? liveText);
    if (!textarea) {
      onChangeText(baseText + (baseText ? ' ' : '') + token);
      return;
    }
    const start = wasListening ? baseText.length : textarea.selectionStart;
    const end = wasListening ? baseText.length : textarea.selectionEnd;
    const textBefore = baseText.substring(0, start);
    const textAfter = baseText.substring(end);

    // Gestió intel·ligent d'espais
    const prefix = (textBefore.length > 0 && !textBefore.endsWith(' ') && !token.startsWith(' ')) ? ' ' : '';
    const suffix = (textAfter.length > 0 && !textAfter.startsWith(' ') && !token.endsWith(' ')) ? ' ' : '';

    const newText = `${textBefore}${prefix}${token}${suffix}${textAfter}`;
    onChangeText(newText);

    setTimeout(() => {
      textarea.focus();
      const newCursorPos = start + prefix.length + token.length;
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 10);
  };

  const getDisplayValue = () => {
    if (isListening && interimTranscript) {
      const spacer = (currentText && !currentText.endsWith(' ')) ? ' ' : '';
      return currentText + spacer + interimTranscript;
    }
    return currentText;
  };

  return (
    <div className="flex flex-col h-full bg-slate-950/20 relative overflow-hidden">

      {/* 1. COMPONENT DE XIPS (Ingredients i Temps) */}
      <SuggestionChips
        ingredients={data.ingredients}
        // ✅ CORRECCIÓ: Convertim el valor a number per satisfer les Props del component
        prepTimeMinutes={Number(data.prepTimeMinutes) || 0}
        onInsert={insertToken}
      />

      {/* 2. COMPONENT DE CAPÇALERA (Accions) */}
      <InputHeader
        isEditing={isEditing}
        isListening={isListening}
        hasContent={!!currentText.trim()}
        labels={{ title: labels.new_step_title, subtitle: labels.new_step_desc }}
        onSave={onSave}
        onCancel={onCancel}
        onToggleSpeech={isListening ? stopListening : startListening}
      />

      {/* 3. TEXTAREA (Es manté aquí perquè necessita la ref directa i events complexos) */}
      <div id="tour-step-textarea" className="flex-1 p-4 pt-2 relative group min-h-50 flex flex-col">
        <textarea
          ref={textareaRef}
          value={getDisplayValue()}
          onChange={(e) => onChangeText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={isListening ? "Parla ara..." : labels.placeholder}
          data-testid="recipe-step-input"
          spellCheck={false}
          className={`
                    flex-1 w-full bg-slate-900 border rounded-2xl p-4 text-base text-white caret-white outline-none resize-none transition-all leading-relaxed custom-scrollbar
                    ${isListening
              ? 'border-red-500/50 ring-1 ring-red-500/20'
              : isEditing
                ? 'border-purple-500/50 ring-1 ring-purple-500/20 bg-purple-900/10'
                : 'border-slate-800 focus:border-purple-500 focus:ring-1 focus:ring-purple-500/50'
            }
                `}
        />
      </div>
    </div>
  );
}
