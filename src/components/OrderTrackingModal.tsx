import React, { useState, useEffect } from 'react';
import { Order, OrderStatus } from '../types';
import { generateInvoicePDF } from '../utils/pdfGenerator';
import { 
  X, 
  Flame, 
  Sparkles, 
  Package, 
  Bike, 
  CheckCircle2, 
  Download, 
  Clock, 
  MapPin, 
  PhoneCall, 
  ShieldCheck,
  ChevronRight
} from 'lucide-react';

interface OrderTrackingModalProps {
  isOpen: boolean;
  onClose: () => void;
  orders: Order[];
  onUpdateOrderStatus: (orderId: string, newStatus: OrderStatus) => void;
}

const TRACKING_STEPS: { status: OrderStatus; label: string; desc: string; icon: any }[] = [
  { 
    status: 'recibido', 
    label: 'Orden Verificada', 
    desc: 'Validada por sistema seguro con token KYC.', 
    icon: ShieldCheck 
  },
  { 
    status: 'horneando', 
    label: 'Horneado Artesanal', 
    desc: 'Masa esponjosa levando y dorándose en hornos de la I.E. Marco Fidel Suárez.', 
    icon: Flame 
  },
  { 
    status: 'decorando', 
    label: 'Glaseado de Autor', 
    desc: 'Aplicando coberturas de chocolate real y lluvia de toppings seleccionados.', 
    icon: Sparkles 
  },
  { 
    status: 'empaquetando', 
    label: 'Empaque de Lujo', 
    desc: 'Control de higiene y sellado en caja con ventana protectora cristalina.', 
    icon: Package 
  },
  { 
    status: 'en_camino', 
    label: 'En Camino por Gualanday', 
    desc: 'Repartidor local en ruta a tu dirección en Tolima.', 
    icon: Bike 
  },
  { 
    status: 'entregado', 
    label: '¡Entregado!', 
    desc: 'Donas tibias listas para disfrutar y compartir.', 
    icon: CheckCircle2 
  },
];

