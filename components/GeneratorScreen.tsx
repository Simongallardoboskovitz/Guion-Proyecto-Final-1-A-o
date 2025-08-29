import React, { useState, useCallback, useEffect } from 'react';
import { GeneratedScript } from '../types';
import { generateScript } from '../services/geminiService';
import ScriptDisplay from './ScriptDisplay';
import LoadingSpinner from './LoadingSpinner';
// @ts-ignore
import { jsPDF } from 'jspdf';

interface GeneratorScreenProps {
  onBack: () => void;
}

interface FilePreview {
  name: string;
  type: string;
  data: string; // base64
  previewUrl: string; // object URL for preview
}

// Icons
const ChevronLeftIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
    </svg>
);
const DownloadIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
    </svg>
);
const GenerateIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
    </svg>
);
const FileIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
);
const TrashIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
);

const GeneratorScreen: React.FC<GeneratorScreenProps> = ({ onBack }) => {
    const [topic, setTopic] = useState('');
    const [files, setFiles] = useState<FilePreview[]>([]);
    const [script, setScript] = useState<GeneratedScript | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            const fileList = Array.from(event.target.files);
            const newFiles: FilePreview[] = [];

            fileList.forEach(file => {
                const reader = new FileReader();
                reader.onloadend = () => {
                    const base64String = (reader.result as string).split(',')[1];
                    newFiles.push({
                        name: file.name,
                        type: file.type,
                        data: base64String,
                        previewUrl: URL.createObjectURL(file),
                    });
                    if (newFiles.length === fileList.length) {
                        setFiles(prevFiles => [...prevFiles, ...newFiles]);
                    }
                };
                reader.readAsDataURL(file);
            });
        }
    };
    
    useEffect(() => {
      // Cleanup object URLs to prevent memory leaks
      return () => {
        files.forEach(file => URL.revokeObjectURL(file.previewUrl));
      };
    }, [files]);

    const handleRemoveFile = (fileName: string) => {
        setFiles(files.filter(file => file.name !== fileName));
    };

    const handleGenerate = useCallback(async () => {
        if (!topic && files.length === 0) {
            setError('Por favor, ingresa un tema o sube un archivo de referencia.');
            return;
        }
        setIsLoading(true);
        setError(null);
        setScript(null);

        try {
            const fileData = files.map(({ type, data }) => ({ mimeType: type, data }));
            const result = await generateScript(topic, fileData);
            setScript(result);
        } catch (e) {
            setError('Ocurrió un error al generar el guión. Por favor, intenta de nuevo.');
            console.error(e);
        } finally {
            setIsLoading(false);
        }
    }, [topic, files]);
    
    const handleDownloadPdf = useCallback(() => {
        if (!script) return;
        setIsLoading(true);

        try {
            const doc = new jsPDF({
                orientation: 'p',
                unit: 'mm',
                format: 'a4'
            });

            const pageHeight = doc.internal.pageSize.getHeight();
            const pageWidth = doc.internal.pageSize.getWidth();
            const margin = 15;
            const maxWidth = pageWidth - margin * 2;
            let y = margin;

            const checkPageBreak = (heightNeeded: number) => {
                if (y + heightNeeded > pageHeight - margin) {
                    doc.addPage();
                    y = margin;
                }
            };

            const addText = (text: string, size: number, style: 'normal' | 'bold' | 'italic' | 'bolditalic', spaceAfter: number) => {
                doc.setFont('helvetica', style);
                doc.setFontSize(size);
                
                const splitText = doc.splitTextToSize(text, maxWidth);
                const textHeight = doc.getTextDimensions(splitText).h;
                
                checkPageBreak(textHeight);
                
                doc.text(splitText, margin, y);
                y += textHeight + spaceAfter;
            };
            
            const addList = (items: string[], spaceAfter: number) => {
                doc.setFont('helvetica', 'normal');
                doc.setFontSize(11);
                items.forEach(item => {
                    const listItem = `• ${item}`;
                    const splitText = doc.splitTextToSize(listItem, maxWidth);
                    const textHeight = doc.getTextDimensions(splitText).h;
                    checkPageBreak(textHeight);
                    doc.text(splitText, margin, y);
                    y += textHeight + 2;
                });
                y += spaceAfter - 2; // Adjust for last item's spacing
            };

            // --- PDF CONTENT ---
            addText(script.titulo, 24, 'bold', 5);
            addText(`Duración Estimada: ${script.duracion_estimada}`, 10, 'italic', 2);
            addText(`Objetivo: ${script.objetivo}`, 10, 'italic', 10);
            
            // --- Parte 1 ---
            addText(`PARTE 1: ${script.parte_1_investigacion.titulo_parte}`, 18, 'bold', 8);
            
            addText('Apertura / Hook', 14, 'bolditalic', 3);
            addText(`Duración: ~${script.parte_1_investigacion.apertura_hook.duracion}`, 10, 'italic', 4);
            addText('Voz en Off (Hook):', 11, 'bold', 2);
            addText(script.parte_1_investigacion.apertura_hook.hook_texto, 11, 'normal', 4);
            addText('Ideas Visuales:', 11, 'bold', 2);
            addText(script.parte_1_investigacion.apertura_hook.hook_visual, 11, 'normal', 4);
            addText('Sugerencias de Audio:', 11, 'bold', 2);
            addText(script.parte_1_investigacion.apertura_hook.hook_audio, 11, 'normal', 8);

            addText('Contexto del Problema', 14, 'bolditalic', 3);
            addText(`Duración: ~${script.parte_1_investigacion.contexto_problema.duracion}`, 10, 'italic', 4);
            addText('Voz en Off:', 11, 'bold', 2);
            addText(script.parte_1_investigacion.contexto_problema.voz_en_off, 11, 'normal', 4);
            addText('Ideas Visuales:', 11, 'bold', 2);
            addText(script.parte_1_investigacion.contexto_problema.ideas_visuales, 11, 'normal', 10);

            // --- Parte 2 ---
            addText(`PARTE 2: ${script.parte_2_proyecto.titulo_parte}`, 18, 'bold', 8);

            addText('Presentación de la Solución', 14, 'bolditalic', 3);
            addText(`Duración: ~${script.parte_2_proyecto.presentacion_solucion.duracion}`, 10, 'italic', 4);
            addText('Voz en Off:', 11, 'bold', 2);
            addText(script.parte_2_proyecto.presentacion_solucion.voz_en_off, 11, 'normal', 4);
            addText('Argumentos Clave:', 11, 'bold', 2);
            addList(script.parte_2_proyecto.presentacion_solucion.argumentos, 4);
            addText('Ideas Visuales:', 11, 'bold', 2);
            addText(script.parte_2_proyecto.presentacion_solucion.ideas_visuales, 11, 'normal', 8);

            addText('Cierre / Llamado a la Acción', 14, 'bolditalic', 3);
            addText(`Duración: ~${script.parte_2_proyecto.cierre_cta.duracion}`, 10, 'italic', 4);
            addText('Voz en Off:', 11, 'bold', 2);
            addText(script.parte_2_proyecto.cierre_cta.voz_en_off, 11, 'normal', 4);
            addText('Texto en Pantalla:', 11, 'bold', 2);
            addText(script.parte_2_proyecto.cierre_cta.texto_en_pantalla, 11, 'normal', 10);

            // --- Videos Recomendados ---
            addText('Próximas Ideas de Video', 18, 'bold', 8);
            script.videos_recomendados.forEach((video, index) => {
                addText(video.titulo, 14, 'bolditalic', 3);
                addText(video.descripcion, 11, 'normal', 4);
                addText(`Sugerencia Visual: ${video.sugerencia_visual}`, 10, 'italic', index === script.videos_recomendados.length - 1 ? 0 : 8);
            });

            const safeTitle = script.titulo.replace(/[^a-z0-9]/gi, '_').toLowerCase();
            doc.save(`guion_${safeTitle}.pdf`);

        } catch (err) {
            console.error("Error creating PDF", err);
            setError("No se pudo generar el PDF.");
        } finally {
            setIsLoading(false);
        }
    }, [script]);

    return (
        <div className="w-full max-w-5xl mx-auto animate-fade-in-up">
            <button onClick={onBack} className="flex items-center text-sm text-gray-600 hover:text-black mb-6 transition-colors">
                <ChevronLeftIcon /> Volver al Inicio
            </button>

            {!script && (
                 <div className="bg-white p-8 rounded-lg border border-gray-200 shadow-sm">
                    <h2 className="text-2xl font-bold mb-2">Define tu idea</h2>
                    <p className="text-gray-600 mb-6">Ingresa un tema o sube archivos de referencia para inspirar a la IA.</p>
                    <div className="space-y-6">
                        <textarea
                            value={topic}
                            onChange={(e) => setTopic(e.target.value)}
                            placeholder="Ej: El impacto del diseño hostil en la vida urbana..."
                            className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black transition-shadow"
                            rows={3}
                            disabled={isLoading}
                        />

                        <div>
                             <label className="block text-sm font-medium text-gray-700 mb-2">Archivos de Referencia (Opcional)</label>
                             <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                                <div className="space-y-1 text-center">
                                    <FileIcon />
                                    <div className="flex text-sm text-gray-600">
                                        <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-black hover:text-gray-700 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-black">
                                            <span>Sube tus archivos</span>
                                            <input id="file-upload" name="file-upload" type="file" className="sr-only" multiple onChange={handleFileChange} disabled={isLoading} />
                                        </label>
                                        <p className="pl-1">o arrástralos aquí</p>
                                    </div>
                                    <p className="text-xs text-gray-500">Imágenes o documentos de referencia</p>
                                </div>
                            </div>
                        </div>

                        {files.length > 0 && (
                            <div className="space-y-3">
                                <h3 className="font-semibold text-sm">Archivos cargados:</h3>
                                <ul className="flex flex-wrap gap-4">
                                    {files.map((file, index) => (
                                        <li key={index} className="relative group p-2 border rounded-md bg-gray-50">
                                            <div className="flex items-center space-x-3">
                                                {file.type.startsWith('image/') ? (
                                                    <img src={file.previewUrl} alt={file.name} className="h-12 w-12 object-cover rounded-md" />
                                                ) : (
                                                    <div className="h-12 w-12 flex items-center justify-center bg-gray-200 rounded-md"><FileIcon /></div>
                                                )}
                                                <span className="text-sm text-gray-700 max-w-xs truncate">{file.name}</span>
                                            </div>
                                            <button onClick={() => handleRemoveFile(file.name)} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <TrashIcon />
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        <button
                            onClick={handleGenerate}
                            disabled={isLoading}
                            className="w-full bg-black text-white font-bold py-4 px-8 rounded-lg text-lg flex items-center justify-center transform transition-all duration-300 hover:scale-105 hover:bg-gray-800 focus:outline-none focus:ring-4 focus:ring-black focus:ring-opacity-50 disabled:bg-gray-400 disabled:scale-100"
                        >
                            {isLoading ? <LoadingSpinner /> : <GenerateIcon />}
                            <span className="ml-2">{isLoading ? 'Generando Guión...' : 'Generar Guión'}</span>
                        </button>
                    </div>
                </div>
            )}

            {error && <div className="mt-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg" role="alert">{error}</div>}

            {script && (
                <div className="mt-8 animate-fade-in-up">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-3xl font-bold">Tu Guión está Listo</h2>
                        <button
                            onClick={handleDownloadPdf}
                            disabled={isLoading}
                            className="bg-black text-white font-semibold py-2 px-5 rounded-lg flex items-center justify-center transition-colors hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black disabled:bg-gray-400"
                        >
                           {isLoading && script ? <LoadingSpinner /> : <DownloadIcon />}
                           <span>Descargar PDF</span>
                        </button>
                    </div>
                    <div>
                       <ScriptDisplay script={script} />
                    </div>
                </div>
            )}
        </div>
    );
};

export default GeneratorScreen;