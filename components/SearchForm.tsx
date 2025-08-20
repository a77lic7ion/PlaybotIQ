import React from 'react';
import { GuideType, Platform } from '../types';
import { GUIDE_OPTIONS, PLATFORM_OPTIONS } from '../constants';
import { WandIcon } from './IconComponents';

interface SearchFormProps {
  gameName: string;
  setGameName: (name: string) => void;
  guideType: GuideType;
  setGuideType: (type: GuideType) => void;
  platform: Platform;
  setPlatform: (platform: Platform) => void;
  onGenerate: () => void;
  isLoading: boolean;
}

const SearchForm: React.FC<SearchFormProps> = ({
  gameName,
  setGameName,
  guideType,
  setGuideType,
  platform,
  setPlatform,
  onGenerate,
  isLoading,
}) => {
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onGenerate();
  };
  
  const inputStyles = "w-full bg-[#1F1F31] border border-border-color rounded-lg py-2.5 px-4 text-text-light placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary/50 transition duration-300";

  return (
    <div className="bg-surface-light/80 backdrop-blur-sm border border-border-color p-6 rounded-2xl h-full flex flex-col">
      <h2 className="text-xl font-bold text-text-light mb-6">Create Your Game Guide</h2>
       <p className="text-text-muted mb-6 text-sm">
        Your AI-powered companion for any game. Instantly generate detailed walkthroughs, levelling guides, and more.
      </p>
      <form onSubmit={handleFormSubmit} className="space-y-6 flex-grow flex flex-col">
        <div className="space-y-4">
          <div>
            <label htmlFor="gameName" className="block text-xs font-medium text-text-muted mb-2 uppercase tracking-wider">
              Game Name
            </label>
            <input
              id="gameName"
              type="text"
              value={gameName}
              onChange={(e) => setGameName(e.target.value)}
              placeholder="e.g., Cyberpunk 2077"
              className={inputStyles}
              required
            />
          </div>
          <div>
            <label htmlFor="platform" className="block text-xs font-medium text-text-muted mb-2 uppercase tracking-wider">
              Platform
            </label>
            <select
              id="platform"
              value={platform}
              onChange={(e) => setPlatform(e.target.value as Platform)}
              className={inputStyles}
            >
              {PLATFORM_OPTIONS.map((option) => (
                <option key={option.value} value={option.value} className="bg-dark-bg text-text-light">
                  {option.label}
                </option>
              ))}
            </select>
          </div>
           <div>
            <label className="block text-xs font-medium text-text-muted mb-2 uppercase tracking-wider">
              Guide Type
            </label>
            <div className="grid grid-cols-2 gap-3" role="radiogroup">
              {GUIDE_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  role="radio"
                  aria-checked={guideType === option.value}
                  onClick={() => setGuideType(option.value)}
                  className={`flex flex-col items-center justify-center p-3 rounded-lg border-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/50 ${
                    guideType === option.value
                      ? 'bg-primary/20 border-primary text-primary'
                      : 'bg-[#1F1F31] border-border-color text-text-muted hover:border-primary/50 hover:text-text-light'
                  }`}
                >
                  <option.icon className="w-6 h-6 mb-1.5" />
                  <span className="text-sm font-medium">{option.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-auto pt-6">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary-hover text-white font-bold py-3 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-surface-light focus:ring-primary transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-primary-glow"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Generating...
              </>
            ) : (
              <>
                <WandIcon className="w-5 h-5" />
                Generate Guide
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SearchForm;