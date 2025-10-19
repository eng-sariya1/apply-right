import { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import CVDisplay from './CVDisplay';
import type { CVData } from '../types/cv.types';
import '../styles/cv-paginated.css';

interface CVPaginatedPreviewProps {
  data: CVData;
}

export default function CVPaginatedPreview({ data }: CVPaginatedPreviewProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const contentRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);

  // Calculate total pages based on content height
  useEffect(() => {
    const calculatePages = () => {
      if (contentRef.current && viewportRef.current) {
        const contentHeight = contentRef.current.scrollHeight;
        const viewportHeight = viewportRef.current.clientHeight;
        const calculatedPages = Math.max(1, Math.ceil(contentHeight / viewportHeight));
        setTotalPages(calculatedPages);

        // Reset to page 1 if current page exceeds new total
        if (currentPage > calculatedPages) {
          setCurrentPage(1);
        }
      }
    };

    // Calculate immediately
    calculatePages();

    // Recalculate after delays to ensure content is rendered
    const timer1 = setTimeout(calculatePages, 100);
    const timer2 = setTimeout(calculatePages, 500);

    // Set up ResizeObserver to recalculate on content changes
    const observer = new ResizeObserver(calculatePages);
    if (contentRef.current) {
      observer.observe(contentRef.current);
    }

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      observer.disconnect();
    };
  }, [data, currentPage]);

  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(1, prev - 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(totalPages, prev + 1));
  };

  // Calculate scroll offset for current page
  const getPageOffset = () => {
    if (!viewportRef.current) return 0;
    const viewportHeight = viewportRef.current.clientHeight;
    return -(currentPage - 1) * viewportHeight;
  };

  return (
    <div className="cv-paginated-container">
      {/* A4 Page Card with automatic page flow */}
      <div className="cv-page-card-wrapper">
        <div className="cv-page-card-viewport" ref={viewportRef}>
          <div
            className="cv-page-card-content"
            ref={contentRef}
            style={{
              transform: `translateY(${getPageOffset()}px)`,
              transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
            }}
          >
            <CVDisplay data={data} />
          </div>
        </div>

        {/* Pagination Controls - Fixed at bottom of card */}
        {totalPages > 1 && (
          <div className="cv-pagination-controls-fixed">
            <button
              onClick={handlePreviousPage}
              disabled={currentPage === 1}
              className="cv-pagination-button"
              aria-label="Previous page"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <span className="cv-pagination-indicator">
              Page {currentPage} of {totalPages}
            </span>

            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className="cv-pagination-button"
              aria-label="Next page"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Page indicator overlay */}
        <div className="cv-current-page-indicator">
          Page {currentPage}
        </div>
      </div>
    </div>
  );
}
