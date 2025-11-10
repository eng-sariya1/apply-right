import React from 'react';
import { CVData, Project } from '../../types/cv.types';
import { Plus, Trash2, X } from 'lucide-react';

interface ProjectsFormProps {
  cvData: CVData;
  setCVData: React.Dispatch<React.SetStateAction<CVData>>;
}

const ProjectsForm: React.FC<ProjectsFormProps> = ({ cvData, setCVData }) => {
  const addProject = () => {
    const newProject: Project = {
      id: Date.now().toString(),
      name: '',
      description: '',
      technologies: [],
      link: '',
      startDate: '',
      endDate: ''
    };
    setCVData(prev => ({
      ...prev,
      projects: [...prev.projects, newProject]
    }));
  };

  const removeProject = (id: string) => {
    setCVData(prev => ({
      ...prev,
      projects: prev.projects.filter(proj => proj.id !== id)
    }));
  };

  const updateProject = (id: string, field: string, value: any) => {
    setCVData(prev => ({
      ...prev,
      projects: prev.projects.map(proj =>
        proj.id === id ? { ...proj, [field]: value } : proj
      )
    }));
  };

  const addTechnology = (projId: string, tech: string) => {
    if (!tech.trim()) return;
    setCVData(prev => ({
      ...prev,
      projects: prev.projects.map(proj =>
        proj.id === projId
          ? { ...proj, technologies: [...proj.technologies, tech.trim()] }
          : proj
      )
    }));
  };

  const removeTechnology = (projId: string, techIndex: number) => {
    setCVData(prev => ({
      ...prev,
      projects: prev.projects.map(proj =>
        proj.id === projId
          ? {
              ...proj,
              technologies: proj.technologies.filter((_, i) => i !== techIndex)
            }
          : proj
      )
    }));
  };

  return (
    <div className="space-y-6">
      {cvData.projects.length === 0 && (
        <p className="text-gray-500 text-center py-8">
          No projects added yet. Click "Add Project" to showcase your work.
        </p>
      )}

      {cvData.projects.map((project, index) => (
        <div key={project.id} className="p-6 border border-gray-200 rounded-lg bg-gray-50">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Project #{index + 1}
            </h3>
            <button
              onClick={() => removeProject(project.id)}
              className="text-red-600 hover:text-red-700"
            >
              <Trash2 size={20} />
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Project Name *
              </label>
              <input
                type="text"
                value={project.name}
                onChange={(e) => updateProject(project.id, 'name', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="E-commerce Platform"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                value={project.description}
                onChange={(e) => updateProject(project.id, 'description', e.target.value)}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Describe the project, your role, and key achievements..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Technologies Used
              </label>
              <div className="flex flex-wrap gap-2 mb-2">
                {project.technologies.map((tech, techIndex) => (
                  <span
                    key={techIndex}
                    className="inline-flex items-center space-x-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                  >
                    <span>{tech}</span>
                    <button
                      onClick={() => removeTechnology(project.id, techIndex)}
                      className="hover:text-blue-900"
                    >
                      <X size={14} />
                    </button>
                  </span>
                ))}
              </div>
              <input
                type="text"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addTechnology(project.id, e.currentTarget.value);
                    e.currentTarget.value = '';
                  }
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Type a technology and press Enter"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Project Link (Optional)
                </label>
                <input
                  type="url"
                  value={project.link || ''}
                  onChange={(e) => updateProject(project.id, 'link', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="https://github.com/..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Start Date
                </label>
                <input
                  type="month"
                  value={project.startDate}
                  onChange={(e) => updateProject(project.id, 'startDate', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  End Date
                </label>
                <input
                  type="month"
                  value={project.endDate}
                  onChange={(e) => updateProject(project.id, 'endDate', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        </div>
      ))}

      <button
        onClick={addProject}
        className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-500 hover:text-blue-600 transition-colors flex items-center justify-center space-x-2"
      >
        <Plus size={20} />
        <span>Add Project</span>
      </button>
    </div>
  );
};

export default ProjectsForm;
