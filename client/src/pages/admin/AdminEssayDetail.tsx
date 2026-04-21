import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { adminService } from '../../services/admin';
import { Essay, EssayFeedback } from '../../types';
import { diff_match_patch, DIFF_DELETE, DIFF_INSERT } from 'diff-match-patch';
import { ArrowLeft, Send, Loader2, User, Calendar, PlusCircle, Eye, CheckCircle2, MessageSquare, History } from 'lucide-react';

const AdminEssayDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [essay, setEssay] = useState<Essay | null>(null);
  const [feedbackHistory, setFeedbackHistory] = useState<EssayFeedback[]>([]);
  
  const [viewMode, setViewMode] = useState<'history' | 'new_feedback'>('history');
  const [selectedFeedback, setSelectedFeedback] = useState<EssayFeedback | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [newFeedback, setNewFeedback] = useState({
    comments: '',
    improvedVersion: '',
    overallBandScore: '' as number | '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (id) {
      Promise.all([
        adminService.getEssayById(id),
        adminService.getFeedbackHistory(id)
      ])
      .then(([essayData, historyData]) => {
        setEssay(essayData);
        setFeedbackHistory(historyData);
        setNewFeedback(prev => ({ ...prev, improvedVersion: essayData.content }));
      })
      .catch(() => setError('Failed to fetch essay data.'))
      .finally(() => setLoading(false));
    }
  }, [id]);

  const diffHtml = useMemo(() => {
    if (!essay || !selectedFeedback) return [];
    const dmp = new diff_match_patch();
    const diff = dmp.diff_main(essay.content, selectedFeedback.improvedVersion || '');
    dmp.diff_cleanupSemantic(diff);
    return diff.map(([type, text], index) => {
      text = text.replace(/\n/g, '<br>');
      if (type === DIFF_INSERT) return <ins key={index} className="bg-green-100 text-green-800 no-underline rounded px-1" dangerouslySetInnerHTML={{ __html: text }} />;
      if (type === DIFF_DELETE) return <del key={index} className="bg-red-100 text-red-800 line-through rounded px-1" dangerouslySetInnerHTML={{ __html: text }} />;
      return <span key={index} dangerouslySetInnerHTML={{ __html: text }} />;
    });
  }, [essay, selectedFeedback]);

  const liveDiffHtml = useMemo(() => {
    if (!essay) return [];
    const dmp = new diff_match_patch();
    const diff = dmp.diff_main(essay.content, newFeedback.improvedVersion);
    dmp.diff_cleanupSemantic(diff);
    return diff.map(([type, text], index) => {
      text = text.replace(/\n/g, '<br>');
      if (type === DIFF_INSERT) return <ins key={index} className="bg-green-100 text-green-800 no-underline rounded px-1" dangerouslySetInnerHTML={{ __html: text }} />;
      if (type === DIFF_DELETE) return <del key={index} className="bg-red-100 text-red-800 line-through rounded px-1" dangerouslySetInnerHTML={{ __html: text }} />;
      return <span key={index} dangerouslySetInnerHTML={{ __html: text }} />;
    });
  }, [essay, newFeedback.improvedVersion]);

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewFeedback(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmitFeedback = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || newFeedback.overallBandScore === '') {
      setError('Overall Band Score is required.');
      return;
    }
    setIsSubmitting(true);
    try {
      await adminService.submitFeedback(id, {
        ...newFeedback,
        overallBandScore: parseFloat(String(newFeedback.overallBandScore)),
      });
      navigate(0); // Reload the page to show the new review in the history
    } catch (err) {
      setError('Failed to submit feedback');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <div className="flex justify-center items-center h-64"><Loader2 className="animate-spin h-12 w-12 text-indigo-600" /></div>;
  if (error) return <div className="text-center py-10 text-red-500">{error}</div>;
  if (!essay) return <div className="text-center py-10">Essay not found.</div>;

    return (
      <div className="min-h-screen bg-slate-50">
        {/* Header Sticky */}
        <nav className="bg-white border-b border-slate-200 sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
            <Link to="/admin/submissions" className="group flex items-center text-sm font-medium text-slate-500 hover:text-indigo-600 transition-colors">
              <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
              Back to Submissions
            </Link>
            <div className="flex items-center space-x-2">
              <span className="px-2 py-1 bg-indigo-50 text-indigo-700 text-xs font-bold rounded uppercase tracking-wider">Review Mode</span>
            </div>
          </div>
        </nav>

        <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* LEFT: Student Submission Reference */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-white shadow-sm border border-slate-200 rounded-xl p-6 sticky top-24">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h1 className="text-xl font-black text-slate-900">Student Submission</h1>
                    <div className="mt-2 space-y-1">
                      <div className="flex items-center text-sm text-slate-600">
                        <User className="mr-2 h-4 w-4 text-slate-400" />
                        <span className="font-medium">{essay.user?.name}</span>
                      </div>
                      <div className="flex items-center text-sm text-slate-500">
                        <Calendar className="mr-2 h-4 w-4 text-slate-400" />
                        {new Date(essay.submittedAt).toLocaleDateString(undefined, { dateStyle: 'long' })}
                      </div>
                    </div>
                  </div>
                  <div className="bg-slate-100 p-2 rounded-lg">
                    <MessageSquare className="h-5 w-5 text-slate-400" />
                  </div>
                </div>

                <div className="space-y-4">
                  <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Original Text</h2>
                  <div className="prose prose-slate max-w-none text-slate-700 bg-slate-50 p-5 rounded-xl border border-slate-100 h-[calc(100vh-400px)] overflow-y-auto leading-relaxed italic">
                    <p style={{ whiteSpace: 'pre-wrap' }}>"{essay.content}"</p>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT: Action Area (History or Form) */}
            <div className="lg:col-span-7">
              <div className="bg-white shadow-sm border border-slate-200 rounded-xl overflow-hidden transition-all">
                
                {/* Tabs-like Header */}
                <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4 bg-slate-50/50">
                  <h2 className="flex items-center font-bold text-slate-800">
                    {viewMode === 'history' ? (
                      <><History className="mr-2 h-5 w-5 text-indigo-500" /> Feedback History</>
                    ) : (
                      <><PlusCircle className="mr-2 h-5 w-5 text-green-500" /> New Evaluation</>
                    )}
                  </h2>
                  {viewMode === 'history' && (
                    <button
                      onClick={() => { setViewMode('new_feedback'); setSelectedFeedback(null); }}
                      className="flex items-center px-4 py-2 bg-indigo-600 text-white text-sm font-bold rounded-lg hover:bg-indigo-700 transition-all shadow-md shadow-indigo-100"
                    >
                      <PlusCircle className="mr-2 h-4 w-4" /> Create Review
                    </button>
                  )}
                </div>

                <div className="p-6">
                  {viewMode === 'history' ? (
                    <div className="space-y-6">
                      {feedbackHistory.length === 0 ? (
                        <div className="text-center py-12">
                          <History className="mx-auto h-12 w-12 text-slate-200 mb-4" />
                          <p className="text-slate-500">No reviews submitted yet.</p>
                        </div>
                      ) : (
                        <div className="grid gap-4">
                          {feedbackHistory.map(fb => (
                            <div 
                              key={fb.id} 
                              onClick={() => setSelectedFeedback(fb)}
                              className={`p-4 rounded-xl border transition-all cursor-pointer flex justify-between items-center ${
                                selectedFeedback?.id === fb.id ? 'border-indigo-500 bg-indigo-50/30' : 'border-slate-100 hover:border-slate-300'
                              }`}
                            >
                              <div className="flex items-center space-x-4">
                                <div className="h-10 w-10 bg-indigo-100 text-indigo-700 flex items-center justify-center rounded-full font-black">
                                  {fb.overallBandScore}
                                </div>
                                <div>
                                  <p className="font-bold text-slate-800">Band Score {fb.overallBandScore}</p>
                                  <p className="text-xs text-slate-400 uppercase font-semibold">
                                    {new Date(fb.completedAt).toLocaleDateString()}
                                  </p>
                                </div>
                              </div>
                              <Eye className={`h-5 w-5 ${selectedFeedback?.id === fb.id ? 'text-indigo-500' : 'text-slate-300'}`} />
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Feedback Detail View */}
                      {selectedFeedback && (
                        <div className="mt-8 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                          <div className="p-5 bg-slate-900 rounded-xl text-white">
                            <h3 className="text-sm font-bold text-indigo-300 uppercase mb-3">General Comments</h3>
                            <p className="text-slate-200 leading-relaxed italic">"{selectedFeedback.comments}"</p>
                          </div>
                          
                          <div>
                            <h3 className="font-bold text-slate-800 mb-3 flex items-center">
                              <CheckCircle2 className="mr-2 h-5 w-5 text-green-500" />
                              Corrected Version (Diff)
                            </h3>
                            <div className="bg-white border border-slate-200 p-5 rounded-xl prose-sm max-w-none leading-loose shadow-inner">
                              {diffHtml}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    /* SUBMISSION FORM */
                    <form onSubmit={handleSubmitFeedback} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-sm font-bold text-slate-700">Overall Band Score</label>
                          <input 
                            type="number" name="overallBandScore" min="0" max="9" step="0.5" 
                            value={newFeedback.overallBandScore} onChange={handleFormChange} required 
                            className="block w-full rounded-lg border-slate-200 bg-slate-50 focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all font-bold text-lg" 
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700">General Comments & Advice</label>
                        <textarea 
                          name="comments" rows={5} 
                          value={newFeedback.comments} onChange={handleFormChange}
                          placeholder="Provide structural and grammatical advice..."
                          className="block w-full rounded-lg border-slate-200 bg-slate-50 focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all resize-none p-4"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700">Improved Text (Edit here)</label>
                        <textarea 
                          name="improvedVersion" rows={10} 
                          value={newFeedback.improvedVersion} onChange={handleFormChange}
                          className="block w-full rounded-lg border-slate-200 bg-slate-50 font-mono text-sm focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all p-4"
                        />
                      </div>

                      <div className="pt-4 border-t border-slate-100">
                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3 block">Live Diff Preview</label>
                        <div className="bg-slate-50 border border-slate-100 p-5 rounded-xl prose-sm max-w-none h-64 overflow-y-auto leading-loose shadow-inner">
                          {liveDiffHtml}
                        </div>
                      </div>

                      <div className="flex items-center justify-end space-x-3 pt-6">
                        <button 
                          type="button" onClick={() => setViewMode('history')} 
                          className="px-6 py-2 text-sm font-bold text-slate-500 hover:text-slate-800 transition-colors"
                        >
                          Discard
                        </button>
                        <button 
                          type="submit" disabled={isSubmitting} 
                          className="flex items-center px-8 py-3 bg-indigo-600 text-white font-bold rounded-xl shadow-lg shadow-indigo-100 hover:bg-indigo-700 active:scale-95 transition-all disabled:opacity-50"
                        >
                          {isSubmitting ? <Loader2 className="animate-spin h-5 w-5 mr-2" /> : <Send className="h-5 w-5 mr-2" />}
                          Publish Review
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
};

export default AdminEssayDetail;
