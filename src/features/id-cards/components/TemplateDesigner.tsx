import React, { useState, useEffect } from 'react';
import { useIDCardStore, IDCardTemplate, TemplateElement, CHENNAI_SCHOOLS } from '../store/idCardStore';
import { ArrowLeft, Save, Type, Image as ImageIcon, QrCode, Move, CheckCircle, Palette, Upload, Sparkles, Barcode, FlipHorizontal, Shield, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import clsx from 'clsx';
import toast from 'react-hot-toast';

interface TemplateDesignerProps {
  templateId: string | null;
  onClose: () => void;
}

export const TemplateDesigner: React.FC<TemplateDesignerProps> = ({ templateId, onClose }) => {
  const { templates, addTemplate, updateTemplate, publishTemplate, archiveTemplate, selectedSchoolId } = useIDCardStore();
  const [editingSide, setEditingSide] = useState<'front' | 'back'>('front');
  const contextSchool = CHENNAI_SCHOOLS.find(s => s.id === selectedSchoolId) ?? null;
  
  const [template, setTemplate] = useState<Partial<IDCardTemplate>>({
    name: 'Untitled Template',
    scope: 'Global',
    orientation: 'landscape',
    width: 324, // 85.6mm equivalent
    height: 204, // 54mm equivalent
    elements: [],
    status: 'Draft',
    version: 1,
    cardStyle: {
      backgroundColor: '#ffffff',
      borderColor: '#e2e8f0',
      borderWidth: 0,
      borderRadius: 8,
    }
  });

  const [activeElementId, setActiveElementId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'element' | 'card'>('element');

  useEffect(() => {
    if (templateId) {
      const existing = templates.find(t => t.id === templateId);
      if (existing) {
        setTemplate(existing);
      }
    }
  }, [templateId, templates]);

  useEffect(() => {
    if (!activeElementId) {
      setActiveTab('card');
    } else {
      setActiveTab('element');
    }
  }, [activeElementId]);

  const handleSave = () => {
    if (templateId) {
      updateTemplate(templateId, template);
      toast.success('Template updated successfully');
    } else {
      addTemplate(template as any);
      toast.success('Template created successfully');
      onClose();
    }
  };

  const handlePublish = () => {
    if (templateId) {
      publishTemplate(templateId);
      toast.success('Template published! It is now available for generating cards.');
      onClose();
    }
  };

  const addElement = (type: 'text' | 'image' | 'qrcode' | 'barcode', contentOverride?: string) => {
    const defaultContent: Record<string, string> = {
      text: '{{student.name}}',
      image: '{{student.photo}}',
      qrcode: '{{student.qr_code}}',
      barcode: '{{student.admissionNo}}',
    };
    const newEl: TemplateElement = {
      id: `el_${Date.now()}`,
      type,
      x: 20,
      y: 20,
      width: type === 'text' ? 150 : type === 'barcode' ? 180 : 80,
      height: type === 'text' ? 30 : type === 'barcode' ? 36 : 80,
      content: contentOverride || defaultContent[type],
      style: type === 'text' ? { fontSize: '14px', color: '#000000', fontWeight: 'normal' } : {},
    };
    if (editingSide === 'front') {
      setTemplate(prev => ({ ...prev, elements: [...(prev.elements || []), newEl] }));
    } else {
      setTemplate(prev => ({ ...prev, backElements: [...(prev.backElements || []), newEl] }));
    }
    setActiveElementId(newEl.id);
  };

  const updateActiveElement = (updates: Partial<TemplateElement>) => {
    if (editingSide === 'front') {
      setTemplate(prev => ({
        ...prev,
        elements: prev.elements?.map(el => el.id === activeElementId ? { ...el, ...updates } : el)
      }));
    } else {
      setTemplate(prev => ({
        ...prev,
        backElements: (prev.backElements || []).map(el => el.id === activeElementId ? { ...el, ...updates } : el)
      }));
    }
  };

  const activeElements = editingSide === 'front' ? (template.elements || []) : (template.backElements || []);

  const updateCardStyle = (updates: any) => {
    setTemplate(prev => ({
      ...prev,
      cardStyle: { ...prev.cardStyle, ...updates }
    }));
  };

  const handleLogoUpload = () => {
    // Use the selected school's actual logo if available
    const logoUrl = contextSchool
      ? contextSchool.logoUrl
      : 'https://ui-avatars.com/api/?name=School+Logo&background=e2e8f0&color=475569&size=128';
    addElement('image', logoUrl);
    toast.success(contextSchool ? `${contextSchool.shortName} logo added!` : 'School logo added to template.');
  };

  const applySchoolTheme = () => {
    if (!contextSchool) return;
    
    setTemplate(prev => {
      // Check if logo already exists
      const hasLogo = prev.elements?.some(el => el.content === contextSchool.logoUrl);
      const newLogoElement: TemplateElement = {
        id: `el_${Date.now()}_logo`,
        type: 'image',
        x: 20,
        y: 20,
        width: 50,
        height: 50,
        content: contextSchool.logoUrl,
        style: { borderRadius: '50%', borderWidth: '0px' },
      };
      
      const newElements = hasLogo 
        ? prev.elements 
        : [...(prev.elements || []), newLogoElement];

      return {
        ...prev,
        elements: newElements,
        cardStyle: {
          ...prev.cardStyle,
          theme: contextSchool.theme.theme,
          primaryColor: contextSchool.theme.primaryColor,
          secondaryColor: contextSchool.theme.secondaryColor,
          borderColor: contextSchool.theme.primaryColor,
          borderWidth: 2,
          borderRadius: 10,
          backgroundColor: '#ffffff',
        }
      };
    });

    toast.success(`Applied ${contextSchool.shortName} official theme & logo!`);
  };

  const activeElement = template.elements?.find(e => e.id === activeElementId);

  return (
    <div className="flex flex-col h-[calc(100vh-180px)] min-h-[600px] bg-slate-50 -m-4 sm:-m-6 rounded-b-2xl overflow-hidden border-t border-slate-200">
      {/* Designer Header */}
      <div className="h-14 bg-white border-b border-slate-200 flex items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <button 
            onClick={onClose}
            className="p-1.5 hover:bg-slate-100 rounded-md text-slate-500 transition-colors"
          >
            <ArrowLeft size={18} />
          </button>
          <div className="flex flex-col">
            <input 
              type="text" 
              value={template.name}
              onChange={(e) => setTemplate({ ...template, name: e.target.value })}
              className="text-sm font-bold text-slate-800 bg-transparent border-none p-0 focus:ring-0 focus:outline-none w-64"
            />
            <div className="flex items-center gap-2 text-[10px] text-slate-500">
              <span className="uppercase">{template.status}</span>
              <span>•</span>
              <span>v{template.version}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={handleSave}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-300 text-slate-700 text-sm font-medium rounded-md hover:bg-slate-50 transition-colors"
          >
            <Save size={16} />
            Save Draft
          </button>
          {template.status === 'Draft' && templateId && (
            <button 
              onClick={handlePublish}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500 text-white text-sm font-medium rounded-md hover:bg-emerald-600 transition-colors shadow-sm"
            >
              <CheckCircle size={16} />
              Publish
            </button>
          )}
        </div>
      </div>

      {/* Main Designer Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Toolbar */}
        <div className="w-20 bg-white border-r border-slate-200 flex flex-col items-center py-6 gap-5 z-10 shadow-[2px_0_10px_rgba(0,0,0,0.02)]">
          <ToolbarButton icon={<Type size={22} />} label="Text" onClick={() => addElement('text')} />
          <ToolbarButton icon={<ImageIcon size={22} />} label="Image" onClick={() => addElement('image')} />
          <ToolbarButton icon={<QrCode size={22} />} label="QR" onClick={() => addElement('qrcode')} />
          <ToolbarButton icon={<Barcode size={22} className="text-emerald-500" />} label="Barcode" onClick={() => addElement('barcode')} />
          <div className="w-12 h-px bg-slate-200 my-2" />
          <ToolbarButton icon={<Upload size={22} className="text-indigo-500" />} label="Logo" onClick={handleLogoUpload} />
        </div>

        {/* Canvas Area */}
        <div className="flex-1 bg-slate-100/80 overflow-auto flex items-center justify-center p-8 custom-scrollbar relative" onClick={() => setActiveElementId(null)}>
          
          <div className="absolute top-4 left-4 flex gap-2 flex-wrap">
            <select 
              value={template.orientation}
              onChange={(e) => {
                const orientation = e.target.value as 'landscape' | 'portrait';
                setTemplate({ 
                  ...template, 
                  orientation,
                  width: orientation === 'landscape' ? 324 : 204,
                  height: orientation === 'landscape' ? 204 : 324,
                });
              }}
              className="text-xs border-slate-200 rounded-md bg-white shadow-sm text-slate-700 font-medium px-2 py-1 focus:ring-amber-500"
            >
              <option value="landscape">Landscape (CR-80)</option>
              <option value="portrait">Portrait (CR-80)</option>
            </select>

            {/* Front/Back toggle */}
            {template.hasBackSide && (
              <div className="flex bg-white rounded-md border border-slate-200 shadow-sm overflow-hidden">
                <button
                  onClick={(e) => { e.stopPropagation(); setEditingSide('front'); setActiveElementId(null); }}
                  className={clsx('px-2 py-1 text-xs font-bold transition-colors', editingSide === 'front' ? 'bg-slate-800 text-white' : 'text-slate-500 hover:bg-slate-100')}
                >
                  Front
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); setEditingSide('back'); setActiveElementId(null); }}
                  className={clsx('px-2 py-1 text-xs font-bold transition-colors flex items-center gap-1', editingSide === 'back' ? 'bg-slate-800 text-white' : 'text-slate-500 hover:bg-slate-100')}
                >
                  <FlipHorizontal size={11} /> Back
                </button>
              </div>
            )}

            {/* Toggle double-sided */}
            <button
              onClick={(e) => { e.stopPropagation(); setTemplate(prev => ({ ...prev, hasBackSide: !prev.hasBackSide })); }}
              className={clsx('px-2 py-1 text-xs font-bold rounded-md border shadow-sm flex items-center gap-1 transition-colors', template.hasBackSide ? 'bg-emerald-500 text-white border-emerald-500' : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50')}
            >
              <Shield size={11} /> {template.hasBackSide ? 'Double-Sided' : 'Single-Sided'}
            </button>
          </div>

          <div 
            className="bg-white shadow-2xl relative transition-all duration-300"
            style={{ 
              width: template.width, 
              height: template.height,
              backgroundColor: template.cardStyle?.backgroundColor || '#ffffff',
              border: `${template.cardStyle?.borderWidth || 0}px solid ${template.cardStyle?.borderColor || 'transparent'}`,
              borderRadius: `${template.cardStyle?.borderRadius || 0}px`,
              backgroundImage: template.cardStyle?.backgroundImage ? `url(${template.cardStyle.backgroundImage})` : 'none',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
            onClick={(e) => {
              e.stopPropagation();
              setActiveElementId(null);
            }}
          >
            {/* Grid Pattern Background - Only visible while editing */}
            <div className="absolute inset-0 opacity-[0.05] pointer-events-none rounded-inherit" style={{ backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
            
            {/* Theme Background */}
            <CardThemeRenderer
              theme={template.cardStyle?.theme}
              primaryColor={template.cardStyle?.primaryColor}
              secondaryColor={template.cardStyle?.secondaryColor}
            />
            
            {/* Elements */}
            {activeElements.map(el => (
              <motion.div
                key={el.id}
                drag
                dragMomentum={false}
                onDragEnd={(_, info) => {
                  updateActiveElement({ x: el.x + info.offset.x, y: el.y + info.offset.y });
                }}
                onClick={(e) => { e.stopPropagation(); setActiveElementId(el.id); }}
                className={clsx(
                  "absolute flex items-center justify-center cursor-move",
                  activeElementId === el.id ? "ring-2 ring-indigo-500 shadow-lg z-10" : "hover:ring-2 hover:ring-indigo-400/50 z-0",
                  el.type === 'image' && el.content?.startsWith('{{') ? "bg-slate-100 border border-slate-200 text-slate-400" : "",
                  el.type === 'image' && !el.content?.startsWith('{{') ? "bg-transparent" : ""
                )}
                style={{
                  left: el.x,
                  top: el.y,
                  width: el.width,
                  height: el.height,
                  ...el.style
                }}
              >
                {el.type === 'text' && (
                  <div className="w-full h-full p-1 whitespace-pre-wrap flex items-center">
                    {el.content}
                  </div>
                )}
                
                {el.type === 'image' && (
                  <div className="w-full h-full flex flex-col items-center justify-center text-[10px] font-medium overflow-hidden rounded-inherit">
                    {el.content?.startsWith('http') ? (
                      <img src={el.content} alt="element" className="w-full h-full object-cover pointer-events-none" />
                    ) : (
                      <>
                        <ImageIcon size={24} className="mb-1 opacity-50" />
                        {el.content}
                      </>
                    )}
                  </div>
                )}

                {el.type === 'qrcode' && (
                  <div className="w-full h-full bg-white/80 backdrop-blur-sm p-1 border border-slate-200/50 flex items-center justify-center rounded">
                    <QrCode size={el.width - 8} className="text-slate-800" />
                  </div>
                )}

                {el.type === 'barcode' && (
                  <div className="w-full h-full bg-white border border-slate-200 rounded flex flex-col items-center justify-center px-1 py-0.5">
                    <div className="flex gap-0.5 items-end h-3/4 w-full">
                      {Array.from({length: 16}, (_, i) => (
                        <div key={i} className="bg-slate-800" style={{ width: i % 3 === 0 ? 3 : 1.5, height: i % 5 === 0 ? '100%' : '70%' }} />
                      ))}
                    </div>
                    <div className="text-[6px] text-slate-500 mt-0.5 font-mono truncate w-full text-center">{el.content}</div>
                  </div>
                )}
                
                {/* Resize handles for active element */}
                {activeElementId === el.id && (
                  <>
                    <div className="absolute -top-1.5 -left-1.5 w-3 h-3 bg-white border-2 border-indigo-500 rounded-full shadow-sm" />
                    <div className="absolute -bottom-1.5 -right-1.5 w-3 h-3 bg-white border-2 border-indigo-500 rounded-full shadow-sm" />
                  </>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Right Properties Panel */}
        <div className="w-72 bg-white border-l border-slate-200 flex flex-col shadow-sm z-10">
          
          <div className="p-3 border-b border-slate-100 bg-slate-50/80 backdrop-blur-sm sticky top-0 z-20">
            <div className="flex bg-slate-200/60 p-1 rounded-xl">
              <button 
                onClick={() => setActiveTab('element')}
                className={clsx(
                  "flex-1 py-2 text-[11px] font-bold uppercase tracking-wider rounded-lg transition-all",
                  activeTab === 'element' ? "bg-white text-indigo-700 shadow-sm ring-1 ring-slate-900/5" : "text-slate-500 hover:text-slate-700"
                )}
              >
                Element
              </button>
              <button 
                onClick={() => { setActiveTab('card'); setActiveElementId(null); }}
                className={clsx(
                  "flex-1 py-2 text-[11px] font-bold uppercase tracking-wider rounded-lg transition-all",
                  activeTab === 'card' ? "bg-white text-indigo-700 shadow-sm ring-1 ring-slate-900/5" : "text-slate-500 hover:text-slate-700"
                )}
              >
                Card Theme
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar p-4">
            {activeTab === 'element' && activeElement ? (
              <div className="space-y-5 animate-in fade-in duration-200">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Data Binding / Content</label>
                  <input 
                    type="text" 
                    value={activeElement.content || ''}
                    onChange={(e) => updateActiveElement({ content: e.target.value })}
                    className="w-full text-sm border-slate-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 bg-white shadow-sm"
                  />
                  <div className="text-[10px] text-slate-400 mt-1">Try: {'{{student.name}}'}, {'{{student.photo}}'}, {'{{school.logo}}'}</div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">X Pos</label>
                    <input type="number" value={activeElement.x} onChange={(e) => updateActiveElement({ x: Number(e.target.value) })} className="w-full text-sm border-slate-200 rounded-lg bg-white shadow-sm focus:ring-indigo-500 focus:border-indigo-500" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Y Pos</label>
                    <input type="number" value={activeElement.y} onChange={(e) => updateActiveElement({ y: Number(e.target.value) })} className="w-full text-sm border-slate-200 rounded-lg bg-white shadow-sm focus:ring-indigo-500 focus:border-indigo-500" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Width</label>
                    <input type="number" value={activeElement.width} onChange={(e) => updateActiveElement({ width: Number(e.target.value) })} className="w-full text-sm border-slate-200 rounded-lg bg-white shadow-sm focus:ring-indigo-500 focus:border-indigo-500" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Height</label>
                    <input type="number" value={activeElement.height} onChange={(e) => updateActiveElement({ height: Number(e.target.value) })} className="w-full text-sm border-slate-200 rounded-lg bg-white shadow-sm focus:ring-indigo-500 focus:border-indigo-500" />
                  </div>
                </div>

                {activeElement.type === 'text' && (
                  <div className="space-y-4 pt-4 border-t border-slate-100">
                    <div>
                      <label className="block text-xs font-medium text-slate-600 mb-1.5">Typography</label>
                      <div className="flex gap-2 mb-2">
                        <select 
                          value={activeElement.style?.fontWeight || 'normal'}
                          onChange={(e) => updateActiveElement({ style: { ...activeElement.style, fontWeight: e.target.value } })}
                          className="flex-1 text-sm border-slate-300 rounded-md bg-slate-50 focus:ring-amber-500"
                        >
                          <option value="normal">Regular</option>
                          <option value="500">Medium</option>
                          <option value="600">SemiBold</option>
                          <option value="bold">Bold</option>
                        </select>
                        <input 
                          type="text" 
                          placeholder="Size (14px)"
                          value={activeElement.style?.fontSize || '14px'} 
                          onChange={(e) => updateActiveElement({ style: { ...activeElement.style, fontSize: e.target.value } })}
                          className="w-20 text-sm border-slate-300 rounded-md bg-slate-50 focus:ring-amber-500" 
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-600 mb-1.5">Text Color</label>
                      <div className="flex gap-2 items-center">
                        <input 
                          type="color" 
                          value={activeElement.style?.color || '#000000'}
                          onChange={(e) => updateActiveElement({ style: { ...activeElement.style, color: e.target.value } })}
                          className="w-8 h-8 rounded border border-slate-200 cursor-pointer p-0 bg-transparent" 
                        />
                        <input 
                          type="text" 
                          value={activeElement.style?.color || '#000000'} 
                          onChange={(e) => updateActiveElement({ style: { ...activeElement.style, color: e.target.value } })} 
                          className="flex-1 text-sm border-slate-300 rounded-md uppercase text-slate-600 focus:ring-amber-500" 
                        />
                      </div>
                    </div>
                  </div>
                )}

                {activeElement.type === 'image' && (
                  <div className="space-y-4 pt-4 border-t border-slate-100">
                    <div>
                      <label className="block text-xs font-medium text-slate-600 mb-1.5">Image Shape (Border Radius)</label>
                      <div className="flex items-center gap-2">
                        <input 
                          type="range" 
                          min="0" max="100" 
                          value={parseInt(activeElement.style?.borderRadius || '0')}
                          onChange={(e) => updateActiveElement({ style: { ...activeElement.style, borderRadius: `${e.target.value}%` } })}
                          className="flex-1 accent-amber-500" 
                        />
                        <span className="text-xs text-slate-500 w-10 text-right">{parseInt(activeElement.style?.borderRadius || '0')}%</span>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                         <label className="block text-xs font-medium text-slate-600 mb-1.5">Border Width</label>
                         <select 
                           value={activeElement.style?.borderWidth || '0px'}
                           onChange={(e) => updateActiveElement({ style: { ...activeElement.style, borderWidth: e.target.value, borderStyle: 'solid' } })}
                           className="w-full text-sm border-slate-300 rounded-md bg-slate-50 focus:ring-amber-500"
                         >
                            <option value="0px">None</option>
                            <option value="1px">1px</option>
                            <option value="2px">2px</option>
                            <option value="4px">4px</option>
                            <option value="6px">6px</option>
                         </select>
                      </div>
                      <div>
                         <label className="block text-xs font-medium text-slate-600 mb-1.5">Border Color</label>
                         <div className="flex gap-2 items-center">
                          <input 
                            type="color" 
                            value={activeElement.style?.borderColor || '#ffffff'}
                            onChange={(e) => updateActiveElement({ style: { ...activeElement.style, borderColor: e.target.value } })}
                            className="w-full h-9 rounded border border-slate-200 cursor-pointer p-0 bg-transparent" 
                            disabled={!activeElement.style?.borderWidth || activeElement.style?.borderWidth === '0px'}
                          />
                         </div>
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="pt-4 border-t border-slate-100 mt-6">
                  <button 
                    onClick={() => {
                      if (editingSide === 'front') {
                        setTemplate(prev => ({ ...prev, elements: prev.elements?.filter(e => e.id !== activeElementId) }));
                      } else {
                        setTemplate(prev => ({ ...prev, backElements: (prev.backElements || []).filter(e => e.id !== activeElementId) }));
                      }
                      setActiveElementId(null);
                    }}
                    className="w-full py-2 text-sm text-red-600 bg-red-50 hover:bg-red-100 rounded-md font-medium transition-colors border border-red-200"
                  >
                    Delete Element
                  </button>
                </div>
              </div>
            ) : activeTab === 'element' && !activeElement ? (
              <div className="h-full flex flex-col items-center justify-center text-slate-400">
                <Move className="w-10 h-10 mx-auto mb-3 opacity-30" />
                <p className="text-sm font-medium text-center px-4">Select an element on the canvas to edit properties</p>
              </div>
            ) : null}

            {activeTab === 'element' && !activeElement && editingSide === 'back' && (
              <div className="p-4 bg-blue-50 rounded-xl border border-blue-200 text-xs text-blue-700 mb-4">
                <div className="font-bold mb-1">Editing Back Side</div>
                Add elements like contact info, T&amp;C, or a secondary QR code. The back defaults to a plain style.
              </div>
            )}

            {activeTab === 'card' && (
              <div className="space-y-5 animate-in fade-in duration-200">

                {/* Apply School Theme Button */}
                {contextSchool && (
                  <div
                    className="rounded-xl p-3 border flex items-center gap-3"
                    style={{
                      background: `${contextSchool.theme.primaryColor}10`,
                      borderColor: `${contextSchool.theme.primaryColor}35`,
                    }}
                  >
                    <img
                      src={contextSchool.logoUrl}
                      alt={contextSchool.shortName}
                      className="w-10 h-10 rounded-lg object-cover flex-shrink-0"
                      style={{ background: contextSchool.theme.primaryColor }}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-bold text-slate-700 truncate">{contextSchool.shortName}</div>
                      <div className="text-[10px] text-slate-500">Official theme available</div>
                    </div>
                    <button
                      onClick={applySchoolTheme}
                      className="flex items-center gap-1.5 px-2.5 py-1.5 text-[11px] font-bold rounded-lg text-white flex-shrink-0"
                      style={{ background: contextSchool.theme.primaryColor }}
                    >
                      <Sparkles size={11} />
                      Apply
                    </button>
                  </div>
                )}

                {/* Theme Setting */}
                <div>
                  <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 uppercase tracking-wider mb-3">
                    <Palette size={14} className="text-amber-500" />
                    Card Theme
                  </label>
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { id: 'default', label: 'Default Solid' },
                        { id: 'modern-wave', label: 'Modern Wave' },
                        { id: 'corporate-edge', label: 'Corporate Edge' },
                        { id: 'gradient-flow', label: 'Gradient Flow' },
                        { id: 'playful-bubbles', label: 'Playful Bubbles' },
                        { id: 'classic-stripe', label: 'Classic Stripe' },
                        { id: 'geometric-mesh', label: 'Geometric Mesh' },
                        { id: 'glassmorphism', label: 'Glassmorphism' }
                      ].map(theme => (
                        <button
                          key={theme.id}
                          onClick={() => updateCardStyle({ theme: theme.id })}
                          className={clsx(
                            "py-2 px-1 text-[11px] rounded-lg border font-bold text-center transition-all shadow-sm",
                            template.cardStyle?.theme === theme.id || (!template.cardStyle?.theme && theme.id === 'default')
                              ? "bg-indigo-50 border-indigo-500 text-indigo-700 ring-1 ring-indigo-500/20"
                              : "bg-white border-slate-200 text-slate-600 hover:border-indigo-300 hover:bg-slate-50"
                          )}
                        >
                          {theme.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Primary & Secondary Colors */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1.5">Primary Color</label>
                    <div className="flex gap-2 items-center">
                      <input
                        type="color"
                        value={template.cardStyle?.primaryColor || '#1e3a5f'}
                        onChange={(e) => updateCardStyle({ primaryColor: e.target.value })}
                        className="w-8 h-8 rounded border border-slate-200 cursor-pointer p-0 bg-transparent"
                      />
                      <input
                        type="text"
                        value={template.cardStyle?.primaryColor || '#1e3a5f'}
                        onChange={(e) => updateCardStyle({ primaryColor: e.target.value })}
                        className="flex-1 text-xs border-slate-300 rounded-md uppercase text-slate-600 focus:ring-amber-500 bg-slate-50"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1.5">Secondary Color</label>
                    <div className="flex gap-2 items-center">
                      <input
                        type="color"
                        value={template.cardStyle?.secondaryColor || '#c8a951'}
                        onChange={(e) => updateCardStyle({ secondaryColor: e.target.value })}
                        className="w-8 h-8 rounded border border-slate-200 cursor-pointer p-0 bg-transparent"
                      />
                      <input
                        type="text"
                        value={template.cardStyle?.secondaryColor || '#c8a951'}
                        onChange={(e) => updateCardStyle({ secondaryColor: e.target.value })}
                        className="flex-1 text-xs border-slate-300 rounded-md uppercase text-slate-600 focus:ring-amber-500 bg-slate-50"
                      />
                    </div>
                  </div>
                </div>

                <div className="h-px bg-slate-100" />

                {/* Background Setting */}
                <div>
                  <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 uppercase tracking-wider mb-3">
                    <Palette size={14} className="text-amber-500" />
                    Background Color
                  </label>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-medium text-slate-500 mb-1">Color</label>
                      <div className="flex gap-2 items-center">
                        <input 
                          type="color" 
                          value={template.cardStyle?.backgroundColor || '#ffffff'}
                          onChange={(e) => updateCardStyle({ backgroundColor: e.target.value })}
                          className="w-8 h-8 rounded border border-slate-200 cursor-pointer p-0 bg-transparent" 
                        />
                        <input 
                          type="text" 
                          value={template.cardStyle?.backgroundColor || '#ffffff'} 
                          onChange={(e) => updateCardStyle({ backgroundColor: e.target.value })} 
                          className="flex-1 text-sm border-slate-300 rounded-md uppercase text-slate-600 focus:ring-amber-500 bg-slate-50" 
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="h-px bg-slate-100" />

                {/* Border Settings */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-3">
                    Border & Edges
                  </label>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-xs text-slate-500 mb-1">
                        <span>Border Radius</span>
                        <span>{template.cardStyle?.borderRadius || 0}px</span>
                      </div>
                      <input 
                        type="range" 
                        min="0" max="30" 
                        value={template.cardStyle?.borderRadius || 0}
                        onChange={(e) => updateCardStyle({ borderRadius: Number(e.target.value) })}
                        className="w-full accent-amber-500" 
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-slate-500 mb-1">Width</label>
                        <select 
                          value={template.cardStyle?.borderWidth || 0}
                          onChange={(e) => updateCardStyle({ borderWidth: Number(e.target.value) })}
                          className="w-full text-sm border-slate-300 rounded-md bg-slate-50 focus:ring-amber-500"
                        >
                          <option value="0">None</option>
                          <option value="1">1px</option>
                          <option value="2">2px</option>
                          <option value="4">4px</option>
                          <option value="8">8px</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-500 mb-1">Color</label>
                        <div className="flex gap-2">
                          <input 
                            type="color" 
                            value={template.cardStyle?.borderColor || '#e2e8f0'}
                            onChange={(e) => updateCardStyle({ borderColor: e.target.value })}
                            className="w-full h-[38px] rounded border border-slate-200 cursor-pointer p-0 bg-transparent" 
                            disabled={(template.cardStyle?.borderWidth || 0) === 0}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Security Pattern */}
                <div className="h-px bg-slate-100" />
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1">
                    <Shield size={12} className="text-amber-500" /> Security Features
                  </label>
                  <div className="grid grid-cols-2 gap-2 mb-3">
                    {['none', 'dots', 'lines', 'guilloche'].map(pattern => (
                      <button
                        key={pattern}
                        onClick={() => updateCardStyle({ securityPattern: pattern as any })}
                        className={clsx(
                          'py-1.5 px-2 text-[10px] font-bold rounded-lg border capitalize transition-all',
                          (template.cardStyle?.securityPattern === pattern || (!template.cardStyle?.securityPattern && pattern === 'none'))
                            ? 'bg-indigo-50 border-indigo-500 text-indigo-700'
                            : 'bg-white border-slate-200 text-slate-500 hover:border-indigo-300'
                        )}
                      >
                        {pattern}
                      </button>
                    ))}
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">Watermark Text</label>
                    <input
                      type="text"
                      placeholder="e.g. OFFICIAL, CONFIDENTIAL"
                      value={template.cardStyle?.watermark || ''}
                      onChange={(e) => updateCardStyle({ watermark: e.target.value || undefined })}
                      className="w-full text-xs border-slate-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 bg-white shadow-sm uppercase"
                    />
                  </div>
                </div>

                {/* Expiry */}
                <div className="h-px bg-slate-100" />
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1">
                    <Clock size={12} className="text-amber-500" /> Card Validity
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min="0"
                      max="60"
                      placeholder="12"
                      value={template.expiryMonths || ''}
                      onChange={(e) => setTemplate(prev => ({ ...prev, expiryMonths: Number(e.target.value) || undefined }))}
                      className="w-20 text-sm border-slate-300 rounded-lg bg-white focus:ring-amber-500 focus:border-amber-500"
                    />
                    <span className="text-xs text-slate-500">months (0 = no expiry)</span>
                  </div>
                </div>

              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const ToolbarButton = ({ icon, label, onClick }: { icon: React.ReactNode, label: string, onClick: () => void }) => (
  <button 
    onClick={onClick}
    title={`Add ${label}`}
    className="flex flex-col items-center gap-1.5 p-2.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all w-16 group"
  >
    <div className="group-hover:scale-110 transition-transform duration-200">{icon}</div>
    <span className="text-[9px] font-bold uppercase tracking-wider">{label}</span>
  </button>
);

const CardThemeRenderer = ({
  theme,
  primaryColor,
  secondaryColor,
}: {
  theme?: string;
  primaryColor?: string;
  secondaryColor?: string;
}) => {
  const p = primaryColor || '#1e3a5f';
  const s = secondaryColor || '#c8a951';

  if (theme === 'modern-wave') {
    return (
      <svg className="absolute inset-0 w-full h-full pointer-events-none rounded-inherit" preserveAspectRatio="none" viewBox="0 0 324 204">
        <defs>
          <linearGradient id="mw-grad1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={p} />
            <stop offset="100%" stopColor={s} />
          </linearGradient>
          <linearGradient id="mw-grad2" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={p} />
            <stop offset="100%" stopColor={s} />
          </linearGradient>
        </defs>
        <path d={`M0,0 L324,0 L324,65 C240,95 80,35 0,65 Z`} fill="url(#mw-grad1)" opacity="0.9" />
        <path d={`M0,0 L324,0 L324,48 C240,75 80,25 0,48 Z`} fill={p} opacity="0.4" />
        <path d={`M0,75 C15,120 -8,175 12,204 L0,204 Z`} fill={s} opacity="0.6" />
        <path d={`M220,204 C265,175 295,160 324,185 L324,204 Z`} fill="url(#mw-grad2)" />
      </svg>
    );
  }
  if (theme === 'corporate-edge') {
    return (
      <svg className="absolute inset-0 w-full h-full pointer-events-none rounded-inherit" preserveAspectRatio="none" viewBox="0 0 324 204">
        <defs>
          <linearGradient id="ce-grad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={p} />
            <stop offset="100%" stopColor={s} />
          </linearGradient>
        </defs>
        <path d={`M0,0 L324,0 L324,70 L0,30 Z`} fill="url(#ce-grad)" />
        <path d={`M0,30 L324,70 L324,80 L0,40 Z`} fill={s} opacity="0.8" />
        <path d={`M0,204 L120,204 L0,150 Z`} fill={p} opacity="0.8" />
        <path d={`M324,204 L204,204 L324,150 Z`} fill={s} opacity="0.9" />
      </svg>
    );
  }
  if (theme === 'gradient-flow') {
    return (
      <div className="absolute inset-0 w-full h-full pointer-events-none rounded-inherit overflow-hidden"
        style={{ 
          background: `linear-gradient(135deg, ${p} 0%, ${s} 100%)`,
          boxShadow: 'inset 0 0 40px rgba(255,255,255,0.2)'
        }}>
        <svg className="absolute -bottom-4 -left-4 w-[120%] h-[60%]" preserveAspectRatio="none" viewBox="0 0 324 120">
          <path d="M0,120 L324,120 L324,40 C245,-10 160,110 0,15 Z" fill="#ffffff" opacity="0.95" />
          <path d="M0,120 L324,120 L324,65 C245,5 160,125 0,40 Z" fill="#ffffff" opacity="0.6" />
          <path d="M0,120 L324,120 L324,88 C245,30 160,145 0,65 Z" fill="#ffffff" opacity="0.3" />
        </svg>
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mt-10 -mr-10"></div>
        <div className="absolute bottom-10 left-10 w-24 h-24 bg-black/10 rounded-full blur-xl"></div>
      </div>
    );
  }
  if (theme === 'playful-bubbles') {
    return (
      <div className="absolute inset-0 w-full h-full pointer-events-none rounded-inherit overflow-hidden bg-white">
        <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none" viewBox="0 0 324 204">
          <path d={`M0,0 L324,0 L324,110 C240,90 80,120 0,80 Z`} fill={p} />
          <circle cx="280" cy="40" r="30" fill={s} opacity="0.8" />
          <circle cx="250" cy="80" r="15" fill="#ffffff" opacity="0.3" />
          <circle cx="50" cy="50" r="40" fill={s} opacity="0.6" />
          <circle cx="90" cy="20" r="10" fill="#ffffff" opacity="0.4" />
          <circle cx="20" cy="180" r="60" fill={s} opacity="0.1" />
          <circle cx="300" cy="190" r="45" fill={p} opacity="0.05" />
        </svg>
        <div className="absolute inset-0 backdrop-blur-[2px]"></div>
      </div>
    );
  }
  if (theme === 'classic-stripe') {
    return (
      <svg className="absolute inset-0 w-full h-full pointer-events-none rounded-inherit" preserveAspectRatio="none" viewBox="0 0 324 204">
        <rect x="0" y="0" width="324" height="204" fill="#ffffff" />
        <rect x="15" y="0" width="4" height="204" fill={p} />
        <rect x="22" y="0" width="2" height="204" fill={s} />
        <path d={`M0,170 L324,170 L324,204 L0,204 Z`} fill={p} />
        <path d={`M0,165 L324,165 L324,170 L0,170 Z`} fill={s} />
        <polygon points="324,0 324,40 284,0" fill={s} />
      </svg>
    );
  }
  if (theme === 'geometric-mesh') {
    return (
      <svg className="absolute inset-0 w-full h-full pointer-events-none rounded-inherit" preserveAspectRatio="none" viewBox="0 0 324 204">
        <defs>
          <pattern id="mesh" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1" fill={p} opacity="0.2" />
          </pattern>
        </defs>
        <rect x="0" y="0" width="324" height="204" fill="url(#mesh)" />
        <polygon points="0,0 324,0 324,80 162,120 0,80" fill={p} opacity="0.95" />
        <polygon points="0,0 162,120 0,160" fill={s} opacity="0.7" />
        <polygon points="324,0 162,120 324,160" fill={p} opacity="0.5" />
      </svg>
    );
  }
  if (theme === 'glassmorphism') {
    return (
      <div className="absolute inset-0 w-full h-full pointer-events-none rounded-inherit overflow-hidden bg-slate-50">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[70%] rounded-full mix-blend-multiply filter blur-2xl opacity-70" style={{ background: p }}></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[70%] rounded-full mix-blend-multiply filter blur-2xl opacity-70" style={{ background: s }}></div>
        <div className="absolute inset-4 rounded-xl border border-white/40 shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] backdrop-blur-sm" style={{ background: 'rgba(255, 255, 255, 0.45)' }}></div>
      </div>
    );
  }
  return null;
};
