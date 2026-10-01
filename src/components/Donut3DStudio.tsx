import React, { useState, useRef, useEffect } from 'react';
import { BaseGlaze, Topping, Sauce, CustomDonutConfig, CartItem } from '../types';
import { Sparkles, ShoppingBag, RotateCw, Check, Layers, Droplet } from 'lucide-react';
import confetti from 'canvas-confetti';

interface Donut3DStudioProps {
  onAddToCart: (item: CartItem) => void;
  onOpenCart: () => void;
}

const BASE_COLORS: Record<BaseGlaze, { main: string; highlight: string; shadow: string; name: string }> = {
  Chocolate: { main: '#3a2014', highlight: '#5c3523', shadow: '#22110a', name: 'Chocolate Belga 65%' },
  Menta: { main: '#5eead4', highlight: '#99f6e4', shadow: '#14b8a6', name: 'Menta Glaseada Fría' },
  Fresa: { main: '#fb7185', highlight: '#fda4af', shadow: '#e11d48', name: 'Fresa Silvestre Dulce' },
  Arequipe: { main: '#c27803', highlight: '#eab308', shadow: '#854d0e', name: 'Arequipe Tolimense' },
  Mora: { main: '#701a75', highlight: '#a21caf', shadow: '#4a044e', name: 'Mora de la Cordillera' },
};

const TOPPING_ITEMS: { id: Topping; name: string; color: string; desc: string }[] = [
  { id: 'Chispas', name: 'Chispas de Colores', color: '#f43f5e', desc: 'Arcoíris crocante' },
  { id: 'Maní', name: 'Maní Tostado', color: '#d97706', desc: 'Granillo tostado' },
  { id: 'Oreo', name: 'Oreo Triturada', color: '#18181b', desc: 'Galleta negra artesanal' },
  { id: 'Coco', name: 'Coco Rallado', color: '#f8fafc', desc: 'Copos naturales' },
  { id: 'Gomitas', name: 'Gomitas Dulces', color: '#10b981', desc: 'Gemas masticables' },
  { id: 'Masmelos', name: 'Mini Masmelos', color: '#fbcfe8', desc: 'Nubes esponjosas' },
  { id: 'Frutas', name: 'Frutas Frescas', color: '#ef4444', desc: 'Fresas y arándanos' },
  { id: 'Nutella', name: 'Nutella Swirl', color: '#451a03', desc: 'Avellanas cremosas' },
  { id: 'Almendras', name: 'Almendras Tostadas', color: '#eab308', desc: 'Laminadas crujientes' },
];

const SAUCE_ITEMS: { id: Sauce; name: string; color: string; price: number }[] = [
  { id: 'Chocolate', name: 'Sirope de Chocolate', color: '#271206', price: 1500 },
  { id: 'Arequipe', name: 'Dulce de Leche / Arequipe', color: '#b45309', price: 1500 },
  { id: 'Fresa', name: 'Couli de Fresa Natural', color: '#be123c', price: 1500 },
  { id: 'Maracuyá', name: 'Reducción de Maracuyá', color: '#ca8a04', price: 1500 },
  { id: 'Lechera', name: 'Leche Condensada Artesanal', color: '#fef08a', price: 1500 },
];

