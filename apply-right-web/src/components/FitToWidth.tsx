import { useRef, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

interface FitToWidthProps {
  children: ReactNode;
  className?: string;
  naturalWidth?: number;
}

export default function FitToWidth({ children, className, naturalWidth = 794 }: FitToWidthProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [scaledHeight, setScaledHeight] = useState<number | undefined>(undefined);

  useEffect(() => {
    const container = containerRef.current;
    const content = contentRef.current;
    if (!container || !content) return;

    const update = () => {
      const containerWidth = container.clientWidth;
      const s = containerWidth / naturalWidth;
      setScale(s);
      setScaledHeight(content.scrollHeight * s);
    };

    update();
    const observer = new ResizeObserver(update);
    observer.observe(container);
    observer.observe(content);
    return () => observer.disconnect();
  }, [naturalWidth]);

  return (
    <div ref={containerRef} className={className} style={{ height: scaledHeight }}>
      <div
        ref={contentRef}
        style={{
          width: naturalWidth,
          transformOrigin: 'top left',
          transform: `scale(${scale})`,
        }}
      >
        {children}
      </div>
    </div>
  );
}
