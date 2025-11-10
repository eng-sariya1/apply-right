import React from 'react';
import { CVData, Education } from '../../types/cv.types';
import { Plus, Trash2 } from 'lucide-react';

interface EducationFormProps {
  cvData: CVData;
  setCVData: React.Dispatch<React.SetStateAction<CVData>>;
}

const EducationForm: React.FC<EducationFormProps> = ({ cvData, setCVData }) => {
  const addEducation = () => {
    const newEducation: Education = {
      id: Date.now().toString(),
      institution: '',
      degree: '',
      field: '',
      location: '',
      startDate: '',
      endDate: '',
      gpa: '',
      achievements: ['']
    };
    setCVData(prev => ({
      ...prev,
      education: [...prev.education, newEducation]
    }));
  };

  const removeEducation = (id: string) => {
    setCVData(prev => ({
      ...prev,
      education: prev.education.filter(edu => edu.id !== id)
    }));
  };

  const updateEducation = (id: string, field: string, value: any) => {
    setCVData(prev => ({
      ...prev,
      education: prev.education.map(edu =>
        edu.id === id ? { ...edu, [field]: value } : edu
      )
    }));
  };

  const updateAchievement = (eduId: string, index: number, value: string) => {
    setCVData(prev => ({
      ...prev,
      education: prev.education.map(edu =>
        edu.id === eduId
          ? {
              ...edu,
              achievements: edu.achievements.map((ach, i) => (i === index ? value : ach))
            }
          : edu
      )
    }));
  };

  const addAchievement = (eduId: string) => {
    setCVData(prev => ({
      ...prev,
      education: prev.education.map(edu =>
        edu.id === eduId ? { ...edu, achievements: [...edu.achievements, ''] } : edu
      )
    }));
  };

  const removeAchievement = (eduId: string, index: number) => {
    setCVData(prev => ({
      ...prev,
      education: prev.education.map(edu =>
        edu.id === eduId
          ? {
              ...edu,
              achievements: edu.achievements.filter((_, i) => i !== index)
            }
          : edu
      )
    }));
  };

  return (
    <div className="space-y-6">
      {cvData.education.map((edu, eduIndex) => (
        <div key={edu.id} className="p-6 border border-gray-200 rounded-lg bg-gray-50">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Education #{eduIndex + 1}
            </h3>
            <button
              onClick={() => removeEducation(edu.id)}
              className="text-red-600 hover:text-red-700"
            >
              <Trash2 size={20} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Institution *
              </label>
              <input
                type="text"
                value={edu.institution}
                onChange={(e) => updateEducation(edu.id, 'institution', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="University Name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Degree *
              </label>
              <input
                type="text"
                value={edu.degree}
                onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Bachelor of Science"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Field of Study *
              </label>
              <input
                type="text"
                value={edu.field}
                onChange={(e) => updateEducation(edu.id, 'field', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Computer Science"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location
              </label>
              <input
                type="text"
                value={edu.location}
                onChange={(e) => updateEducation(edu.id, 'location', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="City, State"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Start Date
              </label>
              <input
                type="month"
                value={edu.startDate}
                onChange={(e) => updateEducation(edu.id, 'startDate', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                End Date
              </label>
              <input
                type="month"
                value={edu.endDate}
                onChange={(e) => updateEducation(edu.id, 'endDate', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                GPA (Optional)
              </label>
              <input
                type="text"
                value={edu.gpa || ''}
                onChange={(e) => updateEducation(edu.id, 'gpa', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="3.8/4.0"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Achievements / Honors
            </label>
            {edu.achievements.map((achievement, achIndex) => (
              <div key={achIndex} className="flex items-center space-x-2 mb-2">
                <input
                  type="text"
                  value={achievement}
                  onChange={(e) => updateAchievement(edu.id, achIndex, e.target.value)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Dean's List, Honors, Awards..."
                />
                <button
                  onClick={() => removeAchievement(edu.id, achIndex)}
                  className="p-2 text-red-600 hover:text-red-700"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            ))}
            <button
              onClick={() => addAchievement(edu.id)}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              + Add Achievement
            </button>
          </div>
        </div>
      ))}

      <button
        onClick={addEducation}
        className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-500 hover:text-blue-600 transition-colors flex items-center justify-center space-x-2"
      >
        <Plus size={20} />
        <span>Add Education</span>
      </button>
    </div>
  );
};

export default EducationForm;
