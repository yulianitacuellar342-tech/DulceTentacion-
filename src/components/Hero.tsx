import React from 'react';
import { Sparkles, ArrowRight, ShieldCheck, Heart, Award, MapPin } from 'lucide-react';

interface HeroProps {
  onOpenCustomStudio: () => void;
  onExploreCatalog: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenCustomStudio, onExploreCatalog }) => {
  return (
    <section className="relative overflow-hidden pt-8 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-amber-600/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left Column: Editorial Copy */}
        <div className="lg:col-span-6 space-y-6 text-center lg:text-left z-10">
          {/* Trust Kicker (Non-pill unboxed text with separators) */}
          <div className="flex items-center justify-center lg:justify-start gap-2 text-xs tracking-wider uppercase text-amber-500 font-medium">
            <span>Donas Artesanas Gourmet</span>
            <span aria-hidden="true">·</span>
            <span>Gualanday, Tolima</span>
            <span aria-hidden="true">·</span>
            <span>I.E. Marco Fidel Suárez</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-serif tracking-tight text-white leading-[1.12] text-balance">
            El Arte de la Repostería en Cada Bocado
          </h1>

          <p className="text-neutral-300 text-base sm:text-lg max-w-xl mx-auto lg:mx-0 leading-relaxed font-light">
            Esponjosas, frescas y horneadas diariamente con materias primas seleccionadas: harina de alta proteína, coberturas de chocolate real y confituras de frutas frescas.
          </p>

          {/* Action CTAs */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
            <button
              onClick={onExploreCatalog}
              className="w-full sm:w-auto px-7 py-4 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-black font-semibold text-sm rounded-xl flex items-center justify-center gap-2 shadow-xl shadow-amber-500/20 transition-all hover:translate-y-[-2px] active:scale-[0.98]"
            >
              <span>Explorar Menú</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={onOpenCustomStudio}
              className="w-full sm:w-auto px-7 py-4 bg-white/10 hover:bg-white/15 text-white font-semibold text-sm rounded-xl flex items-center justify-center gap-2 border border-white/10 transition-all hover:border-amber-500/40"
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Personalizar en 3D</span>
            </button>
          </div>

          {/* Adjacency Trust Metrics */}
          <div className="pt-8 border-t border-white/10 grid grid-cols-3 gap-4 text-left">
            <div>
              <div className="text-xl sm:text-2xl font-bold font-mono text-white">$5.000 <span className="text-xs font-normal text-neutral-400 font-sans">COP</span></div>
              <div className="text-[11px] text-neutral-400 mt-0.5">Dona Individual</div>
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-bold font-mono text-amber-400">$25.000 <span className="text-xs font-normal text-neutral-400 font-sans">COP</span></div>
              <div className="text-[11px] text-neutral-400 mt-0.5">Caja Familiar de 6</div>
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-bold font-mono text-emerald-400">100%</div>
              <div className="text-[11px] text-neutral-400 mt-0.5">Garantía Artesanal</div>
            </div>
          </div>
        </div>

        {/* Right Column: Hero High-Fidelity Image Showcase */}
        <div className="lg:col-span-6 relative flex items-center justify-center">
          <div className="relative w-full max-w-lg lg:max-w-none aspect-[16/9] sm:aspect-[4/3] rounded-3xl overflow-hidden border border-white/10 shadow-2xl shadow-black/80 group">
            <img
              src="/src/assets/images/hero_gourmet_donuts_1790823089936.jpg"
              alt="Donas artesanas gourmet Dulce Tentación Gualanday"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
            />

            {/* Gradient Scrim for Contrast */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

            {/* Floating Trust Card */}
            <div className="absolute bottom-6 left-6 right-6 bg-black/60 backdrop-blur-md border border-white/10 rounded-2xl p-4 flex items-center justify-between gap-3 text-xs text-white">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-semibold text-amber-300">Horneadas Diariamente con Amor</div>
                  <div className="text-[11px] text-neutral-400">Proceso higiénico I.E. Marco Fidel Suárez</div>
                </div>
              </div>
              <span className="font-mono text-neutral-400 text-[11px] hidden sm:inline">Gualanday</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
