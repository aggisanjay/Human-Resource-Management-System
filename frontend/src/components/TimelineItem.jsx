import React from 'react';
import { Clock, User, PlusSquare, Edit, Trash, Link as LinkIcon } from 'lucide-react';

function metaPreview(meta) {
  try {
    if (!meta) return '';
    if (typeof meta === 'string') return meta.slice(0, 120);
    return JSON.stringify(meta).slice(0, 160);
  } catch {
    return '';
  }
}

function actionToIcon(action) {
  if (!action) return <Clock size={18} />;
  if (action.includes('created')) return <PlusSquare size={18} />;
  if (action.includes('updated')) return <Edit size={18} />;
  if (action.includes('deleted')) return <Trash size={18} />;
  if (action.includes('assigned') || action.includes('assign')) return <LinkIcon size={18} />;
  if (action === 'login' || action === 'logout') return <User size={18} />;
  return <Clock size={18} />;
}

function actionToColor(action) {
  if (!action) return 'bg-gray-100';
  if (action.includes('created')) return 'bg-green-100 text-green-700';
  if (action.includes('updated')) return 'bg-yellow-100 text-yellow-700';
  if (action.includes('deleted')) return 'bg-red-100 text-red-700';
  if (action.includes('assign')) return 'bg-blue-100 text-blue-700';
  if (action === 'login' || action === 'logout') return 'bg-indigo-100 text-indigo-700';
  return 'bg-gray-100';
}

export default function TimelineItem({ log }) {
  const ts = new Date(log.timestamp);
  const iso = ts.toLocaleString();

  return (
    <div className="flex items-start gap-4">
      <div className="flex flex-col items-center">
        <div className={`p-2 rounded-full ${actionToColor(log.action).split(' ')[0]}`}>
          {actionToIcon(log.action)}
        </div>
        <div className="h-full w-px bg-gray-200" style={{ minHeight: 10 }} />
      </div>

      <div className="flex-1">
        <div className="flex items-center justify-between">
          <div className="font-medium">{log.action}</div>
          <div className="text-sm text-gray-400">{iso}</div>
        </div>

        <div className="text-sm text-gray-600 mt-1">
          <span className="text-xs text-gray-500 mr-2">user:{log.user_id}</span>
          <span className="text-xs text-gray-500">org:{log.organisation_id}</span>
        </div>

        <div className="text-sm text-gray-700 mt-2">
          {metaPreview(log.meta)}
        </div>
      </div>
    </div>
  );
}
