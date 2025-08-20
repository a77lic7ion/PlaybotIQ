import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { DownloadIcon, LinkIcon } from './IconComponents';
import { Reference } from '../types';

interface GuideDisplayProps {
  guide: string;
  references: Reference[];
  isLoading: boolean;
  error: string | null;
  onExportPdf: () => void;
  guideContentRef: React.RefObject<HTMLDivElement>;
}

const LoadingSkeleton: React.FC = () => (
  <div className="space-y-4 animate-pulse p-6">
    <div className="h-4 bg-surface rounded w-3/4"></div>
    <div className="h-4 bg-surface rounded w-full"></div>
    <div className="h-4 bg-surface rounded w-full"></div>
    <div className="h-4 bg-surface rounded w-5/6"></div>
    <div className="mt-6 h-4 bg-surface rounded w-1/2"></div>
    <div className="h-4 bg-surface rounded w-full"></div>
    <div className="h-4 bg-surface rounded w-4/6"></div>
  </div>
);

const GuideDisplay: React.FC<GuideDisplayProps> = ({ guide, references, isLoading, error, onExportPdf, guideContentRef }) => {
  const canExport = guide && !isLoading;

  const renderContent = () => {
    if (isLoading && !guide) {
      return (
        <div>
          <h2 className="text-xl font-semibold mb-2 text-text-light">Generating Your Guide...</h2>
          <p className="text-text-muted mb-4">The AI is interfacing with the web. This might take a moment.</p>
          <LoadingSkeleton />
        </div>
      );
    }
  
    if (error) {
      return (
        <div className="bg-red-900/50 border border-red-500 p-6 rounded-lg text-red-300">
          <h3 className="font-bold text-lg uppercase tracking-wider">System Error</h3>
          <p className="font-mono mt-2 text-sm">{error}</p>
        </div>
      );
    }
  
    if (!guide && !isLoading) {
      return (
         <div className="h-full flex flex-col items-center justify-center text-center text-text-muted border-2 border-dashed border-border-color rounded-2xl p-12">
            <h3 className="text-xl font-medium">Awaiting Input...</h3>
            <p>Your generated guide will render here.</p>
         </div>
      );
    }

    return (
       <>
        <div ref={guideContentRef} className="p-6">
          <div className="prose prose-invert lg:prose-lg max-w-none">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {guide}
            </ReactMarkdown>
          </div>
          {references && references.length > 0 && (
            <div className="mt-8 pt-6 border-t border-border-color">
              <h3 className="text-xl font-semibold text-text-light mb-4 tracking-wide">References</h3>
              <ul className="space-y-3">
                {references.map((ref, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <LinkIcon className="w-4 h-4 mt-1 flex-shrink-0 text-text-muted" />
                    <a 
                      href={ref.uri} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-primary/90 hover:text-primary hover:underline break-all text-sm"
                    >
                      {ref.title || ref.uri}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </>
    )
  }

  const hasContent = guide || error || isLoading;

  return (
    <div className={`bg-surface-light/80 backdrop-blur-sm border border-border-color rounded-2xl h-full flex flex-col ${!hasContent ? 'p-0' : ''}`}>
      {hasContent && (
        <div className="flex justify-between items-center p-6 border-b border-border-color flex-shrink-0">
            <h2 className="text-xl font-bold text-text-light tracking-wide">Generated Guide</h2>
            <button
              onClick={onExportPdf}
              disabled={!canExport}
              className="flex items-center gap-2 border border-border-color bg-transparent hover:bg-border-color/50 text-text-light font-semibold py-2 px-4 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent transition-all duration-200"
              aria-label="Export guide to PDF"
            >
              <DownloadIcon className="w-5 h-5" />
              Export to PDF
            </button>
        </div>
      )}
      <div className="overflow-y-auto flex-grow">
        {renderContent()}
      </div>
    </div>
  );
};

export default GuideDisplay;