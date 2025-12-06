import React, { useState } from 'react';
import { GoogleGenAI } from '@google/genai';
import { Search, Globe, ArrowRight, Loader2, MapPin } from 'lucide-react';

const SearchApp: React.FC = () => {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState<{ text: string; chunks: any[] } | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setResult(null);

    try {
        const apiKey = process.env.API_KEY;
        if (!apiKey) throw new Error("No API Key");

        const ai = new GoogleGenAI({ apiKey });
        // Use flash for general search
        const model = 'gemini-2.5-flash';

        const response = await ai.models.generateContent({
            model,
            contents: query,
            config: {
                tools: [{ googleSearch: {} }],
            }
        });
        
        const text = response.text || "No results found.";
        const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];

        setResult({ text, chunks });

    } catch (err) {
        console.error(err);
        setResult({ text: "Error fetching search results. Please try again.", chunks: [] });
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-900 text-white font-sans">
      <div className="p-8 flex flex-col items-center justify-center border-b border-white/5 bg-gradient-to-b from-slate-900 to-slate-800">
        <h1 className="text-3xl font-light mb-6 tracking-wide text-cyan-400 flex items-center gap-2">
            <Globe size={32} />
            NetSearch
        </h1>
        <form onSubmit={handleSearch} className="w-full max-w-2xl relative">
            <input 
                type="text" 
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search the web with Gemini..."
                className="w-full bg-black/30 border border-white/10 rounded-full py-4 pl-6 pr-14 text-lg focus:outline-none focus:ring-2 focus:ring-cyan-500/50 backdrop-blur-md transition-all shadow-inner"
            />
            <button 
                type="submit"
                disabled={loading}
                className="absolute right-2 top-2 bottom-2 aspect-square bg-cyan-600 hover:bg-cyan-500 rounded-full flex items-center justify-center transition-colors disabled:opacity-50"
            >
                {loading ? <Loader2 className="animate-spin text-white" /> : <Search className="text-white" />}
            </button>
        </form>
      </div>

      <div className="flex-1 overflow-y-auto p-6 md:px-20">
         {loading && (
             <div className="flex flex-col gap-4 animate-pulse mt-8">
                 <div className="h-4 bg-white/10 rounded w-3/4"></div>
                 <div className="h-4 bg-white/10 rounded w-1/2"></div>
                 <div className="h-32 bg-white/5 rounded mt-4"></div>
             </div>
         )}

         {result && (
             <div className="max-w-4xl mx-auto space-y-6">
                 <div className="prose prose-invert max-w-none">
                     <div className="bg-slate-800/50 p-6 rounded-xl border border-white/5 shadow-lg whitespace-pre-wrap leading-relaxed text-gray-200">
                        {result.text}
                     </div>
                 </div>

                 {result.chunks && result.chunks.length > 0 && (
                     <div className="grid gap-3">
                         <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Sources</h3>
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                             {result.chunks.map((chunk, i) => {
                                 if (chunk.web) {
                                     return (
                                         <a 
                                            key={i} 
                                            href={chunk.web.uri} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-3 p-3 bg-slate-800 hover:bg-slate-700 border border-white/5 rounded-lg transition-all hover:translate-x-1 group"
                                         >
                                             <div className="bg-cyan-900/30 p-2 rounded text-cyan-400">
                                                 <Globe size={16} />
                                             </div>
                                             <div className="flex-1 min-w-0">
                                                 <div className="text-sm font-medium truncate text-cyan-200 group-hover:text-cyan-100">{chunk.web.title}</div>
                                                 <div className="text-xs text-slate-500 truncate">{chunk.web.uri}</div>
                                             </div>
                                             <ArrowRight size={14} className="text-slate-500 group-hover:text-white" />
                                         </a>
                                     )
                                 }
                                 return null;
                             })}
                         </div>
                     </div>
                 )}
             </div>
         )}
         
         {!result && !loading && (
             <div className="flex flex-col items-center justify-center h-full text-slate-600">
                 <Search size={64} className="mb-4 opacity-20" />
                 <p>Search grounded by Google Gemini</p>
             </div>
         )}
      </div>
    </div>
  );
};

export default SearchApp;