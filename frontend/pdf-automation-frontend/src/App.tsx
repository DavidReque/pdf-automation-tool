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
  const [summary, setSummary] = useState<string>('')

  const hf = new HfInference(API_KEY)

  const handleFileChange = (newFile: File) => {
    setFile(newFile);
  }

  const handleAnalyze = async () => {
    if (!file) {
      console.error('No file selected');
      return;
    }

    const formData = new FormData();
    formData.append('pdf', file);

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
      console.log('Analyzing text (first 100 chars):', text.substring(0, 100));
      if (!text.trim()) {
        throw new Error('Empty text');
      }
      
      // Dividir el texto en palabras
      const words = text.split(/\s+/);
      
      // Tomar las primeras 500 palabras (ajusta este número según sea necesario)
      const truncatedText = words.slice(0, 125).join(' ');
      
      console.log('Truncated text (first 100 chars):', truncatedText.substring(0, 100));
      
      const res = await hf.summarization({
        model: 'facebook/bart-large-cnn',
        inputs: text, 
        parameters: {
          max_length: 150, 
          min_length: 30
        }
      })
      
      setSummary(res.summary_text);
    } catch (error) {
      console.error('Error resumiendo el texto:', error);
      setSummary('Error en el resumen: ' + (error as Error).message);
    }
  }

  return (
    <div className='App'>
      <h1>PDF Automation Tool</h1>
      <FileUpload onFileChange={handleFileChange} />
      {file && <PdfViewer file={file} />}
      <button className='cursor-pointer bg-slate-400' onClick={handleAnalyze} disabled={!file}>Resumir</button>
      <div>
        <h3>Extracted Text:</h3>
        <pre>{extractedText}</pre>
      </div>
      <div>
        <h3>symmary:</h3>
        <pre>{summary}</pre>
      </div>
    </div>
  )
}
export default App