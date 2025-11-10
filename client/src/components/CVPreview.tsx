import React from 'react';
import { CVData } from '../types/cv.types';
import { Download } from 'lucide-react';
import jsPDF from 'jspdf';

interface CVPreviewProps {
  cvData: CVData;
}

const CVPreview: React.FC<CVPreviewProps> = ({ cvData }) => {
  const formatDate = (date: string) => {
    if (!date) return '';
    const [year, month] = date.split('-');
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${monthNames[parseInt(month) - 1]} ${year}`;
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    let yPos = 20;
    const lineHeight = 7;
    const pageHeight = doc.internal.pageSize.height;

    const checkPageBreak = (additionalHeight: number = lineHeight) => {
      if (yPos + additionalHeight > pageHeight - 20) {
        doc.addPage();
        yPos = 20;
      }
    };

    // Personal Info
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text(cvData.personalInfo.fullName || 'Your Name', 20, yPos);
    yPos += 10;

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    const contactInfo = [
      cvData.personalInfo.email,
      cvData.personalInfo.phone,
      cvData.personalInfo.location
    ].filter(Boolean).join(' | ');
    doc.text(contactInfo, 20, yPos);
    yPos += lineHeight;

    if (cvData.personalInfo.linkedin || cvData.personalInfo.website) {
      const links = [cvData.personalInfo.linkedin, cvData.personalInfo.website]
        .filter(Boolean)
        .join(' | ');
      doc.text(links, 20, yPos);
      yPos += lineHeight;
    }

    // Summary
    if (cvData.personalInfo.summary) {
      yPos += 5;
      checkPageBreak(15);
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text('PROFESSIONAL SUMMARY', 20, yPos);
      yPos += lineHeight;
      
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      const summaryLines = doc.splitTextToSize(cvData.personalInfo.summary, 170);
      summaryLines.forEach((line: string) => {
        checkPageBreak();
        doc.text(line, 20, yPos);
        yPos += lineHeight;
      });
    }

    // Experience
    if (cvData.experience.length > 0) {
      yPos += 5;
      checkPageBreak(15);
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text('EXPERIENCE', 20, yPos);
      yPos += lineHeight;

      cvData.experience.forEach(exp => {
        checkPageBreak(20);
        doc.setFontSize(11);
        doc.setFont('helvetica', 'bold');
        doc.text(exp.position, 20, yPos);
        yPos += lineHeight;

        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        const expInfo = `${exp.company} | ${formatDate(exp.startDate)} - ${exp.current ? 'Present' : formatDate(exp.endDate)}`;
        doc.text(expInfo, 20, yPos);
        yPos += lineHeight;

        if (exp.description) {
          const descLines = doc.splitTextToSize(exp.description, 170);
          descLines.forEach((line: string) => {
            checkPageBreak();
            doc.text(line, 20, yPos);
            yPos += lineHeight;
          });
        }

        exp.achievements.filter(Boolean).forEach(ach => {
          checkPageBreak();
          const achLines = doc.splitTextToSize(`• ${ach}`, 165);
          achLines.forEach((line: string) => {
            checkPageBreak();
            doc.text(line, 25, yPos);
            yPos += lineHeight;
          });
        });
        yPos += 3;
      });
    }

    // Education
    if (cvData.education.length > 0) {
      yPos += 5;
      checkPageBreak(15);
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text('EDUCATION', 20, yPos);
      yPos += lineHeight;

      cvData.education.forEach(edu => {
        checkPageBreak(15);
        doc.setFontSize(11);
        doc.setFont('helvetica', 'bold');
        doc.text(`${edu.degree} in ${edu.field}`, 20, yPos);
        yPos += lineHeight;

        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        const eduInfo = `${edu.institution} | ${formatDate(edu.startDate)} - ${formatDate(edu.endDate)}`;
        doc.text(eduInfo, 20, yPos);
        yPos += lineHeight;

        if (edu.gpa) {
          doc.text(`GPA: ${edu.gpa}`, 20, yPos);
          yPos += lineHeight;
        }
        yPos += 3;
      });
    }

    // Skills
    if (cvData.skills.length > 0) {
      yPos += 5;
      checkPageBreak(15);
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text('SKILLS', 20, yPos);
      yPos += lineHeight;

      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      const skillsByCategory = cvData.skills.reduce((acc, skill) => {
        if (!acc[skill.category]) acc[skill.category] = [];
        acc[skill.category].push(skill.name);
        return acc;
      }, {} as Record<string, string[]>);

      Object.entries(skillsByCategory).forEach(([category, skills]) => {
        checkPageBreak();
        const categoryName = category.charAt(0).toUpperCase() + category.slice(1);
        doc.text(`${categoryName}: ${skills.join(', ')}`, 20, yPos);
        yPos += lineHeight;
      });
    }

    // Certifications
    if (cvData.certifications.length > 0) {
      yPos += 5;
      checkPageBreak(15);
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text('CERTIFICATIONS', 20, yPos);
      yPos += lineHeight;

      cvData.certifications.forEach(cert => {
        checkPageBreak();
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.text(`• ${cert.name} - ${cert.issuer} (${formatDate(cert.date)})`, 20, yPos);
        yPos += lineHeight;
      });
    }

    // Projects
    if (cvData.projects.length > 0) {
      yPos += 5;
      checkPageBreak(15);
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text('PROJECTS', 20, yPos);
      yPos += lineHeight;

      cvData.projects.forEach(proj => {
        checkPageBreak(15);
        doc.setFontSize(11);
        doc.setFont('helvetica', 'bold');
        doc.text(proj.name, 20, yPos);
        yPos += lineHeight;

        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        const projLines = doc.splitTextToSize(proj.description, 170);
        projLines.forEach((line: string) => {
          checkPageBreak();
          doc.text(line, 20, yPos);
          yPos += lineHeight;
        });

        if (proj.technologies.length > 0) {
          checkPageBreak();
          doc.text(`Technologies: ${proj.technologies.join(', ')}`, 20, yPos);
          yPos += lineHeight;
        }
        yPos += 3;
      });
    }

    doc.save(`${cvData.personalInfo.fullName || 'CV'}_Resume.pdf`);
  };

  return (
    <div className="space-y-4">
      <div className="bg-gray-50 rounded-lg p-4 max-h-96 overflow-y-auto scrollbar-hide text-xs">
        {/* Personal Info */}
        <div className="mb-4">
          <h2 className="text-lg font-bold text-gray-900">
            {cvData.personalInfo.fullName || 'Your Name'}
          </h2>
          <p className="text-gray-600 text-xs">
            {[cvData.personalInfo.email, cvData.personalInfo.phone, cvData.personalInfo.location]
              .filter(Boolean)
              .join(' | ')}
          </p>
          {cvData.personalInfo.summary && (
            <p className="mt-2 text-gray-700 text-xs">{cvData.personalInfo.summary}</p>
          )}
        </div>

        {/* Experience */}
        {cvData.experience.length > 0 && (
          <div className="mb-4">
            <h3 className="text-sm font-bold text-gray-900 mb-2">EXPERIENCE</h3>
            {cvData.experience.map(exp => (
              <div key={exp.id} className="mb-3">
                <p className="font-semibold text-gray-900">{exp.position}</p>
                <p className="text-gray-600 text-xs">{exp.company}</p>
                <p className="text-gray-500 text-xs">
                  {formatDate(exp.startDate)} - {exp.current ? 'Present' : formatDate(exp.endDate)}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Education */}
        {cvData.education.length > 0 && (
          <div className="mb-4">
            <h3 className="text-sm font-bold text-gray-900 mb-2">EDUCATION</h3>
            {cvData.education.map(edu => (
              <div key={edu.id} className="mb-2">
                <p className="font-semibold text-gray-900">{edu.degree} in {edu.field}</p>
                <p className="text-gray-600 text-xs">{edu.institution}</p>
              </div>
            ))}
          </div>
        )}

        {/* Skills */}
        {cvData.skills.length > 0 && (
          <div className="mb-4">
            <h3 className="text-sm font-bold text-gray-900 mb-2">SKILLS</h3>
            <div className="flex flex-wrap gap-1">
              {cvData.skills.map(skill => (
                <span
                  key={skill.id}
                  className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs"
                >
                  {skill.name}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      <button
        onClick={exportToPDF}
        className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
      >
        <Download size={20} />
        <span>Export to PDF</span>
      </button>
    </div>
  );
};

export default CVPreview;
