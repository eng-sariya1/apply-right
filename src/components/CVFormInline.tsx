
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Chips } from 'primereact/chips';
import { Dropdown } from 'primereact/dropdown';
import { Checkbox } from 'primereact/checkbox';
import { Accordion, AccordionTab } from 'primereact/accordion';
import { ColorPicker } from 'primereact/colorpicker';
import { Sparkles, Plus, Trash2, Zap } from 'lucide-react';
import type { CVData } from '../types/cv.types';
import { useGemini } from '../hooks/useGemini';
import { useGeminiCareer } from '../hooks/useGeminiCareer';
import { useGeminiProjects } from '../hooks/useGeminiProjects';
import { useGeminiEducation } from '../hooks/useGeminiEducation';
import { useGeminiATS } from '../hooks/useGeminiATS';
import {useNavigate} from "react-router-dom";

interface CVFormInlineProps {
  onSubmit: (data: CVData) => void;
  initialData?: CVData;
}

const jobTypeOptions = [
  { label: 'Full time', value: 'Full time' },
  { label: 'Part time', value: 'Part time' },
  { label: 'Contract', value: 'Contract' },
  { label: 'Freelance', value: 'Freelance' }
];

export default function CVFormInline({ onSubmit, initialData }: CVFormInlineProps) {
  const defaultValues: CVData = initialData || {
    header: {
      fullName: '',
      specialization: '',
      email: '',
      phone: '',
      links: []
    },
    abstract: '',
    skills: [],
    career: [],
    personalProjects: [],
    education: '',
    sectionTitleColor: '017A8C'
  };
const navigate = useNavigate();
  const { control, watch, setValue } = useForm<CVData>({
    defaultValues
  });

  const { improveText, isLoading } = useGemini();
  const { improveText: improveEducationText, isLoading: isEducationLoading } = useGeminiEducation();
  const { analyzeAndOptimizeCV, isLoading: isATSLoading } = useGeminiATS();

  // Update CV in real-time
  useEffect(() => {
    const subscription = watch((data) => {
      onSubmit(data as CVData);
    });
    return () => subscription.unsubscribe();
  }, [watch, onSubmit]);

  const { fields: linkFields, append: appendLink, remove: removeLink } = useFieldArray({
    control,
    name: 'header.links'
  });

  const { fields: careerFields, append: appendCareer, remove: removeCareer } = useFieldArray({
    control,
    name: 'career'
  });

  const { fields: personalProjectFields, append: appendPersonalProject, remove: removePersonalProject } = useFieldArray({
    control,
    name: 'personalProjects'
  });

  const handleImproveAbstract = async () => {
    const currentAbstract = watch('abstract');
    if (!currentAbstract?.trim()) return;

    try {
      const improvedText = await improveText(currentAbstract);
      setValue('abstract', improvedText, { shouldValidate: true });
    } catch (error) {
      console.error('Failed to improve abstract:', error);
    }
  };

  const handleImproveEducation = async () => {
    const currentEducation = watch('education');
    if (!currentEducation?.trim()) return;

    try {
      const improvedText = await improveEducationText(currentEducation);
      setValue('education', improvedText, { shouldValidate: true });
    } catch (error) {
      console.error('Failed to improve education:', error);
    }
  };

  const handleATSOptimization = async () => {
    const currentData = watch();

    // Check if there's enough data to optimize
    if (!currentData.header?.fullName || !currentData.abstract?.trim()) {
      console.error('Please fill in at least your name and abstract before ATS optimization');
      return;
    }

    try {
      const optimizedCV = await analyzeAndOptimizeCV(currentData as CVData);

      // Update all form fields with optimized data
      Object.keys(optimizedCV).forEach((key) => {
        setValue(key as any, (optimizedCV as any)[key], { shouldValidate: true });
      });
    } catch (error) {
      console.error('Failed to optimize CV for ATS:', error);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* ATS Optimization Button - Prominent at top */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-gradient-to-r from-[#017A8C]/10 via-[#019baf]/5 to-transparent p-4 rounded-xl border border-[#017A8C]/30"
      >
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-[#017A8C] to-[#019baf] rounded-lg flex items-center justify-center">
            <Zap className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-base font-bold text-[#017A8C] mb-1">ATS Optimization</h3>
            <p className="text-sm text-[#88B7C4] mb-3">
              Let AI optimize your entire CV for Applicant Tracking Systems to increase your chances of getting interviews.
            </p>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="button"
              onClick={()=>{navigate("/ats")}}
              disabled={!watch('header.fullName') || !watch('abstract')?.trim() || isATSLoading}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#017A8C] to-[#019baf] text-white font-semibold rounded-lg hover:from-[#015C6A] hover:to-[#017A8C] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
            >
              <Zap className="w-4 h-4" />
              {isATSLoading ? 'Optimizing...' : 'Optimize My CV for ATS'}
            </motion.button>
            {(!watch('header.fullName') || !watch('abstract')?.trim()) && (
              <p className="text-xs text-[#88B7C4] mt-2 italic">
                * Fill in your name and abstract first to enable ATS optimization
              </p>
            )}
          </div>
        </div>
      </motion.div>

      {/* Personal Information */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h3 className="text-lg font-bold text-[#017A8C] mb-4">Personal Information</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block mb-2 text-sm font-medium text-[#5A6A6F]">Full Name *</label>
            <Controller
              name="header.fullName"
              control={control}
              render={({ field }) => (
                <InputText
                  {...field}
                  className="w-full p-3 border border-[#C6DEE4] rounded-lg focus:border-[#017A8C] focus:ring-2 focus:ring-[#017A8C]/30 transition-all"
                  placeholder="John Doe"
                  data-cy="fullName-input"
                />
              )}
            />
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-[#5A6A6F]">Specialization *</label>
            <Controller
              name="header.specialization"
              control={control}
              render={({ field }) => (
                <InputText
                  {...field}
                  className="w-full p-3 border border-[#C6DEE4] rounded-lg focus:border-[#017A8C] focus:ring-2 focus:ring-[#017A8C]/30 transition-all"
                  placeholder="Software Engineer"
                  data-cy="specialization-input"
                />
              )}
            />
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-[#5A6A6F]">Email *</label>
            <Controller
              name="header.email"
              control={control}
              render={({ field }) => (
                <InputText
                  {...field}
                  type="email"
                  className="w-full p-3 border border-[#C6DEE4] rounded-lg focus:border-[#017A8C] focus:ring-2 focus:ring-[#017A8C]/30 transition-all"
                  placeholder="john.doe@example.com"
                  data-cy="email-input"
                />
              )}
            />
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-[#5A6A6F]">Phone Number *</label>
            <Controller
              name="header.phone"
              control={control}
              render={({ field }) => (
                <InputText
                  {...field}
                  className="w-full p-3 border border-[#C6DEE4] rounded-lg focus:border-[#017A8C] focus:ring-2 focus:ring-[#017A8C]/30 transition-all"
                  placeholder="+1234567890"
                  data-cy="phone-input"
                />
              )}
            />
          </div>
        </div>

        {/* Links */}
        <div className="mt-6">
          <div className="flex justify-between items-center mb-3">
            <label className="text-sm font-medium text-[#5A6A6F]">Links</label>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="button"
              onClick={() => appendLink({ name: '', url: '' })}
              className="flex items-center gap-2 px-3 py-1.5 bg-[#017A8C] text-white text-sm font-semibold rounded-lg hover:bg-[#015C6A] transition-all"
              data-cy="add-link-button"
            >
              <Plus className="w-4 h-4" />
              Add Link
            </motion.button>
          </div>

          <div className="space-y-3">
            {linkFields.map((field, index) => (
              <div key={field.id} className="flex gap-2 p-3 bg-[#FAF7F0] rounded-lg border border-[#C6DEE4]/30">
                <div className="flex-1 space-y-2">
                  <Controller
                    name={`header.links.${index}.name`}
                    control={control}
                    render={({ field }) => (
                      <InputText
                        {...field}
                        className="w-full p-2 border border-[#C6DEE4] rounded-lg focus:border-[#017A8C] focus:ring-2 focus:ring-[#017A8C]/30 transition-all"
                        placeholder="Link Name (e.g., LinkedIn)"
                        data-cy={`link-name-input-${index}`}
                      />
                    )}
                  />
                  <Controller
                    name={`header.links.${index}.url`}
                    control={control}
                    render={({ field }) => (
                      <InputText
                        {...field}
                        className="w-full p-2 border border-[#C6DEE4] rounded-lg focus:border-[#017A8C] focus:ring-2 focus:ring-[#017A8C]/30 transition-all"
                        placeholder="https://..."
                        data-cy={`link-url-input-${index}`}
                      />
                    )}
                  />
                </div>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  type="button"
                  onClick={() => removeLink(index)}
                  className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                </motion.button>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Theme Color */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="pt-6 border-t border-[#C6DEE4]/30"
      >
        <h3 className="text-lg font-bold text-[#017A8C] mb-4">Theme Color</h3>
        <div className="flex items-center gap-4">
          <Controller
            name="sectionTitleColor"
            control={control}
            render={({ field }) => (
              <>
                <ColorPicker
                  value={field.value || '017A8C'}
                  onChange={(e) => field.onChange(e.value)}
                  format="hex"
                />
                <div
                  className="flex-1 h-12 rounded-lg border-2 border-[#C6DEE4] transition-all duration-300 flex items-center justify-center"
                  style={{ backgroundColor: `#${field.value || '017A8C'}` }}
                >
                  <span className="text-white font-semibold text-sm">
                    #{field.value || '017A8C'}
                  </span>
                </div>
              </>
            )}
          />
        </div>
      </motion.div>

      {/* Abstract */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="pt-6 border-t border-[#C6DEE4]/30"
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-[#017A8C]">Abstract</h3>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="button"
            onClick={handleImproveAbstract}
            disabled={!watch('abstract')?.trim() || isLoading}
            className="flex items-center gap-2 px-3 py-1.5 bg-white border border-[#017A8C]/30 text-[#017A8C] text-sm font-semibold rounded-lg hover:bg-[#017A8C] hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Sparkles className="w-4 h-4" />
            {isLoading ? 'Improving...' : 'Improve with AI'}
          </motion.button>
        </div>
        <Controller
          name="abstract"
          control={control}
          render={({ field }) => (
            <InputTextarea
              {...field}
              rows={6}
              className="w-full p-3 border border-[#C6DEE4] rounded-lg focus:border-[#017A8C] focus:ring-2 focus:ring-[#017A8C]/30 transition-all"
              placeholder="Write a brief summary about yourself..."
              data-cy="abstract-input"
            />
          )}
        />
      </motion.div>

      {/* Skills */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
        className="pt-6 border-t border-[#C6DEE4]/30"
      >
        <h3 className="text-lg font-bold text-[#017A8C] mb-4">Skills</h3>
        <div data-cy="skills-input">
          <Controller
            name="skills"
            control={control}
            render={({ field }) => (
              <Chips
                value={field.value}
                onChange={(e) => field.onChange(e.value)}
                className="w-full"
                placeholder="Type a skill and press Enter"
              />
            )}
          />
        </div>
        <p className="text-xs text-[#88B7C4] mt-2">
          Type a skill and press Enter. Examples: React, TypeScript, Node.js
        </p>
      </motion.div>

      {/* Career */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.4 }}
        className="pt-6 border-t border-[#C6DEE4]/30"
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-[#017A8C]">Career</h3>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="button"
            onClick={() => appendCareer({
              startDate: '',
              endDate: null,
              isPresent: false,
              location: '',
              companyName: '',
              workSpecialization: '',
              jobType: 'Full time',
              summarization: '',
              projects: []
            })}
            className="flex items-center gap-2 px-3 py-1.5 bg-[#017A8C] text-white text-sm font-semibold rounded-lg hover:bg-[#015C6A] transition-all"
            data-cy="add-career-button"
          >
            <Plus className="w-4 h-4" />
            Add Career
          </motion.button>
        </div>

        <Accordion multiple className="career-accordion">
          {careerFields.map((field, careerIndex) => (
            <AccordionTab
              key={field.id}
              header={
                <div className="flex justify-between items-center w-full pr-2" data-cy={`career-entry-header-${careerIndex}`}>
                  <span className="font-semibold">Career Entry {careerIndex + 1}</span>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeCareer(careerIndex);
                    }}
                    className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </motion.button>
                </div>
              }
            >
              <CareerFields control={control} careerIndex={careerIndex} watch={watch} setValue={setValue} />
            </AccordionTab>
          ))}
        </Accordion>
      </motion.div>

      {/* Personal Projects */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.5 }}
        className="pt-6 border-t border-[#C6DEE4]/30"
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-[#017A8C]">Personal Projects</h3>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="button"
            onClick={() => appendPersonalProject({
              title: '',
              description: '',
              technologies: '',
              keyFeatures: []
            })}
            className="flex items-center gap-2 px-3 py-1.5 bg-[#017A8C] text-white text-sm font-semibold rounded-lg hover:bg-[#015C6A] transition-all"
            data-cy="add-project-button"
          >
            <Plus className="w-4 h-4" />
            Add Project
          </motion.button>
        </div>

        <Accordion multiple>
          {personalProjectFields.map((field, projectIndex) => (
            <AccordionTab
              key={field.id}
              header={
                <div className="flex justify-between items-center w-full pr-2" data-cy={`project-entry-header-${projectIndex}`}>
                  <span className="font-semibold">Project {projectIndex + 1}</span>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      removePersonalProject(projectIndex);
                    }}
                    className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </motion.button>
                </div>
              }
            >
              <PersonalProjectFields control={control} projectIndex={projectIndex} watch={watch} setValue={setValue} />
            </AccordionTab>
          ))}
        </Accordion>
      </motion.div>

      {/* Education */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.6 }}
        className="pt-6 border-t border-[#C6DEE4]/30"
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-[#017A8C]">Education</h3>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="button"
            onClick={handleImproveEducation}
            disabled={!watch('education')?.trim() || isEducationLoading}
            className="flex items-center gap-2 px-3 py-1.5 bg-white border border-[#017A8C]/30 text-[#017A8C] text-sm font-semibold rounded-lg hover:bg-[#017A8C] hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Sparkles className="w-4 h-4" />
            {isEducationLoading ? 'Improving...' : 'Improve with AI'}
          </motion.button>
        </div>
        <Controller
          name="education"
          control={control}
          render={({ field }) => (
            <InputTextarea
              {...field}
              rows={4}
              className="w-full p-3 border border-[#C6DEE4] rounded-lg focus:border-[#017A8C] focus:ring-2 focus:ring-[#017A8C]/30 transition-all"
              placeholder="Describe your education..."
              data-cy="education-input"
            />
          )}
        />
      </motion.div>
    </div>
  );
}

// Career Fields Component
function CareerFields({ control, careerIndex, watch, setValue }: any) {
  const { fields: projectFields, append: appendProject, remove: removeProject } = useFieldArray({
    control,
    name: `career.${careerIndex}.projects`
  });

  const { improveText: improveCareerText, isLoading: isCareerLoading } = useGeminiCareer();

  const handleImproveCareerSummary = async () => {
    const currentSummary = watch(`career.${careerIndex}.summarization`);
    if (!currentSummary?.trim()) return;

    try {
      const improvedText = await improveCareerText(currentSummary);
      setValue(`career.${careerIndex}.summarization`, improvedText, { shouldValidate: true });
    } catch (error) {
      console.error('Failed to improve career summary:', error);
    }
  };

  return (
    <div className="flex flex-col gap-4 mt-4">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block mb-2 text-sm font-medium text-[#5A6A6F]">Start Date</label>
          <Controller
            name={`career.${careerIndex}.startDate`}
            control={control}
            render={({ field }) => (
              <InputText
                {...field}
                className="w-full p-2 border border-[#C6DEE4] rounded-lg focus:border-[#017A8C] focus:ring-2 focus:ring-[#017A8C]/30 transition-all"
                placeholder="Jan 2020"
                data-cy={`career-startDate-input-${careerIndex}`}
              />
            )}
          />
        </div>

        <div>
          <label className="block mb-2 text-sm font-medium text-[#5A6A6F]">End Date</label>
          <Controller
            name={`career.${careerIndex}.endDate`}
            control={control}
            render={({ field }) => (
              <InputText
                {...field}
                value={field.value || ''}
                className="w-full p-2 border border-[#C6DEE4] rounded-lg focus:border-[#017A8C] focus:ring-2 focus:ring-[#017A8C]/30 transition-all"
                placeholder="Dec 2022"
                data-cy={`career-endDate-input-${careerIndex}`}
              />
            )}
          />
        </div>
      </div>

      <Controller
        name={`career.${careerIndex}.isPresent`}
        control={control}
        render={({ field }) => (
          <div className="flex items-center gap-2">
            <Checkbox
              inputId={`present-${careerIndex}`}
              checked={field.value}
              onChange={(e) => field.onChange(e.checked)}
            />
            <label htmlFor={`present-${careerIndex}`} className="text-sm text-[#5A6A6F]">I currently work here</label>
          </div>
        )}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <label className="block mb-2 text-sm font-medium text-[#5A6A6F]">Company Name</label>
          <Controller
            name={`career.${careerIndex}.companyName`}
            control={control}
            render={({ field }) => (
              <InputText
                {...field}
                className="w-full p-2 border border-[#C6DEE4] rounded-lg focus:border-[#017A8C] focus:ring-2 focus:ring-[#017A8C]/30 transition-all"
                placeholder="Company Inc."
                data-cy={`career-companyName-input-${careerIndex}`}
              />
            )}
          />
        </div>

        <div>
          <label className="block mb-2 text-sm font-medium text-[#5A6A6F]">Location</label>
          <Controller
            name={`career.${careerIndex}.location`}
            control={control}
            render={({ field }) => (
              <InputText
                {...field}
                className="w-full p-2 border border-[#C6DEE4] rounded-lg focus:border-[#017A8C] focus:ring-2 focus:ring-[#017A8C]/30 transition-all"
                placeholder="New York, USA"
                data-cy={`career-location-input-${careerIndex}`}
              />
            )}
          />
        </div>

        <div>
          <label className="block mb-2 text-sm font-medium text-[#5A6A6F]">Position</label>
          <Controller
            name={`career.${careerIndex}.workSpecialization`}
            control={control}
            render={({ field }) => (
              <InputText
                {...field}
                className="w-full p-2 border border-[#C6DEE4] rounded-lg focus:border-[#017A8C] focus:ring-2 focus:ring-[#017A8C]/30 transition-all"
                placeholder="Frontend Developer"
                data-cy={`career-workSpecialization-input-${careerIndex}`}
              />
            )}
          />
        </div>

        <div>
          <label className="block mb-2 text-sm font-medium text-[#5A6A6F]">Job Type</label>
          <Controller
            name={`career.${careerIndex}.jobType`}
            control={control}
            render={({ field }) => (
              <Dropdown
                {...field}
                options={jobTypeOptions}
                className="w-full"
                placeholder="Select job type"
                data-cy={`career-jobType-dropdown-${careerIndex}`}
              />
            )}
          />
        </div>
      </div>

      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="text-sm font-medium text-[#5A6A6F]">Work Summary</label>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="button"
            onClick={handleImproveCareerSummary}
            disabled={!watch(`career.${careerIndex}.summarization`)?.trim() || isCareerLoading}
            className="flex items-center gap-1 px-2 py-1 bg-white border border-[#017A8C]/30 text-[#017A8C] text-xs font-semibold rounded-lg hover:bg-[#017A8C] hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Sparkles className="w-3 h-3" />
            AI
          </motion.button>
        </div>
        <Controller
          name={`career.${careerIndex}.summarization`}
          control={control}
          render={({ field }) => (
            <InputTextarea
              {...field}
              rows={4}
              className="w-full p-2 border border-[#C6DEE4] rounded-lg focus:border-[#017A8C] focus:ring-2 focus:ring-[#017A8C]/30 transition-all"
              placeholder="Describe your work..."
              data-cy={`career-summarization-input-${careerIndex}`}
            />
          )}
        />
      </div>

      {/* Projects within Career */}
      <div className="mt-4 pt-4 border-t border-[#C6DEE4]/30">
        <div className="flex justify-between items-center mb-3">
          <label className="text-sm font-semibold text-[#5A6A6F]">Projects</label>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="button"
            onClick={() => appendProject({
              name: '',
              description: '',
              technologies: '',
              keyContributions: []
            })}
            className="flex items-center gap-1 px-2 py-1 bg-[#017A8C] text-white text-xs font-semibold rounded-lg hover:bg-[#015C6A] transition-all"
          >
            <Plus className="w-3 h-3" />
            Add
          </motion.button>
        </div>

        {projectFields.map((field, projectIndex) => (
          <div key={field.id} className="mb-3 p-3 bg-[#FAF7F0] rounded-lg border border-[#C6DEE4]/30">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-semibold text-[#017A8C]">Project {projectIndex + 1}</span>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                type="button"
                onClick={() => removeProject(projectIndex)}
                className="p-1 text-red-500 hover:bg-red-50 rounded transition-all"
              >
                <Trash2 className="w-3 h-3" />
              </motion.button>
            </div>
            <ProjectFields control={control} careerIndex={careerIndex} projectIndex={projectIndex} />
          </div>
        ))}
      </div>
    </div>
  );
}

// Project Fields Component (for career projects)
function ProjectFields({ control, careerIndex, projectIndex }: any) {
  return (
    <div className="flex flex-col gap-3">
      <Controller
        name={`career.${careerIndex}.projects.${projectIndex}.name`}
        control={control}
        render={({ field }) => (
          <InputText
            {...field}
            className="w-full p-2 border border-[#C6DEE4] rounded-lg focus:border-[#017A8C] focus:ring-2 focus:ring-[#017A8C]/30 transition-all"
            placeholder="Project name"
          />
        )}
      />

      <Controller
        name={`career.${careerIndex}.projects.${projectIndex}.description`}
        control={control}
        render={({ field }) => (
          <InputTextarea
            {...field}
            rows={2}
            className="w-full p-2 border border-[#C6DEE4] rounded-lg focus:border-[#017A8C] focus:ring-2 focus:ring-[#017A8C]/30 transition-all"
            placeholder="Project description"
          />
        )}
      />

      <Controller
        name={`career.${careerIndex}.projects.${projectIndex}.technologies`}
        control={control}
        render={({ field }) => (
          <InputText
            {...field}
            className="w-full p-2 border border-[#C6DEE4] rounded-lg focus:border-[#017A8C] focus:ring-2 focus:ring-[#017A8C]/30 transition-all"
            placeholder="Technologies: React, TypeScript, Node.js"
          />
        )}
      />

      <Controller
        name={`career.${careerIndex}.projects.${projectIndex}.keyContributions`}
        control={control}
        render={({ field }) => (
          <Chips
            value={field.value}
            onChange={(e) => field.onChange(e.value)}
            className="w-full"
            placeholder="Key contributions (press Enter)"
          />
        )}
      />
    </div>
  );
}

// Personal Project Fields Component
function PersonalProjectFields({ control, projectIndex, watch, setValue }: any) {
  const { improveText: improveProjectText, isLoading: isProjectLoading } = useGeminiProjects();

  const handleImproveProjectDescription = async () => {
    const currentDescription = watch(`personalProjects.${projectIndex}.description`);
    if (!currentDescription?.trim()) return;

    try {
      const improvedText = await improveProjectText(currentDescription);
      setValue(`personalProjects.${projectIndex}.description`, improvedText, { shouldValidate: true });
    } catch (error) {
      console.error('Failed to improve project description:', error);
    }
  };

  return (
    <div className="flex flex-col gap-4 mt-4">
      <div>
        <label className="block mb-2 text-sm font-medium text-[#5A6A6F]">Project Title</label>
        <Controller
          name={`personalProjects.${projectIndex}.title`}
          control={control}
          render={({ field }) => (
            <InputText
              {...field}
              className="w-full p-2 border border-[#C6DEE4] rounded-lg focus:border-[#017A8C] focus:ring-2 focus:ring-[#017A8C]/30 transition-all"
              placeholder="My Awesome Project"
              data-cy={`project-title-input-${projectIndex}`}
            />
          )}
        />
      </div>

      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="text-sm font-medium text-[#5A6A6F]">Description</label>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="button"
            onClick={handleImproveProjectDescription}
            disabled={!watch(`personalProjects.${projectIndex}.description`)?.trim() || isProjectLoading}
            className="flex items-center gap-1 px-2 py-1 bg-white border border-[#017A8C]/30 text-[#017A8C] text-xs font-semibold rounded-lg hover:bg-[#017A8C] hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Sparkles className="w-3 h-3" />
            AI
          </motion.button>
        </div>
        <Controller
          name={`personalProjects.${projectIndex}.description`}
          control={control}
          render={({ field }) => (
            <InputTextarea
              {...field}
              rows={4}
              className="w-full p-2 border border-[#C6DEE4] rounded-lg focus:border-[#017A8C] focus:ring-2 focus:ring-[#017A8C]/30 transition-all"
              placeholder="Describe your project..."
              data-cy={`project-description-input-${projectIndex}`}
            />
          )}
        />
      </div>

      <div>
        <label className="block mb-2 text-sm font-medium text-[#5A6A6F]">Technologies</label>
        <Controller
          name={`personalProjects.${projectIndex}.technologies`}
          control={control}
          render={({ field }) => (
            <InputText
              {...field}
              className="w-full p-2 border border-[#C6DEE4] rounded-lg focus:border-[#017A8C] focus:ring-2 focus:ring-[#017A8C]/30 transition-all"
              placeholder="React, Firebase, TailwindCSS"
              data-cy={`project-technologies-input-${projectIndex}`}
            />
          )}
        />
      </div>

      <div>
        <label className="block mb-2 text-sm font-medium text-[#5A6A6F]">Key Features</label>
        <div data-cy={`project-keyFeatures-input-${projectIndex}`}>
          <Controller
            name={`personalProjects.${projectIndex}.keyFeatures`}
            control={control}
            render={({ field }) => (
              <Chips
                value={field.value}
                onChange={(e) => field.onChange(e.value)}
                className="w-full"
                placeholder="Type and press Enter"
              />
            )}
          />
        </div>
      </div>
    </div>
  );
}
