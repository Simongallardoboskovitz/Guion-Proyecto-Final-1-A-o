
export enum View {
    Home = 'home',
    Generator = 'generator'
}

interface ScriptSection {
    duracion: string;
    voz_en_off: string;
    ideas_visuales: string;
}

export interface RecommendedVideo {
    titulo: string;
    descripcion: string;
    sugerencia_visual: string;
}

export interface GeneratedScript {
  titulo: string;
  duracion_estimada: string;
  objetivo: string;
  parte_1_investigacion: {
    titulo_parte: string;
    apertura_hook: {
      duracion: string;
      hook_texto: string;
      hook_visual: string;
      hook_audio: string;
    };
    contexto_problema: ScriptSection;
  };
  parte_2_proyecto: {
    titulo_parte: string;
    presentacion_solucion: ScriptSection & { argumentos: string[] };
    cierre_cta: {
      duracion:string;
      voz_en_off: string;
      texto_en_pantalla: string;
    };
  };
  videos_recomendados: RecommendedVideo[];
}
