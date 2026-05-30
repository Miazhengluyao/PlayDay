'use client';
import { useState } from 'react';
import data from '../public/data.json';
import parks from '../public/parks.json';

export default function Home() {
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [activeMood, setActiveMood] = useState<string | null>(null);

  const moods = Object.keys(data.mood_criteria);
  
  // 🧘‍♀️ Mindful & Vibey English Labels
  const moodLabels: { [key: string]: string } = {
    sensory_exploration: "✨ Sensory Flow",
    get_the_wiggles_out: "⚡️ High Energy Release",
    ada_accessible: "♿️ Inclusive Spaces",
    active_sports_play: "🎾 Active Motion",
    nature_calm_reset: "🍃 Grounding Nature",
    stroller_friendly: "🛹 Smooth Paths",
    bike_ride_toddler: "🚲 Little Wheels",
    water_play: "🌊 Water Reset",
    picnic_and_chill: "🧺 Slow Mornings",
    first_easy_outing: "🌱 Gentle Outings"
  };

  const handleMoodSelect = (moodCode: string) => {
    setActiveMood(moodCode);
    const rules = (data.mood_criteria as any)[moodCode];
    const sorted = parks
      .map((park: any) => {
        const isQualified = rules.required.some((req: string) => park.tags.includes(req));
        if (!isQualified) return null;
        const score = rules.preferred.filter((pref: string) => park.tags.includes(pref)).length;
        return { ...park, score };
      })
      .filter((p): p is any => p !== null)
      .sort((a, b) => b.score - a.score);
    setRecommendations(sorted);
  };

  return (
    <main className="min-h-screen bg-stone-50 p-6 md:p-12 font-sans text-stone-900">
      <div className="max-w-2xl mx-auto">
        
        {/* Header Section */}
        <header className="mb-12 text-center md:text-left mt-8">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tighter text-stone-800">
            PlayDay
          </h1>
          <p className="text-stone-500 font-medium tracking-wide">
            Find the perfect Topeka park for your current vibe.
          </p>
        </header>
        
        {/* Mood Selection Buttons */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-16">
          {moods.map((m) => (
            <button 
              key={m} 
              onClick={() => handleMoodSelect(m)} 
              className={`p-4 rounded-3xl border transition-all duration-500 ease-out transform hover:-translate-y-1 ${
                activeMood === m 
                  ? "bg-stone-800 text-stone-50 border-stone-800 shadow-lg scale-105" 
                  : "bg-white border-stone-200 text-stone-600 hover:border-stone-300 hover:bg-stone-100 hover:shadow-sm"
              }`}
            >
              <span className="font-medium text-sm md:text-base tracking-wide">{moodLabels[m]}</span>
            </button>
          ))}
        </div>
        
        {/* Empty State */}
        {recommendations.length === 0 && activeMood && (
          <div className="text-center p-12 text-stone-400 animate-pulse">
            <p className="tracking-wide">Scanning for the perfect spot...</p>
          </div>
        )}

        {/* Results Section */}
        <div className="space-y-5">
          {recommendations.map((p) => (
            <div key={p.id} className="group p-6 md:p-8 bg-white rounded-[2rem] border border-stone-100 shadow-sm transition-all duration-500 hover:shadow-xl hover:border-stone-200">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-stone-800 group-hover:text-stone-500 transition-colors duration-300">
                    {p.name}
                  </h2>
                  
                  {/* Visual Vibe Match Indicator */}
                  <div className="flex items-center gap-3 mt-3">
                    <div className="h-1.5 w-16 bg-stone-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-stone-800 rounded-full transition-all duration-1000 ease-out" 
                        style={{ width: `${Math.min((p.score * 25) + 25, 100)}%` }}
                      />
                    </div>
                    <p className="text-xs text-stone-400 font-semibold uppercase tracking-widest">
                      Vibe Match: {p.score * 12.5}%
                    </p>
                  </div>
                </div>
                
                {/* Park Tags */}
                {p.tags && p.tags[0] && (
                  <div className="bg-stone-50 px-4 py-2 rounded-full text-[10px] font-bold text-stone-500 uppercase tracking-widest border border-stone-200/60">
                    {p.tags[0].replace('tier_', '')}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
