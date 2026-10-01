import React, { useState } from 'react';
import { LOYALTY_REWARDS } from '../data/initialData';
import { LoyaltyReward } from '../types';
import { Award, Gift, Sparkles, Trophy, Star, CheckCircle, RotateCw } from 'lucide-react';
import confetti from 'canvas-confetti';

interface LoyaltyClubProps {
  userPoints: number;
  onApplyReward: (reward: LoyaltyReward) => void;
}

export const LoyaltyClub: React.FC<LoyaltyClubProps> = ({ userPoints, onApplyReward }) => {
  const [activeCodeApplied, setActiveCodeApplied] = useState<string | null>(null);
  const [spinResult, setSpinResult] = useState<string | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [hasSpunToday, setHasSpunToday] = useState(false);

  const fortuneRewards = [
    'Salsa Gourmet Gratis (+$1.500 COP)',
    '100 Donas Doradas Extra',
    'Topping Crujiente Oreo Gratis',
    '15% Descuento en Caja de 6',
    'Café de Cortesía con tu Pedido',
  ];

  const handleSpinWheel = () => {
    if (hasSpunToday || isSpinning) return;
    setIsSpinning(true);
    setSpinResult(null);

    setTimeout(() => {
      const prize = fortuneRewards[Math.floor(Math.random() * fortuneRewards.length)];
      setSpinResult(prize);
      setIsSpinning(false);
      setHasSpunToday(true);

      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#f59e0b', '#fbbf24', '#ec4899'],
      });
    }, 1800);
  };

  const handleRedeem = (reward: LoyaltyReward) => {
    setActiveCodeApplied(reward.code);
    onApplyReward(reward);
    confetti({
      particleCount: 40,
      spread: 50,
      origin: { y: 0.7 },
      colors: ['#10b981', '#fbbf24', '#d97706'],
    });
  };

  return (
    <section id="lealtad" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="bg-[#140e11] border border-amber-500/25 rounded-3xl p-8 sm:p-12 relative overflow-hidden shadow-2xl">
        {/* Glow */}
        <div className="absolute -top-12 -right-12 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-amber-400 mb-2">
              <Trophy className="w-4 h-4 text-amber-400" />
              <span>Club Donas Doradas · Programa de Lealtad</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-serif text-white tracking-tight">
              Recompensas para Amantes de las Donas
            </h2>
            <p className="text-neutral-400 text-sm sm:text-base mt-2 max-w-2xl">
              Acumula 100 puntos por cada $5.000 COP en compras en Gualanday y canjéalos por salsas de autor, donas gratis y accesos anticipados a sabores de temporada.
            </p>
          </div>

          {/* User Points Badge */}
          <div className="bg-black/50 border border-amber-500/30 rounded-2xl p-4 sm:p-5 flex items-center gap-4 shrink-0">
            <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <Star className="w-6 h-6 fill-amber-400 text-amber-400" />
            </div>
            <div>
              <div className="text-[11px] uppercase tracking-wider text-neutral-400">Tus Donas Doradas</div>
              <div className="text-2xl font-bold font-mono text-white">
                {userPoints.toLocaleString('es-CO')} <span className="text-xs text-amber-400 font-sans font-semibold">PTS</span>
              </div>
              <div className="text-[10px] text-emerald-400 mt-0.5">Nivel: Maestro Artesano</div>
            </div>
          </div>
        </div>

        {/* Interactive Fortune Wheel / Mini Game */}
        <div className="mb-12 bg-gradient-to-r from-amber-950/40 via-purple-950/20 to-black/60 border border-amber-500/30 rounded-2xl p-6 flex flex-col lg:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center lg:text-left">
            <div className="inline-flex items-center gap-1.5 text-xs text-amber-400 font-mono tracking-wider uppercase">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Premio Sorpresa Diario</span>
            </div>
            <h3 className="text-xl font-bold text-white font-serif">
              Gira la Ruleta Gourmet de Gualanday
            </h3>
            <p className="text-xs text-neutral-300 max-w-lg">
              Tienes 1 giro gratis hoy por visitar Dulce Tentación. Desbloquea toppings exclusivos al instante.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto">
            {spinResult && (
              <div className="p-3 bg-emerald-500/15 border border-emerald-500/40 rounded-xl text-xs text-emerald-300 font-medium animate-fade-in text-center">
                🎉 ¡Ganaste: <strong>{spinResult}</strong>!
              </div>
            )}

            <button
              onClick={handleSpinWheel}
              disabled={isSpinning || hasSpunToday}
              className={`px-6 py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 w-full sm:w-auto ${
                hasSpunToday
                  ? 'bg-white/5 text-neutral-500 cursor-not-allowed border border-white/5'
                  : 'bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-black shadow-lg shadow-amber-500/20 active:scale-95'
              }`}
            >
              <RotateCw className={`w-4 h-4 ${isSpinning ? 'animate-spin' : ''}`} />
              <span>{isSpinning ? 'Girando...' : hasSpunToday ? 'Giro Usado Hoy' : 'Girar Ruleta'}</span>
            </button>
          </div>
        </div>

        {/* Rewards Catalog */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {LOYALTY_REWARDS.map((reward) => {
            const canRedeem = userPoints >= reward.pointsRequired;
            const isApplied = activeCodeApplied === reward.code;

            return (
              <div
                key={reward.id}
                className="bg-black/40 border border-white/5 hover:border-amber-500/30 rounded-2xl p-6 flex flex-col justify-between transition-colors"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-400">
                      <Gift className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-mono font-bold text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/20">
                      {reward.pointsRequired} Pts
                    </span>
                  </div>

                  <h4 className="text-lg font-bold text-white font-serif mb-1">{reward.title}</h4>
                  <p className="text-xs text-neutral-400 leading-relaxed mb-4">{reward.description}</p>
                </div>

                <button
                  disabled={!canRedeem || isApplied}
                  onClick={() => handleRedeem(reward)}
                  className={`w-full py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                    isApplied
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : canRedeem
                      ? 'bg-amber-500 hover:bg-amber-400 text-black font-bold'
                      : 'bg-white/5 text-neutral-500 cursor-not-allowed'
                  }`}
                >
                  {isApplied ? (
                    <>
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span>¡Canjeado en tu Carrito!</span>
                    </>
                  ) : canRedeem ? (
                    <span>Canjear Recompensa</span>
                  ) : (
                    <span>Te faltan {reward.pointsRequired - userPoints} pts</span>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
