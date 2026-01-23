'use client';

import { BackButton } from '@/components/ui/BackButton';

interface Props {
  title: string;
  isEditing: boolean;
  onExit: () => void;
  onTitleClick: () => void;
  rightSlot?: React.ReactNode;
}

export function EditorHeader({ title, isEditing, onExit, onTitleClick, rightSlot }: Props) {
  return (
    <div className="shrink-0 px-4 py-3 bg-slate-950 flex items-center justify-between border-b border-slate-900">
      <div onClick={onExit}>
        <BackButton />
      </div>
      <h1 className="text-slate-200 font-bold text-lg cursor-pointer" onClick={onTitleClick}>
        {title || (isEditing ? "Editant Recepta" : "Nova Recepta")}
      </h1>
      <div className="min-w-[2.5rem] flex justify-end">{rightSlot}</div>
    </div>
  );
}
