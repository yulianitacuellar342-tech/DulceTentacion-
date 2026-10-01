import React, { useState } from 'react';
import { Review } from '../types';
import { Star, MessageSquarePlus, Share2, ShieldCheck, Heart, Send, X, Image as ImageIcon } from 'lucide-react';
import confetti from 'canvas-confetti';

interface SocialReviewWallProps {
  reviews: Review[];
  onAddReview: (review: Review) => void;
}

export const SocialReviewWall: React.FC<SocialReviewWallProps> = ({ reviews, onAddReview }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [author, setAuthor] = useState('');
  const [comment, setComment] = useState('');
  const [rating, setRating] = useState(5);
  const [donutPurchased, setDonutPurchased] = useState('Dona de Autor');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!author.trim() || !comment.trim()) return;

    const newReview: Review = {
      id: 'rev_' + Date.now(),
      author,
      location: 'Gualanday, Tolima',
      rating,
      comment,
      donutPurchased,
      date: 'Reciente',
      verifiedBuyer: true,
    };

    onAddReview(newReview);
    setIsModalOpen(false);
    setAuthor('');
    setComment('');

    confetti({
      particleCount: 40,
      spread: 60,
      origin: { y: 0.8 },
      colors: ['#f43f5e', '#fbbf24', '#d97706'],
    });
  };

  const shareReviewWhatsApp = (rev: Review) => {
    const text = `¡Acabo de probar las donas artesanales de Dulce Tentación en Gualanday! ⭐⭐⭐⭐⭐ "${rev.comment}" - Recomendadísimas. Pídelas al WhatsApp 3213610322.`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <section id="resenas" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
          <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-amber-500 mb-2">
            <span>Comunidad & Reseñas</span>
            <span aria-hidden="true">·</span>
            <span>Gualanday, Tolima</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-serif text-white tracking-tight">
            Opiniones de Amantes del Buen Dulce
          </h2>
          <p className="text-neutral-400 text-sm sm:text-base mt-2 max-w-2xl">
            Clientes locales verificados que comparten sus momentos más dulces con nuestras donas recién horneadas.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-5 py-3 bg-white/10 hover:bg-white/15 text-white font-semibold text-xs rounded-xl flex items-center gap-2 transition-colors border border-white/10 self-start md:self-auto"
        >
          <MessageSquarePlus className="w-4 h-4 text-amber-400" />
          <span>Escribir Mi Reseña</span>
        </button>
      </div>

      {/* Reviews Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {reviews.map((rev) => (
          <div
            key={rev.id}
            className="p-6 bg-[#140e10] border border-white/5 hover:border-amber-500/30 rounded-3xl flex flex-col justify-between transition-all"
          >
            <div>
              {/* Stars & Verified */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < rev.rating
                          ? 'fill-amber-400 text-amber-400'
                          : 'text-neutral-700'
                      }`}
                    />
                  ))}
                </div>
                {rev.verifiedBuyer && (
                  <span className="flex items-center gap-1 text-[10px] text-emerald-400 font-medium">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Comprador Verificado</span>
                  </span>
                )}
              </div>

              {/* Review Text */}
              <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed italic mb-4">
                "{rev.comment}"
              </p>
            </div>

            {/* Author and Social Share */}
            <div className="pt-4 border-t border-white/5 flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-white">{rev.author}</div>
                <div className="text-[11px] text-neutral-500">{rev.location} · {rev.donutPurchased}</div>
              </div>

              <button
                onClick={() => shareReviewWhatsApp(rev)}
                className="p-2 rounded-xl bg-white/5 hover:bg-emerald-500/20 text-neutral-400 hover:text-emerald-400 transition-colors"
                title="Compartir en WhatsApp"
              >
                <Share2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Review Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#140e11] border border-[#2e1f24] w-full max-w-md rounded-3xl p-6 text-white relative shadow-2xl space-y-4">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 right-5 p-1.5 rounded-full hover:bg-white/10 text-neutral-400"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="text-lg font-bold font-serif">Comparte tu Experiencia Dulce</h3>
            <p className="text-xs text-neutral-400">Tu opinión apoya a los estudiantes y la calidad de nuestras donas artesanales.</p>

            <form onSubmit={handleSubmit} className="space-y-3 pt-2">
              <div>
                <label className="block text-xs uppercase tracking-wider text-neutral-400 mb-1">Tu Nombre</label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Andrés Ramírez"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  className="w-full bg-black/50 border border-white/10 rounded-xl p-2.5 text-xs text-white outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-neutral-400 mb-1">Dona que Probaste</label>
                <select
                  value={donutPurchased}
                  onChange={(e) => setDonutPurchased(e.target.value)}
                  className="w-full bg-black/50 border border-white/10 rounded-xl p-2.5 text-xs text-white outline-none focus:border-amber-500"
                >
                  <option value="Dona Individual">Dona Individual Artesanal</option>
                  <option value="Caja de 6 Unidades">Caja de 6 Unidades Gourmet</option>
                  <option value="Dona Personalizada de Autor">Dona Personalizada de Autor</option>
                  <option value="Corona de Arequipe & Nuez">Corona Imperial de Arequipe</option>
                </select>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-neutral-400 mb-1">Calificación</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setRating(star)}
                      className="p-1 hover:scale-110 transition-transform"
                    >
                      <Star
                        className={`w-6 h-6 ${
                          star <= rating
                            ? 'fill-amber-400 text-amber-400'
                            : 'text-neutral-700'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-neutral-400 mb-1">Comentario</label>
                <textarea
                  rows={3}
                  required
                  placeholder="¿Cómo te pareció la textura, frescura y sabor?"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="w-full bg-black/50 border border-white/10 rounded-xl p-2.5 text-xs text-white outline-none focus:border-amber-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-black font-semibold text-xs rounded-xl transition-colors shadow-lg shadow-amber-500/20"
              >
                Publicar Reseña
              </button>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};
