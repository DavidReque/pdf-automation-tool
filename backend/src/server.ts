import express, { Request, Response } from "express";
import multer from "multer"; // Middleware para manejar datos multipart/form-data (usado para subir archivos)
import cors from 'cors'; // Middleware para habilitar CORS (Cross-Origin Resource Sharing)
import fs from 'fs'; // Módulo para interactuar con el sistema de archivos
import { PDFExtract } from "pdf.js-extract"; // Librería para extraer texto de archivos PDF
import path from "path";

const app = express();
const port = 3001; 

app.use(cors()); // Habilitar CORS para las rutas
app.use(express.json());

const upload = multer({ dest: 'uploads/' }); // Los archivos se guardaran temporalmente en la carpeta /uploads
const pdfExtract = new PDFExtract();

// Definir el post para la subida de archivo PDF
app.post('/upload', upload.single('pdf'), async (req: Request, res: Response) => {
    console.log('Received upload request');
    // Verificar si se ha subido el archivo
    if (!req.file) {
        console.log('no file upload');
        return res.status(400).send('No file uploaded');
    }

    const pdfPath = path.join(__dirname, req.file.path);

    try {
        console.log('processing pdf');
        // leer el archivo pdf subido
        const data = await pdfExtract.extract(req.file.path);

        // extraer el texto del PDF usando pdf-parse
        const extractedText = data.pages.map((page: any) => page.content.map((item: any) => item.str).join(' ')).join('\n');

        // Crear un objeto con la información extraída
        // extraccion de informacion especifica
        const extractedInfo = {
            text: extractedText,
        };

        // eliminar archivo temporal
        fs.unlinkSync(req.file.path);

        console.log('sending response');
        res.json(extractedInfo);
    } catch (error) {
        console.error('Error processing PDF:', error);
        res.status(500).send('Error processing PDF');
    }
});

app.get('/', async (req: Request, res: Response) => {
    res.json('Hola');
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
