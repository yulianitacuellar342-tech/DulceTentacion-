import React, { useState } from 'react';
import { Product, CartItem } from '../types';
import { ShoppingBag, Eye, Heart, Plus, Sparkles, Check } from 'lucide-react';
import confetti from 'canvas-confetti';

interface ProductCatalogProps {
  products: Product[];
  onAddToCart: (item: CartItem) => void;
  onOpenCart: () => void;
  onOpenCustomStudio: () => void;
}

export const ProductCatalog: React.FC<ProductCatalogProps> = ({
  products,
  onAddToCart,
  onOpenCart,
  onOpenCustomStudio,
}) => {
  const [selectedFilter, setSelectedFilter] = useState<'todos' | 'individual' | 'caja' | 'especial'>('todos');
  const [addedProductId, setAddedProductId] = useState<string | null>(null);

  const filteredProducts = products.filter((p) => {
    if (selectedFilter === 'todos') return true;
    return p.category === selectedFilter;
  });

  const handleQuickAdd = (product: Product) => {
    const config = product.defaultConfig;
    const item: CartItem = {
      id: `${product.id}_${Date.now()}`,
      productId: product.id,
      name: product.name,
      presentation: config?.presentation || (product.category === 'caja' ? 'Caja 6 Unidades' : 'Individual'),
      baseGlaze: config?.baseGlaze || 'Chocolate',
      toppings: config?.toppings || ['Chispas'],
      sauce: config?.sauce || null,
      unitPriceCOP: product.priceCOP,
      quantity: 1,
      subtotalCOP: product.priceCOP,
      image: product.image,
      notes: product.highlight,
    };

    onAddToCart(item);
    setAddedProductId(product.id);
    setTimeout(() => setAddedProductId(null), 1800);

    confetti({
      particleCount: 30,
      spread: 45,
      origin: { y: 0.8 },
      colors: ['#d97706', '#fbbf24', '#f59e0b'],
    });
  };

  return (
    <section id="catalogo" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
        <div>
          <div className="flex items-center gap-2 text-xs tracking-wider uppercase text-amber-500 mb-2">
            <span>Carta de Donas</span>
            <span aria-hidden="true">·</span>
            <span>Gualanday, Tolima</span>
            <span aria-hidden="true">·</span>
            <span>I.E. Marco Fidel Suárez</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white font-serif">
            Colección Artesanal Gourmet
          </h2>
          <p className="text-neutral-400 text-sm sm:text-base mt-2 max-w-2xl">
            Preparadas diariamente con masa madre esponjosa, chocolate real 65% y frutas seleccionadas. Sin conservantes artificiales.
          </p>
        </div>

        {/* Filter Segmented Controls */}
        <div className="flex items-center p-1 bg-[#181114] border border-white/5 rounded-2xl shrink-0 self-start md:self-auto overflow-x-auto">
          {(
            [
              { id: 'todos', label: 'Todas las Donas' },
              { id: 'individual', label: 'Individuales' },
              { id: 'caja', label: 'Cajas de 6' },
              { id: 'especial', label: 'Especiales del Chef' },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedFilter(tab.id)}
              className={`px-4 py-2 text-xs font-medium rounded-xl transition-all whitespace-nowrap ${
                selectedFilter === tab.id
                  ? 'bg-amber-500 text-black shadow-md font-semibold'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredProducts.map((product) => {
          const isJustAdded = addedProductId === product.id;

          return (
            <div
              key={product.id}
              className="group bg-[#140e10] border border-[#26191d] hover:border-amber-500/40 rounded-3xl overflow-hidden transition-all duration-300 flex flex-col hover:-translate-y-1 hover:shadow-2xl hover:shadow-amber-500/5"
            >
              {/* Image Container */}
              <div className="relative aspect-[4/3] w-full bg-neutral-900 overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                />

                {/* Subtle Text Tag (Non-pill) */}
                {product.badge && (
                  <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md border border-white/10 px-3 py-1 rounded-full text-[11px] font-medium text-amber-300">
                    {product.badge}
                  </div>
                )}

                {/* Stock indicator */}
                <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md border border-white/10 px-2.5 py-1 rounded-full text-[11px] font-mono text-neutral-300">
                  {product.stockCount} disp.
                </div>
              </div>

              {/* Content Box */}
              <div className="p-6 flex flex-col flex-grow justify-between">
                <div>
                  <div className="flex items-center gap-2 text-xs text-neutral-500 mb-2">
                    <span className="uppercase tracking-wider">{product.category}</span>
                    <span aria-hidden="true">·</span>
                    <span>{product.calories || 'Fresco de hoy'}</span>
                  </div>

                  <h3 className="text-xl font-bold text-white font-serif group-hover:text-amber-400 transition-colors">
                    {product.name}
                  </h3>

                  <p className="text-xs text-neutral-400 mt-2 line-clamp-2 leading-relaxed">
                    {product.description}
                  </p>

                  {product.highlight && (
                    <div className="mt-3 text-[11px] text-amber-400/90 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 shrink-0 text-amber-400" />
                      <span className="truncate">{product.highlight}</span>
                    </div>
                  )}
                </div>

                {/* Price and Action Footer */}
                <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-neutral-500 uppercase tracking-wider block">Precio</span>
                    <span className="text-xl font-bold font-mono text-white tabular-nums">
                      ${product.priceCOP.toLocaleString('es-CO')}{' '}
                      <span className="text-xs font-sans text-neutral-400">COP</span>
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {product.category === 'personalizada' ? (
                      <button
                        onClick={onOpenCustomStudio}
                        className="px-4 py-2.5 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-black font-semibold text-xs rounded-xl flex items-center gap-1.5 shadow-md transition-all"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Configurar 3D</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => handleQuickAdd(product)}
                        className={`px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                          isJustAdded
                            ? 'bg-emerald-500 text-black'
                            : 'bg-white/10 hover:bg-amber-500 text-white hover:text-black'
                        }`}
                      >
                        {isJustAdded ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span>¡Agregada!</span>
                          </>
                        ) : (
                          <>
                            <ShoppingBag className="w-3.5 h-3.5" />
                            <span>Pedir</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
