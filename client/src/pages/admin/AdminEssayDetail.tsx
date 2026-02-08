import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { adminService } from '../../services/admin';
import { Essay, EssayFeedback } from '../../types';
import { diff_match_patch, DIFF_DELETE, DIFF_INSERT } from 'diff-match-patch';
import { ArrowLeft, Send, Loader2, User, Calendar, PlusCircle, Eye } from 'lucide-react';

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
        overallBandScore: parseFloat(newFeedback.overallBandScore as string),
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
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <Link to="/admin/submissions" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-700 mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Submission History
        </Link>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white shadow rounded-lg p-6 self-start sticky top-6">
            <div className="border-b pb-4 mb-4">
              <h1 className="text-xl font-bold text-gray-900">Student Submission</h1>
              <div className="flex items-center text-sm text-gray-500 mt-2"><User className="mr-2 h-4 w-4" /> {essay.user?.name} ({essay.user?.email})</div>
              <div className="flex items-center text-sm text-gray-500 mt-1"><Calendar className="mr-2 h-4 w-4" /> Submitted on {new Date(essay.submittedAt).toLocaleDateString()}</div>
            </div>
            <h2 className="text-lg font-semibold text-gray-800 mb-2">Original Essay</h2>
            <div className="prose max-w-none text-gray-700 bg-gray-50 p-4 rounded-md h-96 overflow-y-auto">
              <p style={{ whiteSpace: 'pre-wrap' }}>{essay.content}</p>
            </div>
          </div>
          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900">Review History</h2>
              <button
                onClick={() => { setViewMode('new_feedback'); setSelectedFeedback(null); }}
                className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
              >
                <PlusCircle className="mr-2 h-4 w-4" /> New Review
              </button>
            </div>
            {viewMode === 'history' ? (
              <div className="space-y-4">
                {feedbackHistory.length === 0 ? (
                  <p>No reviews yet for this essay.</p>
                ) : (
                  <ul className="divide-y divide-gray-200">
                    {feedbackHistory.map(fb => (
                      <li key={fb.id} className="py-3 flex justify-between items-center">
                        <div>
                          <p className="font-semibold">Score: {fb.overallBandScore}</p>
                          <p className="text-sm text-gray-500">Reviewed on {new Date(fb.completedAt).toLocaleDateString()}</p>
                        </div>
                        <button onClick={() => setSelectedFeedback(fb)} className="text-indigo-600 hover:text-indigo-800"><Eye className="h-5 w-5" /></button>
                      </li>
                    ))}
                  </ul>
                )}
                {selectedFeedback && (
                  <div className="mt-6 pt-4 border-t">
                    <h3 className="text-lg font-bold">Review Details</h3>
                    <p><strong>Overall Score:</strong> {selectedFeedback.overallBandScore}</p>
                    <p className="mt-2"><strong>Comments:</strong></p>
                    <p className="text-sm bg-gray-50 p-2 rounded" style={{ whiteSpace: 'pre-wrap' }}>{selectedFeedback.comments}</p>
                    <h4 className="font-semibold mt-4">Corrected Version (Diff)</h4>
                    <div className="prose max-w-none text-gray-700 bg-gray-50 p-4 rounded-md mt-2">{diffHtml}</div>
                  </div>
                )}
              </div>
            ) : (
              <form onSubmit={handleSubmitFeedback} className="space-y-6">
                <div>
                  <label htmlFor="overallBandScore" className="block text-sm font-medium text-gray-700">Overall Band Score</label>
                  <input type="number" id="overallBandScore" name="overallBandScore" min="0" max="9" step="0.5" value={newFeedback.overallBandScore} onChange={handleFormChange} required className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md" />
                </div>
                <div>
                  <label htmlFor="comments" className="block text-sm font-medium text-gray-700">General Comments</label>
                  <textarea id="comments" name="comments" rows={8} value={newFeedback.comments} onChange={handleFormChange} className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md" />
                </div>
                <div>
                  <label htmlFor="improvedVersion" className="block text-sm font-medium text-gray-700">Improved Version</label>
                  <textarea id="improvedVersion" name="improvedVersion" rows={12} value={newFeedback.improvedVersion} onChange={handleFormChange} className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md" />
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-gray-700">Live Diff View</h4>
                  <div className="prose max-w-none text-gray-700 bg-gray-50 p-4 rounded-md mt-2 h-64 overflow-y-auto">{liveDiffHtml}</div>
                </div>
                <div className="flex items-center justify-end space-x-2">
                  <button type="button" onClick={() => setViewMode('history')} className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md text-sm">Cancel</button>
                  <button type="submit" disabled={isSubmitting} className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400">
                    {isSubmitting ? <Loader2 className="animate-spin h-5 w-5 mr-2" /> : <Send className="h-5 w-5 mr-2" />}
                    Submit Feedback
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminEssayDetail;
