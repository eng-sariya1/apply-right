import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, ChevronRight, Home, LayoutTemplate } from 'lucide-react';
import { useCVContext } from '../context/CVContext';
import type { TemplateId } from '../types/cv.types';
import tem2Preview from '../../images/templates/TEM1.png';
import classicPreview from '../../images/templates/classic.png';
import tem3Preview from '../../images/templates/TEM2.JPG';

const templates: {
  id: TemplateId;
  name: string;
  description: string;
  features: string[];
}[] = [
  {
    id: 'template1',
    name: 'Classic',
    description: 'A clean, structured layout with a clear hierarchy. Great for technical roles and academic backgrounds.',
    features: ['Abstract section', 'Career history', 'Personal projects', 'Skills', 'Education'],
  },
  {
    id: 'template2',
    name: 'Professional',
    description: 'A polished, corporate design with a photo slot and clearly labeled sections. Ideal for business and executive roles.',
    features: ['Profile photo', 'Summary', 'Professional experience', 'Education', 'Technical skills', 'Additional info'],
  },
  {
    id: 'template3',
    name: 'Modern',
    description: 'A clean, minimal black-and-white design with centered header and structured sections. Perfect for any industry.',
    features: ['Professional summary', 'Work experience', 'Structured education', 'Skills', 'Certifications'],
  },
];


export default function TemplatePage() {
  const navigate = useNavigate();
  const { cvData, setCvData } = useCVContext();

  const handleSelectTemplate = (templateId: TemplateId) => {
    setCvData({ ...cvData, templateId });
    navigate('/cv-builder');
  };

  const currentTemplateId = cvData.templateId || 'template1';

  return (
    <div className="min-h-screen bg-[var(--color-bg)] relative overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-gradient-to-r from-[#017A8C]/10 via-transparent to-transparent blur-3xl rounded-full" />
        <div className="absolute bottom-1/3 left-1/4 w-96 h-96 bg-gradient-to-l from-[#017A8C]/10 via-transparent to-transparent blur-3xl rounded-full" />
      </div>

      {/* Sticky Header */}
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="sticky top-0 z-50"
      >
        <div className="bg-gradient-to-r from-[#015C6A] via-[#017A8C] to-[#019baf] rounded-b-[2rem] shadow-lg shadow-[#017A8C]/20 relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/3 blur-3xl" />
            <div className="absolute bottom-0 left-1/4 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 blur-2xl" />
          </div>

          {/* Top nav row */}
          <div className="container mx-auto px-6 pt-4 pb-2 relative z-10">
            <div className="flex items-center justify-between">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="text-2xl font-bold text-white tracking-tight cursor-pointer"
                onClick={() => navigate('/')}
              >
                Nuivo
              </motion.div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/')}
                className="flex items-center gap-2 px-4 py-2 bg-white/15 hover:bg-white/25 text-white font-semibold rounded-xl backdrop-blur-sm border border-white/20 transition-all duration-300"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Home
              </motion.button>
            </div>
          </div>

          {/* Breadcrumb + Title */}
          <div className="container mx-auto px-6 pb-6 pt-1 relative z-10">
            <div className="flex items-center gap-1.5 text-white/60 text-sm mb-3">
              <Home className="w-3.5 h-3.5" />
              <button onClick={() => navigate('/')} className="hover:text-white/90 transition-colors">Home</button>
              <ChevronRight className="w-3.5 h-3.5" />
              <span className="text-white font-medium">Choose Template</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/15 backdrop-blur-sm flex items-center justify-center border border-white/20">
                <LayoutTemplate className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white leading-tight">Choose Your Resume Template</h1>
                <p className="text-sm text-white/60">Select the design that best represents you</p>
              </div>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <div className="container mx-auto max-w-7xl px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {templates.map((template, index) => {
            const isSelected = currentTemplateId === template.id;
            return (
              <motion.div
                key={template.id}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                className={`relative rounded-2xl border-2 transition-all duration-300 overflow-hidden shadow-lg hover:shadow-xl cursor-pointer group flex flex-col ${
                  isSelected
                    ? 'border-[#017A8C] shadow-[#017A8C]/20'
                    : 'border-[var(--color-border)]/50 hover:border-[#017A8C]/50 bg-[var(--color-surface-80)] backdrop-blur-sm'
                }`}
                onClick={() => handleSelectTemplate(template.id)}
              >
                {/* Selected badge */}
                {isSelected && (
                  <div className="absolute top-3 right-3 z-10 flex items-center gap-1.5 bg-[#017A8C] text-white text-xs font-semibold px-2.5 py-1 rounded-full shadow-md">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Selected
                  </div>
                )}

                {/* Top accent line */}
                <div className={`h-1 ${isSelected ? 'bg-gradient-to-r from-[var(--color-primary)] via-[var(--color-primary-light)] to-[var(--color-text-light)]' : 'bg-gradient-to-r from-[var(--color-border)] to-[var(--color-text-light)] group-hover:from-[var(--color-primary)] group-hover:to-[var(--color-primary-light)]'} transition-all duration-300`} />

                {/* Template Preview Thumbnail */}
                <div className="mx-4 mt-4 rounded-xl overflow-hidden border border-[var(--color-border)]/40 shadow-inner"
                  style={{ aspectRatio: '1 / 1.414', background: 'var(--color-card)' }}>
                  <img
                    src={template.id === 'template3' ? tem3Preview : template.id === 'template2' ? tem2Preview : classicPreview}
                    alt={`${template.name} Template Preview`}
                    className="w-full h-full object-cover object-top"
                  />
                </div>

                {/* Card Body */}
                <div className="p-5 flex flex-col flex-1">
                  <h2 className="text-xl font-bold text-[var(--color-text-dark)] mb-2">
                    {template.name}
                  </h2>
                  <p className="text-sm text-[var(--color-text-light)] leading-relaxed mb-4">
                    {template.description}
                  </p>

                  {/* Features list */}
                  <ul className="space-y-1 mb-5">
                    {template.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm text-[var(--color-muted)]">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#017A8C] flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  {/* Select button */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelectTemplate(template.id);
                    }}
                    className={`w-full py-3 rounded-xl font-semibold text-sm transition-all duration-300 shadow-md hover:shadow-lg mt-auto ${
                      isSelected
                        ? 'bg-[#017A8C] text-white'
                        : 'bg-gradient-to-r from-[#017A8C] to-[#019baf] hover:from-[#015C6A] hover:to-[#017A8C] text-white'
                    }`}
                  >
                    {isSelected ? 'Continue with this Template' : 'Use This Template'}
                  </motion.button>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Info note */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center text-sm text-[var(--color-text-light)] mt-8"
        >
          You can switch templates at any time from the Resume Builder page.
        </motion.p>
      </div>
    </div>
  );
}
