'use client';

import { useState, useEffect, useMemo } from 'react';
import { WordSolver, parseGrid, Position, FoundWord } from '@/lib/solver';

const DEFAULT_GRID = "NGOEIEULSTSISALCSMAD GOECNPPICIDUEFSDUWOS LWWNESWHOIBARTLSRISL NRAEOOAREADINGIOATKT EETIACRMYGEIECLUNCHT ICECHIINANADETENTION RCRSAANTDEOEILCSIERO HOFNTLASUNYROTSIHRTR YSOMHSHSILGNEGAUGNAL RIUHSTGEOGRAPHICLISA AINSLUPRINCIPALDVKLT RTTSLDAGAHLGMEAOALEA BNAEAIBOEGNIYDUTSLDR ITICBEKROWEMOHTNOEGE LONETSSTASNKATHEEBTS AFTREHETDPEUYDHIOINH MDEAKKAERBGNIRPSTRKN TARHSSNRNAMFSCHOOLGE LTMEAMATHEMATICSRERW LSSHBHTIPRVOLLEYBALL";
const DEFAULT_WORDS = ["ART", "ENGLISH", "LANGUAGE", "READING", "SPRINGBREAK", "FRIENDS", "LIBRARY", "RECESS", "STUDYING", "BELL", "GEOGRAPH", "LUNCH", "SCHOOL", "TEACHERS", "BUS", "GYM", "MATHEMATICS", "SCIENCE", "TERMS", "DANCES", "HISTORY", "MUSIC", "SOCCER", "VOLLEYBALL", "DETENTION", "HOMEWORK", "PRINCIPAL", "SOCIALSTUDIES", "WATERFOUNTAIN"];

export default function Home() {
  const [gridData, setGridData] = useState<string[][]>([]);
  const [words, setWords] = useState<string[]>(DEFAULT_WORDS);
  const [activePath, setActivePath] = useState<Position[]>([]);
  const [foundWords, setFoundWords] = useState<FoundWord[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [status, setStatus] = useState("Ready to solve.");

  const solver = useMemo(() => {
    if (gridData.length > 0) {
      return new WordSolver(gridData, words);
    }
    return null;
  }, [gridData, words]);

  useEffect(() => {
    const parsed = parseGrid(DEFAULT_GRID);
    setGridData(parsed);
  }, []);

  const handleSearch = () => {
    if (!solver || !searchQuery) return;
    const path = solver.findWord(searchQuery);
    if (path) {
      setActivePath(path);
      setStatus(`Word "${searchQuery.toUpperCase()}" found!`);
    } else {
      setActivePath([]);
      setStatus(`Word "${searchQuery.toUpperCase()}" not found.`);
    }
  };

  const handleSolveAll = () => {
    if (!solver) return;
    setStatus("Solving entire grid...");
    const results = solver.solveAll();
    setFoundWords(results);
    setStatus(`Completed. Found ${results.length} words.`);
  };

  const isHighlighted = (r: number, c: number) => {
    // Check if in active path
    const inActive = activePath.some(p => p.r === r && p.c === c);
    if (inActive) return 'active';
    
    // Check if in any found words (if solved all)
    const inFound = foundWords.some(fw => fw.path.some(p => p.r === r && p.c === c));
    if (inFound) return 'found';
    
    return 'none';
  };

  return (
    <main className="min-h-screen p-8 lg:p-16 max-w-7xl mx-auto flex flex-col gap-12">
      <header className="flex flex-col gap-4 animate-fade-in">
        <h1 className="text-5xl font-black tracking-tight text-gradient">WORD ARCHITECT</h1>
        <p className="text-slate-400 max-w-2xl text-lg font-light">
          A premium, graph-based word puzzle solver designed for precision and performance.
          No distractions, just algorithmic excellence.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left: Settings & Status */}
        <aside className="lg:col-span-4 flex flex-col gap-8 animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <div className="glass-card p-8 flex flex-col gap-6">
            <h2 className="text-xl font-bold">CONTROL CENTER</h2>
            
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Single Search</label>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  placeholder="Type a word..."
                  className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 flex-grow outline-none focus:border-cyan-500 transition-colors"
                />
                <button 
                  onClick={handleSearch}
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 text-black font-bold px-6 rounded-xl hover:scale-105 transition-transform active:scale-95"
                >
                  GO
                </button>
              </div>
            </div>

            <button 
              onClick={handleSolveAll}
              className="w-full glass border border-cyan-500/30 py-4 font-bold text-cyan-400 hover:bg-cyan-500/10 transition-colors uppercase tracking-widest text-sm"
            >
              Solve Entire Grid
            </button>

            <div className="pt-4 border-t border-white/5">
              <p className="text-xs text-slate-500 mb-2">ENGINE STATUS</p>
              <div className="font-mono text-sm text-cyan-500/80 bg-black/40 p-3 rounded-lg border border-white/5">
                {status}
              </div>
            </div>
          </div>

          <div className="glass-card p-8 flex flex-col gap-6">
            <h2 className="text-xl font-bold">DICTIONARY</h2>
            <div className="flex flex-wrap gap-2 max-h-64 overflow-y-auto pr-2">
              {words.map(w => (
                <span 
                  key={w} 
                  className={`text-xs px-2 py-1 rounded border ${
                    foundWords.some(fw => fw.word === w) 
                      ? 'border-cyan-500/50 bg-cyan-500/10 text-cyan-300' 
                      : 'border-white/10 text-slate-500'
                  }`}
                >
                  {w}
                </span>
              ))}
            </div>
          </div>
        </aside>

        {/* Right: Grid */}
        <section className="lg:col-span-8 glass-card p-4 lg:p-8 animate-fade-in overflow-hidden" style={{ animationDelay: '0.4s' }}>
          <div className="aspect-square w-full grid gap-1 md:gap-2" 
               style={{ 
                 gridTemplateColumns: `repeat(${gridData[0]?.length || 1}, 1fr)`,
                 gridTemplateRows: `repeat(${gridData.length || 1}, 1fr)`
               }}>
            {gridData.map((row, r) => (
              row.map((char, c) => {
                const state = isHighlighted(r, c);
                return (
                  <div 
                    key={`${r}-${c}`}
                    className={`
                      aspect-square flex items-center justify-center text-sm md:text-base font-bold rounded-md transition-all duration-300
                      ${state === 'active' ? 'bg-cyan-500 text-black scale-110 z-10 shadow-[0_0_20px_rgba(6,182,212,0.5)]' : 
                        state === 'found' ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' : 
                        'bg-white/5 text-slate-500 border border-white/5'}
                      hover:bg-white/10 cursor-default
                    `}
                  >
                    {char}
                  </div>
                );
              })
            ))}
          </div>
        </section>
      </div>
      
      <footer className="mt-12 text-center text-slate-600 text-sm font-light animate-fade-in" style={{ animationDelay: '0.6s' }}>
        <p>WORD ARCHITECT ENGINE &copy; 2024 | HIGH PERFORMANCE GRAPH SOLVER</p>
      </footer>
    </main>
  );
}
