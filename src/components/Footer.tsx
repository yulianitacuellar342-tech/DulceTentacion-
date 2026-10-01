import React from 'react';
import { MessageCircle, Heart, MapPin, School, Phone } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <>
      <footer className="border-t border-white/5 bg-[#0a0708] py-16 text-neutral-400 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-12 border-b border-white/5">
            {/* Column 1: Brand */}
            <div className="space-y-3">
              <h3 className="text-xl font-bold font-serif text-white">Dulce Tentación</h3>
              <p className="text-neutral-400 leading-relaxed text-xs">
                Emprendimiento de venta de donas artesanas gourmet en Gualanday, Tolima. Masa suave, glaseados de autor y amor en cada receta.
              </p>
              <div className="flex items-center gap-1.5 text-neutral-400 text-xs pt-1">
                <School className="w-3.5 h-3.5 text-amber-500" />
                <span>I.E. Marco Fidel Suárez</span>
              </div>
            </div>

            {/* Column 2: Quick Links */}
            <div className="space-y-2.5">
              <h4 className="text-xs uppercase tracking-wider font-semibold text-white">Navegación</h4>
              <ul className="space-y-2">
                <li><a href="#catalogo" className="hover:text-white transition-colors">Carta de Donas</a></li>
                <li><a href="#personalizador" className="hover:text-white transition-colors">Estudio Gourmet 3D</a></li>
                <li><a href="#lealtad" className="hover:text-white transition-colors">Club Donas Doradas</a></li>
                <li><a href="#resenas" className="hover:text-white transition-colors">Opiniones & Comunidad</a></li>
              </ul>
            </div>

            {/* Column 3: Contact & Hours */}
            <div className="space-y-2.5">
              <h4 className="text-xs uppercase tracking-wider font-semibold text-white">Canales de Contacto</h4>
              <ul className="space-y-2 text-neutral-400">
                <li className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                  <span>Sede: Gualanday, Tolima</span>
                </li>
                <li className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                  <a href="tel:3213610322" className="hover:text-white font-mono">321 361 0322</a>
                </li>
                <li className="flex items-center gap-2">
                  <MessageCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <a
                    href="https://wa.me/573213610322"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-emerald-400 text-white font-mono"
                  >
                    WhatsApp Pedidos
                  </a>
                </li>
              </ul>
            </div>

            {/* Column 4: Quality Commitment */}
            <div className="space-y-2.5">
              <h4 className="text-xs uppercase tracking-wider font-semibold text-white">Garantía Gourmet</h4>
              <p className="text-neutral-400 leading-relaxed text-xs">
                Elaboración higiénica bajo estándares de manipulación de alimentos. Facturación digital PDF automática y pagos seguros Nequi y PSE.
              </p>
              <div className="text-[11px] text-amber-500 font-mono">
                Hosting: Netlify & Cloud Run
              </div>
            </div>
          </div>

          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-neutral-500 text-[11px]">
            <div>
              © 2026 Dulce Tentación · Gualanday, Tolima. Todos los derechos reservados.
            </div>
            <div className="flex items-center gap-4">
              <span>Ficha Técnica v2.4</span>
              <span>·</span>
              <span>Privacidad & KYC Seguro</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Floating WhatsApp Contact Button */}
      <a
        href="https://wa.me/573213610322?text=Hola%20Dulce%20Tentaci%C3%B3n,%20deseo%20hacer%20un%20pedido%20de%20donas%20artesanales%20en%20Gualanday."
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-40 bg-emerald-500 hover:bg-emerald-400 text-black font-bold p-3.5 rounded-full shadow-2xl shadow-emerald-500/30 flex items-center justify-center transition-all hover:scale-110 active:scale-95 group"
        title="Contactar por WhatsApp a Dulce Tentación (3213610322)"
      >
        <MessageCircle className="w-6 h-6 fill-current text-white" />
        <span className="max-w-0 overflow-hidden whitespace-nowrap group-hover:max-w-xs transition-all duration-300 text-xs font-semibold text-white pl-0 group-hover:pl-2">
          321 361 0322
        </span>
      </a>
    </>
  );
};
