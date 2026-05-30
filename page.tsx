'use client';
import { useState } from 'react';
import data from '../data/data.json';
import parks from '../data/parks.json';

export default function Home() {
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [activeMood, setActiveMood] = useState<string | null>(null);

  const moods = Object.keys(data.mood_criteria);
  const moodLabels: { [key: string]: string } = {
    sensory_exploration: "✨ 触感小探险",
    get_the_wiggles_out: "🔋 疯狂放电模式",
    ada_accessible: "♿️ 无障碍乐园",
    active_sports_play: "⚽️ 球场运动风",
    nature_calm_reset: "🍃 静心森呼吸",
    stroller_friendly: "🚼 推车友好派",
    bike_ride_toddler: "🚲 骑行小能手",
    water_play: "💦 戏水清凉季",
    picnic_and_chill: "🧺 野餐躺平局",
    first_easy_outing: "🐣 新手友好路"
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
    <main className="min-h-screen bg-zinc-50 p-6 md:p-12 font-sans text-zinc-900">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-extrabold mb-8 tracking-tight">Topeka 公园智库</h1>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-12">
          {moods.map((m) => (
            <button 
              key={m} 
              onClick={() => handleMoodSelect(m)} 
              className={`p-4 rounded-2xl border-2 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg ${
                activeMood === m ? "bg-black text-white border-black" : "bg-white border-zinc-200 hover:border-black"
              }`}
            >
              <span className="font-medium">{moodLabels[m]}</span>
            </button>
          ))}
        </div>
        
        <div className="space-y-6">
          {recommendations.map((p) => (
            <div key={p.id} className="group p-6 bg-white rounded-3xl border border-zinc-100 shadow-sm transition-all hover:shadow-md hover:border-zinc-300">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-bold group-hover:text-blue-600 transition-colors">{p.name}</h2>
                  <p className="text-sm text-zinc-500 mt-1">推荐契合度评分: {p.score * 12.5}%</p>
                </div>
                <div className="bg-zinc-100 px-3 py-1 rounded-full text-xs font-bold text-zinc-600 uppercase">
                  {p.tags[0].replace('tier_', '')}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
