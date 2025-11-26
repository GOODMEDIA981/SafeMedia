import React from 'react';
import { MediaAnalysis } from '../types';

interface AnalysisResultProps {
  data: MediaAnalysis;
}

export const AnalysisResult: React.FC<AnalysisResultProps> = ({ data }) => {
  
  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'low': return 'bg-green-500/20 text-green-200 border-green-500/30';
      case 'medium': return 'bg-yellow-500/20 text-yellow-200 border-yellow-500/30';
      case 'high': return 'bg-orange-500/20 text-orange-200 border-orange-500/30';
      case 'extreme': return 'bg-red-500/20 text-red-200 border-red-500/30';
      default: return 'bg-navy-700 text-white';
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8 animate-fade-in pb-24">
      {/* Header Section */}
      <div className="bg-navy-800 rounded-2xl p-6 border border-navy-600 shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold text-white tracking-tight">{data.title}</h2>
            <span className="inline-block mt-2 px-3 py-1 rounded-full bg-navy-700 text-sm text-navy-200 font-medium border border-navy-600">
              {data.mediaType}
            </span>
          </div>
          <div className="flex gap-4 flex-wrap">
             <div className="text-center px-4 py-2 bg-navy-900 rounded-lg border border-navy-700 min-w-[80px]">
                <div className="text-xs text-navy-400 uppercase tracking-wider">Age</div>
                <div className="text-xl font-bold text-white">{data.ratings.suggestedAge}</div>
             </div>
             <div className="text-center px-4 py-2 bg-navy-900 rounded-lg border border-navy-700 min-w-[80px]">
                <div className="text-xs text-navy-400 uppercase tracking-wider">Origin ({data.ratings.originCountry})</div>
                <div className="text-xl font-bold text-white">{data.ratings.originRating}</div>
             </div>
             <div className="text-center px-4 py-2 bg-navy-900 rounded-lg border border-navy-700 min-w-[80px]">
                <div className="text-xs text-navy-400 uppercase tracking-wider">US Equiv</div>
                <div className="text-xl font-bold text-white">{data.ratings.usMpaRating}</div>
             </div>
          </div>
        </div>
        <p className="mt-4 text-navy-200 leading-relaxed">
          {data.ratings.explanation}
        </p>
      </div>

      {/* Content Warnings Section */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-white flex items-center gap-2">
          <span className="w-1 h-6 bg-red-500 rounded-full"></span>
          Content Warnings
        </h3>
        <div className="grid gap-4 md:grid-cols-1">
          {data.contentWarnings.map((warning, idx) => (
            <div key={idx} className="bg-navy-800 rounded-xl overflow-hidden border border-navy-700">
              <div className={`px-6 py-3 flex justify-between items-center border-b border-navy-700 ${getSeverityColor(warning.severity)} bg-opacity-10`}>
                <span className="font-bold text-lg">{warning.category}</span>
                <span className="text-xs font-bold uppercase px-2 py-1 rounded bg-black/20">
                  {warning.severity}
                </span>
              </div>
              <div className="p-6 space-y-4">
                <p className="text-navy-100">{warning.details}</p>
                {warning.specificScenes.length > 0 && (
                  <div className="bg-navy-900/50 rounded-lg p-4 border border-navy-700/50">
                    <span className="text-xs font-bold text-navy-400 uppercase tracking-wider block mb-2">Specific Scenes</span>
                    <ul className="list-disc list-inside space-y-1">
                      {warning.specificScenes.map((scene, sIdx) => (
                        <li key={sIdx} className="text-sm text-navy-200">{scene}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Controversies Section */}
      {data.controversies.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-white flex items-center gap-2">
            <span className="w-1 h-6 bg-yellow-500 rounded-full"></span>
            Controversies
          </h3>
          <div className="bg-navy-800 rounded-xl p-6 border border-navy-600">
            <ul className="space-y-3">
              {data.controversies.map((item, idx) => (
                <li key={idx} className="flex gap-3 items-start text-navy-200">
                  <span className="mt-1.5 w-1.5 h-1.5 bg-yellow-500 rounded-full flex-shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Assessment Section */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-white flex items-center gap-2">
          <span className="w-1 h-6 bg-blue-500 rounded-full"></span>
          Overall Assessment
        </h3>
        <div className="bg-gradient-to-br from-navy-800 to-navy-900 rounded-xl p-8 border border-navy-600 shadow-lg">
          <p className="text-lg leading-relaxed text-white">
            {data.overallAssessment}
          </p>
          <div className="mt-6 flex items-center justify-end">
            <span className="text-sm text-navy-400 font-medium flex items-center gap-2">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
              Generated by SAFEMEDIA AI
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};