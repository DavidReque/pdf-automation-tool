import React, { useState } from 'react'
import './App.css';
import FileUpload from './components/FileUpload';
import PdfViewer from './components/PdfViewer';
import axios from 'axios';
import { HfInference } from '@huggingface/inference';

const API_KEY = process.env.REACT_APP_HF_API_KEY;

const App: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [extractedText, setExtractedText] = useState<string>('');
  const [analysis, setAnalysis] = useState<string>('')

  const hf = new HfInference(API_KEY)

  const handleFileChange = async (newFile: File) => {
      setFile(newFile);

      const formData = new FormData();
      formData.append('pdf', newFile);

      try {
        // Subir archivo al backend
        const response = await axios.post('http://localhost:3001/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        setExtractedText(response.data.text);

        // analizar el texto con huggin face
        await analyzeText(response.data.text)
      } catch (error) {
        console.error('Error processing file:', error);
      }
  }

  const analyzeText = async (text: string) => {
      try {
        const res = await hf.textClassification({
          model: 'distilbert-base-uncased-finetuned-sst-2-english',
          inputs: text
        });
        setAnalysis(JSON.stringify(res, null, 2));
      } catch (error) {
        console.error('Error analyzing text:', error);
        setAnalysis('Error en el análisis');
      }
  }

  return (
    <div className='App'>
      <h1>PDF Automation Tool</h1>
      <FileUpload onFileChange={handleFileChange} />
      {file && <PdfViewer file={file} />}
      <div>
      <h3>Extracted Text:</h3>
        <pre>{extractedText}</pre>
      </div>
      <div>
        <h3>Analysis:</h3>
        <pre>{analysis}</pre>
      </div>
    </div>
  )
}
export default App
