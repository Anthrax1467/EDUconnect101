import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI, Modality, LiveServerMessage } from '@google/genai';
import { AppProject } from '../types';
import { Mic, MicOff, Volume2, Loader2, Info } from 'lucide-react';

interface LiveAssistantProps {
  project: AppProject | null;
}

// Guideline-compliant audio utilities for raw PCM data
function decode(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

function encode(bytes: Uint8Array) {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

const LiveAssistant: React.FC<LiveAssistantProps> = ({ project }) => {
  const [isActive, setIsActive] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [transcriptions, setTranscriptions] = useState<string[]>([]);
  const nextStartTimeRef = useRef(0);
  const audioContextRef = useRef<AudioContext | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());

  const toggleSession = async () => {
    if (isActive) {
      setIsActive(false);
      streamRef.current?.getTracks().forEach(track => track.stop());
      return;
    }

    setIsConnecting(true);
    // Initialize GoogleGenAI right before connection.
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    try {
      const inputAudioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      const outputAudioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      audioContextRef.current = outputAudioContext;

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-09-2025',
        callbacks: {
          onopen: () => {
            setIsConnecting(false);
            setIsActive(true);
            
            const source = inputAudioContext.createMediaStreamSource(stream);
            const scriptProcessor = inputAudioContext.createScriptProcessor(4096, 1, 1);
            scriptProcessor.onaudioprocess = (audioProcessingEvent) => {
              const inputData = audioProcessingEvent.inputBuffer.getChannelData(0);
              const l = inputData.length;
              const int16 = new Int16Array(l);
              for (let i = 0; i < l; i++) {
                int16[i] = inputData[i] * 32768;
              }
              const pcmBlob = {
                data: encode(new Uint8Array(int16.buffer)),
                mimeType: 'audio/pcm;rate=16000',
              };
              // Always use the resolved promise to send input to prevent stale closure issues.
              sessionPromise.then(session => session.sendRealtimeInput({ media: pcmBlob }));
            };
            source.connect(scriptProcessor);
            scriptProcessor.connect(inputAudioContext.destination);
          },
          onmessage: async (message: LiveServerMessage) => {
            const base64EncodedAudioString = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
            if (base64EncodedAudioString) {
              // Scheduling audio chunks to start at the exact end of previous chunks.
              nextStartTimeRef.current = Math.max(nextStartTimeRef.current, outputAudioContext.currentTime);
              const audioBuffer = await decodeAudioData(
                decode(base64EncodedAudioString),
                outputAudioContext,
                24000,
                1,
              );
              const source = outputAudioContext.createBufferSource();
              source.buffer = audioBuffer;
              source.connect(outputAudioContext.destination);
              
              source.addEventListener('ended', () => {
                sourcesRef.current.delete(source);
              });

              source.start(nextStartTimeRef.current);
              nextStartTimeRef.current = nextStartTimeRef.current + audioBuffer.duration;
              sourcesRef.current.add(source);
            }

            if (message.serverContent?.interrupted) {
              sourcesRef.current.forEach(s => s.stop());
              sourcesRef.current.clear();
              nextStartTimeRef.current = 0;
            }

            if (message.serverContent?.outputTranscription) {
              setTranscriptions(prev => [...prev, message.serverContent!.outputTranscription!.text]);
            }
          },
          onerror: (e) => {
            console.error(e);
            setIsActive(false);
            setIsConnecting(false);
          },
          onclose: () => setIsActive(false),
        },
        config: {
          responseModalities: [Modality.AUDIO],
          outputAudioTranscription: {},
          inputAudioTranscription: {},
          systemInstruction: `You are an elite product strategist. The user is brainstorming an application called ${project?.name || 'their new project'}. ${project ? `Details: ${project.description}` : ''}. Be concise, insightful, and challenge their assumptions to build a better product.`
        },
      });
    } catch (err) {
      console.error(err);
      setIsConnecting(false);
    }
  };

  return (
    <div className="flex flex-col h-full space-y-8 animate-in fade-in duration-500">
      <header>
        <h1 className="text-3xl font-outfit font-bold text-slate-50">Live Strategy Session</h1>
        <p className="text-slate-400 mt-2">Speak directly with a product expert to refine your architecture and feature set.</p>
      </header>

      <div className="flex-1 flex flex-col items-center justify-center space-y-12">
        <div className="relative">
          <div className={`absolute inset-0 rounded-full blur-3xl transition-all duration-1000 ${
            isActive ? 'bg-indigo-500/30 scale-150 animate-pulse' : 'bg-indigo-500/5 scale-100'
          }`} />
          
          <button
            onClick={toggleSession}
            disabled={isConnecting}
            className={`relative w-48 h-48 rounded-full flex flex-col items-center justify-center transition-all duration-500 border-4 ${
              isActive 
                ? 'bg-indigo-600 border-indigo-400 shadow-2xl shadow-indigo-500/50' 
                : 'bg-slate-900 border-slate-800 hover:border-slate-700'
            }`}
          >
            {isConnecting ? (
              <Loader2 size={64} className="text-indigo-400 animate-spin" />
            ) : isActive ? (
              <>
                <Mic size={64} className="text-white mb-2" />
                <span className="text-xs font-bold uppercase tracking-widest text-indigo-100">Listening...</span>
              </>
            ) : (
              <>
                <MicOff size={64} className="text-slate-500 mb-2" />
                <span className="text-xs font-bold uppercase tracking-widest text-slate-500">Start Session</span>
              </>
            )}
          </button>
        </div>

        <div className="w-full max-w-2xl bg-slate-900/50 border border-slate-800 rounded-3xl p-8 backdrop-blur-xl">
          <div className="flex items-center gap-2 mb-6 text-slate-400">
            <Volume2 size={20} />
            <h2 className="text-sm font-bold uppercase tracking-widest">Live Transcription</h2>
          </div>
          <div className="h-40 overflow-y-auto space-y-4 pr-4">
            {transcriptions.length > 0 ? (
              transcriptions.map((t, i) => (
                <p key={i} className="text-slate-300 text-lg leading-relaxed">{t}</p>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-slate-600 italic">
                <Info size={24} className="mb-2 opacity-50" />
                <p>Start the session to see real-time advice</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveAssistant;