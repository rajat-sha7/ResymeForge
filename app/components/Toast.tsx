'use client';

import React, { useEffect, useState } from 'react';
import { useResumeStore } from '../store/resumeStore';

const Toast: React.FC = () => {
  const notification = useResumeStore((s) => s.notification);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (notification) {
      // trigger enter animation
      setVisible(true);
      // hide after CSS transition, the store will clear the notification independently
      const t = setTimeout(() => setVisible(false), 1400);
      return () => clearTimeout(t);
    }
    setVisible(false);
  }, [notification]);

  if (!notification) return null;

  const bg = notification.type === 'error' ? 'bg-red-600' : notification.type === 'success' ? 'bg-green-600' : 'bg-gray-800';

  return (
    <div className="fixed right-6 bottom-6 z-50 pointer-events-none">
      <div
        className={`pointer-events-auto max-w-xs ${bg} text-white px-4 py-2 rounded-lg shadow-lg transform transition-all duration-300 ${
          visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'
        }`}
      >
        <div className="flex items-center gap-3">
          <div className="text-sm font-medium">{notification.message}</div>
        </div>
      </div>
    </div>
  );
};

export default Toast;
