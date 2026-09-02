import { useState } from 'react';
import { ChevronRight, MapPin, AlertTriangle, CloudRain, Mountain, Activity, Plus, Minus } from 'lucide-react';

export default function App() {
  // --- App State Machine ---
  // 'setup' | 'itinerary'
  const [appState, setAppState] = useState('setup'); 
  
  // false = Confident/Inviting mood, true = Honest/Risk mood
  const [isRiskOverlayActive, setIsRiskOverlayActive] = useState(false);
  
  // Deep dive state: null or specific day data
  const [selectedRiskDay, setSelectedRiskDay] = useState(null);

  // --- Handlers ---
  const handlePlanRoute = () => {
    setAppState('itinerary');
  };

  const handleToggleRisk = () => {
    setIsRiskOverlayActive(!isRiskOverlayActive);
    if (isRiskOverlayActive) setSelectedRiskDay(null);
  };

  return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center p-4 font-sans text-stone-900">
      
      {/* Mobile-sized container matching the 390x844 design canvas */}
      <div className="w-full max-w-[390px] h-[844px] bg-white border border-stone-200 shadow-2xl rounded-[2rem] overflow-hidden flex flex-col relative transition-colors duration-500">
        
        {appState === 'setup' && (
          <SetupView onPlan={handlePlanRoute} />
        )}

        {appState === 'itinerary' && !selectedRiskDay && (
          <ItineraryView 
            isRiskActive={isRiskOverlayActive} 
            onToggleRisk={handleToggleRisk}
            onOpenRiskDetail={() => setSelectedRiskDay(mockRiskData)}
          />
        )}

        {selectedRiskDay && (
          <RiskDetailView 
            data={selectedRiskDay} 
            onClose={() => setSelectedRiskDay(null)} 
          />
        )}

      </div>
    </div>
  );
}

