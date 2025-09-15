import React, { useState, useRef, useEffect, useCallback } from 'react';

const PDFViewer = ({ pdfUrl, title = "Document", onScrollToBottom }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hasScrolledToBottom, setHasScrolledToBottom] = useState(false);
  const [showCheckbox, setShowCheckbox] = useState(false);
  const iframeRef = useRef(null);

  useEffect(() => {
    setIsLoading(true);
    setError(null);
  }, [pdfUrl]);

  const handleLoad = () => {
    setIsLoading(false);
  };

  const handleError = () => {
    setIsLoading(false);
    setError('Failed to load PDF document');
  };

  // Function to check if user has scrolled to bottom
  const checkScrollToBottom = useCallback(() => {
    if (iframeRef.current && iframeRef.current.contentWindow) {
      try {
        const iframe = iframeRef.current;
        const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
        
        if (iframeDoc) {
          const scrollTop = iframeDoc.documentElement.scrollTop || iframeDoc.body.scrollTop;
          const scrollHeight = iframeDoc.documentElement.scrollHeight || iframeDoc.body.scrollHeight;
          const clientHeight = iframeDoc.documentElement.clientHeight || iframeDoc.body.clientHeight;
          
          // Check if scrolled to bottom (with 100px tolerance)
          const isAtBottom = scrollTop + clientHeight >= scrollHeight - 100;
          
          if (isAtBottom && !showCheckbox) {
            setShowCheckbox(true);
          } else if (!isAtBottom && showCheckbox) {
            setShowCheckbox(false);
          }
        }
      } catch {
        // Cross-origin restrictions might prevent access
        // Fallback: show checkbox after 3 seconds
        if (!showCheckbox) {
          setTimeout(() => setShowCheckbox(true), 3000);
        }
      }
    }
  }, [showCheckbox]);

  // Add scroll event listener when iframe loads
  useEffect(() => {
    const iframe = iframeRef.current;
    if (iframe) {
      const handleIframeLoad = () => {
        try {
          const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
          if (iframeDoc) {
            iframeDoc.addEventListener('scroll', checkScrollToBottom);
            iframeDoc.addEventListener('wheel', checkScrollToBottom);
            iframeDoc.addEventListener('mousemove', checkScrollToBottom);
          }
        } catch {
          // Cross-origin restrictions - show checkbox after delay
          setTimeout(() => setShowCheckbox(true), 3000);
        }
      };

      iframe.addEventListener('load', handleIframeLoad);
      
      return () => {
        iframe.removeEventListener('load', handleIframeLoad);
        try {
          const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
          if (iframeDoc) {
            iframeDoc.removeEventListener('scroll', checkScrollToBottom);
            iframeDoc.removeEventListener('wheel', checkScrollToBottom);
            iframeDoc.removeEventListener('mousemove', checkScrollToBottom);
          }
        } catch {
          // Cross-origin restrictions
        }
      };
    }
  }, [showCheckbox, checkScrollToBottom]);

  return (
    <div className="h-full w-full bg-white dark:bg-gray-900 relative flex flex-col">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white dark:bg-gray-900 z-10">
          <div className="flex flex-col items-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            <p className="text-gray-600 dark:text-gray-400">Loading document...</p>
          </div>
        </div>
      )}

      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-white dark:bg-gray-900 z-10">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 text-red-500">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      )}

      <div className="flex-1 overflow-x-auto">
        <iframe
          ref={iframeRef}
          src={`${pdfUrl}#toolbar=0&navpanes=0&scrollbar=1&statusbar=0&messages=0&scrollbar=1`}
          title={title}
          width="100%"
          height="100%"
          onLoad={handleLoad}
          onError={handleError}
          className="border-0 w-full h-full"
          style={{ 
            minHeight: '100%',
            border: 'none',
            outline: 'none'
          }}
        />
        {showCheckbox && (
        <div className="bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-4 animate-in slide-in-from-bottom-2 duration-300">
          <div className="flex items-center justify-center ">
            <input
              type="checkbox"
              id="pdfTermsAgree"
              checked={hasScrolledToBottom}
              onChange={(e) => {
                setHasScrolledToBottom(e.target.checked);
                if (e.target.checked && onScrollToBottom) {
                  onScrollToBottom();
                }
              }}
              className="mr-3 h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
            />
            <label
              htmlFor="pdfTermsAgree"
              className="text-sm text-gray-700 dark:text-gray-300 cursor-pointer"
            >
              I have read and agreed to the Terms and Conditions
            </label>
          </div>
        </div>
      )}
      </div>

      {/* Terms and Conditions Agreement Checkbox - Only show when scrolled to bottom */}
      
    </div>
  );
};

export default PDFViewer;
