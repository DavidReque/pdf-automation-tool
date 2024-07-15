import React, { useState } from 'react'
import './App.css';
import FileUpload from './components/FileUpload';
import PdfViewer from './components/PdfViewer';
import axios from 'axios';
import { HfInference } from '@huggingface/inference';
import { Button } from './components/ui/button';
import { ReloadIcon } from '@radix-ui/react-icons';

const API_KEY = process.env.REACT_APP_HF_API_KEY;

const App: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [extractedText, setExtractedText] = useState<string>('');
  const [summary, setSummary] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const hf = new HfInference(API_KEY)

  const handleFileChange = (newFile: File) => {
    setFile(newFile);
    setExtractedText('');
    setSummary('')
  }

  const handleAnalyze = async () => {
    if (!file) {
      console.error('No file selected');
      return;
    }

    const formData = new FormData();
    formData.append('pdf', file);

    setLoading(true);

    try {
      // Subir archivo al backend
      const response = await axios.post('http://localhost:3001/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setExtractedText(response.data.text);

      // analizar el texto con huggin face
      await analyzeText(response.data.text);
    } catch (error) {
      console.error('Error processing file:', error);
    } finally {
      setLoading(false);
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
    <div className='mx-4 my-10 lg:max-w-4xl lg:mx-auto'>
      <div className=''>
      <h1 className='text-3xl text-center mb-9'>PDF Automation Tool</h1>
      <FileUpload onFileChange={handleFileChange} />
      {file && <PdfViewer file={file} />}
      <div className=''>
      <Button className='my-4' onClick={handleAnalyze} disabled={!file || loading}>{loading ? 'Analyzing' : 'Analyze'}</Button>
      </div>
          {
            loading ? (
              <div className='text-center'>
                  <ReloadIcon className="mr-2 h-4 w-10 animate-spin" />
              </div>
            ) : (
            <div>
              <div className='my-4'>
              {extractedText && (
            <div>
              <h3 className='text-lg font-bold mb-2'>Extracted Text:</h3>
              <pre className='extracted-text bg-gray-100 p-4 border border-gray-300 rounded-md shadow-md whitespace-pre-wrap text-sm text-gray-700'>{extractedText}</pre>
            </div>
        )}
            </div>
              <div className=''>
              {summary && (
            <div>
              <h3 className='text-lg font-bold mb-2'>Summary:</h3>
              <pre className='extracted-text bg-gray-100 p-4 border border-gray-300 rounded-md shadow-md whitespace-pre-wrap text-sm text-gray-700'>{summary}</pre>
            </div>
        )}
      </div>
              </div>
            )
          }
      </div>
    </div>
  )
}
export default App