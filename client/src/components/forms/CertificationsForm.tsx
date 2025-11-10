import React from 'react';
import { CVData, Certification } from '../../types/cv.types';
import { Plus, Trash2 } from 'lucide-react';

interface CertificationsFormProps {
  cvData: CVData;
  setCVData: React.Dispatch<React.SetStateAction<CVData>>;
}

const CertificationsForm: React.FC<CertificationsFormProps> = ({ cvData, setCVData }) => {
  const addCertification = () => {
    const newCert: Certification = {
      id: Date.now().toString(),
      name: '',
      issuer: '',
      date: '',
      expiryDate: '',
      credentialId: ''
    };
    setCVData(prev => ({
      ...prev,
      certifications: [...prev.certifications, newCert]
    }));
  };

  const removeCertification = (id: string) => {
    setCVData(prev => ({
      ...prev,
      certifications: prev.certifications.filter(cert => cert.id !== id)
    }));
  };

  const updateCertification = (id: string, field: string, value: any) => {
    setCVData(prev => ({
      ...prev,
      certifications: prev.certifications.map(cert =>
        cert.id === id ? { ...cert, [field]: value } : cert
      )
    }));
  };

  return (
    <div className="space-y-6">
      {cvData.certifications.length === 0 && (
        <p className="text-gray-500 text-center py-8">
          No certifications added yet. Click "Add Certification" to get started.
        </p>
      )}

      {cvData.certifications.map((cert, index) => (
        <div key={cert.id} className="p-6 border border-gray-200 rounded-lg bg-gray-50">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Certification #{index + 1}
            </h3>
            <button
              onClick={() => removeCertification(cert.id)}
              className="text-red-600 hover:text-red-700"
            >
              <Trash2 size={20} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Certification Name *
              </label>
              <input
                type="text"
                value={cert.name}
                onChange={(e) => updateCertification(cert.id, 'name', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="AWS Certified Solutions Architect"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Issuing Organization *
              </label>
              <input
                type="text"
                value={cert.issuer}
                onChange={(e) => updateCertification(cert.id, 'issuer', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Amazon Web Services"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Issue Date *
              </label>
              <input
                type="month"
                value={cert.date}
                onChange={(e) => updateCertification(cert.id, 'date', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Expiry Date (Optional)
              </label>
              <input
                type="month"
                value={cert.expiryDate || ''}
                onChange={(e) => updateCertification(cert.id, 'expiryDate', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Credential ID (Optional)
              </label>
              <input
                type="text"
                value={cert.credentialId || ''}
                onChange={(e) => updateCertification(cert.id, 'credentialId', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="ABC123XYZ"
              />
            </div>
          </div>
        </div>
      ))}

      <button
        onClick={addCertification}
        className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-500 hover:text-blue-600 transition-colors flex items-center justify-center space-x-2"
      >
        <Plus size={20} />
        <span>Add Certification</span>
      </button>
    </div>
  );
};

export default CertificationsForm;
