
import React, { useState, useRef } from 'react';
import { Review, Institute, MediaReview } from '../types';
import { GoogleGenAI } from '@google/genai';
import { 
  MessageSquare, 
  Star, 
  CheckCircle, 
  Search, 
  Plus, 
  Image as ImageIcon, 
  Play, 
  Volume2, 
  Camera, 
  ShieldCheck, 
  Upload, 
  X, 
  Loader2, 
  AlertCircle,
  FileCheck,
  Film,
  Trash2
} from 'lucide-react';

interface CommunityProps {
  role: string;
  isVerified: boolean;
  selectedInstitute: Institute | null;
}

const Community: React.FC<CommunityProps> = ({ role, isVerified: initialVerified, selectedInstitute }) => {
  const [reviews, setReviews] = useState<Review[]>([
    {
      id: '1',
      author: 'Aarav S.',
      role: 'student',
      rating: 4,
      comment: "Good infrastructure, but the hidden 'event fees' every month are becoming too much. Verified through ID card.",
      tags: ['fees', 'events'],
      isVerified: true,
      date: '2024-03-15',
      instituteId: '1',
      media: [{ type: 'image', url: 'https://images.unsplash.com/photo-1541339907198-e08756ebafe3?auto=format&fit=crop&w=800&q=80' }]
    },
    {
      id: '2',
      author: 'Meera Patel',
      role: 'parent',
      rating: 2,
      comment: "Disappointed with the sudden 15% hike in book charges. The quality of books doesn't justify the price.",
      tags: ['books', 'fees'],
      isVerified: true,
      date: '2024-03-10',
      instituteId: '1'
    }
  ]);

  const [isPosting, setIsPosting] = useState(false);
  const [verificationStep, setVerificationStep] = useState<'none' | 'upload' | 'processing' | 'success'>('none');
  const [isUserVerified, setIsUserVerified] = useState(initialVerified);
  const [newReview, setNewReview] = useState({
    rating: 5,
    comment: '',
    tags: [] as string[],
    media: [] as MediaReview[]
  });
  const [processingStatus, setProcessingStatus] = useState('');
  const [error, setError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const mediaInputRef = useRef<HTMLInputElement>(null);

  const handleStartReview = () => {
    if (role === 'guest') {
      setError("Guests cannot post reviews. Please login as a Student or Parent.");
      return;
    }
    setIsPosting(true);
    if (!isUserVerified) {
      setVerificationStep('upload');
    }
  };

  const handleIdUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setVerificationStep('processing');
    setProcessingStatus("Scanning ID Document...");
    setError(null);

    try {
      const reader = new FileReader();
      const base64Promise = new Promise<string>((resolve) => {
        reader.onload = () => resolve((reader.result as string).split(',')[1]);
        reader.readAsDataURL(file);
      });
      const base64Data = await base64Promise;

      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: {
          parts: [
            { inlineData: { data: base64Data, mimeType: file.type } },
            { text: `Simulate an identity verification. Check if this document looks like a Student or Parent ID. 
                    Verify it against the institute: ${selectedInstitute?.name || 'Academic Institution'}. 
                    If it looks valid, respond with "VERIFIED: [Name]". Otherwise respond with "REJECTED: [Reason]".` }
          ]
        }
      });

      const result = response.text || '';
      if (result.includes("VERIFIED")) {
        setProcessingStatus("Identity Confirmed. Linking account to " + (selectedInstitute?.name || "Institute"));
        setTimeout(() => {
          setIsUserVerified(true);
          setVerificationStep('success');
        }, 1500);
      } else {
        setError("Verification failed: The AI could not confirm your identity from the uploaded image. Please try a clearer photo.");
        setVerificationStep('upload');
      }
    } catch (err) {
      console.error(err);
      setError("An error occurred during verification. Please try again.");
      setVerificationStep('upload');
    }
  };

  const handleMediaSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Fix: Explicitly cast to File[] to avoid 'unknown' type issues during iteration and fix property access errors
    const files = Array.from(e.target.files || []) as File[];
    if (files.length === 0) return;

    const newMediaItems: MediaReview[] = files.map(file => {
      let type: 'image' | 'audio' | 'video' = 'image';
      // Fix: file is now correctly inferred as File, resolving 'unknown' property access for type and createObjectURL
      if (file.type.startsWith('audio/')) type = 'audio';
      if (file.type.startsWith('video/')) type = 'video';
      
      return {
        type,
        url: URL.createObjectURL(file),
        thumbnail: type === 'image' ? URL.createObjectURL(file) : undefined
      };
    });

    setNewReview(prev => ({
      ...prev,
      media: [...prev.media, ...newMediaItems]
    }));
  };

  const removeMedia = (index: number) => {
    setNewReview(prev => {
      const updatedMedia = [...prev.media];
      // Clean up object URL to prevent memory leaks
      URL.revokeObjectURL(updatedMedia[index].url);
      updatedMedia.splice(index, 1);
      return { ...prev, media: updatedMedia };
    });
  };

  const handleSubmitReview = () => {
    const review: Review = {
      id: Math.random().toString(36).substring(7),
      author: role === 'student' ? 'Alex (Me)' : 'Verified Parent',
      role: role as 'student' | 'parent',
      rating: newReview.rating,
      comment: newReview.comment,
      tags: newReview.tags,
      isVerified: true,
      date: new Date().toISOString().split('T')[0],
      instituteId: selectedInstitute?.id || '1',
      media: newReview.media
    };

    setReviews([review, ...reviews]);
    setIsPosting(false);
    setVerificationStep('none');
    setNewReview({ rating: 5, comment: '', tags: [], media: [] });
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-outfit font-bold text-slate-50">Transparency Hub</h1>
          <p className="text-slate-400 mt-2">Verified reports and media reviews for educational institutions.</p>
        </div>
        <button 
          onClick={handleStartReview}
          className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 transition-all rounded-xl font-bold shadow-lg shadow-blue-600/20 active:scale-95"
        >
          <Plus size={18} />
          Post Verified Report
        </button>
      </header>

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-3 text-red-400 animate-in slide-in-from-top-2">
          <AlertCircle size={20} />
          <p className="text-sm font-medium">{error}</p>
          <button onClick={() => setError(null)} className="ml-auto text-red-400 hover:text-white">✕</button>
        </div>
      )}

      {/* Posting Modal */}
      {isPosting && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-950/90 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-slate-800 flex justify-between items-center">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <FileCheck className="text-blue-500" />
                Submit Trusted Review
              </h2>
              <button onClick={() => { setIsPosting(false); setVerificationStep('none'); }} className="text-slate-500 hover:text-white">✕</button>
            </div>

            <div className="p-8 overflow-y-auto custom-scrollbar">
              {verificationStep === 'upload' && (
                <div className="space-y-6 text-center py-4">
                  <div className="w-20 h-20 bg-blue-600/10 rounded-full flex items-center justify-center mx-auto text-blue-500">
                    <ShieldCheck size={40} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-2">Identify Verification Required</h3>
                    <p className="text-slate-400 max-w-md mx-auto">
                      To build trust in our community, we require students and parents to verify their link to 
                      <span className="text-blue-400 font-bold"> {selectedInstitute?.name || 'their institute'}</span>.
                    </p>
                  </div>
                  
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-slate-800 rounded-3xl p-12 hover:border-blue-500/50 hover:bg-slate-800/20 transition-all cursor-pointer group"
                  >
                    <Upload className="mx-auto mb-4 text-slate-500 group-hover:text-blue-400" size={32} />
                    <p className="text-slate-300 font-bold">Upload Student/Staff ID Card</p>
                    <p className="text-slate-500 text-xs mt-2">Our AI will instantly verify your affiliation. Data is processed securely.</p>
                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      className="hidden" 
                      accept="image/*" 
                      onChange={handleIdUpload}
                    />
                  </div>
                </div>
              )}

              {verificationStep === 'processing' && (
                <div className="text-center py-20">
                  <Loader2 size={48} className="text-blue-500 animate-spin mx-auto mb-6" />
                  <h3 className="text-xl font-bold text-white mb-2">{processingStatus}</h3>
                  <p className="text-slate-500">Gemini AI is analyzing document details...</p>
                </div>
              )}

              {(isUserVerified || verificationStep === 'success') && (
                <div className="space-y-6 animate-in slide-in-from-bottom-4">
                  {verificationStep === 'success' && (
                    <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center gap-3 text-emerald-400 mb-6">
                      <CheckCircle size={20} />
                      <p className="text-sm font-bold">Identity Verified Successfully!</p>
                    </div>
                  )}

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Overall Rating</label>
                      <div className="flex gap-1 text-amber-500">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <button 
                            key={s} 
                            onClick={() => setNewReview({ ...newReview, rating: s })}
                            className="hover:scale-110 transition-transform"
                          >
                            <Star size={24} fill={s <= newReview.rating ? "currentColor" : "none"} />
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Comment</label>
                      <textarea 
                        value={newReview.comment}
                        onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                        placeholder="Share your honest experience about fees, books, or facilities..."
                        className="w-full h-32 bg-slate-950 border border-slate-800 rounded-2xl p-4 text-slate-200 outline-none focus:ring-2 focus:ring-blue-500/50 transition-all resize-none"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Media Attachments</label>
                      <div className="grid grid-cols-2 gap-4">
                        <button 
                          onClick={() => {
                            if (mediaInputRef.current) {
                              mediaInputRef.current.accept = "image/*";
                              mediaInputRef.current.click();
                            }
                          }}
                          className="p-4 bg-slate-950 border border-slate-800 rounded-2xl flex items-center justify-center gap-2 text-slate-400 hover:text-white transition-all border-dashed"
                        >
                          <ImageIcon size={20} />
                          Attach Photos
                        </button>
                        <button 
                          onClick={() => {
                            if (mediaInputRef.current) {
                              mediaInputRef.current.accept = "video/*,audio/*";
                              mediaInputRef.current.click();
                            }
                          }}
                          className="p-4 bg-slate-950 border border-slate-800 rounded-2xl flex items-center justify-center gap-2 text-slate-400 hover:text-white transition-all border-dashed"
                        >
                          <Film size={20} />
                          Video/Audio
                        </button>
                        <input 
                          type="file" 
                          multiple 
                          ref={mediaInputRef} 
                          className="hidden" 
                          onChange={handleMediaSelect}
                        />
                      </div>

                      {/* Pending Media Previews */}
                      {newReview.media.length > 0 && (
                        <div className="flex flex-wrap gap-3 mt-4">
                          {newReview.media.map((m, idx) => (
                            <div key={idx} className="relative w-24 h-24 rounded-xl border border-slate-800 overflow-hidden group">
                              {m.type === 'image' && <img src={m.url} className="w-full h-full object-cover" alt="preview" />}
                              {m.type === 'video' && (
                                <div className="w-full h-full flex items-center justify-center bg-slate-950">
                                  <Play size={24} className="text-blue-500" />
                                </div>
                              )}
                              {m.type === 'audio' && (
                                <div className="w-full h-full flex items-center justify-center bg-slate-950">
                                  <Volume2 size={24} className="text-emerald-500" />
                                </div>
                              )}
                              <button 
                                onClick={() => removeMedia(idx)}
                                className="absolute top-1 right-1 p-1 bg-red-500 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                              >
                                <Trash2 size={12} className="text-white" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="p-6 bg-slate-950 border-t border-slate-800 flex justify-end gap-3">
              <button 
                onClick={() => { setIsPosting(false); setVerificationStep('none'); }}
                className="px-6 py-2 text-slate-500 font-bold hover:text-white transition-colors"
              >
                Cancel
              </button>
              {(isUserVerified || verificationStep === 'success') && (
                <button 
                  onClick={handleSubmitReview}
                  disabled={!newReview.comment.trim()}
                  className="px-8 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-800 disabled:text-slate-600 rounded-xl font-bold text-white transition-all shadow-lg shadow-blue-600/20"
                >
                  Post Review
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Media Interaction Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-6 bg-slate-900/50 border border-slate-800 rounded-3xl flex items-center gap-4 group hover:border-blue-500/30 transition-all">
          <div className="w-12 h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-500 group-hover:scale-110 transition-transform"><Camera size={24} /></div>
          <div><p className="font-bold">Photo Reviews</p><p className="text-xs text-slate-500">Facility & book condition</p></div>
        </div>
        <div className="p-6 bg-slate-900/50 border border-slate-800 rounded-3xl flex items-center gap-4 group hover:border-emerald-500/30 transition-all">
          <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-500 group-hover:scale-110 transition-transform"><Volume2 size={24} /></div>
          <div><p className="font-bold">Audio Reports</p><p className="text-xs text-slate-500">Verified student accounts</p></div>
        </div>
        <div className="p-6 bg-slate-900/50 border border-slate-800 rounded-3xl flex items-center gap-4 group hover:border-purple-500/30 transition-all">
          <div className="w-12 h-12 bg-purple-500/10 rounded-2xl flex items-center justify-center text-purple-500 group-hover:scale-110 transition-transform"><Play size={24} /></div>
          <div><p className="font-bold">Video Tours</p><p className="text-xs text-slate-500">Campus orientation & events</p></div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {reviews.map((review) => (
          <div key={review.id} className="bg-slate-900/40 border border-slate-800 rounded-3xl p-6 transition-all hover:bg-slate-900 group">
            <div className="flex flex-col md:flex-row gap-8">
              <div className="flex-1">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center font-bold text-blue-500 uppercase">{review.author[0]}</div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-100">{review.author}</span>
                        {review.isVerified && (
                          <div className="flex items-center gap-1 px-2 py-0.5 bg-blue-500/10 rounded text-[10px] text-blue-400 border border-blue-500/20 font-bold uppercase">
                            <ShieldCheck size={10} />
                            Verified
                          </div>
                        )}
                      </div>
                      <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">{review.role} • {review.date}</span>
                    </div>
                  </div>
                  <div className="flex gap-1 text-amber-500">
                    {[...Array(5)].map((_, i) => <Star key={i} size={14} fill={i < review.rating ? "currentColor" : "none"} />)}
                  </div>
                </div>
                <p className="text-slate-300 mb-6 italic leading-relaxed">"{review.comment}"</p>
                <div className="flex flex-wrap gap-2 mb-6">
                  {review.tags.map(tag => <span key={tag} className="px-2 py-1 bg-blue-500/10 text-blue-400 text-[10px] font-bold uppercase rounded-md border border-blue-500/20">#{tag}</span>)}
                </div>

                {/* Inline Media Gallery */}
                {review.media && review.media.length > 0 && (
                  <div className="flex flex-wrap gap-3 mt-4">
                    {review.media.map((m, idx) => (
                      <div key={idx} className="relative w-32 h-32 rounded-2xl overflow-hidden border border-slate-800 group/item cursor-pointer">
                        {m.type === 'image' && <img src={m.url} className="w-full h-full object-cover transition-transform group-hover/item:scale-110" alt="review" />}
                        {m.type === 'video' && (
                          <video src={m.url} className="w-full h-full object-cover" muted />
                        )}
                        {m.type === 'audio' && (
                          <div className="w-full h-full flex items-center justify-center bg-slate-950">
                            <Volume2 size={32} className="text-emerald-500" />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-slate-950/20 flex items-center justify-center opacity-0 group-hover/item:opacity-100 transition-opacity">
                          {m.type === 'image' && <ImageIcon size={20} />}
                          {m.type === 'video' && <Play size={20} />}
                          {m.type === 'audio' && <Volume2 size={20} />}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Community;
