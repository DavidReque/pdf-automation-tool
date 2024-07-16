"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer")); // Middleware para manejar datos multipart/form-data (usado para subir archivos)
const cors_1 = __importDefault(require("cors")); // Middleware para habilitar CORS (Cross-Origin Resource Sharing)
const fs_1 = __importDefault(require("fs")); // Módulo para interactuar con el sistema de archivos
const pdf_js_extract_1 = require("pdf.js-extract"); // Librería para extraer texto de archivos PDF
const path_1 = __importDefault(require("path"));
const app = (0, express_1.default)();
const port = 3001;
app.use((0, cors_1.default)()); // Habilitar CORS para las rutas
app.use(express_1.default.json());
const upload = (0, multer_1.default)({ dest: 'uploads/' }); // Los archivos se guardaran temporalmente en la carpeta /uploads
const pdfExtract = new pdf_js_extract_1.PDFExtract();
// Definir el post para la subida de archivo PDF
app.post('/upload', upload.single('pdf'), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('Received upload request');
    // Verificar si se ha subido el archivo
    if (!req.file) {
        console.log('no file upload');
        return res.status(400).send('No file uploaded');
    }
    const pdfPath = path_1.default.join(__dirname, req.file.path);
    try {
        console.log('processing pdf');
        // leer el archivo pdf subido
        const data = yield pdfExtract.extract(req.file.path);
        // extraer el texto del PDF usando pdf-parse
        const extractedText = data.pages.map((page) => page.content.map((item) => item.str).join(' ')).join('\n');
        // Crear un objeto con la información extraída
        // extraccion de informacion especifica
        const extractedInfo = {
            text: extractedText,
        };
        // eliminar archivo temporal
        fs_1.default.unlinkSync(req.file.path);
        console.log('sending response');
        res.json(extractedInfo);
    }
    catch (error) {
        console.error('Error processing PDF:', error);
        res.status(500).send('Error processing PDF');
    }
}));
app.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.json('Hola');
}));
app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
