import React, { useState } from 'react';
import { CVData, Skill } from '../../types/cv.types';
import { Plus, Trash2, Sparkles, Loader2 } from 'lucide-react';
import apiService from '../../services/api.service';

interface SkillsFormProps {
  cvData: CVData;
  setCVData: React.Dispatch<React.SetStateAction<CVData>>;
}

const SkillsForm: React.FC<SkillsFormProps> = ({ cvData, setCVData }) => {
  const [jobTitle, setJobTitle] = useState('');
  const [industry, setIndustry] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const addSkill = () => {
    const newSkill: Skill = {
      id: Date.now().toString(),
      name: '',
      category: 'technical',
      level: 'intermediate'
    };
    setCVData(prev => ({
      ...prev,
      skills: [...prev.skills, newSkill]
    }));
  };

  const removeSkill = (id: string) => {
    setCVData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill.id !== id)
    }));
  };

  const updateSkill = (id: string, field: string, value: any) => {
    setCVData(prev => ({
      ...prev,
      skills: prev.skills.map(skill =>
        skill.id === id ? { ...skill, [field]: value } : skill
      )
    }));
  };

  const suggestSkills = async () => {
    if (!jobTitle || !industry) {
      alert('Please enter both job title and industry');
      return;
    }

    setIsLoading(true);
    try {
      const result = await apiService.suggestKeywords(jobTitle, industry);
      const newSkills: Skill[] = result.keywords.map(keyword => ({
        id: Date.now().toString() + Math.random(),
        name: keyword,
        category: 'technical',
        level: 'intermediate'
      }));
      setCVData(prev => ({
        ...prev,
        skills: [...prev.skills, ...newSkills]
      }));
    } catch (error) {
      console.error('Error suggesting skills:', error);
      alert('Failed to suggest skills. Please check your API key.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* AI Skill Suggestions */}
      <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
        <h3 className="text-sm font-semibold text-purple-900 mb-3">
          Get AI-Powered Skill Suggestions
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
          <input
            type="text"
            value={jobTitle}
            onChange={(e) => setJobTitle(e.target.value)}
            className="px-4 py-2 border border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-500"
            placeholder="Target Job Title (e.g., Software Engineer)"
          />
          <input
            type="text"
            value={industry}
            onChange={(e) => setIndustry(e.target.value)}
            className="px-4 py-2 border border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-500"
            placeholder="Industry (e.g., Technology)"
          />
        </div>
        <button
          onClick={suggestSkills}
          disabled={isLoading}
          className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
        >
          {isLoading ? (
            <>
              <Loader2 size={20} className="animate-spin" />
              <span>Generating Suggestions...</span>
            </>
          ) : (
            <>
              <Sparkles size={20} />
              <span>Suggest Skills</span>
            </>
          )}
        </button>
      </div>

      {/* Skills List */}
      <div className="space-y-4">
        {cvData.skills.map((skill, index) => (
          <div key={skill.id} className="p-4 border border-gray-200 rounded-lg bg-gray-50">
            <div className="flex items-start space-x-4">
              <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Skill Name *
                  </label>
                  <input
                    type="text"
                    value={skill.name}
                    onChange={(e) => updateSkill(skill.id, 'name', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="JavaScript, Leadership, etc."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <select
                    value={skill.category}
                    onChange={(e) => updateSkill(skill.id, 'category', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="technical">Technical</option>
                    <option value="soft">Soft Skills</option>
                    <option value="language">Language</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Proficiency Level
                  </label>
                  <select
                    value={skill.level}
                    onChange={(e) => updateSkill(skill.id, 'level', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                    <option value="expert">Expert</option>
                  </select>
                </div>
              </div>

              <button
                onClick={() => removeSkill(skill.id)}
                className="mt-8 p-2 text-red-600 hover:text-red-700"
              >
                <Trash2 size={20} />
              </button>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={addSkill}
        className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-500 hover:text-blue-600 transition-colors flex items-center justify-center space-x-2"
      >
        <Plus size={20} />
        <span>Add Skill</span>
      </button>
    </div>
  );
};

export default SkillsForm;
