import React from 'react';
import { ListTree, X, ChevronRight, Hash, Bookmark } from 'lucide-react';
import { Editor } from '@tiptap/react';

interface TableOfContentsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  editor: Editor | null;
}

export const TableOfContentsDrawer: React.FC<TableOfContentsDrawerProps> = ({
  isOpen,
  onClose,
  editor,
}) => {
  if (!isOpen) return null;

  const getHeadings = () => {
    if (!editor) return [];
    const headings: { text: string; level: number; pos: number }[] = [];
    
    editor.state.doc.descendants((node, pos) => {
      if (node.type.name === 'heading') {
        const text = node.textContent.trim();
        if (text) {
          headings.push({
            text,
            level: node.attrs.level,
            pos,
          });
        }
      }
    });

    return headings;
  };

  const headings = getHeadings();

  const handleScrollToHeading = (pos: number) => {
    if (!editor) return;
    editor.chain().focus().setTextSelection(pos + 1).run();
    const dom = editor.view.domAtPos(pos + 1).node as HTMLElement;
    if (dom && dom.scrollIntoView) {
      dom.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  return (
    <aside className="w-80 h-full bg-[#1e0714]/90 backdrop-blur-2xl border-l border-white/15 flex flex-col z-30 select-none shadow-2xl transition-all duration-300">
      {/* Header */}
      <div className="p-4 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-7 h-7 rounded-xl bg-amber-500/20 text-amber-300 flex items-center justify-center border border-amber-400/30">
            <ListTree className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-white">Document Outline</h3>
            <p className="text-[10px] text-rose-200/60">{headings.length} headings found</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="text-rose-200/50 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Headings List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-1.5">
        {headings.length === 0 ? (
          <div className="text-center py-12 px-4 text-rose-200/40 text-xs">
            <Bookmark className="w-8 h-8 mx-auto mb-2 text-rose-300/30" />
            <p className="font-semibold text-rose-200/70">No headings yet</p>
            <p className="text-[11px] mt-1">
              Add Heading 1, 2, or 3 formatting to your document to generate an interactive table of contents.
            </p>
          </div>
        ) : (
          headings.map((heading, index) => (
            <button
              key={index}
              onClick={() => handleScrollToHeading(heading.pos)}
              style={{ paddingLeft: `${(heading.level - 1) * 14 + 10}px` }}
              className="w-full text-left py-2 pr-2.5 rounded-xl text-xs hover:bg-white/10 hover:text-white transition-all flex items-center justify-between group border border-transparent hover:border-white/10"
            >
              <div className="flex items-center space-x-2 min-w-0">
                <Hash
                  className={`w-3.5 h-3.5 flex-shrink-0 ${
                    heading.level === 1
                      ? 'text-rose-400'
                      : heading.level === 2
                      ? 'text-pink-400'
                      : 'text-indigo-400'
                  }`}
                />
                <span
                  className={`truncate ${
                    heading.level === 1
                      ? 'font-bold text-white'
                      : heading.level === 2
                      ? 'font-medium text-rose-100'
                      : 'text-rose-200/80 text-[11px]'
                  }`}
                >
                  {heading.text}
                </span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-white/20 group-hover:text-white/70 group-hover:translate-x-0.5 transition-all flex-shrink-0" />
            </button>
          ))
        )}
      </div>

      {/* Footer Info */}
      <div className="p-3 bg-white/5 border-t border-white/10 text-[10px] text-rose-200/50 flex items-center justify-between">
        <span>Click heading to jump to section</span>
        <span className="font-mono">TOC • Live</span>
      </div>
    </aside>
  );
};
