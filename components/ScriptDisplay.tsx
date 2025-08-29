import React from 'react';
import { GeneratedScript, RecommendedVideo } from '../types';

interface ScriptDisplayProps {
  script: GeneratedScript;
}

const ScriptSection: React.FC<{ title: string; duration: string; children: React.ReactNode; icon: JSX.Element;}> = ({ title, duration, children, icon }) => (
    <div className="bg-white rounded-lg p-6 border border-gray-200 mb-6 shadow-sm">
        <div className="flex items-center mb-4">
            <div className="mr-4 text-black">{icon}</div>
            <div>
                <h3 className="text-xl font-bold text-black">{title}</h3>
                <p className="text-sm text-gray-500 font-mono">Duración: ~{duration}</p>
            </div>
        </div>
        <div className="space-y-4 text-gray-700 pl-10 border-l-2 border-gray-200 ml-4">
            {children}
        </div>
    </div>
);

const Detail: React.FC<{ label: string; content: string | string[]; icon: JSX.Element; }> = ({ label, content, icon }) => (
    <div>
        <h4 className="text-md font-semibold text-black flex items-center mb-2">
            {icon}
            <span className="ml-2">{label}</span>
        </h4>
        {Array.isArray(content) ? (
            <ul className="list-disc list-inside space-y-2 pl-2 text-gray-800">
                {content.map((item, index) => <li key={index}>{item}</li>)}
            </ul>
        ) : (
            <p className="text-gray-800">{content}</p>
        )}
    </div>
);

const PartHeader: React.FC<{ number: number; title: string; icon: JSX.Element }> = ({ number, title, icon }) => (
    <div className="flex items-center my-8">
        <div className="flex-grow border-t border-gray-300"></div>
        <div className="flex items-center mx-4">
            {icon}
            <div className="ml-3">
                 <span className="text-gray-500 font-mono text-sm">PARTE {number}</span>
                 <h2 className="text-2xl font-bold text-black">{title}</h2>
            </div>
        </div>
        <div className="flex-grow border-t border-gray-300"></div>
    </div>
);

// Icons
const PlayIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const GlobeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 21a9 9 0 100-18 9 9 0 000 18zm0 0a8.949 8.949 0 005.67-2.073M12 21a8.949 8.949 0 01-5.67-2.073M12 3a8.949 8.949 0 015.67 2.073M12 3a8.949 8.949 0 00-5.67 2.073m11.34 0A8.966 8.966 0 0121 12h-3m-3 9v-3m-6 0v3m-3-9H3m9 18v-3" /></svg>;
const SparklesIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>;
const CheckCircleIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const TextIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" /></svg>;
const CameraIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>;
const SpeakerWaveIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.858 5.858a1 1 0 00-1.414 1.414l12.728 12.728a1 1 0 001.414-1.414L5.858 5.858zM10 12a2 2 0 11-4 0 2 2 0 014 0z" /></svg>;
const ListBulletIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" /></svg>;
const LightBulbIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 017.072 0l-.707.707M12 21a5 5 0 01-5-5h10a5 5 0 01-5 5z" /></svg>;
const FilmIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" /></svg>;
const DocumentTextIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 inline-block mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>;
const ClockIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 inline-block mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const BeakerIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 inline-block mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 21a9 9 0 01-9-9V5a2 2 0 012-2h10a2 2 0 012 2v7a9 9 0 01-9 9z" /></svg>;

const ScriptDisplay: React.FC<ScriptDisplayProps> = ({ script }) => {
    const { titulo, duracion_estimada, objetivo, parte_1_investigacion, parte_2_proyecto, videos_recomendados } = script;
    return (
        <div id="script-content" className="w-full max-w-4xl mx-auto p-8 bg-gray-50 rounded-lg border border-gray-200">
            <header className="text-center border-b-2 border-gray-200 pb-8 mb-8">
                <h1 className="text-4xl font-extrabold text-black mb-4">{titulo}</h1>
                <div className="flex justify-center items-center space-x-6 text-gray-600">
                    <span className="flex items-center"><ClockIcon /> {duracion_estimada}</span>
                    <span className="flex items-center text-left max-w-md"><BeakerIcon /> {objetivo}</span>
                </div>
            </header>

            <main>
                {/* Parte 1 */}
                <PartHeader number={1} title={parte_1_investigacion.titulo_parte} icon={<GlobeIcon />} />
                <ScriptSection title="Apertura / Hook" duration={parte_1_investigacion.apertura_hook.duracion} icon={<PlayIcon />}>
                    <Detail label="Voz en Off (Hook)" content={parte_1_investigacion.apertura_hook.hook_texto} icon={<TextIcon />} />
                    <Detail label="Ideas Visuales" content={parte_1_investigacion.apertura_hook.hook_visual} icon={<CameraIcon />} />
                    <Detail label="Sugerencias de Audio" content={parte_1_investigacion.apertura_hook.hook_audio} icon={<SpeakerWaveIcon />} />
                </ScriptSection>
                <ScriptSection title="Contexto del Problema" duration={parte_1_investigacion.contexto_problema.duracion} icon={<GlobeIcon />}>
                    <Detail label="Voz en Off" content={parte_1_investigacion.contexto_problema.voz_en_off} icon={<TextIcon />} />
                    <Detail label="Ideas Visuales" content={parte_1_investigacion.contexto_problema.ideas_visuales} icon={<CameraIcon />} />
                </ScriptSection>

                {/* Parte 2 */}
                <PartHeader number={2} title={parte_2_proyecto.titulo_parte} icon={<SparklesIcon />} />
                <ScriptSection title="Presentación de la Solución" duration={parte_2_proyecto.presentacion_solucion.duracion} icon={<SparklesIcon />}>
                    <Detail label="Voz en Off" content={parte_2_proyecto.presentacion_solucion.voz_en_off} icon={<TextIcon />} />
                    <Detail label="Argumentos Clave" content={parte_2_proyecto.presentacion_solucion.argumentos} icon={<ListBulletIcon />} />
                    <Detail label="Ideas Visuales" content={parte_2_proyecto.presentacion_solucion.ideas_visuales} icon={<CameraIcon />} />
                </ScriptSection>
                <ScriptSection title="Cierre / Llamado a la Acción" duration={parte_2_proyecto.cierre_cta.duracion} icon={<CheckCircleIcon />}>
                    <Detail label="Voz en Off" content={parte_2_proyecto.cierre_cta.voz_en_off} icon={<TextIcon />} />
                    <Detail label="Texto en Pantalla" content={parte_2_proyecto.cierre_cta.texto_en_pantalla} icon={<TextIcon />} />
                </ScriptSection>
            </main>

            <footer className="mt-12 pt-8 border-t-2 border-gray-200">
                 <div className="flex items-center mb-6">
                    <div className="text-black mr-4"><LightBulbIcon /></div>
                    <h2 className="text-2xl font-bold text-black">Próximas Ideas de Video</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {videos_recomendados.map((video: RecommendedVideo, index: number) => (
                        <div key={index} className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm transition-transform hover:scale-105">
                           <div className="flex items-start space-x-3">
                             <div className="text-black mt-1"><FilmIcon /></div>
                             <div>
                                <h4 className="font-bold text-lg text-black">{video.titulo}</h4>
                                <p className="text-gray-600 text-sm mt-1">{video.descripcion}</p>
                                <p className="text-gray-500 text-xs mt-3 font-mono">Visual: {video.sugerencia_visual}</p>
                             </div>
                           </div>
                        </div>
                    ))}
                </div>
            </footer>
        </div>
    );
};

export default ScriptDisplay;
