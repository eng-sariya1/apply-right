import React, { useState } from 'react';
import { CVData, Experience } from '../../types/cv.types';
import apiService from '../../services/api.service';
import { Plus, Trash2, Sparkles, Loader2 } from 'lucide-react';

interface ExperienceFormProps {
  cvData: CVData;
  setCVData: React.Dispatch<React.SetStateAction<CVData>>;
}

const ExperienceForm: React.FC<ExperienceFormProps> = ({ cvData, setCVData }) => {
  const [enhancingIndex, setEnhancingIndex] = useState<number | null>(null);

  const addExperience = () => {
    const newExperience: Experience = {
      id: Date.now().toString(),
      company: '',
      position: '',
      location: '',
      startDate: '',
      endDate: '',
      current: false,
      description: '',
      achievements: ['']
    };
    setCVData(prev => ({
      ...prev,
      experience: [...prev.experience, newExperience]
    }));
  };

  const removeExperience = (id: string) => {
    setCVData(prev => ({
      ...prev,
      experience: prev.experience.filter(exp => exp.id !== id)
    }));
  };

  const updateExperience = (id: string, field: string, value: any) => {
    setCVData(prev => ({
      ...prev,
      experience: prev.experience.map(exp =>
        exp.id === id ? { ...exp, [field]: value } : exp
      )
    }));
  };

  const addAchievement = (expId: string) => {
    setCVData(prev => ({
      ...prev,
      experience: prev.experience.map(exp =>
        exp.id === expId ? { ...exp, achievements: [...exp.achievements, ''] } : exp
      )
    }));
  };

  const updateAchievement = (expId: string, index: number, value: string) => {
    setCVData(prev => ({
      ...prev,
      experience: prev.experience.map(exp =>
        exp.id === expId
          ? {
              ...exp,
              achievements: exp.achievements.map((ach, i) => (i === index ? value : ach))
            }
          : exp
      )
    }));
  };

  const removeAchievement = (expId: string, index: number) => {
    setCVData(prev => ({
      ...prev,
      experience: prev.experience.map(exp =>
        exp.id === expId
          ? {
              ...exp,
              achievements: exp.achievements.filter((_, i) => i !== index)
            }
          : exp
      )
    }));
  };

  const enhanceAchievement = async (expId: string, index: number, achievement: string) => {
    if (!achievement.trim()) return;
    
    setEnhancingIndex(index);
    try {
      const result = await apiService.enhanceAchievement(achievement);
      updateAchievement(expId, index, result.enhanced);
    } catch (error) {
      console.error('Error enhancing achievement:', error);
      alert('Failed to enhance achievement. Please check your API key.');
    } finally {
      setEnhancingIndex(null);
    }
  };

  return (
    <div className="space-y-6">
      {cvData.experience.map((exp, expIndex) => (
        <div key={exp.id} className="p-6 border border-gray-200 rounded-lg bg-gray-50">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Experience #{expIndex + 1}
            </h3>
            <button
              onClick={() => removeExperience(exp.id)}
              className="text-red-600 hover:text-red-700"
            >
              <Trash2 size={20} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Company *
              </label>
              <input
                type="text"
                value={exp.company}
                onChange={(e) => updateExperience(exp.id, 'company', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Company Name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Position *
              </label>
              <input
                type="text"
                value={exp.position}
                onChange={(e) => updateExperience(exp.id, 'position', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Job Title"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location
              </label>
              <input
                type="text"
                value={exp.location}
                onChange={(e) => updateExperience(exp.id, 'location', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="City, State"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Start Date
                </label>
                <input
                  type="month"
                  value={exp.startDate}
                  onChange={(e) => updateExperience(exp.id, 'startDate', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  End Date
                </label>
                <input
                  type="month"
                  value={exp.endDate}
                  onChange={(e) => updateExperience(exp.id, 'endDate', e.target.value)}
                  disabled={exp.current}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                />
              </div>
            </div>
          </div>

          <div className="mb-4">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={exp.current}
                onChange={(e) => updateExperience(exp.id, 'current', e.target.checked)}
                className="rounded text-blue-600"
              />
              <span className="text-sm text-gray-700">I currently work here</span>
            </label>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={exp.description}
              onChange={(e) => updateExperience(exp.id, 'description', e.target.value)}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Brief description of your role and responsibilities..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Key Achievements
            </label>
            {exp.achievements.map((achievement, achIndex) => (
              <div key={achIndex} className="flex items-start space-x-2 mb-2">
                <textarea
                  value={achievement}
                  onChange={(e) => updateAchievement(exp.id, achIndex, e.target.value)}
                  rows={2}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Describe a key achievement with quantifiable results..."
                />
                <button
                  onClick={() => enhanceAchievement(exp.id, achIndex, achievement)}
                  disabled={enhancingIndex === achIndex}
                  className="p-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
                  title="Enhance with AI"
                >
                  {enhancingIndex === achIndex ? (
                    <Loader2 size={20} className="animate-spin" />
                  ) : (
                    <Sparkles size={20} />
                  )}
                </button>
                <button
                  onClick={() => removeAchievement(exp.id, achIndex)}
                  className="p-2 text-red-600 hover:text-red-700"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            ))}
            <button
              onClick={() => addAchievement(exp.id)}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              + Add Achievement
            </button>
          </div>
        </div>
      ))}

      <button
        onClick={addExperience}
        className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-500 hover:text-blue-600 transition-colors flex items-center justify-center space-x-2"
      >
        <Plus size={20} />
        <span>Add Experience</span>
      </button>
    </div>
  );
};

export default ExperienceForm;
