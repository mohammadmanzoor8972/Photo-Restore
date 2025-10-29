
import React from 'react';
import { PhotoIcon } from './icons/PhotoIcon';
import { SparklesIcon } from './icons/SparklesIcon';

export const Header: React.FC = () => {
  return (
    <header className="text-center mb-8 md:mb-12">
      <div className="flex justify-center items-center gap-4 mb-4">
        <PhotoIcon className="w-16 h-16 text-indigo-400" />
        <SparklesIcon className="w-12 h-12 text-amber-400" />
      </div>
      <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">
        Vintage Photo Restorer
      </h1>
      <p className="mt-4 text-lg text-slate-400 max-w-3xl mx-auto">
        Breathe new life into your old memories. Our AI meticulously removes damages and enhances details to restore your photos to HD quality.
      </p>
    </header>
  );
};
