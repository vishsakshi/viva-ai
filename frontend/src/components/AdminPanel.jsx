import { useState, useEffect, useRef } from 'react';
import { adminAPI } from '../api';

export default function AdminPanel() {
  const [stats, setStats] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [uploadResult, setUploadResult] = useState(null);
  const [genResult, setGenResult] = useState(null);
  const [error, setError] = useState('');
  const fileRef = useRef(null);

  useEffect(() => { fetchStats(); }, []);

  const fetchStats = async () => {
    try { const res = await adminAPI.getStats(); setStats(res.data); } catch { setStats({ text_chunks: 0, questions: 0, system_ready: false }); }
  };

  const handleUpload = async () => {
    const file = fileRef.current?.files?.[0];
    if (!file) { setError('Please select a PDF file.'); return; }
    if (!file.name.endsWith('.pdf')) { setError('Only PDF files are accepted.'); return; }
    setUploading(true); setError(''); setUploadResult(null);
    try {
      const res = await adminAPI.uploadPDF(file);
      setUploadResult(res.data);
      fetchStats();
    } catch (err) { setError(err.response?.data?.detail || 'Upload failed.'); }
    finally { setUploading(false); }
  };

  const handleGenerate = async () => {
    setGenerating(true); setError(''); setGenResult(null);
    try {
      const res = await adminAPI.generateQuestions();
      setGenResult(res.data);
      fetchStats();
    } catch (err) { setError(err.response?.data?.detail || 'Generation failed.'); }
    finally { setGenerating(false); }
  };

  return (
    <div className="min-h-screen">
      <header className="border-b border-white/5 bg-surface-900/50 backdrop-blur-lg">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75" />
              </svg>
            </div>
            <h1 className="text-lg font-bold text-white">Admin Panel</h1>
          </div>
          <a href="/" className="text-sm text-surface-200/50 hover:text-white transition-colors">← Back to Login</a>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-10">
        <h2 className="text-2xl font-bold text-white mb-2 animate-fade-in">System Administration</h2>
        <p className="text-surface-200/50 mb-8 animate-fade-in">Upload course PDFs and generate exam questions.</p>

        {error && (
          <div className="mb-6 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">{error}</div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Upload PDF */}
          <div className="glass-card p-6 animate-fade-in-delay">
            <h3 className="text-lg font-bold text-white mb-4">📄 Upload PDF Textbook</h3>
            <p className="text-sm text-surface-200/50 mb-4">Upload a course PDF to extract text and create knowledge base.</p>
            <input ref={fileRef} type="file" accept=".pdf" className="block w-full text-sm text-surface-200/50 mb-4
              file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium
              file:bg-primary-500/20 file:text-primary-400 hover:file:bg-primary-500/30 file:cursor-pointer file:transition-colors" />
            <button id="upload-pdf-btn" onClick={handleUpload} disabled={uploading} className="btn-primary w-full flex items-center justify-center gap-2">
              {uploading ? (<><svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>Uploading...</>) : 'Upload & Process'}
            </button>
            {uploadResult && (
              <div className="mt-4 p-3 rounded-lg bg-accent-500/10 border border-accent-500/20 text-accent-400 text-sm">
                ✅ {uploadResult.message}
              </div>
            )}
          </div>

          {/* Generate Questions */}
          <div className="glass-card p-6 animate-fade-in-delay-2">
            <h3 className="text-lg font-bold text-white mb-4">🧠 Generate Questions</h3>
            <p className="text-sm text-surface-200/50 mb-4">Use T5 AI model to generate exam questions from extracted text chunks.</p>
            <div className="mb-4 p-3 rounded-lg bg-surface-900/40 border border-white/5 text-sm text-surface-200/50">
              <p>Text chunks available: <span className="font-bold text-primary-400">{stats?.text_chunks ?? 0}</span></p>
              <p>Questions generated: <span className="font-bold text-primary-400">{stats?.questions ?? 0}</span></p>
            </div>
            <button id="generate-questions-btn" onClick={handleGenerate} disabled={generating || (stats && stats.text_chunks === 0)}
              className="btn-primary w-full flex items-center justify-center gap-2">
              {generating ? (<><svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>Generating (may take minutes)...</>) : 'Generate Questions'}
            </button>
            {genResult && (
              <div className="mt-4 p-3 rounded-lg bg-accent-500/10 border border-accent-500/20 text-accent-400 text-sm">
                ✅ {genResult.message}
              </div>
            )}
          </div>
        </div>

        {/* System Status */}
        <div className="glass-card p-6">
          <h3 className="text-lg font-bold text-white mb-4">📊 System Status</h3>
          <div className="flex items-center gap-4">
            <span className={`px-3 py-1.5 rounded-full text-sm font-medium ${stats?.system_ready ? 'bg-accent-500/15 text-accent-400' : 'bg-amber-500/15 text-amber-400'}`}>
              {stats?.system_ready ? '● System Ready for Viva' : '○ Need at least 10 questions'}
            </span>
          </div>
        </div>
      </main>
    </div>
  );
}
