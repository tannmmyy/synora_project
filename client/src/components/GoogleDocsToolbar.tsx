import React, { useState, useRef, useEffect } from 'react';
import { Editor } from '@tiptap/react';
import {
  Undo,
  Redo,
  Printer,
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  Baseline,
  Highlighter,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  List,
  ListOrdered,
  CheckSquare,
  Quote,
  Code,
  Table as TableIcon,
  RemoveFormatting,
  ChevronDown,
  Sparkles,
  Type,
  Plus,
  Minus,
  Rows,
  Columns as ColumnsIcon,
  Trash2
} from 'lucide-react';

interface GoogleDocsToolbarProps {
  editor: Editor | null;
  onPrint: () => void;
  onOpenAIModal?: () => void;
}

export const GoogleDocsToolbar: React.FC<GoogleDocsToolbarProps> = ({ 
  editor, 
  onPrint,
  onOpenAIModal,
}) => {
  const [zoom, setZoom] = useState('100%');
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showHighlightPicker, setShowHighlightPicker] = useState(false);
  const [showTableMenu, setShowTableMenu] = useState(false);

  const colorRef = useRef<HTMLDivElement>(null);
  const highlightRef = useRef<HTMLDivElement>(null);
  const tableRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (colorRef.current && !colorRef.current.contains(e.target as Node)) {
        setShowColorPicker(false);
      }
      if (highlightRef.current && !highlightRef.current.contains(e.target as Node)) {
        setShowHighlightPicker(false);
      }
      if (tableRef.current && !tableRef.current.contains(e.target as Node)) {
        setShowTableMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!editor) {
    return null;
  }

  const TEXT_COLORS = [
    '#ffffff', '#f8fafc', '#e2e8f0', '#94a3b8', '#64748b', '#0f172a',
    '#f43f5e', '#fb7185', '#fda4af', '#e11d48', '#9f1239', '#881337',
    '#ec4899', '#d946ef', '#a855f7', '#8b5cf6', '#6366f1', '#3b82f6',
    '#0ea5e9', '#06b6d4', '#14b8a6', '#10b981', '#84cc16', '#eab308',
    '#f97316', '#ef4444', '#78350f', '#451a03', '#1e293b', '#000000',
  ];

  const HIGHLIGHT_COLORS = [
    { name: 'None', color: 'transparent' },
    { name: 'Yellow', color: 'rgba(234, 179, 8, 0.35)' },
    { name: 'Rose', color: 'rgba(244, 63, 94, 0.35)' },
    { name: 'Emerald', color: 'rgba(16, 185, 129, 0.35)' },
    { name: 'Cyan', color: 'rgba(6, 182, 212, 0.35)' },
    { name: 'Purple', color: 'rgba(168, 85, 247, 0.35)' },
    { name: 'Amber', color: 'rgba(245, 158, 11, 0.35)' },
  ];

  const handleTextStyleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (value === 'paragraph') {
      editor.chain().focus().setParagraph().run();
    } else if (value === 'h1') {
      editor.chain().focus().toggleHeading({ level: 1 }).run();
    } else if (value === 'h2') {
      editor.chain().focus().toggleHeading({ level: 2 }).run();
    } else if (value === 'h3') {
      editor.chain().focus().toggleHeading({ level: 3 }).run();
    }
  };

  const getCurrentHeading = () => {
    if (editor.isActive('heading', { level: 1 })) return 'h1';
    if (editor.isActive('heading', { level: 2 })) return 'h2';
    if (editor.isActive('heading', { level: 3 })) return 'h3';
    return 'paragraph';
  };

  const insertTable = () => {
    editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
    setShowTableMenu(false);
  };

  const isInsideTable = editor.isActive('table');

  return (
    <div className="bg-[#280e1a]/85 backdrop-blur-2xl px-4 py-2 border border-white/15 flex items-center space-x-1.5 flex-wrap text-rose-100/90 rounded-2xl mx-auto my-2 shadow-[0_15px_35px_rgba(0,0,0,0.6)] no-print max-w-5xl justify-center transition-all select-none">
      {/* Undo & Redo */}
      <div className="flex items-center space-x-0.5">
        <button
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          className="p-1.5 hover:bg-white/15 hover:text-white disabled:opacity-20 rounded-xl transition-colors"
          title="Undo (Ctrl+Z)"
        >
          <Undo className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          className="p-1.5 hover:bg-white/15 hover:text-white disabled:opacity-20 rounded-xl transition-colors"
          title="Redo (Ctrl+Y)"
        >
          <Redo className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={onPrint}
          className="p-1.5 hover:bg-white/15 hover:text-white rounded-xl transition-colors"
          title="Print (Ctrl+P)"
        >
          <Printer className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="h-4 w-px bg-white/15 mx-1" />

      {/* Synora AI Smart Writing Button */}
      {onOpenAIModal && (
        <button
          onClick={onOpenAIModal}
          className="flex items-center space-x-1.5 px-3 py-1 bg-gradient-to-r from-rose-500/30 via-pink-500/30 to-indigo-500/30 hover:from-rose-500/50 hover:to-indigo-500/50 text-white rounded-xl border border-rose-400/40 text-xs font-semibold shadow-xs transition-all hover:scale-105 active:scale-95"
          title="Synora AI Writing Assistant"
        >
          <Sparkles className="w-3.5 h-3.5 text-rose-300 animate-pulse" />
          <span className="text-[11px]">Synora AI</span>
        </button>
      )}

      <div className="h-4 w-px bg-white/15 mx-1" />

      {/* Heading Style Dropdown */}
      <select
        value={getCurrentHeading()}
        onChange={handleTextStyleChange}
        className="bg-white/10 hover:bg-white/15 text-white px-2.5 py-1 text-xs font-medium rounded-xl border border-white/15 focus:outline-none focus:ring-1 focus:ring-rose-400 cursor-pointer backdrop-blur-md"
      >
        <option value="paragraph" className="bg-[#240916] text-white">Normal text</option>
        <option value="h1" className="bg-[#240916] text-white font-bold">Heading 1</option>
        <option value="h2" className="bg-[#240916] text-white font-semibold">Heading 2</option>
        <option value="h3" className="bg-[#240916] text-white font-medium">Heading 3</option>
      </select>

      {/* Zoom selector */}
      <select
        value={zoom}
        onChange={(e) => {
          setZoom(e.target.value);
          const el = document.querySelector('.ProseMirror') as HTMLElement;
          if (el) {
            const scale = parseInt(e.target.value) / 100;
            el.style.transform = `scale(${scale})`;
            el.style.transformOrigin = 'top center';
          }
        }}
        className="bg-white/10 hover:bg-white/15 text-white px-2 py-1 text-xs rounded-xl border border-white/15 focus:outline-none cursor-pointer backdrop-blur-md"
      >
        <option value="75" className="bg-[#240916] text-white">75%</option>
        <option value="90" className="bg-[#240916] text-white">90%</option>
        <option value="100" className="bg-[#240916] text-white">100%</option>
        <option value="125" className="bg-[#240916] text-white">125%</option>
        <option value="150" className="bg-[#240916] text-white">150%</option>
      </select>

      <div className="h-4 w-px bg-white/15 mx-1" />

      {/* Formatting Marks (Bold, Italic, Underline, Strike) */}
      <div className="flex items-center space-x-0.5">
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`p-1.5 rounded-xl transition-all ${
            editor.isActive('bold')
              ? 'bg-white/25 text-white font-bold shadow-inner ring-1 ring-white/30'
              : 'hover:bg-white/15 hover:text-white'
          }`}
          title="Bold (Ctrl+B)"
        >
          <Bold className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`p-1.5 rounded-xl transition-all ${
            editor.isActive('italic')
              ? 'bg-white/25 text-white shadow-inner ring-1 ring-white/30'
              : 'hover:bg-white/15 hover:text-white'
          }`}
          title="Italic (Ctrl+I)"
        >
          <Italic className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={`p-1.5 rounded-xl transition-all ${
            editor.isActive('underline')
              ? 'bg-white/25 text-white shadow-inner ring-1 ring-white/30'
              : 'hover:bg-white/15 hover:text-white'
          }`}
          title="Underline (Ctrl+U)"
        >
          <UnderlineIcon className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={`p-1.5 rounded-xl transition-all ${
            editor.isActive('strike')
              ? 'bg-white/25 text-white shadow-inner ring-1 ring-white/30'
              : 'hover:bg-white/15 hover:text-white'
          }`}
          title="Strikethrough"
        >
          <Strikethrough className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="h-4 w-px bg-white/15 mx-1" />

      {/* Text Color Picker */}
      <div className="relative" ref={colorRef}>
        <button
          onClick={() => setShowColorPicker(!showColorPicker)}
          className="p-1.5 hover:bg-white/15 hover:text-white rounded-xl flex items-center space-x-0.5 transition-colors"
          title="Text Color"
        >
          <Baseline className="w-3.5 h-3.5" />
          <ChevronDown className="w-2.5 h-2.5 opacity-60" />
        </button>
        {showColorPicker && (
          <div className="absolute top-full left-0 mt-2 p-3 bg-[#240916]/95 backdrop-blur-2xl border border-white/20 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.85)] z-50 grid grid-cols-6 gap-1.5 w-52">
            {TEXT_COLORS.map((c) => (
              <button
                key={c}
                onClick={() => {
                  editor.chain().focus().setColor(c).run();
                  setShowColorPicker(false);
                }}
                className="w-6 h-6 rounded-full border border-white/20 hover:scale-115 transition-transform"
                style={{ backgroundColor: c }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Highlight Color */}
      <div className="relative" ref={highlightRef}>
        <button
          onClick={() => setShowHighlightPicker(!showHighlightPicker)}
          className="p-1.5 hover:bg-white/15 hover:text-white rounded-xl flex items-center space-x-0.5 transition-colors"
          title="Highlight Color"
        >
          <Highlighter className="w-3.5 h-3.5" />
          <ChevronDown className="w-2.5 h-2.5 opacity-60" />
        </button>
        {showHighlightPicker && (
          <div className="absolute top-full left-0 mt-2 p-3 bg-[#240916]/95 backdrop-blur-2xl border border-white/20 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.85)] z-50 grid grid-cols-4 gap-2 w-48">
            {HIGHLIGHT_COLORS.map((h) => (
              <button
                key={h.name}
                onClick={() => {
                  if (h.color === 'transparent') {
                    editor.chain().focus().unsetHighlight().run();
                  } else {
                    editor.chain().focus().toggleHighlight({ color: h.color }).run();
                  }
                  setShowHighlightPicker(false);
                }}
                className="w-8 h-8 rounded-xl border border-white/20 hover:scale-110 transition-transform flex items-center justify-center text-[10px] text-white"
                style={{ backgroundColor: h.color }}
                title={h.name}
              >
                {h.color === 'transparent' ? '✕' : ''}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="h-4 w-px bg-white/15 mx-1" />

      {/* Alignment */}
      <div className="flex items-center space-x-0.5">
        <button
          onClick={() => editor.chain().focus().setTextAlign('left').run()}
          className={`p-1.5 rounded-xl transition-all ${
            editor.isActive({ textAlign: 'left' })
              ? 'bg-white/25 text-white shadow-inner'
              : 'hover:bg-white/15 hover:text-white'
          }`}
          title="Align Left"
        >
          <AlignLeft className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={() => editor.chain().focus().setTextAlign('center').run()}
          className={`p-1.5 rounded-xl transition-all ${
            editor.isActive({ textAlign: 'center' })
              ? 'bg-white/25 text-white shadow-inner'
              : 'hover:bg-white/15 hover:text-white'
          }`}
          title="Align Center"
        >
          <AlignCenter className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={() => editor.chain().focus().setTextAlign('right').run()}
          className={`p-1.5 rounded-xl transition-all ${
            editor.isActive({ textAlign: 'right' })
              ? 'bg-white/25 text-white shadow-inner'
              : 'hover:bg-white/15 hover:text-white'
          }`}
          title="Align Right"
        >
          <AlignRight className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={() => editor.chain().focus().setTextAlign('justify').run()}
          className={`p-1.5 rounded-xl transition-all ${
            editor.isActive({ textAlign: 'justify' })
              ? 'bg-white/25 text-white shadow-inner'
              : 'hover:bg-white/15 hover:text-white'
          }`}
          title="Justify"
        >
          <AlignJustify className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="h-4 w-px bg-white/15 mx-1" />

      {/* Lists & Task Checklist */}
      <div className="flex items-center space-x-0.5">
        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-1.5 rounded-xl transition-all ${
            editor.isActive('bulletList')
              ? 'bg-white/25 text-white shadow-inner'
              : 'hover:bg-white/15 hover:text-white'
          }`}
          title="Bulleted list"
        >
          <List className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`p-1.5 rounded-xl transition-all ${
            editor.isActive('orderedList')
              ? 'bg-white/25 text-white shadow-inner'
              : 'hover:bg-white/15 hover:text-white'
          }`}
          title="Numbered list"
        >
          <ListOrdered className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleTaskList().run()}
          className={`p-1.5 rounded-xl transition-all ${
            editor.isActive('taskList')
              ? 'bg-white/25 text-white shadow-inner'
              : 'hover:bg-white/15 hover:text-white'
          }`}
          title="Checklist"
        >
          <CheckSquare className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="h-4 w-px bg-white/15 mx-1" />

      {/* Quote & Code & Table */}
      <div className="flex items-center space-x-0.5">
        <button
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`p-1.5 rounded-xl transition-all ${
            editor.isActive('blockquote')
              ? 'bg-white/25 text-white shadow-inner'
              : 'hover:bg-white/15 hover:text-white'
          }`}
          title="Blockquote"
        >
          <Quote className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          className={`p-1.5 rounded-xl transition-all ${
            editor.isActive('codeBlock')
              ? 'bg-white/25 text-white shadow-inner'
              : 'hover:bg-white/15 hover:text-white'
          }`}
          title="Code block"
        >
          <Code className="w-3.5 h-3.5" />
        </button>

        {/* Table Menu */}
        <div className="relative" ref={tableRef}>
          <button
            onClick={() => setShowTableMenu(!showTableMenu)}
            className={`p-1.5 rounded-xl flex items-center space-x-0.5 transition-all ${
              isInsideTable ? 'bg-indigo-500/30 text-indigo-200' : 'hover:bg-white/15 hover:text-white'
            }`}
            title="Table Tools"
          >
            <TableIcon className="w-3.5 h-3.5" />
            <ChevronDown className="w-2.5 h-2.5 opacity-60" />
          </button>
          {showTableMenu && (
            <div className="absolute top-full right-0 mt-2 w-48 bg-[#240916]/95 backdrop-blur-2xl border border-white/20 rounded-2xl shadow-2xl z-50 py-2 text-xs text-rose-100">
              <button
                onClick={insertTable}
                className="w-full text-left px-3.5 py-1.5 hover:bg-white/10 hover:text-white flex items-center space-x-2 transition-colors"
              >
                <Plus className="w-3.5 h-3.5 text-emerald-400" />
                <span>Insert 3x3 Table</span>
              </button>
              {isInsideTable && (
                <>
                  <div className="border-t border-white/10 my-1" />
                  <button
                    onClick={() => { editor.chain().focus().addRowAfter().run(); setShowTableMenu(false); }}
                    className="w-full text-left px-3.5 py-1.5 hover:bg-white/10 hover:text-white flex items-center space-x-2"
                  >
                    <Rows className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Add Row Below</span>
                  </button>
                  <button
                    onClick={() => { editor.chain().focus().addColumnAfter().run(); setShowTableMenu(false); }}
                    className="w-full text-left px-3.5 py-1.5 hover:bg-white/10 hover:text-white flex items-center space-x-2"
                  >
                    <ColumnsIcon className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Add Column Right</span>
                  </button>
                  <button
                    onClick={() => { editor.chain().focus().deleteRow().run(); setShowTableMenu(false); }}
                    className="w-full text-left px-3.5 py-1.5 hover:bg-white/10 hover:text-white flex items-center space-x-2 text-rose-300"
                  >
                    <Trash2 className="w-3.5 h-3.5 text-rose-400" />
                    <span>Delete Row</span>
                  </button>
                  <button
                    onClick={() => { editor.chain().focus().deleteColumn().run(); setShowTableMenu(false); }}
                    className="w-full text-left px-3.5 py-1.5 hover:bg-white/10 hover:text-white flex items-center space-x-2 text-rose-300"
                  >
                    <Trash2 className="w-3.5 h-3.5 text-rose-400" />
                    <span>Delete Column</span>
                  </button>
                  <button
                    onClick={() => { editor.chain().focus().deleteTable().run(); setShowTableMenu(false); }}
                    className="w-full text-left px-3.5 py-1.5 hover:bg-rose-500/20 text-rose-400 flex items-center space-x-2 font-semibold"
                  >
                    <Trash2 className="w-3.5 h-3.5 text-rose-400" />
                    <span>Delete Table</span>
                  </button>
                </>
              )}
            </div>
          )}
        </div>

        {/* Clear formatting */}
        <button
          onClick={() => editor.chain().focus().clearNodes().unsetAllMarks().run()}
          className="p-1.5 hover:bg-white/15 hover:text-white rounded-xl transition-colors"
          title="Clear formatting"
        >
          <RemoveFormatting className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
