import React, { useState } from 'react';
import { 
  FileText, 
  Table, 
  Presentation, 
  Save, 
  Bold, 
  Italic, 
  Underline, 
  AlignLeft, 
  AlignCenter, 
  AlignRight,
  Type,
  Grid,
  MonitorPlay,
  Plus
} from 'lucide-react';
import { useOS } from '../../context/OSContext';

type OfficeAppType = 'writer' | 'sheets' | 'slides';

const NexusOfficeApp: React.FC<{ windowId: string }> = ({ windowId }) => {
  const { createFile } = useOS();
  const [activeApp, setActiveApp] = useState<OfficeAppType>('writer');
  const [documentTitle, setDocumentTitle] = useState('Untitled Document');
  const [content, setContent] = useState('');
  
  // Sheets State
  const [cells, setCells] = useState<Record<string, string>>({});
  
  // Slides State
  const [slides, setSlides] = useState([{ id: 1, title: 'Click to add title', body: 'Click to add subtitle' }]);
  const [activeSlide, setActiveSlide] = useState(0);

  const handleSave = () => {
    let fileContent = '';
    let ext = '';
    
    if (activeApp === 'writer') {
        fileContent = content;
        ext = '.docx'; // Simulated
    } else if (activeApp === 'sheets') {
        fileContent = JSON.stringify(cells);
        ext = '.xlsx'; // Simulated
    } else {
        fileContent = JSON.stringify(slides);
        ext = '.pptx'; // Simulated
    }

    const fileName = documentTitle.endsWith(ext) ? documentTitle : `${documentTitle}${ext}`;
    createFile('docs', fileName, fileContent);
    alert(`Saved ${fileName} to Documents!`);
  };

  const renderWriter = () => (
    <div className="flex-1 flex flex-col bg-white">
        <div className="flex items-center gap-2 p-2 border-b border-gray-200 bg-gray-50">
            <button className="p-1.5 hover:bg-gray-200 rounded"><Bold size={18}/></button>
            <button className="p-1.5 hover:bg-gray-200 rounded"><Italic size={18}/></button>
            <button className="p-1.5 hover:bg-gray-200 rounded"><Underline size={18}/></button>
            <div className="w-[1px] h-4 bg-gray-300 mx-2" />
            <button className="p-1.5 hover:bg-gray-200 rounded"><AlignLeft size={18}/></button>
            <button className="p-1.5 hover:bg-gray-200 rounded"><AlignCenter size={18}/></button>
            <button className="p-1.5 hover:bg-gray-200 rounded"><AlignRight size={18}/></button>
        </div>
        <div className="flex-1 bg-gray-100 p-8 overflow-y-auto flex justify-center">
            <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-[21cm] min-h-[29.7cm] bg-white shadow-lg p-12 outline-none text-gray-800 resize-none"
                placeholder="Start typing your document..."
            />
        </div>
    </div>
  );

  const renderSheets = () => {
    const cols = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
    const rows = Array.from({ length: 20 }, (_, i) => i + 1);

    return (
        <div className="flex-1 flex flex-col bg-white overflow-hidden">
             <div className="flex items-center gap-2 p-2 border-b border-gray-200 bg-gray-50">
                <div className="flex items-center gap-1 border border-gray-300 rounded px-2 bg-white">
                    <span className="text-gray-500 text-xs">fx</span>
                    <input className="outline-none text-sm w-64" placeholder="Formula bar" />
                </div>
             </div>
             <div className="flex-1 overflow-auto">
                 <table className="w-full border-collapse">
                     <thead>
                         <tr>
                             <th className="w-10 bg-gray-100 border border-gray-300"></th>
                             {cols.map(c => (
                                 <th key={c} className="bg-gray-100 border border-gray-300 px-2 py-1 text-xs font-normal text-gray-600 w-24">{c}</th>
                             ))}
                         </tr>
                     </thead>
                     <tbody>
                         {rows.map(r => (
                             <tr key={r}>
                                 <td className="bg-gray-100 border border-gray-300 text-center text-xs text-gray-600">{r}</td>
                                 {cols.map(c => {
                                     const cellId = `${c}${r}`;
                                     return (
                                         <td key={cellId} className="border border-gray-300 p-0">
                                             <input 
                                                className="w-full h-full px-1 outline-none border-none focus:ring-2 focus:ring-green-500 focus:z-10 relative"
                                                value={cells[cellId] || ''}
                                                onChange={(e) => setCells(prev => ({ ...prev, [cellId]: e.target.value }))}
                                             />
                                         </td>
                                     )
                                 })}
                             </tr>
                         ))}
                     </tbody>
                 </table>
             </div>
        </div>
    )
  };

  const renderSlides = () => (
      <div className="flex-1 flex bg-gray-100">
          {/* Sidebar */}
          <div className="w-48 bg-gray-50 border-r border-gray-200 flex flex-col p-4 gap-4 overflow-y-auto">
              {slides.map((slide, idx) => (
                  <div 
                    key={slide.id}
                    onClick={() => setActiveSlide(idx)}
                    className={`aspect-video bg-white shadow border-2 cursor-pointer p-2 transform transition-transform hover:scale-105
                        ${activeSlide === idx ? 'border-orange-500 ring-2 ring-orange-200' : 'border-transparent'}
                    `}
                  >
                      <div className="w-full h-full flex flex-col items-center justify-center gap-1 overflow-hidden pointer-events-none">
                          <div className="text-[6px] font-bold">{slide.title}</div>
                          <div className="text-[4px] text-gray-500">{slide.body}</div>
                      </div>
                  </div>
              ))}
              <button 
                onClick={() => setSlides(prev => [...prev, { id: Date.now(), title: 'New Slide', body: 'Subtitle' }])}
                className="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-orange-500 hover:text-orange-500 flex items-center justify-center gap-2"
              >
                  <Plus size={16} /> New Slide
              </button>
          </div>
          
          {/* Main Stage */}
          <div className="flex-1 p-8 flex items-center justify-center bg-gray-200">
              <div className="aspect-video w-full max-w-4xl bg-white shadow-2xl p-12 flex flex-col justify-center items-center text-center">
                  <input 
                     className="text-4xl font-bold text-center outline-none border-none hover:bg-gray-50 w-full mb-4 placeholder-gray-300"
                     value={slides[activeSlide].title}
                     onChange={(e) => {
                         const newSlides = [...slides];
                         newSlides[activeSlide].title = e.target.value;
                         setSlides(newSlides);
                     }}
                     placeholder="Click to add title"
                  />
                  <textarea 
                     className="text-xl text-gray-500 text-center outline-none border-none hover:bg-gray-50 w-full resize-none placeholder-gray-300"
                     value={slides[activeSlide].body}
                     onChange={(e) => {
                         const newSlides = [...slides];
                         newSlides[activeSlide].body = e.target.value;
                         setSlides(newSlides);
                     }}
                     placeholder="Click to add subtitle"
                  />
              </div>
          </div>
      </div>
  );

  return (
    <div className="flex flex-col h-full bg-white text-gray-800 font-sans">
      {/* Header */}
      <div className="flex items-center gap-4 px-4 py-2 bg-[#2b579a] text-white">
         <div className="grid grid-cols-2 gap-0.5">
             <div className="w-2 h-2 bg-white/80 rounded-sm"></div>
             <div className="w-2 h-2 bg-white/80 rounded-sm"></div>
             <div className="w-2 h-2 bg-white/80 rounded-sm"></div>
             <div className="w-2 h-2 bg-white/80 rounded-sm"></div>
         </div>
         <div className="flex flex-col">
             <input 
                className="bg-transparent text-sm font-medium outline-none placeholder-white/70"
                value={documentTitle}
                onChange={(e) => setDocumentTitle(e.target.value)}
                placeholder="Untitled Document"
             />
             <div className="flex gap-2 text-xs text-white/80">
                 <button className="hover:text-white hover:underline">File</button>
                 <button className="hover:text-white hover:underline">Edit</button>
                 <button className="hover:text-white hover:underline">View</button>
                 <button className="hover:text-white hover:underline">Insert</button>
                 <button className="hover:text-white hover:underline">Format</button>
                 <button className="hover:text-white hover:underline">Help</button>
             </div>
         </div>
         <div className="flex-1" />
         <button 
            onClick={handleSave}
            className="flex items-center gap-2 bg-white text-[#2b579a] px-3 py-1.5 rounded text-sm font-medium hover:bg-gray-100"
         >
             <Save size={16} /> Save
         </button>
      </div>

      {/* App Switcher Tabs */}
      <div className="flex bg-[#2b579a] px-4 pt-2 gap-1">
          <button 
             onClick={() => setActiveApp('writer')}
             className={`px-4 py-2 rounded-t-lg flex items-center gap-2 text-sm font-medium transition-colors
                ${activeApp === 'writer' ? 'bg-white text-[#2b579a]' : 'bg-white/10 text-white hover:bg-white/20'}
             `}
          >
              <FileText size={16} /> Writer
          </button>
          <button 
             onClick={() => setActiveApp('sheets')}
             className={`px-4 py-2 rounded-t-lg flex items-center gap-2 text-sm font-medium transition-colors
                ${activeApp === 'sheets' ? 'bg-white text-[#188038]' : 'bg-white/10 text-white hover:bg-white/20'}
             `}
          >
              <Table size={16} /> Sheets
          </button>
          <button 
             onClick={() => setActiveApp('slides')}
             className={`px-4 py-2 rounded-t-lg flex items-center gap-2 text-sm font-medium transition-colors
                ${activeApp === 'slides' ? 'bg-white text-[#d93025]' : 'bg-white/10 text-white hover:bg-white/20'}
             `}
          >
              <Presentation size={16} /> Slides
          </button>
      </div>

      {/* Main Content Area */}
      {activeApp === 'writer' && renderWriter()}
      {activeApp === 'sheets' && renderSheets()}
      {activeApp === 'slides' && renderSlides()}
    </div>
  );
};

export default NexusOfficeApp;