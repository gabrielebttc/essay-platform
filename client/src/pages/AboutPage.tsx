import React from 'react';
import { ShieldCheck, GraduationCap, CreditCard, Diff, LogIn } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AboutPage: React.FC = () => {
  const navigate = useNavigate()
  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans">
      {/* Hero Section */}
      <div className="bg-indigo-600 py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4">
            IELTS Essay Checker <span className="text-indigo-200">[DEMO]</span>
          </h1>
          <p className="text-xl text-indigo-100">
            A professional platform for students to receive expert IELTS Task 1 & 2 feedback.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto py-12 px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          
          {/* Section: For Students */}
          <section className="space-y-4">
            <div className="flex items-center space-x-3 text-indigo-600">
              <GraduationCap size={32} />
              <h2 className="text-2xl font-bold">Student Experience</h2>
            </div>
            <p className="text-gray-600 leading-relaxed">
              Students can register, upload their essays, and choose between <strong>Academic Task 1</strong> or <strong>General/Academic Task 2</strong>. Once submitted, the essay is sent directly to the professor for a professional review.
            </p>
            <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
              <div className="flex items-center space-x-2 mb-2 text-blue-800">
                <CreditCard size={18} />
                <span className="font-bold uppercase text-xs">Stripe Demo Payment</span>
              </div>
              <p className="text-sm text-blue-700">
                To test the payment flow, use the Stripe test card:
                <code className="block mt-2 bg-white p-2 rounded text-center font-mono font-bold text-indigo-600">
                  4242 4242 4242 4242
                </code>
                <span className="text-[10px] mt-1 block">Use any future expiry date and any 3-digit CVC.</span>
              </p>
            </div>
          </section>

          {/* Section: For The Professor */}
          <section className="space-y-4">
            <div className="flex items-center space-x-3 text-green-600">
              <ShieldCheck size={32} />
              <h2 className="text-2xl font-bold">Professor Dashboard</h2>
            </div>
            <p className="text-gray-600 leading-relaxed">
              As the platform owner, you can manage all submissions. The powerful <strong>Correction Engine</strong> allows you to edit text and see the differences compared to the student's version in <strong>real-time</strong>.
            </p>
            <div className="bg-gray-900 p-5 rounded-xl text-white shadow-xl">
              <div className="flex items-center space-x-2 mb-3 text-indigo-400">
                <LogIn size={18} />
                <span className="font-bold uppercase text-xs">Admin Access</span>
              </div>
              <div className="space-y-2 font-mono text-sm">
                <p><span className="text-gray-400">Email:</span> admin@ielts.com</p>
                <p><span className="text-gray-400">Pass:</span> admin123</p>
              </div>
            </div>
          </section>
        </div>

        <hr className="my-16 border-gray-100" />

        {/* Highlighted Feature: Diff View */}
        <div className="bg-indigo-50 rounded-2xl p-8 flex flex-col md:flex-row items-center gap-8">
          <div className="bg-white p-4 rounded-lg shadow-inner flex-shrink-0">
            <Diff size={48} className="text-indigo-600" />
          </div>
          <div>
            <h3 className="text-xl font-bold mb-2">Real-Time Comparison</h3>
            <p className="text-gray-600">
              Our unique interface highlights precisely what the professor changed. Students can see their original mistakes side-by-side with the corrections, making it an incredibly effective learning tool for IELTS preparation.
            </p>
          </div>
        </div>

        <div className="mt-12 text-center">
          <button className="bg-indigo-600 text-white px-8 py-3 rounded-full font-bold hover:bg-indigo-700 transition-all shadow-lg hover:shadow-indigo-200" onClick={() => navigate('/login')}>
            Go to Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;