import React from 'react';

const DownloadSvg: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    viewBox="0 0 24 24"
    width="24"
    height="24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path d="M12 16l6-6h-4V4H10v6H6l6 6zm-7 2h14v2H5v-2z" />
  </svg>
);

interface DownloadButtonProps {
  onClick: () => void;
  className?: string;
}

const DownloadButton: React.FC<DownloadButtonProps> = ({ onClick, className = '' }) => {
  return (
    <button
      className={`download-btn ${className}`}
      onClick={onClick}
      aria-label="Download CSV"
      title="Download CSV"
    >
      <DownloadSvg />
    </button>
  );
};

export default DownloadButton;
