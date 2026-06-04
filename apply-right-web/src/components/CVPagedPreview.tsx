import type { ReactNode } from 'react';

interface CVPagedPreviewProps {
  children: ReactNode;
}

export default function CVPagedPreview({ children }: CVPagedPreviewProps) {
  return (
    <div style={{ width: 794, background: '#fff', minHeight: 1123 }}>
      {children}
    </div>
  );
}
