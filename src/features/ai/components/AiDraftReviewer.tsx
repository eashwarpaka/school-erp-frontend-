import React, { useState } from 'react';
import { Sparkles, Check, X, FileEdit, AlertCircle, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

export interface AiDraftReviewerProps {
  draftContent: string;
  draftId?: string;
  sourceDataDetails?: string;
  onPublish: (finalContent: string) => void;
  onDiscard: () => void;
}

export const AiDraftReviewer: React.FC<AiDraftReviewerProps> = ({
  draftContent,
  draftId,
  sourceDataDetails,
  onPublish,
  onDiscard,
}) => {
  const [content, setContent] = useState(draftContent);
  const [isEditing, setIsEditing] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);

  const handlePublish = async () => {
    setIsPublishing(true);
    await onPublish(content);
    setIsPublishing(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl border border-indigo-100 shadow-sm overflow-hidden"
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-50 to-blue-50 px-4 py-3 border-b border-indigo-100 flex items-center justify-between">
        <div className="flex items-center gap-2 text-indigo-700 font-medium">
          <Sparkles className="w-4 h-4 text-indigo-500" />
          <span>AI Generated Draft</span>
        </div>
        {draftId && (
          <div className="flex items-center gap-1 text-xs text-slate-500">
            <Clock className="w-3 h-3" />
            <span>ID: {draftId.slice(-6)}</span>
          </div>
        )}
      </div>

      {/* Body */}
      <div className="p-4">
        {sourceDataDetails && (
          <div className="mb-4 text-xs text-slate-500 flex items-start gap-2 bg-slate-50 p-2 rounded-md">
            <AlertCircle className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
            <p>
              <span className="font-semibold text-slate-700">Source context:</span>{' '}
              {sourceDataDetails}
            </p>
          </div>
        )}

        {isEditing ? (
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full h-40 p-3 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all resize-none"
            placeholder="Edit the draft here..."
          />
        ) : (
          <div className="w-full min-h-[10rem] p-3 text-sm bg-slate-50 border border-slate-100 rounded-lg text-slate-700 whitespace-pre-wrap">
            {content}
          </div>
        )}
      </div>

      {/* Footer / Actions */}
      <div className="px-4 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
        >
          <FileEdit className="w-4 h-4" />
          {isEditing ? 'Preview' : 'Edit Draft'}
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={onDiscard}
            disabled={isPublishing}
            className="flex items-center gap-2 px-4 py-1.5 text-sm font-medium text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
          >
            <X className="w-4 h-4" />
            Discard
          </button>
          <button
            onClick={handlePublish}
            disabled={isPublishing || !content.trim()}
            className="flex items-center gap-2 px-4 py-1.5 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors shadow-sm disabled:opacity-50"
          >
            <Check className="w-4 h-4" />
            {isPublishing ? 'Publishing...' : 'Publish'}
          </button>
        </div>
      </div>
    </motion.div>
  );
};
