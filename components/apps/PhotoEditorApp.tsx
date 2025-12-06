import React, { useState, useRef, useEffect } from 'react';
import { 
  Save, 
  Image as ImageIcon, 
  Type, 
  Crop, 
  Brush, 
  Eraser, 
  Undo, 
  Redo, 
  Sliders, 
  Sun, 
  Droplet, 
  Eye, 
  Sparkles,
  Download,
  MousePointer
} from 'lucide-react';
import { GoogleGenAI } from '@google/genai';
import { useOS } from '../../context/OSContext';

const PhotoEditorApp: React.FC<{ windowId: string }> = ({ windowId }) => {
  const { windows, createFile, updateFileContent } = useOS();
  
  // Canvas Refs
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Tools & State
  const [activeTool, setActiveTool] = useState<'move' | 'brush' | 'eraser' | 'text'>('move');
  const [brushColor, setBrushColor] = useState('#000000');
  const [brushSize, setBrushSize] = useState(5);
  const [isDrawing, setIsDrawing] = useState(false);
  
  // Adjustments
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [saturation, setSaturation] = useState(100);
  const [blur, setBlur] = useState(0);

  // AI State
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [showAiPanel, setShowAiPanel] = useState(false);

  // Image Source for referencing
  const [originalImage, setOriginalImage] = useState<HTMLImageElement | null>(null);

  // Initialization
  useEffect(() => {
    const win = windows.find(w => w.id === windowId);
    if (win?.props?.content) {
      loadImage(win.props.content);
    } else {
      // Initialize blank white canvas
      initCanvas(800, 600);
    }
  }, [windowId]);

  const initCanvas = (w: number, h: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, w, h);
    }
  };

  const loadImage = (src: string) => {
    const img = new Image();
    img.onload = () => {
      setOriginalImage(img);
      const canvas = canvasRef.current;
      if (canvas) {
        // Fit logic
        let w = img.width;
        let h = img.height;
        const maxW = 1200;
        const maxH = 800;
        
        if (w > maxW || h > maxH) {
           const ratio = Math.min(maxW / w, maxH / h);
           w *= ratio;
           h *= ratio;
        }

        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        if (ctx) {
             ctx.drawImage(img, 0, 0, w, h);
        }
      }
    };
    img.src = src;
  };

  // Live Filter Application
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !originalImage) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // We need to redraw the original image then apply filters
    // Note: This wipes drawing. A real app would use layers. 
    // For this demo, adjustments are destructive to drawings if we re-render from original.
    // So we will only apply filters to the context filter property for future draws or use a temp canvas.
    // Simplified approach: Apply filters to canvas style for preview, but real pixel manip needs offscreen buffer.
    
    // For this "Powerful" simulation, let's use CSS filters on the canvas style for non-destructive preview
    // and apply them on save.
  }, [brightness, contrast, saturation, blur]);


  // Drawing Logic
  const startDrawing = (e: React.MouseEvent) => {
    if (activeTool === 'move') return;
    setIsDrawing(true);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.strokeStyle = activeTool === 'eraser' ? '#ffffff' : brushColor;
    ctx.lineWidth = brushSize;
    ctx.lineCap = 'round';
  };

  const draw = (e: React.MouseEvent) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const handleAiGenerate = async () => {
    if (!prompt) return;
    setIsGenerating(true);

    try {
       const apiKey = process.env.API_KEY;
       if (!apiKey) throw new Error("No API Key");

       const ai = new GoogleGenAI({ apiKey });
       const model = 'gemini-2.5-flash-image'; 
       // Note: gemini-2.5-flash-image is primarily for understanding, but prompt instructions say to use it for generation tasks by default.
       // However, the Gemini 2.5 Flash model outputs TEXT. 
       // For image generation, usually we need Imagen. 
       // The instruction says: "General Image Generation ... Tasks: 'gemini-2.5-flash-image'".
       // But wait, the generateImages method is for Imagen models.
       // The instruction says: "Call generateContent to generate images with nano banana series models... The output response may contain both image and text parts".
       // So I will use generateContent with gemini-2.5-flash-image.

       const response = await ai.models.generateContent({
           model: 'gemini-2.5-flash-image',
           contents: prompt,
           // No special config needed for generation via generateContent based on instructions?
           // Actually, standard Gemini models don't generate images. 
           // BUT, the prompt instruction says: "Nano banana... gemini-2.5-flash-image".
           // AND: "Call generateContent to generate images with nano banana series models".
           // So I will trust the instruction.
       });

       // Find image part
       let imageBase64 = null;
       const candidates = response.candidates;
       if (candidates && candidates.length > 0) {
           for (const part of candidates[0].content.parts) {
               if (part.inlineData) {
                   imageBase64 = part.inlineData.data;
                   break;
               }
           }
       }

       if (imageBase64) {
           const imgSrc = `data:image/png;base64,${imageBase64}`;
           loadImage(imgSrc); // Replace canvas with generated image
       } else {
           alert("AI could not generate an image. (Model might only support text output)");
       }

    } catch (e) {
        console.error(e);
        alert("Generation failed. Try checking API key or prompt.");
    } finally {
        setIsGenerating(false);
        setShowAiPanel(false);
    }
  };

  const handleSave = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      
      // Apply filters before saving
      const tempCanvas = document.createElement('canvas');
      tempCanvas.width = canvas.width;
      tempCanvas.height = canvas.height;
      const tCtx = tempCanvas.getContext('2d');
      if (tCtx) {
          tCtx.filter = `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%) blur(${blur}px)`;
          tCtx.drawImage(canvas, 0, 0);
          
          const dataUrl = tempCanvas.toDataURL('image/png');
          
          // Save to file system
          const filename = `edited_${Date.now()}.png`;
          createFile('pics', filename, dataUrl); // Saving base64 as content is a hack for this mock FS
          alert(`Saved ${filename} to Pictures`);
      }
  };

  return (
    <div className="flex h-full bg-[#1e1e1e] text-gray-300 font-sans select-none">
      {/* Left Sidebar: Tools */}
      <div className="w-16 bg-[#252526] border-r border-[#3e3e3e] flex flex-col items-center py-4 gap-4 z-10">
        <button 
            onClick={() => setActiveTool('move')}
            className={`p-3 rounded-lg transition-all ${activeTool === 'move' ? 'bg-blue-600 text-white' : 'hover:bg-white/10'}`}
            title="Move / Select"
        >
            <MousePointer size={20} />
        </button>
        <button 
            onClick={() => setActiveTool('brush')}
            className={`p-3 rounded-lg transition-all ${activeTool === 'brush' ? 'bg-blue-600 text-white' : 'hover:bg-white/10'}`}
            title="Brush Tool"
        >
            <Brush size={20} />
        </button>
        <button 
            onClick={() => setActiveTool('eraser')}
            className={`p-3 rounded-lg transition-all ${activeTool === 'eraser' ? 'bg-blue-600 text-white' : 'hover:bg-white/10'}`}
            title="Eraser Tool"
        >
            <Eraser size={20} />
        </button>
        <div className="w-8 h-[1px] bg-gray-600 my-1" />
        <button 
            onClick={() => setShowAiPanel(!showAiPanel)}
            className={`p-3 rounded-lg transition-all animate-pulse ${showAiPanel ? 'bg-purple-600 text-white' : 'bg-gradient-to-br from-purple-500/20 to-blue-500/20 text-purple-400 hover:text-white'}`}
            title="AI Generation"
        >
            <Sparkles size={20} />
        </button>
      </div>

      {/* Center: Canvas Area */}
      <div className="flex-1 bg-[#181818] overflow-auto flex items-center justify-center relative p-8" ref={containerRef}>
         <div 
            className="relative shadow-2xl"
            style={{
                filter: `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%) blur(${blur}px)`
            }}
         >
             <canvas 
                ref={canvasRef}
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                className="cursor-crosshair bg-white"
             />
         </div>

         {/* AI Panel Overlay */}
         {showAiPanel && (
             <div className="absolute top-4 left-4 w-80 bg-[#252526] border border-gray-600 rounded-xl shadow-2xl p-4 z-20 animate-fade-in">
                 <h3 className="text-white font-semibold mb-2 flex items-center gap-2">
                     <Sparkles size={16} className="text-purple-400" />
                     Generative Fill
                 </h3>
                 <textarea 
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Describe what you want to generate..."
                    className="w-full bg-[#1e1e1e] border border-gray-600 rounded-lg p-3 text-sm text-white focus:border-purple-500 outline-none resize-none h-24 mb-3"
                 />
                 <button 
                    onClick={handleAiGenerate}
                    disabled={isGenerating}
                    className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-medium py-2 rounded-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                 >
                    {isGenerating ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : 'Generate'}
                 </button>
             </div>
         )}
      </div>

      {/* Right Sidebar: Adjustments */}
      <div className="w-64 bg-[#252526] border-l border-[#3e3e3e] flex flex-col">
          <div className="p-4 border-b border-[#3e3e3e] flex items-center justify-between">
              <span className="font-semibold text-white">Adjustments</span>
              <Sliders size={16} />
          </div>
          
          <div className="p-4 space-y-6 overflow-y-auto flex-1">
              {/* Brush Settings if active */}
              {(activeTool === 'brush' || activeTool === 'eraser') && (
                  <div className="space-y-3 pb-6 border-b border-gray-700">
                      <div className="text-xs font-medium uppercase text-gray-500">Tool Settings</div>
                      <div>
                          <label className="text-xs flex justify-between mb-1">Size: {brushSize}px</label>
                          <input 
                            type="range" min="1" max="50" 
                            value={brushSize} onChange={(e) => setBrushSize(Number(e.target.value))}
                            className="w-full accent-blue-500"
                          />
                      </div>
                      {activeTool === 'brush' && (
                        <div>
                            <label className="text-xs flex justify-between mb-1">Color</label>
                            <div className="flex gap-2 flex-wrap">
                                {['#000000', '#ffffff', '#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'].map(c => (
                                    <button 
                                        key={c}
                                        onClick={() => setBrushColor(c)}
                                        className={`w-6 h-6 rounded-full border border-gray-600 ${brushColor === c ? 'ring-2 ring-white scale-110' : ''}`}
                                        style={{ backgroundColor: c }}
                                    />
                                ))}
                            </div>
                        </div>
                      )}
                  </div>
              )}

              <div className="space-y-4">
                  <div>
                      <label className="text-xs flex justify-between mb-1 text-gray-400">
                          <span className="flex items-center gap-1"><Sun size={12}/> Brightness</span>
                          <span>{brightness}%</span>
                      </label>
                      <input 
                        type="range" min="0" max="200" 
                        value={brightness} onChange={(e) => setBrightness(Number(e.target.value))}
                        className="w-full accent-blue-500"
                      />
                  </div>
                  <div>
                      <label className="text-xs flex justify-between mb-1 text-gray-400">
                          <span className="flex items-center gap-1"><Eye size={12}/> Contrast</span>
                          <span>{contrast}%</span>
                      </label>
                      <input 
                        type="range" min="0" max="200" 
                        value={contrast} onChange={(e) => setContrast(Number(e.target.value))}
                        className="w-full accent-blue-500"
                      />
                  </div>
                  <div>
                      <label className="text-xs flex justify-between mb-1 text-gray-400">
                          <span className="flex items-center gap-1"><Droplet size={12}/> Saturation</span>
                          <span>{saturation}%</span>
                      </label>
                      <input 
                        type="range" min="0" max="200" 
                        value={saturation} onChange={(e) => setSaturation(Number(e.target.value))}
                        className="w-full accent-blue-500"
                      />
                  </div>
                  <div>
                      <label className="text-xs flex justify-between mb-1 text-gray-400">
                          <span className="flex items-center gap-1"><Droplet size={12}/> Blur</span>
                          <span>{blur}px</span>
                      </label>
                      <input 
                        type="range" min="0" max="20" 
                        value={blur} onChange={(e) => setBlur(Number(e.target.value))}
                        className="w-full accent-blue-500"
                      />
                  </div>
              </div>
          </div>

          <div className="p-4 border-t border-[#3e3e3e]">
              <button 
                onClick={handleSave}
                className="w-full bg-blue-600 hover:bg-blue-500 text-white py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
              >
                  <Save size={16} /> Save Image
              </button>
          </div>
      </div>
    </div>
  );
};

export default PhotoEditorApp;