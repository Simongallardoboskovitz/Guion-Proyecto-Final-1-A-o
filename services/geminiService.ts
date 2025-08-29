import { GoogleGenAI, Type } from "@google/genai";
import { GeneratedScript } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const scriptSectionSchema = {
    type: Type.OBJECT,
    properties: {
        duracion: { type: Type.STRING, description: "Duración de esta sección (ej: '1 min.')." },
        voz_en_off: { type: Type.STRING, description: "Texto de la voz en off para esta sección." },
        ideas_visuales: { type: Type.STRING, description: "Sugerencias visuales para acompañar esta sección." },
    },
    required: ["duracion", "voz_en_off", "ideas_visuales"]
};

const responseSchema = {
    type: Type.OBJECT,
    properties: {
        titulo: { type: Type.STRING, description: "Un título creativo y atractivo para el videoblog de Instagram." },
        duracion_estimada: { type: Type.STRING, description: "La duración total estimada del video (ej: '90 segundos')." },
        objetivo: { type: Type.STRING, description: "El objetivo principal del videoblog en una oración concisa." },
        parte_1_investigacion: {
            type: Type.OBJECT,
            properties: {
                titulo_parte: { type: Type.STRING, description: "Título para la Parte 1, ej: 'Explorando el Problema'." },
                apertura_hook: {
                    type: Type.OBJECT,
                    properties: {
                        duracion: { type: Type.STRING, description: "Duración del hook (ej: '15 seg.')." },
                        hook_texto: { type: Type.STRING, description: "El texto exacto de la voz en off para el hook inicial." },
                        hook_visual: { type: Type.STRING, description: "Sugerencias de imágenes o escenas para el hook visual." },
                        hook_audio: { type: Type.STRING, description: "Sugerencias de música o efectos de sonido para el hook de audio." },
                    },
                    required: ["duracion", "hook_texto", "hook_visual", "hook_audio"]
                },
                contexto_problema: scriptSectionSchema,
            },
            required: ["titulo_parte", "apertura_hook", "contexto_problema"]
        },
        parte_2_proyecto: {
            type: Type.OBJECT,
            properties: {
                titulo_parte: { type: Type.STRING, description: "Título para la Parte 2, ej: 'Una Solución Creativa'." },
                presentacion_solucion: {
                    type: Type.OBJECT,
                    properties: {
                        ...scriptSectionSchema.properties,
                        argumentos: {
                            type: Type.ARRAY,
                            items: { type: Type.STRING },
                            description: "Una lista de exactamente dos argumentos claros y concisos que presentan la solución."
                        },
                    },
                    required: [...scriptSectionSchema.required, "argumentos"]
                },
                cierre_cta: {
                    type: Type.OBJECT,
                    properties: {
                        duracion: { type: Type.STRING, description: "Duración del cierre (ej: '15 seg.')." },
                        voz_en_off: { type: Type.STRING, description: "Texto de la voz en off para el llamado a la acción (CTA)." },
                        texto_en_pantalla: { type: Type.STRING, description: "El texto final que aparecerá en pantalla (ej: '@usuario | Comenta tu idea')." },
                    },
                    required: ["duracion", "voz_en_off", "texto_en_pantalla"]
                },
            },
            required: ["titulo_parte", "presentacion_solucion", "cierre_cta"]
        },
        videos_recomendados: {
            type: Type.ARRAY,
            description: "Una lista de exactamente 3 ideas para futuros videos de Instagram, relacionados con el tema principal.",
            items: {
                type: Type.OBJECT,
                properties: {
                    titulo: { type: Type.STRING, description: "Un título atractivo para el video recomendado." },
                    descripcion: { type: Type.STRING, description: "Una breve descripción del contenido del video recomendado." },
                    sugerencia_visual: { type: Type.STRING, description: "Una idea visual clave para el video recomendado." }
                },
                required: ["titulo", "descripcion", "sugerencia_visual"]
            }
        }
    },
    required: ["titulo", "duracion_estimada", "objetivo", "parte_1_investigacion", "parte_2_proyecto", "videos_recomendados"]
};

const getPrompt = (topic: string, hasFiles: boolean): string => {
    const fileInstruction = hasFiles 
      ? "Usa los archivos (imágenes, documentos) proporcionados como la principal fuente de inspiración y referencia para el contenido del guión. Basa las sugerencias visuales y el contexto en estos archivos."
      : `El tema principal del guión es: "${topic}"`;

    return `
    Actúa como un guionista experto en contenido educativo y dinámico para videos de Instagram.
    Tu tarea es generar un guión completo para un solo video que tiene dos partes claras y conectadas.
    El tono debe ser educativo, conversacional y en español.
    ${fileInstruction}
    La respuesta DEBE ser un objeto JSON válido que se ajuste al esquema proporcionado. No incluyas texto antes o después del objeto JSON.

    Estructura del video único:
    1.  **Parte 1: Investigación:** Comienza con un hook potente. Luego, investiga y presenta un problema o fenómeno cotidiano, revelando tensiones o sensibilidades (inspirado en el estilo 'Hipersensibles').
    2.  **Parte 2: Proyecto/Solución:** Transiciona suavemente a la presentación de una solución o proyecto de diseño creativo que responde al problema de la Parte 1. Debe ser una intervención sutil que transforma una experiencia (inspirado en el estilo 'Objeto Parásito'). Termina con un llamado a la acción claro.
    3.  **Videos Recomendados:** Al final, incluye una lista de exactamente 3 ideas para futuros videos de Instagram que se relacionen con el tema principal.
    `;
};

interface FileData {
    mimeType: string;
    data: string; // base64 encoded string
}

export const generateScript = async (topic: string, files: FileData[]): Promise<GeneratedScript> => {
    try {
        const promptText = getPrompt(topic, files.length > 0);
        
        const textPart = { text: promptText };
        const imageParts = files.map(file => ({
            inlineData: {
                mimeType: file.mimeType,
                data: file.data
            }
        }));

        const contents = { parts: [textPart, ...imageParts] };

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: contents,
            config: {
                responseMimeType: "application/json",
                responseSchema: responseSchema,
            },
        });

        const jsonText = response.text.trim();
        const parsedJson = JSON.parse(jsonText);
        return parsedJson as GeneratedScript;

    } catch (error) {
        console.error("Error generating script from Gemini API:", error);
        throw new Error("Failed to generate script.");
    }
};