export const Donut3DStudio: React.FC<Donut3DStudioProps> = ({ onAddToCart, onOpenCart }) => {
  const [presentation, setPresentation] = useState<'Individual' | 'Caja 6 Unidades' | 'Personalizada'>('Personalizada');
  const [baseGlaze, setBaseGlaze] = useState<BaseGlaze>('Chocolate');
  const [selectedToppings, setSelectedToppings] = useState<Topping[]>(['Oreo', 'Almendras']);
  const [selectedSauce, setSelectedSauce] = useState<Sauce | null>('Arequipe');
  const [rotationAngle, setRotationAngle] = useState(25);
  const [tiltAngle, setTiltAngle] = useState(48);
  const [isRotating, setIsRotating] = useState(true);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Auto rotation loop
  useEffect(() => {
    if (!isRotating) return;
    const interval = setInterval(() => {
      setRotationAngle((prev) => (prev + 0.5) % 360);
    }, 30);
    return () => clearInterval(interval);
  }, [isRotating]);

  // Calculate Subtotal
  const basePrice = presentation === 'Caja 6 Unidades' ? 25000 : 5000;
  const saucePrice = selectedSauce ? 1500 : 0;
  const totalPrice = basePrice + saucePrice;

  // Render 3D Donut onto HTML5 Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    ctx.clearRect(0, 0, width, height);

    const centerX = width / 2;
    const centerY = height / 2 + 10;
    const outerRadius = 145;
    const innerRadius = 55;
    const radRotation = (rotationAngle * Math.PI) / 180;
    const radTilt = (tiltAngle * Math.PI) / 180;

    // 1. Shadow beneath donut on ceramic table
    ctx.save();
    ctx.beginPath();
    ctx.ellipse(centerX, centerY + 90, outerRadius * 1.15, outerRadius * 0.4, 0, 0, Math.PI * 2);
    const shadowGrad = ctx.createRadialGradient(centerX, centerY + 90, 20, centerX, centerY + 90, outerRadius * 1.2);
    shadowGrad.addColorStop(0, 'rgba(0, 0, 0, 0.65)');
    shadowGrad.addColorStop(0.6, 'rgba(15, 10, 12, 0.4)');
    shadowGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = shadowGrad;
    ctx.fill();
    ctx.restore();

    // 2. Donut Dough Base (Golden fried artisanal dough)
    ctx.save();
    ctx.translate(centerX, centerY);

    // Bottom dough extrusion
    ctx.beginPath();
    const doughRadiusX = outerRadius;
    const doughRadiusY = outerRadius * Math.sin(radTilt);
    ctx.ellipse(0, 22, doughRadiusX, doughRadiusY, 0, 0, Math.PI * 2);
    const doughGrad = ctx.createLinearGradient(0, -doughRadiusY, 0, doughRadiusY + 25);
    doughGrad.addColorStop(0, '#c7823f');
    doughGrad.addColorStop(0.5, '#995924');
    doughGrad.addColorStop(1, '#572e0d');
    ctx.fillStyle = doughGrad;
    ctx.fill();

    // Inner hole bottom dough
    ctx.beginPath();
    ctx.ellipse(0, 22, innerRadius, innerRadius * Math.sin(radTilt), 0, 0, Math.PI * 2);
    ctx.fillStyle = '#221308';
    ctx.fill();

    // 3. Glaze Layer (Main colored luxury glaze with reflections)
    const glazeColors = BASE_COLORS[baseGlaze];
    ctx.beginPath();
    ctx.ellipse(0, 0, doughRadiusX, doughRadiusY, 0, 0, Math.PI * 2);
    ctx.ellipse(0, 0, innerRadius, innerRadius * Math.sin(radTilt), 0, 0, Math.PI * 2);

    const glazeGrad = ctx.createRadialGradient(-30, -30, innerRadius, 0, 0, outerRadius);
    glazeGrad.addColorStop(0, glazeColors.highlight);
    glazeGrad.addColorStop(0.5, glazeColors.main);
    glazeGrad.addColorStop(1, glazeColors.shadow);
    ctx.fillStyle = glazeGrad;
    ctx.fill('evenodd');

    // 4. Glaze Specular Highlights (Glossy luxury sheen)
    ctx.beginPath();
    ctx.ellipse(-35, -28, doughRadiusX * 0.65, doughRadiusY * 0.45, -0.2, 0, Math.PI * 2);
    const specularGrad = ctx.createRadialGradient(-35, -28, 5, -35, -28, doughRadiusX * 0.65);
    specularGrad.addColorStop(0, 'rgba(255, 255, 255, 0.45)');
    specularGrad.addColorStop(0.4, 'rgba(255, 255, 255, 0.15)');
    specularGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
    ctx.fillStyle = specularGrad;
    ctx.fill();

    // 5. Toppings Rendering based on selected items
    const numPoints = 65;
    selectedToppings.forEach((topping, toppingIdx) => {
      for (let i = 0; i < numPoints; i++) {
        // Distribute mathematically around the torus ring with seeded pseudo-randomness
        const angle = ((i * 137.5) * Math.PI) / 180 + radRotation + toppingIdx;
        const radiusDist = innerRadius + 22 + (Math.sin(i * 3.7 + toppingIdx) * 0.5 + 0.5) * (outerRadius - innerRadius - 40);
        const x = Math.cos(angle) * radiusDist;
        const y = Math.sin(angle) * radiusDist * Math.sin(radTilt) - 2;

        if (topping === 'Chispas') {
          // Rainbow sprinkles
          const sprinkleColors = ['#f43f5e', '#3b82f6', '#10b981', '#fbbf24', '#f472b6', '#a855f7'];
          const sprColor = sprinkleColors[i % sprinkleColors.length];
          const sprAngle = (i * 47 * Math.PI) / 180;
          ctx.save();
          ctx.translate(x, y);
          ctx.rotate(sprAngle);
          ctx.fillStyle = sprColor;
          ctx.shadowColor = 'rgba(0,0,0,0.4)';
          ctx.shadowBlur = 3;
          ctx.fillRect(-6, -1.8, 12, 3.6);
          ctx.restore();
        } else if (topping === 'Oreo') {
          // Dark crumbled cookie chunks
          ctx.save();
          ctx.translate(x, y);
          ctx.fillStyle = i % 2 === 0 ? '#18181b' : '#27272a';
          ctx.beginPath();
          ctx.arc(0, 0, 3.5 + (i % 3), 0, Math.PI * 2);
          ctx.fill();
          if (i % 4 === 0) {
            ctx.fillStyle = '#ffffff';
            ctx.arc(1.5, 1, 1.2, 0, Math.PI * 2);
            ctx.fill();
          }
          ctx.restore();
        } else if (topping === 'Almendras') {
          // Sliced golden toasted almonds
          ctx.save();
          ctx.translate(x, y);
          ctx.rotate(((i * 70) * Math.PI) / 180);
          ctx.beginPath();
          ctx.ellipse(0, 0, 8, 3.5, 0, 0, Math.PI * 2);
          ctx.fillStyle = '#eab308';
          ctx.strokeStyle = '#854d0e';
          ctx.lineWidth = 1;
          ctx.fill();
          ctx.stroke();
          ctx.restore();
        } else if (topping === 'Maní') {
          // Crunchy golden peanut crumbles
          ctx.save();
          ctx.translate(x, y);
          ctx.fillStyle = '#d97706';
          ctx.beginPath();
          ctx.arc(0, 0, 3.5, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        } else if (topping === 'Gomitas') {
          // Translucent colorful jelly gems
          const gummyColors = ['rgba(16, 185, 129, 0.85)', 'rgba(239, 68, 68, 0.85)', 'rgba(245, 158, 11, 0.85)'];
          ctx.save();
          ctx.translate(x, y);
          ctx.fillStyle = gummyColors[i % gummyColors.length];
          ctx.beginPath();
          ctx.roundRect(-4, -4, 8, 8, 3);
          ctx.fill();
          ctx.restore();
        } else if (topping === 'Masmelos') {
          // Soft fluffy mini marshmallows
          ctx.save();
          ctx.translate(x, y);
          ctx.fillStyle = i % 2 === 0 ? '#ffffff' : '#fbcfe8';
          ctx.beginPath();
          ctx.roundRect(-5, -4, 10, 8, 2);
          ctx.fill();
          ctx.restore();
        } else if (topping === 'Frutas') {
          // Fresh strawberry / berry slices
          ctx.save();
          ctx.translate(x, y);
          ctx.fillStyle = '#dc2626';
          ctx.beginPath();
          ctx.moveTo(0, -6);
          ctx.lineTo(6, 4);
          ctx.lineTo(-6, 4);
          ctx.closePath();
          ctx.fill();
          ctx.restore();
        } else if (topping === 'Coco') {
          // Shredded white coconut flakes
          ctx.save();
          ctx.translate(x, y);
          ctx.rotate(((i * 33) * Math.PI) / 180);
          ctx.fillStyle = '#f8fafc';
          ctx.fillRect(-4, -1, 8, 1.8);
          ctx.restore();
        } else if (topping === 'Nutella') {
          // Hazelnut swirl drops
          ctx.save();
          ctx.translate(x, y);
          ctx.fillStyle = '#451a03';
          ctx.beginPath();
          ctx.arc(0, 0, 4.5, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }
      }
    });

    // 6. Dripping Sauce Layer (Gourmet artisanal drizzle)
    if (selectedSauce) {
      const sauceColor = SAUCE_ITEMS.find((s) => s.id === selectedSauce)?.color || '#271206';
      ctx.save();
      ctx.strokeStyle = sauceColor;
      ctx.lineWidth = 6;
      ctx.lineCap = 'round';
      ctx.shadowColor = 'rgba(0,0,0,0.5)';
      ctx.shadowBlur = 4;

      // Elegant zig-zag swirls across the donut
      ctx.beginPath();
      const waveCount = 14;
      for (let j = 0; j <= waveCount; j++) {
        const t = j / waveCount;
        const ang = t * Math.PI * 2 + radRotation * 0.5;
        const radOsc = innerRadius + 20 + Math.sin(t * Math.PI * 8) * 35;
        const sx = Math.cos(ang) * radOsc;
        const sy = Math.sin(ang) * radOsc * Math.sin(radTilt);

        if (j === 0) ctx.moveTo(sx, sy);
        else ctx.lineTo(sx, sy);
      }
      ctx.stroke();
      ctx.restore();
    }

    ctx.restore();
  }, [baseGlaze, selectedToppings, selectedSauce, rotationAngle, tiltAngle]);

  const toggleTopping = (topping: Topping) => {
    setSelectedToppings((prev) =>
      prev.includes(topping) ? prev.filter((t) => t !== topping) : [...prev, topping]
    );
  };

  const handleAddToCart = () => {
    const newItem: CartItem = {
      id: 'custom_' + Date.now(),
      productId: 'prod_personalizada',
      name: `Dona de Autor (${baseGlaze})`,
      presentation,
      baseGlaze,
      toppings: selectedToppings,
      sauce: selectedSauce,
      unitPriceCOP: totalPrice,
      quantity: 1,
      subtotalCOP: totalPrice,
      image: '/src/assets/images/donut_custom_craft_1790823121418.jpg',
      notes: `Glaseado ${baseGlaze} con ${selectedToppings.join(', ')}${selectedSauce ? ` y salsa ${selectedSauce}` : ''}`,
    };

    onAddToCart(newItem);

    // Festive gourmet confetti
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.7 },
      colors: ['#d97706', '#fb7185', '#38bdf8', '#fbbf24', '#fbcfe8'],
    });

    onOpenCart();
  };

  return (
    <section id="personalizador" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Editorial Header */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <div className="flex items-center justify-center gap-2 text-xs tracking-wider uppercase text-amber-500 mb-2">
          <span>Estudio Gourmet 3D</span>
          <span aria-hidden="true">·</span>
          <span>Personalización en Vivo</span>
          <span aria-hidden="true">·</span>
          <span>Gualanday, Tolima</span>
        </div>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white mb-4">
          Diseña tu Dona Única en 3D
        </h2>
        <p className="text-neutral-400 text-sm sm:text-base">
          Elige tu masa artesanal, cobertura con brillo de espejo, tus toppings crujientes favoritos y salsa gourmet. El horneado se realiza al instante de confirmar tu orden.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-[#151012] border border-[#2a1e22] rounded-3xl p-6 lg:p-8 shadow-2xl">
        {/* Left: 3D Donut Canvas Visualizer */}
        <div className="lg:col-span-6 flex flex-col items-center justify-center relative bg-gradient-to-b from-[#1a1216] to-[#0d090a] rounded-2xl p-4 sm:p-8 border border-white/5 overflow-hidden">
          {/* Subtle Ambient Lighting Aura */}
          <div 
            className="absolute w-72 h-72 rounded-full blur-3xl opacity-25 pointer-events-none transition-colors duration-700"
            style={{ backgroundColor: BASE_COLORS[baseGlaze].main }}
          />

          {/* Interactive Badge */}
          <div className="absolute top-4 left-4 z-10 flex items-center gap-2 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 text-xs text-neutral-300">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Motor 3D Interactivo</span>
          </div>

          <button
            onClick={() => setIsRotating(!isRotating)}
            className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-neutral-300 hover:text-white transition-colors"
            title="Pausar o reanudar rotación"
          >
            <RotateCw className={`w-4 h-4 ${isRotating ? 'animate-spin' : ''}`} style={{ animationDuration: '6s' }} />
          </button>

          {/* Canvas */}
          <canvas
            ref={canvasRef}
            width={440}
            height={380}
            className="w-full max-w-[400px] h-auto cursor-grab active:cursor-grabbing select-none"
            onMouseMove={(e) => {
              if (e.buttons === 1) {
                setIsRotating(false);
                setRotationAngle((prev) => (prev + e.movementX * 0.8) % 360);
              }
            }}
            onTouchMove={(e) => {
              if (e.touches.length > 0) {
                setIsRotating(false);
                setRotationAngle((prev) => (prev + 2) % 360);
              }
            }}
          />

          {/* 3D Controls Bar */}
          <div className="w-full mt-4 flex items-center justify-between text-xs text-neutral-400 bg-black/40 px-4 py-2 rounded-xl border border-white/5">
            <span className="truncate">Arrastra para rotar la dona 360º</span>
            <div className="flex items-center gap-2">
              <span>Inclinación:</span>
              <input
                type="range"
                min="30"
                max="70"
                value={tiltAngle}
                onChange={(e) => setTiltAngle(Number(e.target.value))}
                className="w-20 accent-amber-500 cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Right: Customization Controls */}
        <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
          {/* Step 1: Presentation */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs uppercase tracking-wider font-semibold text-neutral-300">
                1. Presentación
              </label>
              <span className="text-xs text-amber-400 font-mono">
                {presentation === 'Caja 6 Unidades' ? '$25.000 COP' : '$5.000 COP'}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {(['Individual', 'Caja 6 Unidades', 'Personalizada'] as const).map((p) => (
                <button
                  key={p}
                  onClick={() => setPresentation(p)}
                  className={`py-2.5 px-3 rounded-xl text-xs font-medium border text-center transition-all ${
                    presentation === p
                      ? 'bg-amber-500/10 border-amber-500 text-amber-300 shadow-sm'
                      : 'bg-neutral-900/60 border-white/5 text-neutral-400 hover:border-white/20'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          {/* Step 2: Base Glaze */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs uppercase tracking-wider font-semibold text-neutral-300">
                2. Cobertura Base
              </label>
              <span className="text-xs text-neutral-400">{BASE_COLORS[baseGlaze].name}</span>
            </div>
            <div className="grid grid-cols-5 gap-2">
              {(['Chocolate', 'Arequipe', 'Fresa', 'Mora', 'Menta'] as BaseGlaze[]).map((base) => {
                const isSelected = baseGlaze === base;
                return (
                  <button
                    key={base}
                    onClick={() => setBaseGlaze(base)}
                    className={`flex flex-col items-center gap-1.5 p-2 rounded-xl border text-center transition-all ${
                      isSelected
                        ? 'bg-white/10 border-amber-500 text-white'
                        : 'bg-neutral-900/50 border-white/5 text-neutral-400 hover:border-white/20'
                    }`}
                  >
                    <span
                      className="w-6 h-6 rounded-full shadow-inner border border-white/20"
                      style={{ backgroundColor: BASE_COLORS[base].main }}
                    />
                    <span className="text-[11px] font-medium truncate w-full">{base}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 3: Toppings */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs uppercase tracking-wider font-semibold text-neutral-300">
                3. Toppings Crujientes
              </label>
              <span className="text-xs text-neutral-400">
                {selectedToppings.length} seleccionados
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2 max-h-40 overflow-y-auto pr-1">
              {TOPPING_ITEMS.map((t) => {
                const isSelected = selectedToppings.includes(t.id);
                return (
                  <button
                    key={t.id}
                    onClick={() => toggleTopping(t.id)}
                    className={`flex items-center justify-between p-2 rounded-xl border text-left transition-all ${
                      isSelected
                        ? 'bg-amber-500/15 border-amber-500 text-amber-200'
                        : 'bg-neutral-900/40 border-white/5 text-neutral-400 hover:border-white/20'
                    }`}
                  >
                    <div className="truncate">
                      <div className="text-xs font-medium truncate">{t.name}</div>
                      <div className="text-[10px] text-neutral-500 truncate">{t.desc}</div>
                    </div>
                    {isSelected && <Check className="w-3.5 h-3.5 text-amber-400 shrink-0 ml-1" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 4: Gourmet Sauce (+$1.500) */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs uppercase tracking-wider font-semibold text-neutral-300">
                4. Salsa Gourmet de Autor (+$1.500 COP)
              </label>
              <span className="text-xs text-amber-400 font-mono">
                {selectedSauce ? '+$1.500 COP' : 'Ninguna'}
              </span>
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
              {SAUCE_ITEMS.map((s) => {
                const isSelected = selectedSauce === s.id;
                return (
                  <button
                    key={s.id}
                    onClick={() => setSelectedSauce(isSelected ? null : s.id)}
                    className={`p-2 rounded-xl border text-center transition-all ${
                      isSelected
                        ? 'bg-amber-500/20 border-amber-500 text-amber-200'
                        : 'bg-neutral-900/40 border-white/5 text-neutral-400 hover:border-white/20'
                    }`}
                  >
                    <div className="text-xs font-medium truncate">{s.id}</div>
                    <div className="text-[10px] text-amber-400/80 font-mono">+1.5k</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Subtotal & Add Button */}
          <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <div className="text-xs text-neutral-400">Total Configuración:</div>
              <div className="text-2xl font-bold font-mono text-white">
                ${totalPrice.toLocaleString('es-CO')} <span className="text-xs text-neutral-400 font-sans">COP</span>
              </div>
            </div>

            <button
              onClick={handleAddToCart}
              className="w-full sm:w-auto px-6 py-3.5 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-black font-semibold text-sm rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-amber-500/20 active:scale-[0.98]"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Agregar Mi Creación</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
