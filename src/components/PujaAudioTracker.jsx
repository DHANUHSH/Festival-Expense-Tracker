import React, { useState } from 'react';
import { Volume2, VolumeX, Play, Pause, Sun, Moon, Sparkles, CheckSquare, Square } from 'lucide-react';
import { translations } from '../i18n/translations.js';

const AUDIO_TRACKS = [
  {
    id: 1,
    title: "Ganesh Atharvashirsha & Chants",
    subtitle: "మహాగణపతి అథర్వశీర్షమ్ స్తోత్రం",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    duration: "4:15"
  },
  {
    id: 2,
    title: "Vakratunda Mahakaya Mantra",
    subtitle: "వక్రతుండ మహాకాయ సూర్యకోటి సమప్రభ",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    duration: "3:40"
  },
  {
    id: 3,
    title: "Jai Ganesh Deva Aarti",
    subtitle: "జై గణేష్ దేవ నిత్య మంగళ హారతి",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    duration: "5:10"
  }
];

export default function PujaAudioTracker({ samagriChecklist = [], onToggleSamagri, lang = 'en' }) {
  const t = translations[lang] || translations.en;
  const [playingTrackId, setPlayingTrackId] = useState(null);
  const [audioElement, setAudioElement] = useState(null);

  const togglePlay = (track) => {
    if (playingTrackId === track.id) {
      if (audioElement) {
        audioElement.pause();
      }
      setPlayingTrackId(null);
    } else {
      if (audioElement) {
        audioElement.pause();
      }
      const audio = new Audio(track.url);
      audio.play().catch(err => console.log('Audio playback prevented:', err));
      setAudioElement(audio);
      setPlayingTrackId(track.id);

      audio.onended = () => {
        setPlayingTrackId(null);
      };
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-red-700 via-rose-700 to-amber-700 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-red-300/30 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 text-amber-200 rounded-full text-xs font-bold uppercase tracking-wider backdrop-blur-sm border border-white/20">
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>Devotional Portal</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight drop-shadow">
            {t.pujaTitle}
          </h2>
          <p className="text-xs sm:text-sm text-red-100 font-medium max-w-xl">
            Daily Aarti schedule, Ganesha devotional sthotrams, and Pujari Samagri checklist.
          </p>
        </div>
      </div>

      {/* Daily Aarti Timings Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-amber-500 to-orange-600 text-white rounded-3xl p-6 shadow-md flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-amber-100 text-xs font-bold uppercase tracking-wider">
              <Sun className="w-4 h-4 text-amber-200" />
              <span>{t.morningAarti}</span>
            </div>
            <div className="text-3xl font-black">08:00 AM</div>
            <p className="text-xs text-amber-100 font-medium">Daily Morning Dhupa Deepa Naivedyam</p>
          </div>
          <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-3xl">
            🌅
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-700 to-indigo-800 text-white rounded-3xl p-6 shadow-md flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-purple-200 text-xs font-bold uppercase tracking-wider">
              <Moon className="w-4 h-4 text-purple-300" />
              <span>{t.eveningAarti}</span>
            </div>
            <div className="text-3xl font-black">07:30 PM</div>
            <p className="text-xs text-purple-200 font-medium">Evening Maha Mangala Aarti & Bhajans</p>
          </div>
          <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-3xl">
            🪔
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Audio Chants Player */}
        <div className="bg-white rounded-3xl shadow-sm border border-red-100 p-6 space-y-4">
          <h3 className="font-extrabold text-slate-800 text-lg flex items-center gap-2 pb-2 border-b border-slate-100">
            <Volume2 className="w-5 h-5 text-red-600" />
            <span>{t.audioPlayer}</span>
          </h3>

          <div className="space-y-3">
            {AUDIO_TRACKS.map((track) => {
              const isPlaying = playingTrackId === track.id;
              return (
                <div
                  key={track.id}
                  className={`p-4 rounded-2xl border transition flex items-center justify-between gap-4 ${
                    isPlaying
                      ? 'bg-red-50 border-red-300 text-red-950 shadow-sm'
                      : 'bg-slate-50 border-slate-200 text-slate-800 hover:bg-red-50/50'
                  }`}
                >
                  <div className="space-y-1">
                    <h4 className="font-extrabold text-sm">{track.title}</h4>
                    <p className="text-xs text-red-700 font-bold">{track.subtitle}</p>
                  </div>

                  <button
                    onClick={() => togglePlay(track)}
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-md shrink-0 transition ${
                      isPlaying ? 'bg-red-700 hover:bg-red-800' : 'bg-red-600 hover:bg-red-700'
                    }`}
                  >
                    {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Pujari Samagri Checklist */}
        <div className="bg-white rounded-3xl shadow-sm border border-red-100 p-6 space-y-4">
          <h3 className="font-extrabold text-slate-800 text-lg flex items-center gap-2 pb-2 border-b border-slate-100">
            <CheckSquare className="w-5 h-5 text-red-600" />
            <span>{t.samagriChecklist}</span>
          </h3>

          <div className="space-y-2">
            {samagriChecklist.map((item) => (
              <button
                key={item.id}
                onClick={() => onToggleSamagri(item.id)}
                className={`w-full p-3.5 rounded-2xl border text-left flex items-center gap-3 transition ${
                  item.completed
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-900 line-through opacity-75'
                    : 'bg-slate-50 border-slate-200 text-slate-800 hover:bg-red-50 hover:border-red-200'
                }`}
              >
                {item.completed ? (
                  <CheckSquare className="w-5 h-5 text-emerald-600 shrink-0" />
                ) : (
                  <Square className="w-5 h-5 text-slate-400 shrink-0" />
                )}
                <span className="text-xs font-bold">{item.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
