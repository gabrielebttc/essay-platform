import React, { useEffect, useState, useMemo } from 'react';
import { redirectToPayment } from '../services/stripe';
import { essayService, EssaySubmission } from '../services/essay';
import { EssayType } from '../types';
import { CheckCircle, AlertCircle, Loader2, CreditCard } from 'lucide-react';

const SubmitEssay: React.FC = () => {
  const [formData, setFormData] = useState<EssaySubmission>({ taskTypeId: '', content: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [essayTypes, setEssayTypes] = useState<EssayType[]>([]);
  const [selectedEssayType, setSelectedEssayType] = useState<EssayType | null>(null);

  useEffect(() => {
    const fetchEssayTypes = async () => {
      try {
        setLoading(true);
        const response = await essayService.getEssayTypes();
        setEssayTypes(response);
      } catch (err: any) {
        setError('Unable to load essay types.');
      } finally {
        setLoading(false);
      }
    };
    fetchEssayTypes();
  }, []);

  const wordCount = useMemo(() => {
    return formData.content.trim().split(/\s+/).filter(Boolean).length;
  }, [formData.content]);

  const progress = useMemo(() => {
    if (!selectedEssayType?.minWords) return 0;
    return Math.min((wordCount / selectedEssayType.minWords) * 100, 100);
  }, [wordCount, selectedEssayType]);

  const isValid = selectedEssayType && wordCount >= (selectedEssayType.minWords || 0);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (name === 'taskTypeId') {
      setSelectedEssayType(essayTypes.find(t => t.id === value) || null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;
    setLoading(true);
    try {
      await redirectToPayment(formData.taskTypeId, formData.content);
    } catch (err: any) {
      setError(err.message || 'Payment processing error.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-black text-gray-900 tracking-tight">Submit Your Essay</h1>
          <p className="mt-3 text-lg text-gray-600">Get professional feedback from experienced IELTS examiners.</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 flex items-center shadow-sm rounded-r-md animate-in fade-in duration-300">
            <AlertCircle className="w-5 h-5 mr-3" />
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {/* Step 1: Type Selection */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <label className="text-sm font-semibold text-gray-900 uppercase tracking-wider">1. Select Task Type</label>
              <select
                name="taskTypeId"
                value={formData.taskTypeId}
                onChange={handleChange}
                className="mt-3 block w-full rounded-lg border-gray-200 bg-gray-50 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition-all cursor-pointer"
              >
                <option value="">Choose a task...</option>
                {essayTypes.map(t => (
                  <option key={t.id} value={t.id}>{t.name} — ${t.price}</option>
                ))}
              </select>
            </div>

            {/* Step 2: Content */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="flex justify-between items-end mb-3">
                <label className="text-sm font-semibold text-gray-900 uppercase tracking-wider">2. Paste your content</label>
                <span className={`text-xs font-bold transition-colors ${isValid ? 'text-green-600' : 'text-orange-500'}`}>
                  {wordCount} WORDS {selectedEssayType && `/ Min ${selectedEssayType.minWords}`}
                </span>
              </div>
              
              <textarea
                name="content"
                rows={14}
                value={formData.content}
                onChange={handleChange}
                placeholder="Type or paste your essay here..."
                className="block w-full rounded-lg border-gray-200 bg-gray-50 focus:ring-indigo-500 focus:border-indigo-500 p-4 transition-all resize-none"
              />

              {selectedEssayType && (
                <div className="mt-4">
                  <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                    <div 
                      className={`h-1.5 rounded-full transition-all duration-700 ease-out ${isValid ? 'bg-green-500' : 'bg-indigo-500'}`}
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar: Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 sticky top-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Service Summary</h3>
              <ul className="space-y-3 mb-6">
                {[
                  'Overall Band Score (1-9)',
                  'Detailed criteria breakdown',
                  'Grammar & Vocab feedback',
                  '24-48h turnaround time'
                ].map((text, i) => (
                  <li key={i} className="flex items-start text-sm text-gray-600 leading-tight">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" /> {text}
                  </li>
                ))}
              </ul>

              <div className="border-t border-gray-100 pt-4 mb-6">
                <div className="flex justify-between items-center font-bold text-xl text-gray-900">
                  <span>Total</span>
                  <span>${selectedEssayType?.price || '0.00'}</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || !isValid}
                className="w-full bg-indigo-600 text-white font-bold py-4 rounded-xl hover:bg-indigo-700 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center shadow-lg shadow-indigo-100"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                  <><CreditCard className="w-5 h-5 mr-2" /> Proceed to Payment</>
                )}
              </button>

              <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
                <p className="text-[10px] text-blue-800 leading-relaxed">
                  <strong className="block mb-1 uppercase tracking-tighter">Demo Mode:</strong>
                  Use card number <code className="bg-white px-1 font-mono">4242 4242 4242 4242</code> with any future date and 3-digit CVC to test the integration.
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SubmitEssay;