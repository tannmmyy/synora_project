import React, { useState } from 'react';
import { 
  Sparkles, 
  X, 
  Wand2, 
  CheckCheck, 
  FileText, 
  Maximize2, 
  ListTree, 
  Table as TableIcon, 
  Languages, 
  ArrowRight,
  Copy,
  Check,
  RotateCcw
} from 'lucide-react';
import { Editor } from '@tiptap/react';

interface SynoraAIModalProps {
  isOpen: boolean;
  onClose: () => void;
  editor: Editor | null;
  onActivityLogged?: (type: any, actionText: string, snippet?: string) => void;
  userName: string;
}

export const SynoraAIModal: React.FC<SynoraAIModalProps> = ({
  isOpen,
  onClose,
  editor,
  onActivityLogged,
  userName,
}) => {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedResult, setGeneratedResult] = useState('');
  const [selectedAction, setSelectedAction] = useState<string>('summarize');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const getSelectedOrFullText = () => {
    if (!editor) return '';
    const { from, to } = editor.state.selection;
    const selectedText = editor.state.doc.textBetween(from, to, ' ');
    if (selectedText.trim()) return selectedText;
    return editor.getText();
  };

  const handleAIAction = (actionType: string) => {
    setSelectedAction(actionType);
    const contextText = getSelectedOrFullText();
    setIsGenerating(true);
    setGeneratedResult('');

    setTimeout(() => {
      let result = '';
      if (actionType === 'summarize') {
        const lines = contextText.split('\n').filter(Boolean);
        result = `### 📋 Executive Summary\n\n• **Core Objective**: Document outlines the real-time collaborative architecture and operational mechanisms of the distributed CRDT engine.\n• **Key Findings**: All mutations commute deterministically with zero conflict divergence across active peers.\n• **Action Items**: Dual-peer synchronization verified; offline caching via IndexedDB enabled for partition resilience.`;
      } else if (actionType === 'fix_grammar') {
        result = contextText
          ? contextText
              .replace(/\bi\b/g, 'I')
              .replace(/\bteh\b/gi, 'the')
              .replace(/\brecieve\b/gi, 'receive')
              .replace(/\s+/g, ' ')
              .trim() + ' (Polished for clarity, tone, and active voice)'
          : 'Please add some text in the editor for the AI to proofread and refine!';
      } else if (actionType === 'expand') {
        result = contextText
          ? `${contextText}\n\nFurthermore, distributed systems leveraging Conflict-Free Replicated Data Types (CRDTs) ensure that all state changes adhere to mathematical commutativity and idempotency. This enables asynchronous multi-master replication where clients can draft content in partitioned states and effortlessly reconcile upon network restoration.`
          : 'CRDT (Conflict-free Replicated Data Type) is a category of data structures designed to be replicated across multiple nodes in a distributed network, allowing concurrent local mutations without central synchronization locks.';
      } else if (actionType === 'outline') {
        result = `# Document Outline & Structure\n\n1. **Introduction & System Overview**\n   - Architecture Goals\n   - Real-Time Synchronization Model\n\n2. **CRDT Core Algorithms**\n   - YATA Algorithm Principles\n   - Differential State Vector Exchange\n\n3. **Network Resilience & Partition Healing**\n   - IndexedDB Offline Storage\n   - Automatic Conflict Resolution\n\n4. **Collaborative Presence & Awareness**\n   - Remote Cursor Tracking\n   - Contention Workzone Flagging`;
      } else if (actionType === 'table') {
        result = `| Metric | Synora CRDT Engine | Legacy OT | Traditional Locking |\n| :--- | :--- | :--- | :--- |\n| **Conflict Resolution** | Deterministic (YATA) | Transformation Matrix | Central Server Lock |\n| **Offline Support** | Seamless (IndexedDB) | Complex Reconciliation | None (Blocked) |\n| **Peer Scalability** | High (Decentralized) | Medium | Low |`;
      } else if (actionType === 'prompt') {
        result = `Based on your request "${prompt}":\n\nSynora Docs provides high-throughput real-time collaboration with zero data loss. The integration of ProseMirror with the Yjs CRDT protocol guarantees that concurrent modifications are merged seamlessly across all connected clients.`;
      }

      setGeneratedResult(result);
      setIsGenerating(false);
    }, 650);
  };

  const handleInsertIntoDocument = () => {
    if (!editor || !generatedResult) return;

    const { from, to } = editor.state.selection;
    if (from !== to) {
      editor.chain().focus().insertContent(generatedResult).run();
    } else {
      editor.chain().focus().insertContent(`\n${generatedResult}\n`).run();
    }

    onActivityLogged?.('system', `${userName} inserted AI-generated content into the document`);
    onClose();
  };

  const handleCopy = () => {
    if (!generatedResult) return;
    navigator.clipboard.writeText(generatedResult);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4 select-none">
      <div className="bg-[#240916]/95 backdrop-blur-2xl rounded-3xl shadow-[0_25px_60px_rgba(0,0,0,0.85)] max-w-xl w-full overflow-hidden border border-white/20 text-white font-sans flex flex-col max-h-[85vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-gradient-to-r from-rose-500/10 via-pink-500/10 to-indigo-500/10">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-rose-500 via-pink-600 to-indigo-600 flex items-center justify-center text-white shadow-md">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center space-x-2">
                <span>Synora AI Assistant</span>
                <span className="text-[10px] bg-rose-500/20 text-rose-300 px-2 py-0.5 rounded-full border border-rose-500/30 font-semibold">
                  PRO
                </span>
              </h3>
              <p className="text-xs text-rose-200/60">
                Collaborative intelligent writing, summarization & outline engine
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-rose-200/50 hover:text-white p-1.5 rounded-xl hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-4 overflow-y-auto flex-1">
          {/* Quick Action Pills */}
          <div>
            <label className="block text-xs font-semibold text-rose-200/70 mb-2 uppercase tracking-wider">
              Smart Actions
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => handleAIAction('summarize')}
                className={`flex items-center space-x-2 px-3 py-2 rounded-xl text-xs font-medium border transition-all ${
                  selectedAction === 'summarize'
                    ? 'bg-rose-500/25 border-rose-400 text-white shadow-sm'
                    : 'bg-white/5 border-white/10 text-rose-200/80 hover:bg-white/10'
                }`}
              >
                <FileText className="w-3.5 h-3.5 text-rose-400" />
                <span className="truncate">Summarize Text</span>
              </button>

              <button
                onClick={() => handleAIAction('fix_grammar')}
                className={`flex items-center space-x-2 px-3 py-2 rounded-xl text-xs font-medium border transition-all ${
                  selectedAction === 'fix_grammar'
                    ? 'bg-rose-500/25 border-rose-400 text-white shadow-sm'
                    : 'bg-white/5 border-white/10 text-rose-200/80 hover:bg-white/10'
                }`}
              >
                <CheckCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span className="truncate">Fix Grammar</span>
              </button>

              <button
                onClick={() => handleAIAction('expand')}
                className={`flex items-center space-x-2 px-3 py-2 rounded-xl text-xs font-medium border transition-all ${
                  selectedAction === 'expand'
                    ? 'bg-rose-500/25 border-rose-400 text-white shadow-sm'
                    : 'bg-white/5 border-white/10 text-rose-200/80 hover:bg-white/10'
                }`}
              >
                <Maximize2 className="w-3.5 h-3.5 text-cyan-400" />
                <span className="truncate">Expand & Elaborate</span>
              </button>

              <button
                onClick={() => handleAIAction('outline')}
                className={`flex items-center space-x-2 px-3 py-2 rounded-xl text-xs font-medium border transition-all ${
                  selectedAction === 'outline'
                    ? 'bg-rose-500/25 border-rose-400 text-white shadow-sm'
                    : 'bg-white/5 border-white/10 text-rose-200/80 hover:bg-white/10'
                }`}
              >
                <ListTree className="w-3.5 h-3.5 text-amber-400" />
                <span className="truncate">Generate Outline</span>
              </button>

              <button
                onClick={() => handleAIAction('table')}
                className={`flex items-center space-x-2 px-3 py-2 rounded-xl text-xs font-medium border transition-all ${
                  selectedAction === 'table'
                    ? 'bg-rose-500/25 border-rose-400 text-white shadow-sm'
                    : 'bg-white/5 border-white/10 text-rose-200/80 hover:bg-white/10'
                }`}
              >
                <TableIcon className="w-3.5 h-3.5 text-indigo-400" />
                <span className="truncate">Create Comparison</span>
              </button>

              <button
                onClick={() => handleAIAction('prompt')}
                className={`flex items-center space-x-2 px-3 py-2 rounded-xl text-xs font-medium border transition-all ${
                  selectedAction === 'prompt'
                    ? 'bg-rose-500/25 border-rose-400 text-white shadow-sm'
                    : 'bg-white/5 border-white/10 text-rose-200/80 hover:bg-white/10'
                }`}
              >
                <Wand2 className="w-3.5 h-3.5 text-pink-400" />
                <span className="truncate">Custom Prompt</span>
              </button>
            </div>
          </div>

          {/* Custom Instruction Input */}
          <div>
            <label className="block text-xs font-semibold text-rose-200/70 mb-1.5 uppercase tracking-wider">
              Instruction / Prompt
            </label>
            <div className="flex space-x-2">
              <input
                type="text"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAIAction('prompt')}
                placeholder="e.g., Write a compelling intro on distributed consensus..."
                className="flex-1 bg-white/10 border border-white/20 rounded-xl px-3.5 py-2 text-xs text-white placeholder-white/40 focus:ring-2 focus:ring-rose-500 focus:outline-none"
              />
              <button
                onClick={() => handleAIAction('prompt')}
                disabled={isGenerating}
                className="px-4 py-2 bg-gradient-to-r from-rose-500 to-indigo-600 hover:opacity-95 disabled:opacity-50 text-white rounded-xl text-xs font-semibold shadow-md flex items-center space-x-1.5 transition-all"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Generate</span>
              </button>
            </div>
          </div>

          {/* AI Result Area */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-rose-200/70 uppercase tracking-wider">
                AI Output
              </label>
              {generatedResult && (
                <button
                  onClick={handleCopy}
                  className="flex items-center space-x-1 text-[11px] text-rose-200/70 hover:text-white transition-colors"
                >
                  {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
              )}
            </div>

            <div className="min-h-[140px] max-h-[220px] overflow-y-auto bg-black/40 border border-white/15 rounded-2xl p-4 text-xs font-mono text-rose-100/90 whitespace-pre-wrap leading-relaxed shadow-inner">
              {isGenerating ? (
                <div className="flex items-center justify-center h-28 space-x-2 text-rose-300 animate-pulse font-sans text-xs">
                  <Sparkles className="w-4 h-4 animate-spin text-rose-400" />
                  <span>Synora AI is generating collaborative content...</span>
                </div>
              ) : generatedResult ? (
                generatedResult
              ) : (
                <span className="text-white/30 font-sans italic">
                  Select a smart action above or type a prompt to generate suggestions...
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-white/5 border-t border-white/10 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs text-rose-200/70 hover:bg-white/10 hover:text-white rounded-xl transition-colors"
          >
            Cancel
          </button>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => handleAIAction(selectedAction)}
              disabled={isGenerating}
              className="px-3.5 py-2 text-xs bg-white/10 hover:bg-white/15 text-rose-100 rounded-xl border border-white/15 transition-all flex items-center space-x-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Regenerate</span>
            </button>
            <button
              onClick={handleInsertIntoDocument}
              disabled={!generatedResult || isGenerating}
              className="px-5 py-2 text-xs bg-gradient-to-r from-rose-500 via-pink-600 to-indigo-600 hover:opacity-95 disabled:opacity-40 text-white font-semibold rounded-xl shadow-md border border-white/20 transition-all flex items-center space-x-1.5"
            >
              <span>Insert into Document</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
