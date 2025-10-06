import { useNavigate } from 'react-router-dom';
import { Button } from 'primereact/button';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto text-center">
          {/* Main Heading */}
          <h1 className="text-6xl md:text-7xl font-bold mb-6 animate-fade-in">
            <span className="bg-gradient-to-r from-sky-400 via-cyan-400 to-sky-400 bg-clip-text text-transparent">
              Build Your Professional CV
            </span>
          </h1>

          {/* Description */}
          <p className="text-xl md:text-2xl text-slate-50 mb-12 leading-relaxed animate-fade-in-up">
            Create a stunning, professional CV in minutes with our intuitive builder.
            Stand out from the crowd with modern templates and AI-powered suggestions.
            Your dream job is just one click away.
          </p>

          {/* CTA Button */}
          <Button
            label="Get Started"
            icon="pi pi-arrow-right"
            iconPos="right"
            size="large"
            className="bg-blue-500 hover:bg-blue-600 border-0 text-white font-semibold px-8 py-4 text-xl shadow-2xl hover:shadow-blue-500/50 transition-all duration-300 animate-fade-in-up hover:scale-105"
            onClick={() => navigate('/builder')}
          />

          {/* Feature Cards */}
          <div className="grid md:grid-cols-3 gap-8 mt-20 animate-fade-in-up">
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-sky-400/20 hover:border-sky-400/50 transition-all duration-300 hover:transform hover:scale-105 shadow-lg hover:shadow-sky-400/20">
              <div className="text-sky-400 text-4xl mb-4">
                <i className="pi pi-bolt"></i>
              </div>
              <h3 className="text-xl font-bold text-sky-400 mb-2">Fast & Easy</h3>
              <p className="text-slate-50/80">
                Create your CV in minutes with our intuitive drag-and-drop interface
              </p>
            </div>

            <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-cyan-400/20 hover:border-cyan-400/50 transition-all duration-300 hover:transform hover:scale-105 shadow-lg hover:shadow-cyan-400/20">
              <div className="text-cyan-400 text-4xl mb-4">
                <i className="pi pi-palette"></i>
              </div>
              <h3 className="text-xl font-bold text-cyan-400 mb-2">Beautiful Templates</h3>
              <p className="text-slate-50/80">
                Choose from professionally designed templates that make you stand out
              </p>
            </div>

            <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-sky-400/20 hover:border-sky-400/50 transition-all duration-300 hover:transform hover:scale-105 shadow-lg hover:shadow-sky-400/20">
              <div className="text-sky-400 text-4xl mb-4">
                <i className="pi pi-download"></i>
              </div>
              <h3 className="text-xl font-bold text-sky-400 mb-2">Export to PDF</h3>
              <p className="text-slate-50/80">
                Download your CV as a professional PDF ready to send to employers
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
