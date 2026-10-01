import React from 'react';
import { Award, Heart, CheckCircle2, ShieldCheck, Sparkles, School } from 'lucide-react';

export const IngredientsQuality: React.FC = () => {
  const ingredientsList = [
    {
      title: 'Harina de Trigo Alta Proteína',
      description: 'Molienda fina de grano entero seleccionada que garantiza la masa más esponjosa y aireada.',
      tag: 'Textura Esponjosa',
    },
    {
      title: 'Mantequilla Pura Sin Grasas Trans',
      description: 'Grasa láctea de primera calidad que aporta suavidad auténtica sin aceites hidrogenados.',
      tag: '0% Grasas Trans',
    },
    {
      title: 'Leche Entera y Huevos Frescos',
      description: 'Aporte nutritivo y fresco de granjas tolimenses cada mañana a primera hora.',
      tag: 'Origen Local',
    },
    {
      title: 'Chocolate Real & Coberturas Nobles',
      description: '65% de sólidos de cacao con manteca pura, sin sustitutos de manteca vegetal.',
      tag: 'Brillo Espejo',
    },
    {
      title: 'Vainilla y Canela Silvestre',
      description: 'Extractos e infusiones aromáticas naturales que perfuman cada horneada.',
      tag: 'Aroma Gourmet',
    },
    {
      title: 'Frutas Frescas Seleccionadas',
      description: 'Moras y fresas campesinas reducidas en confituras sin colorantes artificiales.',
      tag: '100% Natural',
    },
  ];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="bg-gradient-to-br from-[#1a1216] via-[#140e11] to-[#0f0a0c] border border-amber-500/20 rounded-3xl p-8 sm:p-12 relative overflow-hidden shadow-2xl">
        {/* Glow Element */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Section Header */}
        <div className="max-w-3xl mb-12">
          <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-amber-400 mb-2">
            <School className="w-4 h-4 text-amber-400" />
            <span>I.E. Marco Fidel Suárez · Gualanday, Tolima</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-serif text-white tracking-tight">
            Calidad en Cada Ingrediente
          </h2>
          <p className="text-neutral-400 text-sm sm:text-base mt-3 leading-relaxed">
            Utilizamos materias primas seleccionadas para garantizar el mejor sabor y textura. Cada lote es elaborado bajo estrictos estándares higiénicos y artesanales por estudiantes apasionados de la institución educativa.
          </p>
        </div>

        {/* Grid of Ingredients */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ingredientsList.map((item, index) => (
            <div
              key={index}
              className="p-6 bg-black/40 border border-white/5 rounded-2xl hover:border-amber-500/30 transition-colors flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs text-amber-400 font-mono tracking-wider">{item.tag}</span>
                  <CheckCircle2 className="w-4 h-4 text-amber-400" />
                </div>
                <h3 className="text-lg font-bold text-white font-serif mb-2">{item.title}</h3>
                <p className="text-xs text-neutral-400 leading-relaxed">{item.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Institutional Trust Banner */}
        <div className="mt-10 p-5 bg-amber-500/10 border border-amber-500/30 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-amber-300">
                Compromiso Pedagógico & Artesanal
              </div>
              <div className="text-xs text-neutral-300">
                Proceso de elaboración higiénico y artesanal certificado · Gualanday, Tolima
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-neutral-400">
            <span>Soporte Oficial:</span>
            <a
              href="https://wa.me/573213610322"
              target="_blank"
              rel="noopener noreferrer"
              className="text-amber-400 hover:underline font-bold"
            >
              +57 321 361 0322
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
