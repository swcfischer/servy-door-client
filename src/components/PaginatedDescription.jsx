import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

/**
 * PaginatedDescription
 * - Renders HTML content in a fixed-height viewport (default 570px)
 * - Provides Prev/Next controls to paginate vertically by viewport height
 * - Hides native scrollbars and manages page via component state
 */
function PaginatedDescription({ html = "", height = 570, className = "" }) {
  const containerRef = useRef(null);
  const contentRef = useRef(null);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const sanitizedHtml = useMemo(
    () => html || "<em>No description available.</em>",
    [html]
  );

  const recomputePages = useCallback(() => {
    const content = contentRef.current;
    if (!content) return;
    // Measure the full content height and derive page count
    const fullHeight = content.scrollHeight || content.offsetHeight || 0;
    const viewport = Math.max(1, height);
    const pages = Math.max(1, Math.ceil(fullHeight / viewport));
    setTotalPages(pages);
    // Clamp current page if content shrank
    setPage((p) => Math.min(p, pages - 1));
  }, [height]);

  useEffect(() => {
    recomputePages();
  }, [sanitizedHtml, height, recomputePages]);

  useEffect(() => {
    // Recompute on resize to keep pagination accurate
    const onResize = () => recomputePages();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [recomputePages]);

  // Observe content resize (e.g., images loading) to keep pagination accurate
  useEffect(() => {
    if (!contentRef.current || typeof ResizeObserver === "undefined") return;
    const obs = new ResizeObserver(() => recomputePages());
    obs.observe(contentRef.current);
    return () => obs.disconnect();
  }, [recomputePages]);

  const handlePrev = () => setPage((p) => Math.max(0, p - 1));
  const handleNext = () => setPage((p) => Math.min(totalPages - 1, p + 1));

  return (
    <div className={className}>
      {/* Local style for controls and viewport behavior */}
      <style>
        {`
					.paginated-description__controls button {
						height: max-content;
						padding: 8px 12px;
						font-size: 16px;
						border-radius: 3px;
						border: 1px solid #5e5e5e;
						background-color: #222;
						color: #d4c066;
						cursor: pointer;
						transition: all 0.3s ease;
						font-family: inherit;
					}
					.paginated-description__controls button:hover {
						background-color: #333;
						border-color: #7e7e7e;
					}
					.paginated-description__controls button:focus {
						outline: 2px solid #d4c066;
						outline-offset: 2px;
					}
					.paginated-description__controls button:disabled {
						opacity: 0.5;
						cursor: not-allowed;
					}
				`}
      </style>
      <div
        ref={containerRef}
        className="paginated-description__viewport"
        style={{
          height: `${height}px`,
          overflow: "hidden",
          position: "relative",
        }}
      >
        <div
          ref={contentRef}
          style={{
            lineHeight: 1.5,
            willChange: "transform",
            transform: `translateY(-${page * height}px)`,
            transition: "transform 200ms ease",
          }}
          dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
        />
      </div>
      {totalPages > 1 && (
        <div
          className="paginated-description__controls"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            marginTop: 8,
          }}
        >
          <button
            onClick={handlePrev}
            disabled={page === 0}
            aria-label="Previous page"
          >
            Prev
          </button>
          <span style={{ opacity: 0.8 }}>
            Page {page + 1} / {totalPages}
          </span>
          <button
            onClick={handleNext}
            disabled={page >= totalPages - 1}
            aria-label="Next page"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

export default PaginatedDescription;
