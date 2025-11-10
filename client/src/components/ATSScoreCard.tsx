import React from 'react';
import { ATSScore } from '../types/cv.types';
import { TrendingUp, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';

interface ATSScoreCardProps {
  score: ATSScore;
  isAnalyzing: boolean;
}

const ATSScoreCard: React.FC<ATSScoreCardProps> = ({ score, isAnalyzing }) => {
  const getScoreColor = (value: number) => {
    if (value >= 80) return 'text-green-600';
    if (value >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBgColor = (value: number) => {
    if (value >= 80) return 'bg-green-100';
    if (value >= 60) return 'bg-yellow-100';
    return 'bg-red-100';
  };

  const getScoreLabel = (value: number) => {
    if (value >= 80) return 'Excellent';
    if (value >= 60) return 'Good';
    if (value >= 40) return 'Fair';
    return 'Needs Improvement';
  };

  if (isAnalyzing) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-center space-x-2 py-8">
          <Loader2 className="animate-spin text-blue-600" size={24} />
          <span className="text-gray-600">Analyzing ATS compatibility...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-gray-900">ATS Score</h3>
        <TrendingUp className="text-blue-600" size={24} />
      </div>

      {/* Overall Score */}
      <div className={`${getScoreBgColor(score.overall)} rounded-lg p-6 mb-6 text-center`}>
        <div className={`text-5xl font-bold ${getScoreColor(score.overall)} mb-2`}>
          {score.overall}
        </div>
        <div className="text-sm font-medium text-gray-700">
          {getScoreLabel(score.overall)}
        </div>
      </div>

      {/* Score Breakdown */}
      <div className="space-y-3 mb-6">
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-700">Keyword Match</span>
            <span className={`font-semibold ${getScoreColor(score.keywordMatch)}`}>
              {score.keywordMatch}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full ${
                score.keywordMatch >= 80
                  ? 'bg-green-500'
                  : score.keywordMatch >= 60
                  ? 'bg-yellow-500'
                  : 'bg-red-500'
              }`}
              style={{ width: `${score.keywordMatch}%` }}
            />
          </div>
        </div>

        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-700">Format Compatibility</span>
            <span className={`font-semibold ${getScoreColor(score.formatCompatibility)}`}>
              {score.formatCompatibility}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full ${
                score.formatCompatibility >= 80
                  ? 'bg-green-500'
                  : score.formatCompatibility >= 60
                  ? 'bg-yellow-500'
                  : 'bg-red-500'
              }`}
              style={{ width: `${score.formatCompatibility}%` }}
            />
          </div>
        </div>

        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-700">Section Completeness</span>
            <span className={`font-semibold ${getScoreColor(score.sectionCompleteness)}`}>
              {score.sectionCompleteness}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full ${
                score.sectionCompleteness >= 80
                  ? 'bg-green-500'
                  : score.sectionCompleteness >= 60
                  ? 'bg-yellow-500'
                  : 'bg-red-500'
              }`}
              style={{ width: `${score.sectionCompleteness}%` }}
            />
          </div>
        </div>

        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-700">Contact Info</span>
            <span className={`font-semibold ${getScoreColor(score.contactInfo)}`}>
              {score.contactInfo}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full ${
                score.contactInfo >= 80
                  ? 'bg-green-500'
                  : score.contactInfo >= 60
                  ? 'bg-yellow-500'
                  : 'bg-red-500'
              }`}
              style={{ width: `${score.contactInfo}%` }}
            />
          </div>
        </div>
      </div>

      {/* Strengths */}
      {score.strengths.length > 0 && (
        <div className="mb-4">
          <h4 className="text-sm font-semibold text-gray-900 mb-2 flex items-center">
            <CheckCircle size={16} className="text-green-600 mr-2" />
            Strengths
          </h4>
          <ul className="space-y-1">
            {score.strengths.slice(0, 3).map((strength, index) => (
              <li key={index} className="text-xs text-gray-700 flex items-start">
                <span className="text-green-600 mr-2">✓</span>
                <span>{strength}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Suggestions */}
      {score.suggestions.length > 0 && (
        <div>
          <h4 className="text-sm font-semibold text-gray-900 mb-2 flex items-center">
            <AlertCircle size={16} className="text-yellow-600 mr-2" />
            Suggestions
          </h4>
          <ul className="space-y-1">
            {score.suggestions.slice(0, 3).map((suggestion, index) => (
              <li key={index} className="text-xs text-gray-700 flex items-start">
                <span className="text-yellow-600 mr-2">•</span>
                <span>{suggestion}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ATSScoreCard;
