import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { adminService } from '../../services/admin';
import { Essay } from '../../types';
import { diff_match_patch, DIFF_DELETE, DIFF_INSERT } from 'diff-match-patch'; // Import added
import { ArrowLeft, Send, Loader2, User, Calendar } from 'lucide-react';

const AdminEssayDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [essay, setEssay] = useState<Essay | null>(null);
  const [correctedContent, setCorrectedContent] = useState(''); // Changed to correctedContent for the improved version
  const [comments, setComments] = useState(''); // Single comment field
  const [overallBandScore, setOverallBandScore] = useState<number | ''>(''); // State for overall score
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (id) {
      adminService.getEssayById(id)
        .then(data => {
          setEssay(data);
          setCorrectedContent(data.content || ''); // Initialize with original content
          setComments(data.feedback?.generalComment || ''); // Initialize with existing comments if any
          setOverallBandScore(data.feedback?.overallBandScore || ''); // Initialize with existing score if any
          setLoading(false);
        })
        .catch(() => {
          setError('Failed to fetch essay');
          setLoading(false);
        });
    }
  }, [id]);

  // Diff logic re-introduced
  const diffHtml = useMemo(() => {
    if (!essay) return '';
    const dmp = new diff_match_patch();
    const diff = dmp.diff_main(essay.content, correctedContent);
    dmp.diff_cleanupSemantic(diff);
    let html = '';
    diff.forEach(part => {
      const type = part[0];
      const text = part[1].replace(/\n/g, '<br>');
      switch (type) {
        case DIFF_INSERT:
          html += `<ins class="bg-green-100 text-green-800 no-underline rounded px-1">${text}</ins>`;
          break;
        case DIFF_DELETE:
          html += `<del class="bg-red-100 text-red-800 line-through rounded px-1">${text}</del>`;
          break;
        default:
          html += `<span>${text}</span>`;
          break;
      }
    });
    return html;
  }, [essay, correctedContent]);

  const handleSubmitFeedback = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !overallBandScore) { // Ensure overallBandScore is provided
      setError('Overall Band Score is required.');
      return;
    }
    setIsSubmitting(true);
    try {
      await adminService.submitFeedback(id, {
        overallBandScore: parseFloat(overallBandScore as string), // Convert to number
        generalComment: comments,
        improvedVersion: correctedContent,
        // Other fields like taskAchievement, etc. are removed for simplicity based on user request
      });
      navigate('/admin/submissions');
    } catch (err) {
      setError('Failed to submit feedback');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="animate-spin h-12 w-12 text-indigo-600" />
      </div>
    );
  }

  if (error) return <div className="text-center py-10 text-red-500">{error}</div>;
  if (!essay) return <div className="text-center py-10">Essay not found.</div>;

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <Link to="/admin/submissions" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-700 mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to submissions
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column: Essay Content and Diff View */}
          <div className="space-y-6">
            <div className="bg-white shadow rounded-lg p-6">
              <div className="border-b pb-4 mb-4">
                <h1 className="text-xl font-bold text-gray-900">Student Submission</h1>
                <div className="flex items-center text-sm text-gray-500 mt-2">
                  <User className="mr-2 h-4 w-4" /> {essay.user?.name} ({essay.user?.email})
                </div>
                <div className="flex items-center text-sm text-gray-500 mt-1">
                  <Calendar className="mr-2 h-4 w-4" /> Submitted on {new Date(essay.submittedAt).toLocaleDateString()}
                </div>
              </div>
              <h2 className="text-lg font-semibold text-gray-800 mb-2">Original Essay</h2>
              <div className="prose max-w-none text-gray-700 bg-gray-50 p-4 rounded-md">
                <p style={{ whiteSpace: 'pre-wrap' }}>{essay.content}</p>
              </div>
            </div>

            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-2">Corrected Version (Diff View)</h2>
              <div className="prose max-w-none text-gray-700 bg-gray-50 p-4 rounded-md" dangerouslySetInnerHTML={{ __html: diffHtml }} />
            </div>
          </div>

          {/* Right Column: Feedback Form */}
          <form onSubmit={handleSubmitFeedback} className="bg-white shadow rounded-lg p-6 space-y-6">
            <h2 className="text-xl font-bold text-gray-900">Provide Feedback</h2>

            <div>
              <label htmlFor="overallBandScore" className="block text-sm font-medium text-gray-700">Overall Band Score</label>
              <input
                type="number"
                id="overallBandScore"
                name="overallBandScore"
                min="0"
                max="9"
                step="0.5"
                value={overallBandScore}
                onChange={(e) => setOverallBandScore(e.target.value as unknown as number)}
                required
                className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div>
              <label htmlFor="comments" className="block text-sm font-medium text-gray-700">General Comments</label>
              <textarea
                id="comments"
                name="comments"
                rows={10}
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div>
              <label htmlFor="improvedVersion" className="block text-sm font-medium text-gray-700">Improved Version</label>
              <textarea
                id="improvedVersion"
                name="improvedVersion"
                rows={15}
                value={correctedContent}
                onChange={(e) => setCorrectedContent(e.target.value)}
                className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-400"
              >
                {isSubmitting ? <Loader2 className="animate-spin h-5 w-5 mr-2" /> : <Send className="h-5 w-5 mr-2" />}
                {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminEssayDetail;
