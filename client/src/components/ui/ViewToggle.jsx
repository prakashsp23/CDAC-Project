import React from 'react';

const ViewToggle = ({ view, onViewChange }) => {
  const handleViewChange = (newView) => {
    onViewChange(newView);
  };

  return (
    <div className="inline-flex rounded-lg bg-muted border border-transparent shadow-inner">
      <button
        aria-label="Grid view"
        onClick={() => handleViewChange('grid')}
        className={`px-3 py-1 text-lg rounded-l-lg transition-colors ${
          view === 'grid' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-accent'
        }`}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h7v7H3V3zM14 3h7v7h-7V3zM3 14h7v7H3v-7zM14 14h7v7h-7v-7z" />
        </svg>
      </button>
      <button
        aria-label="Table view"
        onClick={() => handleViewChange('table')}
        className={`px-3 py-1 text-lg font-large rounded-r-lg transition-colors ${
          view === 'table' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-accent'
        }`}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
    </div>
  );
};

export default ViewToggle;