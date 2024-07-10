import express from "express";
import multer from "multer"; // Middleware para manejar datos multipart/form-data (usado para subir archivos)
import cors from 'cors'; // Middleware para habilitar CORS (Cross-Origin Resource Sharing)
import path from 'path'; // Módulo para manejar rutas de archivos
import fs from 'fs'; // Módulo para interactuar con el sistema de archivos
import pdfParse from 'pdf-parse'; // Librería para extraer texto de archivos PDF

const app = express();
const port = 3001; 

app.use(express.json());

app.get('/', async (req, res) => {
    res.json('Hola')
})

app.listen(port, () => {
    console.log('port listen')
})