// --- 1. Setup Wizard Component ---
// Based on Main.dc.html
function SetupView({ onPlan }) {
  const [duration, setDuration] = useState(4);

  return (
    <div className="flex flex-col h-full">
      <div className="flex flex-col gap-1 p-6 pb-4">
        <h1 className="font-serif italic font-semibold text-2xl tracking-wide">Wildline</h1>
        <p className="text-sm text-stone-500">Plan a wild camping trip</p>
      </div>

      <div className="mx-4 rounded-[20px] overflow-hidden relative h-[392px] bg-gradient-to-b from-stone-100 to-stone-50 border border-stone-200">
        {/* Placeholder for MapLibre instance */}
        <div className="absolute inset-0 flex items-center justify-center text-stone-400">
          [ MapLibre GL Renderer ]
        </div>

        <div className="absolute top-4 left-4 right-4 flex items-center gap-3 bg-white rounded-xl p-3 shadow-md">
          <div className="w-3 h-3 rounded-full border-2 border-stone-400"></div>
          <div className="text-sm font-medium">Coledale Fells, Lake District</div>
        </div>

        <div className="absolute left-4 bottom-4 flex flex-col gap-2">
          <div className="flex items-center gap-2 bg-white rounded-lg px-3 py-1.5 shadow-sm text-xs font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-600"></span> Start · Braithwaite
          </div>
          <div className="flex items-center gap-2 bg-white rounded-lg px-3 py-1.5 shadow-sm text-xs font-medium">
            <span className="w-2 h-2 rounded-full border-2 border-rose-500"></span> End · Force Crag
          </div>
        </div>
      </div>

      <div className="mx-4 mt-4 bg-stone-50 rounded-[18px] border border-stone-200 p-5 flex flex-col gap-5">
        <div className="flex flex-col gap-2">
          <div className="text-xs font-bold text-stone-500 uppercase tracking-wider">Duration</div>
          <div className="flex items-center justify-between">
            <button onClick={() => setDuration(d => Math.max(1, d - 1))} className="w-10 h-10 rounded-full border border-stone-200 bg-white flex items-center justify-center"><Minus size={16} /></button>
            <div className="font-serif text-2xl font-semibold">{duration} days</div>
            <button onClick={() => setDuration(d => d + 1)} className="w-10 h-10 rounded-full border border-stone-200 bg-white flex items-center justify-center"><Plus size={16} /></button>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <div className="text-xs font-bold text-stone-500 uppercase tracking-wider">Daily walking capacity</div>
          <div className="flex gap-2">
            <div className="flex-1 text-center p-2 rounded-xl border border-stone-200 bg-white text-sm text-stone-500">Easy<br/><span className="text-[11px]">8–12km</span></div>
            <div className="flex-1 text-center p-2 rounded-xl border-2 border-emerald-600 bg-emerald-50 text-emerald-700 font-semibold text-sm">Moderate<br/><span className="text-[11px] font-medium">12–18km</span></div>
            <div className="flex-1 text-center p-2 rounded-xl border border-stone-200 bg-white text-sm text-stone-500">Ambitious<br/><span className="text-[11px]">18–25km</span></div>
          </div>
        </div>
      </div>

      <div className="mt-auto p-4 pb-6">
        <button onClick={onPlan} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl p-4 font-semibold flex items-center justify-center gap-2 transition-colors">
          Plan my route
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
}

// --- 2. Itinerary & Risk Overlay Component ---
// Based on Itinerary.dc.html
function ItineraryView({ isRiskActive, onToggleRisk, onOpenRiskDetail }) {
  return (
    <div className={`flex flex-col h-full transition-colors duration-500 ${isRiskActive ? 'bg-stone-100' : 'bg-white'}`}>
      <div className="flex items-center gap-3 p-5 pb-2">
        <ChevronRight className="rotate-180" size={20} />
        <div className="flex-1">
          <div className="font-serif font-semibold text-lg">Coledale Fells route</div>
          <div className="text-xs text-stone-500">4 days · 52km · Moderate pace</div>
        </div>
        <MapPin size={18} className="text-stone-400" />
      </div>

      <div className="mx-4 mt-2 rounded-[18px] h-[230px] bg-stone-100 border border-stone-200 relative overflow-hidden">
        {/* Placeholder for Route Map */}
        <div className="absolute inset-0 flex items-center justify-center text-stone-400">
           [ Rendered Route Segment ]
        </div>
        <div className="absolute left-3 bottom-3 bg-white rounded-xl px-3 py-1.5 shadow-md text-xs font-medium text-stone-600">
          Ridgeback Camp · Crag Point lookout
        </div>
      </div>

      <div className="flex gap-2 px-4 py-4">
        {['Day 1', 'Day 2', 'Day 3', 'Day 4'].map((day, i) => (
          <div key={day} className={`flex-1 text-center py-2 rounded-xl text-[13px] font-medium border ${i === 1 ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-stone-50 text-stone-500 border-stone-200'}`}>
            {day}
          </div>
        ))}
      </div>

      <div className="mx-4 mt-1 bg-stone-50 rounded-[18px] border border-stone-200 p-5 flex flex-col gap-4 flex-1 mb-6 relative">
        {isRiskActive && (
          <div className="absolute -top-3 right-4 bg-rose-100 text-rose-700 text-xs font-bold px-3 py-1 rounded-lg border border-rose-200 shadow-sm cursor-pointer" onClick={onOpenRiskDetail}>
            High Risk Day
          </div>
        )}

        <div>
          <div className="font-serif font-semibold text-base">Tarn Hollow → Ridgeback Camp</div>
          <div className="text-xs text-stone-500 mt-1">13.4km · +680m elevation · open fell & ridge</div>
        </div>

        <div className="flex gap-3 items-start">
          <div className="w-8 h-8 rounded-xl bg-emerald-100 flex items-center justify-center shrink-0">
             <MapPin size={16} className="text-emerald-600" />
          </div>
          <div>
            <div className="text-[13.5px] font-semibold">Ridgeback Camp</div>
            <div className="text-xs text-stone-500">Sheltered hollow · stream 80m away · legal wild camp</div>
          </div>
        </div>

        <div className="flex gap-3 items-start">
          <div className="w-8 h-8 rounded-xl bg-rose-50 flex items-center justify-center shrink-0 border border-rose-100">
             <AlertTriangle size={16} className="text-rose-500" />
          </div>
          <div>
            <div className="text-[13.5px] font-semibold">Crag Point lookout</div>
            <div className="text-xs text-stone-500">Sunset views over the valley, 15min off-route</div>
          </div>
        </div>

        <div 
          onClick={onToggleRisk}
          className={`mt-auto rounded-xl border border-dashed p-3 flex items-center gap-3 cursor-pointer transition-colors ${isRiskActive ? 'bg-emerald-50 border-emerald-300' : 'border-stone-300'}`}
        >
          <Activity size={16} className={isRiskActive ? 'text-emerald-600' : 'text-stone-400'} />
          <div className="text-xs text-stone-500 flex-1">
            {isRiskActive ? 'Risk simulation active.' : 'Curious what could go wrong?'}
          </div>
          <div className="text-xs text-emerald-600 font-semibold">
            {isRiskActive ? 'Turn off' : 'Run risk sim'}
          </div>
        </div>
      </div>
    </div>
  );
}

// --- 3. Risk Detail Modal Component ---
// Based on RiskDetail.dc.html
function RiskDetailView({ data, onClose }) {
  return (
    <div className="absolute inset-0 bg-white z-50 flex flex-col">
      <div className="flex items-center gap-3 p-5 pb-2 cursor-pointer" onClick={onClose}>
        <ChevronRight className="rotate-180" size={20} />
        <div>
          <div className="font-serif font-semibold text-lg">Day 2 risk breakdown</div>
          <div className="text-xs text-stone-500">Tarn Hollow → Ridgeback Camp</div>
        </div>
      </div>

      <div className="flex items-center gap-4 px-5 py-4">
        <div className="relative w-20 h-20 flex items-center justify-center shrink-0">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 76 76">
            <circle cx="38" cy="38" r="32" fill="none" stroke="#e5e7eb" strokeWidth="8" />
            <circle cx="38" cy="38" r="32" fill="none" stroke="#e11d48" strokeWidth="8" strokeDasharray="201" strokeDashoffset="60" strokeLinecap="round" />
          </svg>
          <div className="absolute flex flex-col items-center">
            <span className="font-serif font-semibold text-xl leading-none">70</span>
            <span className="text-[9px] text-stone-400">of 100</span>
          </div>
        </div>
        <div className="flex-1">
          <div className="text-[11.5px] font-bold text-rose-700 bg-rose-100 inline-block px-2.5 py-1 rounded-lg mb-1.5">High risk day</div>
          <div className="text-xs text-stone-500 leading-relaxed">Weather and terrain compound on the ridge section — fatigue makes both worse in the afternoon.</div>
        </div>
      </div>

      <div className="mx-4 mt-2 flex flex-col gap-3 overflow-y-auto">
        
        {/* Weather Factor */}
        <div className="bg-stone-50 rounded-2xl border border-stone-200 p-4">
          <div className="flex items-center gap-2 mb-2">
            <CloudRain size={16} className="text-rose-600" />
            <div className="text-sm font-semibold flex-1">Weather</div>
            <div className="text-sm font-bold text-rose-600">62%</div>
          </div>
          <div className="h-1.5 bg-rose-100 rounded-full mb-2">
            <div className="h-full bg-rose-600 rounded-full" style={{ width: '62%' }}></div>
          </div>
          <div className="text-xs text-stone-500 leading-relaxed">Simulated: a squall builds over the fells around 3pm, cutting visibility to ~50m on the exposed ridge.</div>
        </div>

        {/* Terrain Factor */}
        <div className="bg-stone-50 rounded-2xl border border-stone-200 p-4">
          <div className="flex items-center gap-2 mb-2">
            <Mountain size={16} className="text-amber-500" />
            <div className="text-sm font-semibold flex-1">Terrain</div>
            <div className="text-sm font-bold text-amber-500">41%</div>
          </div>
          <div className="h-1.5 bg-amber-100 rounded-full mb-2">
            <div className="h-full bg-amber-500 rounded-full" style={{ width: '41%' }}></div>
          </div>
          <div className="text-xs text-stone-500 leading-relaxed">1.2km of exposed scramble with loose scree, worse underfoot if the squall arrives on schedule.</div>
        </div>

        {/* Mitigation Card */}
        <div className="mt-1 rounded-2xl bg-emerald-50 p-4 flex gap-3 items-start border border-emerald-100">
          <div className="w-7 h-7 rounded-xl bg-white flex items-center justify-center shrink-0 shadow-sm">
            <ChevronRight size={14} className="text-emerald-600" />
          </div>
          <div>
            <div className="text-xs font-bold text-emerald-700 mb-1">Suggested mitigation</div>
            <div className="text-xs text-stone-800 leading-relaxed">Camp at Lower Tarn instead — cuts the ridge crossing to before midday and shortens Day 2 by 4km.</div>
          </div>
        </div>
      </div>

      <div className="mt-auto p-4 pb-6">
        <button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl p-4 font-semibold text-sm transition-colors">
          Apply mitigation
        </button>
      </div>
    </div>
  );
}

// --- Mock Data ---
const mockRiskData = {
  dayNum: 2,
  score: 70,
  factors: [
    { type: 'Weather', prob: 62, desc: 'Simulated: a squall builds over the fells around 3pm...' }
  ]
};