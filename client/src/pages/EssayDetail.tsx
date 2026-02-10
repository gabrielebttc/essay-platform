import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link, useSearchParams } from 'react-router-dom';
import { essayService } from '../services/essay';
import { Essay, EssayType } from '../types';
import { diff_match_patch, DIFF_DELETE, DIFF_INSERT } from 'diff-match-patch';
import { ArrowLeft, Book, Calendar, Clock, Edit, Loader2 } from 'lucide-react';

const EssayDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const reviewKey = searchParams.get('reviewKey');
  const [essay, setEssay] = useState<Essay | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [essayTypes, setEssayTypes] = useState<EssayType[]>([]);

  useEffect(() => {
    if (id) {
      Promise.all([essayService.getMyEssays(), essayService.getEssayTypes()])
        .then(([fetchedEssays, fetchedEssayTypes]) => {
          setEssayTypes(fetchedEssayTypes);
          
          // Helper to generate the unique key for an essay, mirroring the logic in EssayList
          const getUniqueKey = (essay: Essay, idCounts: { [key: string]: number }) => {
            idCounts[essay.id] = (idCounts[essay.id] || 0) + 1;
            const reviewCount = idCounts[essay.id];
            return reviewCount > 1 ? `${essay.id}-review-${reviewCount}` : essay.id;
          };

          const sortedEssays = fetchedEssays.sort((a, b) => new Date(a.submittedAt).getTime() - new Date(b.submittedAt).getTime());
          
          const idCounts: { [key: string]: number } = {};
          const targetEssay = sortedEssays.find(e => {
            const uniqueKey = getUniqueKey(e, idCounts);
            return e.id === id && uniqueKey === reviewKey;
          });

          if (targetEssay) {
            setEssay(targetEssay);
          } else {
            // Fallback to the first essay with the matching ID if no reviewKey is found (for older links)
            const firstMatch = sortedEssays.find(e => e.id === id);
            if (firstMatch) {
              setEssay(firstMatch);
            } else {
              setError('Essay not found.');
            }
          }
        })
        .catch((err) => setError(`Failed to fetch data: ${err.message}`))
        .finally(() => setLoading(false));
    }
  }, [id, reviewKey]);

  const getTaskTypeName = (taskTypeId: string) => {
    const type = essayTypes.find(et => et.id === taskTypeId);
    return type ? type.name : 'Unknown Task Type';
  };

  const diffHtml = useMemo(() => {
    if (!essay?.content || !essay.feedback?.improvedVersion) return `<p style="white-space: pre-wrap">${essay?.content || ''}</p>`;
    const dmp = new diff_match_patch();
    const diff = dmp.diff_main(essay.content, essay.feedback.improvedVersion);
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
  }, [essay]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="animate-spin h-12 w-12 text-indigo-600" />
      </div>
    );
  }

  if (error || !essay) {
    return <div className="text-center py-10 text-red-500">{error || 'Essay not found'}</div>;
  }

  const ScoreCard: React.FC<{ title: string, score?: number }> = ({ title, score }) => (
    <div className="bg-gray-50 rounded-lg p-4">
      <div className="flex justify-between items-center">
        <h4 className="font-semibold text-gray-700">{title}</h4>
        {score !== undefined && <span className="text-xl font-bold text-indigo-600">{score}</span>}
      </div>
    </div>
  );

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <Link to="/essays" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-700 mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to my essays
        </Link>

        <header className="bg-white shadow rounded-lg p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-900">IELTS Writing {getTaskTypeName(essay.taskTypeId)}</h1>
          <div className="text-sm text-gray-500 mt-2 flex items-center">
            <Calendar className="mr-2 h-4 w-4" />
            Submitted on {new Date(essay.submittedAt).toLocaleDateString()}
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white shadow rounded-lg overflow-hidden">
              <div className="p-6">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                  <Book className="mr-3 h-6 w-6 text-indigo-600" />
                  Your Essay
                </h2>
                <div className="mt-4 prose max-w-none text-gray-700">
                  <p style={{ whiteSpace: 'pre-wrap' }}>{essay.content}</p>
                </div>
              </div>
            </div>
            
            {essay.feedback && (
              <div className="bg-white shadow rounded-lg overflow-hidden">
                <div className="p-6">
                  <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                    <Edit className="mr-3 h-6 w-6 text-green-600" />
                    Corrected Version
                  </h2>
                  <div className="mt-4 prose max-w-none text-gray-700" dangerouslySetInnerHTML={{ __html: diffHtml }} />
                </div>
              </div>
            )}
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white shadow rounded-lg p-6 sticky top-6">
              {essay.feedback ? (
                <div className="space-y-4">
                  <h2 className="text-xl font-bold text-gray-900 text-center mb-4">Feedback Report</h2>
                  <div className="text-center">
                    <p className="text-gray-600">Overall Band Score</p>
                    <p className="text-5xl font-extrabold text-indigo-600 my-2">{essay.feedback.overallBandScore}</p>
                  </div>
                  <ScoreCard title="Task Achievement" score={essay.feedback.taskAchievement} />
                  <ScoreCard title="Coherence & Cohesion" score={essay.feedback.coherence} />
                  <ScoreCard title="Lexical Resource" score={essay.feedback.lexicalResource} />
                  <ScoreCard title="Grammatical Range & Accuracy" score={essay.feedback.grammaticalRange} />
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-700">General Comment</h4>
                    <p className="mt-2 text-sm text-gray-600" style={{ whiteSpace: 'pre-wrap' }}>{essay.feedback.comments}</p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-10">
                  <Clock className="mx-auto h-12 w-12 text-gray-400" />
                  <h2 className="mt-2 text-lg font-medium text-gray-900">Pending Feedback</h2>
                  <p className="mt-1 text-sm text-gray-500">Your essay is being reviewed. Feedback will appear here once completed.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EssayDetail;
