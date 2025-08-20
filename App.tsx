import React, { useState, useCallback, useRef, useEffect } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { GuideType, Platform, Reference, HistoryItem } from './types';
import { generateGameGuide } from './services/geminiService';
import Header from './components/Header';
import SearchForm from './components/SearchForm';
import GuideDisplay from './components/GuideDisplay';
import Footer from './components/Footer';
import History from './components/History';

const App: React.FC = () => {
  const [gameName, setGameName] = useState<string>('');
  const [guideType, setGuideType] = useState<GuideType>(GuideType.Walkthrough);
  const [platform, setPlatform] = useState<Platform>(Platform.PC);
  const [generatedGuide, setGeneratedGuide] = useState<string>('');
  const [references, setReferences] = useState<Reference[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isHistoryLoading, setIsHistoryLoading] = useState<boolean>(true);
  const guideContentRef = useRef<HTMLDivElement>(null);

  const fetchHistory = useCallback(async () => {
    setIsHistoryLoading(true);
    try {
      const response = await fetch('/api/get-history');
      if (!response.ok) {
        throw new Error('Failed to fetch history');
      }
      const data = await response.json();
      setHistory(data);
    } catch (err) {
      console.error('Error fetching history:', err);
      // Do not show a UI error for this, just log it.
    } finally {
      setIsHistoryLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  const saveHistory = useCallback(async (guide: string) => {
    try {
      await fetch('/api/save-history', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ gameName, guideType, platform, guide }),
      });
      // Refresh history list after saving
      await fetchHistory();
    } catch (err) {
      console.error('Error saving history:', err);
      // Fail silently, not a critical path for the user
    }
  }, [gameName, guideType, platform, fetchHistory]);


  const handleGenerate = useCallback(async () => {
    if (!gameName.trim()) {
      setError('Please enter a game name.');
      return;
    }

    setIsLoading(true);
    setGeneratedGuide('');
    setReferences([]);
    setError(null);

    try {
      const response = await generateGameGuide(gameName, guideType, platform);
      setGeneratedGuide(response.guide);
      setReferences(response.references);
      // Save to history on success
      await saveHistory(response.guide);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  }, [gameName, guideType, platform, saveHistory]);

  const handleExportPdf = useCallback(async () => {
    const content = guideContentRef.current;
    if (!content) {
      setError("Could not find content to export.");
      return;
    }

    try {
        const canvas = await html2canvas(content, {
            scale: 2,
            backgroundColor: '#262634' // surface-light color
        });
        const imgData = canvas.toDataURL('image/png');
        
        const pdf = new jsPDF({
            orientation: 'p',
            unit: 'px',
            format: [canvas.width, canvas.height]
        });

        pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
        pdf.save(`playbotiq-guide-${gameName.toLowerCase().replace(/\s/g, '-')}.pdf`);

    } catch (err) {
        console.error("Failed to generate PDF:", err);
        setError(err instanceof Error ? err.message : 'An unknown error occurred while exporting to PDF.');
    }
  }, [gameName]);

  return (
    <div className="min-h-screen bg-dark-bg text-text-light font-sans flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-7xl bg-surface backdrop-blur-2xl border border-border-color rounded-3xl shadow-2xl flex flex-col h-[95vh]">
        <Header />
        <main className="flex-grow p-6 lg:p-8 overflow-y-auto">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 h-full">
            <div className="lg:col-span-2 flex flex-col">
              <SearchForm
                gameName={gameName}
                setGameName={setGameName}
                guideType={guideType}
                setGuideType={setGuideType}
                platform={platform}
                setPlatform={setPlatform}
                onGenerate={handleGenerate}
                isLoading={isLoading}
              />
              <History history={history} isLoading={isHistoryLoading} />
            </div>
            <div className="lg:col-span-3">
              <GuideDisplay
                guide={generatedGuide}
                references={references}
                isLoading={isLoading}
                error={error}
                onExportPdf={handleExportPdf}
                guideContentRef={guideContentRef}
              />
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default App;