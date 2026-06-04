// import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Card } from 'primereact/card';
import { Linkedin, ExternalLink } from 'lucide-react';
import type { CVData } from '../types/cv.types';
import { buildLinkedInJobsUrl } from '../utils/linkedinJobs';

interface LinkedInJobsCardProps {
  cvData: CVData;
}

export default function LinkedInJobsCard({ cvData }: LinkedInJobsCardProps) {
  // const url = useMemo(() => buildLinkedInJobsUrl(cvData), [cvData]);
  const url = buildLinkedInJobsUrl(cvData)

  if (!url) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.6 }}
    >
      <Card className="bg-white/70 backdrop-blur-md shadow-lg shadow-[#017A8C]/10 border border-[#017A8C]/20">
        <div className="flex flex-col sm:flex-row items-start gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-[#0A66C2]/10 flex items-center justify-center flex-shrink-0">
            <Linkedin className="w-5 h-5 text-[#0A66C2]" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-bold text-[#017A8C] mb-1">
              Find Matching Jobs on LinkedIn
            </h3>
            <p className="text-sm text-[#88B7C4] break-words">
              We'll pre-fill a LinkedIn Jobs search using your title, top skills, and location.
            </p>
          </div>
        </div>

        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 w-full sm:w-auto bg-gradient-to-r from-[#017A8C] to-[#019baf] hover:from-[#015C6A] hover:to-[#017A8C] text-white font-semibold py-2.5 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 min-h-[44px]"
          data-cy="linkedin-jobs-cta"
        >
          Search on LinkedIn
          <ExternalLink className="w-4 h-4" />
        </a>
      </Card>
    </motion.div>
  );
}
