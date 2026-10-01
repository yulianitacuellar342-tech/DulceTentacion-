import React from 'react';
import { CustomerVerification } from '../types';
import { ShoppingBag, ShieldCheck, Bell, ShieldAlert, Settings2, Sparkles } from 'lucide-react';

interface HeaderProps {
  cartCount: number;
  cartTotalCOP: number;
  verification: CustomerVerification;
  onOpenCart: () => void;
  onOpenVerificationModal: () => void;
  onOpenNotifications: () => void;
  onOpenTracking: () => void;
  onOpenAdmin: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  cartCount,
  cartTotalCOP,
  verification,
  onOpenCart,
  onOpenVerificationModal,
  onOpenNotifications,
  onOpenTracking,
  onOpenAdmin,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#0f0b0c]/90 backdrop-blur-md border-b border-white/5 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        {/* Zone 1: Wordmark in Display Face */}
        <a href="#" className="flex items-baseline gap-2 shrink-0 group">
          <span className="text-2xl sm:text-3xl font-bold font-serif tracking-tight text-white group-hover:text-amber-400 transition-colors">
            Dulce Tentación
          </span>
          <span className="hidden sm:inline-block w-1.5 h-1.5 rounded-full bg-amber-500" />
        </a>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 lg:gap-8 text-xs lg:text-sm font-medium text-neutral-400">
          <a href="#catalogo" className="hover:text-white transition-colors">
            Catálogo
          </a>
          <a href="#personalizador" className="hover:text-white transition-colors flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Estudio 3D</span>
          </a>
          <a href="#lealtad" className="hover:text-white transition-colors">
            Club Lealtad
          </a>
          <button
            onClick={onOpenTracking}
            className="hover:text-white transition-colors text-left"
          >
            Rastreo en Vivo
          </button>
          <a href="#resenas" className="hover:text-white transition-colors">
            Reseñas
          </a>
        </nav>

        {/* Zone 3: Primary Actions */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Client KYC Verification Status Button */}
          <button
            onClick={onOpenVerificationModal}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all border ${
              verification.isVerified
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                : 'bg-amber-500/10 border-amber-500/30 text-amber-300 hover:bg-amber-500/20'
            }`}
            title={verification.isVerified ? 'Identidad y dirección verificada' : 'Verifica tu cuenta para comprar'}
          >
            {verification.isVerified ? (
              <>
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span className="hidden sm:inline truncate max-w-[120px]">{verification.fullName.split(' ')[0]}</span>
                <span className="text-[10px] text-emerald-500 font-mono">KYC</span>
              </>
            ) : (
              <>
                <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
                <span className="truncate">Verificarme</span>
              </>
            )}
          </button>

          {/* Push Notifications Bell */}
          <button
            onClick={onOpenNotifications}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white transition-colors relative"
            title="Notificaciones push de promociones"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
          </button>

          {/* Admin Panel Quick Trigger */}
          <button
            onClick={onOpenAdmin}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-amber-400 transition-colors"
            title="Panel de Administración e IA"
          >
            <Settings2 className="w-4 h-4" />
          </button>

          {/* Cart Drawer Trigger */}
          <button
            onClick={onOpenCart}
            className="px-3.5 py-2 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-black font-semibold text-xs rounded-xl flex items-center gap-2 shadow-lg shadow-amber-500/10 transition-all active:scale-95"
          >
            <ShoppingBag className="w-4 h-4" />
            <span className="font-mono font-bold">{cartCount}</span>
            {cartTotalCOP > 0 && (
              <span className="hidden sm:inline font-mono border-l border-black/20 pl-2">
                ${cartTotalCOP.toLocaleString('es-CO')}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
