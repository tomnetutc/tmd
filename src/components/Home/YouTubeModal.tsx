import React, { useEffect } from "react";

interface YouTubeModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoId: "oxMHGDbzhpE";
}

const YouTubeModal: React.FC<YouTubeModalProps> = ({
  isOpen,
  onClose,
  videoId,
}) => {
  const videoSrc = `https://www.youtube.com/embed/${videoId}?autoplay=1&cc_load_policy=1&enablejsapi=1`;

  // Close modal if clicked outside the modal content
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      const modalContent = document.querySelector(".modal-content");
      if (modalContent && !modalContent.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleOutsideClick);
    }

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <iframe
          src={videoSrc}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          title="YouTube video player"
        ></iframe>
      </div>
      <span className="close" onClick={onClose}>
        &times;
      </span>
    </div>
  );
};

export default YouTubeModal;
