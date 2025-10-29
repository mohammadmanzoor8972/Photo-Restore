
import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { ImageUploader } from './components/ImageUploader';
import { ImageComparator } from './components/ImageComparator';
import { Loader } from './components/Loader';
import { restorePhoto } from './services/geminiService';
import { fileToBase64 } from './utils/imageUtils';
import { SparklesIcon } from './components/icons/SparklesIcon';

type AppState = {
  originalImage: string | null;
  restoredImage: string | null;
  originalFile: File | null;
  isLoading: boolean;
  error: string | null;
};

function App() {
  const [state, setState] = useState<AppState>({
    originalImage: null,
    restoredImage: null,
    originalFile: null,
    isLoading: false,
    error: null,
  });

  const handleImageUpload = useCallback(async (file: File) => {
    setState({
      originalImage: null,
      restoredImage: null,
      originalFile: file,
      isLoading: true,
      error: null
    });
    try {
      const dataUrl = await fileToBase64(file);
      setState(prevState => ({ ...prevState, originalImage: dataUrl, isLoading: false }));
    } catch (err) {
      const error = err instanceof Error ? err.message : 'Failed to read image file.';
      setState(prevState => ({ ...prevState, error, isLoading: false }));
    }
  }, []);

  const handleRestoreClick = async () => {
    if (!state.originalFile) return;

    setState(prevState => ({ ...prevState, isLoading: true, error: null, restoredImage: null }));
    
    try {
      const base64Data = (await fileToBase64(state.originalFile)).split(',')[1];
      const mimeType = state.originalFile.type;

      const restoredBase64 = await restorePhoto(base64Data, mimeType);
      
      if (restoredBase64) {
        const restoredDataUrl = `data:image/jpeg;base64,${restoredBase64}`;
        setState(prevState => ({ ...prevState, restoredImage: restoredDataUrl, isLoading: false }));
      } else {
        throw new Error('The AI model did not return an image. Please try again.');
      }
    } catch (err) {
      const error = err instanceof Error ? err.message : 'An unknown error occurred during restoration.';
      setState(prevState => ({ ...prevState, error, isLoading: false }));
    }
  };

  const handleClear = () => {
    setState({
      originalImage: null,
      restoredImage: null,
      originalFile: null,
      isLoading: false,
      error: null,
    });
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col items-center p-4 md:p-8 font-sans">
      <Header />
      <main className="w-full max-w-7xl flex-grow flex flex-col items-center justify-center">
        {!state.originalImage && !state.isLoading && (
          <ImageUploader onImageUpload={handleImageUpload} />
        )}
        
        {state.isLoading && (
            <div className="text-center flex flex-col items-center justify-center h-64">
                <Loader />
                <p className="mt-4 text-slate-400 text-lg animate-pulse">Restoring your photo, please wait...</p>
                <p className="text-sm text-slate-500 mt-2">This may take a moment as the AI enhances every detail.</p>
            </div>
        )}

        {state.error && (
          <div className="mt-6 p-4 bg-red-900/50 border border-red-700 text-red-300 rounded-lg max-w-2xl text-center">
            <h3 className="font-bold">Restoration Failed</h3>
            <p>{state.error}</p>
          </div>
        )}
        
        {state.originalImage && !state.isLoading && (
          <div className="w-full flex flex-col items-center">
            <div className="w-full max-w-4xl p-2 bg-slate-800 rounded-xl shadow-2xl shadow-slate-950/50 border border-slate-700">
               <ImageComparator
                original={state.originalImage}
                restored={state.restoredImage || state.originalImage}
                showSlider={!!state.restoredImage}
              />
            </div>
            <div className="flex flex-wrap gap-4 mt-6">
              {!state.restoredImage && (
                <button
                  onClick={handleRestoreClick}
                  disabled={state.isLoading}
                  className="px-8 py-3 bg-indigo-600 text-white font-bold rounded-full hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-opacity-75 transition-transform transform hover:scale-105 disabled:bg-slate-600 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  <SparklesIcon className="w-6 h-6" />
                  Restore Photo
                </button>
              )}
              {state.restoredImage && (
                 <a
                    href={state.restoredImage}
                    download="restored-photo.jpg"
                    className="px-8 py-3 bg-green-600 text-white font-bold rounded-full hover:bg-green-500 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-75 transition-transform transform hover:scale-105 flex items-center gap-2"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                    Download Restored Photo
                </a>
              )}
               <button
                  onClick={handleClear}
                  className="px-8 py-3 bg-slate-700 text-slate-300 font-bold rounded-full hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-opacity-75 transition-transform transform hover:scale-105"
                >
                  Start Over
                </button>
            </div>
          </div>
        )}
      </main>
      <footer className="w-full text-center p-4 mt-8 text-slate-500 text-sm">
        Powered by Gemini AI. Images are not stored.
      </footer>
    </div>
  );
}

export default App;
