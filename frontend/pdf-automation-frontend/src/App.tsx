import React, { useState } from 'react'
import './App.css';
import FileUpload from './components/FileUpload';
import PdfViewer from './components/PdfViewer';
const App: React.FC = () => {
  const [file, setFile] = useState<File | null>(null)
  
  return (
    <div className='App'>
      <h1>PDF Automation Tool</h1>
      <FileUpload onFileChange={setFile} />
      {file && <PdfViewer file={file} />}
    </div>
  )
}
export default App
