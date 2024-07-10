import React from 'react';
import { PdfViewerProps } from '../types/types';

const PdfViewer: React.FC<PdfViewerProps> = ({ file }) => {
  const fileUrl = URL.createObjectURL(file);

  return (
    <div style={{ height: '750px', width: '100%' }}>
      <embed 
        src={fileUrl} 
        type="application/pdf"
        width="100%"
        height="100%"
      />
    </div>
  );
};

export default PdfViewer;