export const OrderTrackingModal: React.FC<OrderTrackingModalProps> = ({
  isOpen,
  onClose,
  orders,
  onUpdateOrderStatus,
}) => {
  const [selectedOrderIndex, setSelectedOrderIndex] = useState(0);

  if (!isOpen) return null;

  const currentOrder = orders[selectedOrderIndex] || orders[0];

  const getStepIndex = (status: OrderStatus) => {
    const idx = TRACKING_STEPS.findIndex((s) => s.status === status);
    return idx === -1 ? 0 : idx;
  };

  const currentStepIdx = currentOrder ? getStepIndex(currentOrder.status) : 0;

  const advanceStep = () => {
    if (!currentOrder) return;
    const nextIdx = Math.min(TRACKING_STEPS.length - 1, currentStepIdx + 1);
    const nextStatus = TRACKING_STEPS[nextIdx].status;
    onUpdateOrderStatus(currentOrder.id, nextStatus);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="bg-[#140e11] border border-[#2e1f24] w-full max-w-2xl rounded-3xl p-6 sm:p-8 text-white relative shadow-2xl max-h-[90vh] flex flex-col justify-between overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <Bike className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-bold font-serif text-white">Rastreo en Vivo de tu Orden</h3>
              <p className="text-xs text-neutral-400">Desde la masa artesanal hasta tu mesa en Gualanday</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Order Selector (if multiple) */}
        {orders.length > 1 && (
          <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
            {orders.map((ord, idx) => (
              <button
                key={ord.id}
                onClick={() => setSelectedOrderIndex(idx)}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono transition-all whitespace-nowrap ${
                  idx === selectedOrderIndex
                    ? 'bg-amber-500 text-black font-bold'
                    : 'bg-white/5 text-neutral-400 hover:text-white'
                }`}
              >
                {ord.orderNumber}
              </button>
            ))}
          </div>
        )}

        {!currentOrder ? (
          <div className="py-16 text-center space-y-3">
            <Clock className="w-10 h-10 text-neutral-500 mx-auto" />
            <div className="text-sm font-semibold text-neutral-300">No hay órdenes activas registradas aún.</div>
            <p className="text-xs text-neutral-500">Realiza tu pedido en el catálogo o personalizador 3D para seguirlo aquí en tiempo real.</p>
          </div>
        ) : (
          <div className="my-6 space-y-6">
            {/* Order Highlight Card */}
            <div className="bg-black/40 border border-white/5 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-amber-400 font-mono font-bold tracking-wider">{currentOrder.orderNumber}</span>
                  <span className="text-xs text-neutral-500">·</span>
                  <span className="text-xs text-neutral-400">{new Date(currentOrder.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
                <div className="text-base font-bold text-white mt-1">
                  Destino: {currentOrder.customer.addressGualanday}
                </div>
                <div className="text-xs text-neutral-400 mt-0.5">
                  Cliente: <strong className="text-neutral-200">{currentOrder.customer.fullName}</strong> (+57 {currentOrder.customer.phone})
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-center">
                <button
                  onClick={() => generateInvoicePDF(currentOrder)}
                  className="px-3.5 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs text-neutral-200 flex items-center gap-1.5 transition-colors"
                >
                  <Download className="w-3.5 h-3.5 text-amber-400" />
                  <span>Factura PDF</span>
                </button>
              </div>
            </div>

            {/* Stepper Progress Bar */}
            <div className="space-y-4">
              <div className="text-xs uppercase tracking-wider text-neutral-400 font-semibold flex items-center justify-between">
                <span>Estado de Elaboración & Reparto</span>
                <span className="text-amber-400 font-mono">
                  Paso {currentStepIdx + 1} de {TRACKING_STEPS.length}
                </span>
              </div>

              <div className="space-y-3">
                {TRACKING_STEPS.map((step, idx) => {
                  const isCompleted = idx <= currentStepIdx;
                  const isCurrent = idx === currentStepIdx;
                  const StepIcon = step.icon;

                  return (
                    <div
                      key={step.status}
                      className={`p-3.5 rounded-2xl border transition-all flex items-center gap-3.5 ${
                        isCurrent
                          ? 'bg-amber-500/10 border-amber-500/50 shadow-lg shadow-amber-500/5'
                          : isCompleted
                          ? 'bg-black/30 border-white/5 text-neutral-400'
                          : 'bg-black/10 border-white/5 opacity-40'
                      }`}
                    >
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                          isCurrent
                            ? 'bg-amber-500 text-black font-bold animate-pulse'
                            : isCompleted
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : 'bg-white/5 text-neutral-500'
                        }`}
                      >
                        <StepIcon className="w-4 h-4" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className={`text-xs font-bold ${isCurrent ? 'text-amber-300' : isCompleted ? 'text-white' : 'text-neutral-500'}`}>
                            {step.label}
                          </h4>
                          {isCurrent && (
                            <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full font-mono">
                              En Proceso
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-neutral-400 truncate mt-0.5">{step.desc}</p>
                      </div>

                      {isCompleted && !isCurrent && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Simulation controls for demo */}
            <div className="p-3 bg-neutral-900/60 rounded-xl border border-white/5 flex items-center justify-between">
              <span className="text-[11px] text-neutral-400">¿Quieres probar la progresión en vivo?</span>
              <button
                onClick={advanceStep}
                disabled={currentStepIdx >= TRACKING_STEPS.length - 1}
                className="px-3 py-1.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors disabled:opacity-30"
              >
                <span>Avanzar Estado</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* Footer Support */}
        <div className="pt-4 border-t border-white/5 flex items-center justify-between text-xs text-neutral-400">
          <span>Central de Pedidos Gualanday:</span>
          <a
            href="https://wa.me/573213610322"
            target="_blank"
            rel="noopener noreferrer"
            className="text-amber-400 hover:underline font-mono font-bold"
          >
            +57 321 361 0322
          </a>
        </div>
      </div>
    </div>
  );
};
