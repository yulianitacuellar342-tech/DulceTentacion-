import React, { useState } from 'react';
import { CartItem, CustomerVerification, Order, PaymentMethod } from '../types';
import { generateInvoicePDF } from '../utils/pdfGenerator';
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  ShieldCheck, 
  Download, 
  Send, 
  CreditCard, 
  Banknote, 
  QrCode, 
  CheckCircle2, 
  ArrowRight, 
  AlertCircle 
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface CheckoutDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemoveItem: (id: string) => void;
  onClearCart: () => void;
  verification: CustomerVerification;
  onOpenVerificationModal: () => void;
  onOrderCreated: (order: Order) => void;
}

export const CheckoutDrawer: React.FC<CheckoutDrawerProps> = ({
  isOpen,
  onClose,
  cart,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  verification,
  onOpenVerificationModal,
  onOrderCreated,
}) => {
  const [step, setStep] = useState<'cart' | 'customer' | 'payment' | 'summary' | 'confirmed'>('cart');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('nequi');
  const [pseBank, setPseBank] = useState('Bancolombia');
  const [pseDocType, setPseDocType] = useState('CC');
  const [pseDocNumber, setPseDocNumber] = useState('');
  const [orderNotes, setOrderNotes] = useState('');
  const [createdOrder, setCreatedOrder] = useState<Order | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const subtotalCOP = cart.reduce((acc, item) => acc + item.subtotalCOP, 0);
  const deliveryFeeCOP = subtotalCOP >= 30000 ? 0 : 2500;
  const discountCOP = 0;
  const totalCOP = Math.max(0, subtotalCOP + deliveryFeeCOP - discountCOP);

  const handleProceedToCustomer = () => {
    if (!verification.isVerified) {
      onOpenVerificationModal();
      return;
    }
    setStep('customer');
  };

  const handleFinalizeOrder = () => {
    if (!verification.isVerified) {
      onOpenVerificationModal();
      return;
    }

    setIsProcessing(true);
    setTimeout(() => {
      const orderNumber = `DT-2026-${Math.floor(1000 + Math.random() * 9000)}`;
      const newOrder: Order = {
        id: 'ord_' + Date.now(),
        orderNumber,
        customer: verification,
        items: [...cart],
        subtotalCOP,
        deliveryFeeCOP,
        discountCOP,
        totalCOP,
        paymentMethod,
        paymentStatus: paymentMethod === 'efectivo' ? 'contraentrega' : 'aprobado',
        status: 'recibido',
        createdAt: new Date().toISOString(),
        estimatedDeliveryTime: '30 - 45 min (Gualanday)',
        notes: orderNotes,
      };

      setCreatedOrder(newOrder);
      onOrderCreated(newOrder);
      onClearCart();
      setIsProcessing(false);
      setStep('confirmed');

      confetti({
        particleCount: 70,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#d97706', '#fbbf24', '#10b981'],
      });
    }, 1200);
  };

  const generateWhatsAppUrl = (order: Order) => {
    const itemsList = order.items
      .map((it) => `• ${it.quantity}x ${it.name} [${it.presentation}] (${it.baseGlaze || ''}) - $${it.subtotalCOP.toLocaleString('es-CO')} COP`)
      .join('%0A');

    const message = `*¡HOLA DULCE TENTACIÓN GUALANDAY!*%0A%0A` +
      `Acabo de realizar mi pedido oficial en la web:%0A` +
      `*Orden:* ${order.orderNumber}%0A` +
      `*Cliente Verificado:* ${order.customer.fullName}%0A` +
      `*Teléfono:* +57 ${order.customer.phone}%0A` +
      `*Dirección:* ${order.customer.addressGualanday}%0A%0A` +
      `*Detalle del Pedido:*%0A${itemsList}%0A%0A` +
      `*Total a Pagar:* $${order.totalCOP.toLocaleString('es-CO')} COP%0A` +
      `*Método de Pago:* ${order.paymentMethod.toUpperCase()}%0A%0A` +
      `Por favor confirmar inicio de horneado y despacho. ¡Muchas gracias!`;

    return `https://wa.me/573213610322?text=${message}`;
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/80 backdrop-blur-sm animate-fade-in flex justify-end">
      <div className="w-full max-w-md bg-[#130d10] border-l border-[#2e1d23] h-full flex flex-col justify-between shadow-2xl relative">
        {/* Drawer Header */}
        <div className="p-5 border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-amber-500" />
            <h3 className="text-lg font-bold text-white font-serif">
              {step === 'cart' && 'Tu Carrito de Donas'}
              {step === 'customer' && 'Datos de Entrega'}
              {step === 'payment' && 'Método de Pago Seguro'}
              {step === 'summary' && 'Resumen de Orden'}
              {step === 'confirmed' && '¡Orden Confirmada!'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/10 text-neutral-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Stepper Indicator */}
        <div className="px-5 py-2.5 bg-black/30 border-b border-white/5 flex items-center justify-between text-[11px] text-neutral-400 font-medium">
          <span className={step === 'cart' ? 'text-amber-400 font-bold' : ''}>1. Carrito</span>
          <span>→</span>
          <span className={step === 'customer' ? 'text-amber-400 font-bold' : ''}>2. Datos</span>
          <span>→</span>
          <span className={step === 'payment' ? 'text-amber-400 font-bold' : ''}>3. Pago</span>
          <span>→</span>
          <span className={step === 'summary' ? 'text-amber-400 font-bold' : ''}>4. Resumen</span>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {/* STEP 1: CART ITEMS */}
          {step === 'cart' && (
            <>
              {cart.length === 0 ? (
                <div className="py-20 text-center space-y-3">
                  <div className="w-16 h-16 mx-auto rounded-full bg-white/5 flex items-center justify-center text-neutral-500">
                    <ShoppingBag className="w-8 h-8" />
                  </div>
                  <p className="text-neutral-400 text-sm">Tu carrito de donas está vacío.</p>
                  <p className="text-neutral-600 text-xs">Agrega donas individuales, cajas de 6 o diseña tuya en 3D.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {cart.map((item) => (
                    <div
                      key={item.id}
                      className="p-3.5 bg-black/40 border border-white/5 rounded-2xl flex gap-3 items-center justify-between"
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        referrerPolicy="no-referrer"
                        className="w-16 h-16 rounded-xl object-cover shrink-0 border border-white/10"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-semibold text-white truncate">{item.name}</h4>
                        <div className="text-[11px] text-neutral-400 truncate">
                          {item.presentation} · {item.baseGlaze}
                        </div>
                        {item.toppings && item.toppings.length > 0 && (
                          <div className="text-[10px] text-amber-400/80 truncate">
                            +{item.toppings.join(', ')}
                          </div>
                        )}
                        <div className="text-xs font-mono font-bold text-white mt-1">
                          ${item.subtotalCOP.toLocaleString('es-CO')} COP
                        </div>
                      </div>

                      {/* Quantity Stepper */}
                      <div className="flex flex-col items-end gap-2 shrink-0">
                        <button
                          onClick={() => onRemoveItem(item.id)}
                          className="text-neutral-500 hover:text-red-400 transition-colors p-1"
                          title="Eliminar"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                        <div className="flex items-center gap-1.5 bg-neutral-900 border border-white/10 rounded-lg p-0.5">
                          <button
                            onClick={() => onUpdateQuantity(item.id, -1)}
                            className="p-1 hover:text-amber-400 text-neutral-300"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-xs font-mono font-bold w-4 text-center">{item.quantity}</span>
                          <button
                            onClick={() => onUpdateQuantity(item.id, 1)}
                            className="p-1 hover:text-amber-400 text-neutral-300"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {/* STEP 2: CUSTOMER DATA & KYC CHECK */}
          {step === 'customer' && (
            <div className="space-y-4">
              {verification.isVerified ? (
                <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl space-y-2">
                  <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider">
                    <ShieldCheck className="w-4 h-4" />
                    <span>Cliente Verificado Oficial</span>
                  </div>
                  <div className="text-sm font-semibold text-white">{verification.fullName}</div>
                  <div className="text-xs text-neutral-300">
                    <p>WhatsApp: +57 {verification.phone}</p>
                    <p>Entrega: {verification.addressGualanday}</p>
                  </div>
                </div>
              ) : (
                <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-2xl text-center space-y-3">
                  <AlertCircle className="w-8 h-8 text-amber-400 mx-auto" />
                  <div className="text-sm font-bold text-white">Verificación Requerida</div>
                  <p className="text-xs text-neutral-300">
                    Para seguridad de las transacciones financieras y entrega en Gualanday, debes verificar tu cuenta.
                  </p>
                  <button
                    onClick={onOpenVerificationModal}
                    className="w-full py-2.5 bg-amber-500 text-black font-semibold text-xs rounded-xl"
                  >
                    Verificar Ahora (1 minuto)
                  </button>
                </div>
              )}

              <div>
                <label className="block text-xs uppercase tracking-wider text-neutral-400 mb-1">
                  Notas de Entrega o Puntos de Referencia
                </label>
                <textarea
                  rows={3}
                  value={orderNotes}
                  onChange={(e) => setOrderNotes(e.target.value)}
                  placeholder="Ej. Casa de rejas blancas diagonal al parque principal, timbre fuerte."
                  className="w-full bg-[#1b1317] border border-white/10 rounded-xl p-3 text-xs text-white focus:border-amber-500 outline-none"
                />
              </div>
            </div>
          )}

          {/* STEP 3: PAYMENT METHOD */}
          {step === 'payment' && (
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="block text-xs uppercase tracking-wider text-neutral-400 mb-1">
                  Selecciona la Forma de Pago
                </label>

                {/* Nequi */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('nequi')}
                  className={`w-full p-3.5 rounded-2xl border flex items-center justify-between text-left transition-all ${
                    paymentMethod === 'nequi'
                      ? 'bg-purple-900/20 border-purple-500 text-white'
                      : 'bg-black/40 border-white/5 text-neutral-400'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-purple-600/30 flex items-center justify-center text-purple-400">
                      <QrCode className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white">Nequi (QR o Notificación)</div>
                      <div className="text-[11px] text-purple-300">321 361 0322 · Dulce Tentación</div>
                    </div>
                  </div>
                  {paymentMethod === 'nequi' && <CheckCircle2 className="w-4 h-4 text-purple-400" />}
                </button>

                {/* PSE */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('pse')}
                  className={`w-full p-3.5 rounded-2xl border flex items-center justify-between text-left transition-all ${
                    paymentMethod === 'pse'
                      ? 'bg-blue-900/20 border-blue-500 text-white'
                      : 'bg-black/40 border-white/5 text-neutral-400'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-600/30 flex items-center justify-center text-blue-400">
                      <CreditCard className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white">PSE / Débito Bancario</div>
                      <div className="text-[11px] text-blue-300">Bancolombia, Davivienda, etc.</div>
                    </div>
                  </div>
                  {paymentMethod === 'pse' && <CheckCircle2 className="w-4 h-4 text-blue-400" />}
                </button>

                {/* Cash on Delivery */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('efectivo')}
                  className={`w-full p-3.5 rounded-2xl border flex items-center justify-between text-left transition-all ${
                    paymentMethod === 'efectivo'
                      ? 'bg-emerald-900/20 border-emerald-500 text-white'
                      : 'bg-black/40 border-white/5 text-neutral-400'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-600/30 flex items-center justify-center text-emerald-400">
                      <Banknote className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white">Efectivo Contra Entrega</div>
                      <div className="text-[11px] text-emerald-300">Pagas al recibir en Gualanday</div>
                    </div>
                  </div>
                  {paymentMethod === 'efectivo' && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                </button>
              </div>

              {paymentMethod === 'pse' && (
                <div className="p-3 bg-neutral-900/60 rounded-xl space-y-2 border border-white/5 text-xs">
                  <label className="block text-neutral-400">Banco Aliado:</label>
                  <select
                    value={pseBank}
                    onChange={(e) => setPseBank(e.target.value)}
                    className="w-full bg-black border border-white/10 rounded-lg p-2 text-white outline-none"
                  >
                    <option value="Bancolombia">Bancolombia</option>
                    <option value="Davivienda">Davivienda / Daviplata</option>
                    <option value="Banco de Bogotá">Banco de Bogotá</option>
                    <option value="Nequi">Nequi</option>
                    <option value="Banco Agrario de Colombia">Banco Agrario de Colombia</option>
                  </select>
                </div>
              )}
            </div>
          )}

          {/* STEP 4: SUMMARY */}
          {step === 'summary' && (
            <div className="space-y-4">
              <div className="p-4 bg-black/40 border border-white/5 rounded-2xl text-xs space-y-2">
                <div className="flex justify-between text-neutral-400">
                  <span>Cliente:</span>
                  <span className="text-white font-medium">{verification.fullName}</span>
                </div>
                <div className="flex justify-between text-neutral-400">
                  <span>Destino:</span>
                  <span className="text-white">{verification.addressGualanday}</span>
                </div>
                <div className="flex justify-between text-neutral-400">
                  <span>Forma de Pago:</span>
                  <span className="text-amber-400 font-bold uppercase">{paymentMethod}</span>
                </div>
                <div className="flex justify-between text-neutral-400">
                  <span>Ítems a hornear:</span>
                  <span className="text-white font-mono">{cart.reduce((a, b) => a + b.quantity, 0)} donas</span>
                </div>
              </div>

              <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-[11px] text-amber-200">
                Al confirmar, tu orden será transmitida al horno artesanal de la I.E. Marco Fidel Suárez y se generará tu factura oficial en PDF.
              </div>
            </div>
          )}

          {/* STEP 5: CONFIRMED */}
          {step === 'confirmed' && createdOrder && (
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 mx-auto rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div>
                <h4 className="text-xl font-bold text-white font-serif">¡Orden Generada con Éxito!</h4>
                <p className="text-xs text-neutral-400 mt-1">Código único: <strong className="text-amber-400 font-mono">{createdOrder.orderNumber}</strong></p>
              </div>

              <div className="p-4 bg-black/50 border border-white/5 rounded-2xl text-left text-xs space-y-2">
                <div className="flex justify-between">
                  <span className="text-neutral-500">Total a Pagar:</span>
                  <span className="text-white font-bold font-mono">${createdOrder.totalCOP.toLocaleString('es-CO')} COP</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Estimado Entrega:</span>
                  <span className="text-amber-300 font-medium">{createdOrder.estimatedDeliveryTime}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Estado Inicial:</span>
                  <span className="text-emerald-400 font-semibold">1. Recibido & Verificado</span>
                </div>
              </div>

              <div className="flex flex-col gap-2 pt-2">
                <button
                  onClick={() => generateInvoicePDF(createdOrder)}
                  className="w-full py-3 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl text-xs flex items-center justify-center gap-2 transition-colors border border-white/10"
                >
                  <Download className="w-4 h-4 text-amber-400" />
                  <span>Descargar Factura Digital PDF</span>
                </button>

                <a
                  href={generateWhatsAppUrl(createdOrder)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl text-xs flex items-center justify-center gap-2 transition-colors shadow-lg shadow-emerald-600/20"
                >
                  <Send className="w-4 h-4" />
                  <span>Notificar Pedido por WhatsApp</span>
                </a>
              </div>
            </div>
          )}
        </div>

        {/* Drawer Footer & Actions */}
        {step !== 'confirmed' && (
          <div className="p-5 border-t border-white/5 bg-black/40 space-y-3">
            {/* Price Calculations */}
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between text-neutral-400">
                <span>Subtotal:</span>
                <span className="font-mono text-white">${subtotalCOP.toLocaleString('es-CO')} COP</span>
              </div>
              <div className="flex justify-between text-neutral-400">
                <span>Domicilio en Gualanday:</span>
                <span className="font-mono text-white">{deliveryFeeCOP === 0 ? 'GRATIS' : `$${deliveryFeeCOP.toLocaleString('es-CO')} COP`}</span>
              </div>
              <div className="flex justify-between text-sm font-bold text-white pt-2 border-t border-white/5">
                <span>Total:</span>
                <span className="font-mono text-amber-400">${totalCOP.toLocaleString('es-CO')} COP</span>
              </div>
            </div>

            {/* Stepper Buttons */}
            {step === 'cart' && (
              <button
                disabled={cart.length === 0}
                onClick={handleProceedToCustomer}
                className="w-full py-3.5 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-black font-semibold text-xs rounded-xl flex items-center justify-center gap-2 transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-amber-500/20"
              >
                <span>Continuar a Datos del Cliente</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}

            {step === 'customer' && (
              <div className="flex gap-2">
                <button
                  onClick={() => setStep('cart')}
                  className="w-1/3 py-3 rounded-xl bg-white/5 text-neutral-400 text-xs"
                >
                  Volver
                </button>
                <button
                  onClick={() => setStep('payment')}
                  className="w-2/3 py-3 bg-amber-500 hover:bg-amber-400 text-black font-semibold text-xs rounded-xl flex items-center justify-center gap-1.5"
                >
                  <span>Elegir Método de Pago</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {step === 'payment' && (
              <div className="flex gap-2">
                <button
                  onClick={() => setStep('customer')}
                  className="w-1/3 py-3 rounded-xl bg-white/5 text-neutral-400 text-xs"
                >
                  Volver
                </button>
                <button
                  onClick={() => setStep('summary')}
                  className="w-2/3 py-3 bg-amber-500 hover:bg-amber-400 text-black font-semibold text-xs rounded-xl flex items-center justify-center gap-1.5"
                >
                  <span>Revisar Resumen</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {step === 'summary' && (
              <div className="flex gap-2">
                <button
                  onClick={() => setStep('payment')}
                  className="w-1/3 py-3 rounded-xl bg-white/5 text-neutral-400 text-xs"
                >
                  Volver
                </button>
                <button
                  disabled={isProcessing}
                  onClick={handleFinalizeOrder}
                  className="w-2/3 py-3 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-semibold text-xs rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20"
                >
                  {isProcessing ? 'Confirmando...' : 'Confirmar Pedido y Factura'}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
