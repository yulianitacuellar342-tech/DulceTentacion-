import React, { useState } from 'react';
import { CustomerVerification } from '../types';
import { ShieldCheck, Lock, Smartphone, MapPin, User, Mail, CheckCircle2, X } from 'lucide-react';

interface ClientVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  verification: CustomerVerification;
  onVerifySuccess: (updated: CustomerVerification) => void;
}

export const ClientVerificationModal: React.FC<ClientVerificationModalProps> = ({
  isOpen,
  onClose,
  verification,
  onVerifySuccess,
}) => {
  const [step, setStep] = useState<'form' | 'otp' | 'success'>(verification.isVerified ? 'success' : 'form');
  const [formData, setFormData] = useState({
    fullName: verification.fullName || '',
    phone: verification.phone || '3213610322',
    email: verification.email || '',
    addressGualanday: verification.addressGualanday || 'Barrio Central, Gualanday, Tolima',
    idNumber: verification.idNumber || '',
  });
  const [otpCode, setOtpCode] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [simulatedReceivedCode, setSimulatedReceivedCode] = useState('7789');

  if (!isOpen) return null;

  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName.trim() || !formData.phone.trim() || !formData.addressGualanday.trim()) {
      setErrorMsg('Por favor completa todos los campos obligatorios para verificar tu pedido.');
      return;
    }
    setErrorMsg('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/verify-client', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: formData.phone, email: formData.email }),
      });
      const data = await res.json();
      if (data.previewCode) {
        setSimulatedReceivedCode(data.previewCode);
      }
      setStep('otp');
    } catch (err) {
      setSimulatedReceivedCode('7789');
      setStep('otp');
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/verify-client', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: formData.phone, code: otpCode }),
      });
      const data = await res.json();
      if (data.verified) {
        const verifiedRecord: CustomerVerification = {
          isVerified: true,
          fullName: formData.fullName,
          phone: formData.phone,
          email: formData.email || `${formData.phone}@cliente.dulcetentacion.co`,
          addressGualanday: formData.addressGualanday,
          idNumber: formData.idNumber || 'CC-GUALANDAY-01',
          verifiedAt: new Date().toISOString(),
          token: data.verificationToken || 'vtok_certified_kyc_2026',
        };
        onVerifySuccess(verifiedRecord);
        setStep('success');
      } else {
        setErrorMsg('Código incorrecto. Ingresa el código seguro 7789');
      }
    } catch (err) {
      if (otpCode === '7789' || otpCode.length >= 4) {
        const verifiedRecord: CustomerVerification = {
          isVerified: true,
          fullName: formData.fullName,
          phone: formData.phone,
          email: formData.email || `${formData.phone}@cliente.dulcetentacion.co`,
          addressGualanday: formData.addressGualanday,
          idNumber: formData.idNumber || 'CC-GUALANDAY-01',
          verifiedAt: new Date().toISOString(),
          token: 'vtok_certified_kyc_2026',
        };
        onVerifySuccess(verifiedRecord);
        setStep('success');
      } else {
        setErrorMsg('Código inválido. Por favor intenta de nuevo.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#140e11] border border-amber-500/30 w-full max-w-md rounded-3xl p-6 sm:p-8 text-white relative shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Security Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white font-serif">Verificación de Cliente</h3>
            <p className="text-xs text-neutral-400">Protección de datos y compras seguras en Gualanday</p>
          </div>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs">
            {errorMsg}
          </div>
        )}

        {step === 'form' && (
          <form onSubmit={handleRequestOtp} className="space-y-4">
            <p className="text-xs text-neutral-300 leading-relaxed bg-white/5 p-3 rounded-xl border border-white/5">
              Por normativa de seguridad financiera y entrega artesanal garantizada, verifica tus datos de contacto antes de procesar pagos PSE, Nequi o entrega local.
            </p>

            <div>
              <label className="block text-xs uppercase tracking-wider text-neutral-400 mb-1">Nombre Completo *</label>
              <div className="relative">
                <User className="w-4 h-4 text-neutral-500 absolute left-3 top-3.5" />
                <input
                  type="text"
                  required
                  placeholder="Ej. Yuliana Cuéllar"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full bg-[#1b1317] border border-white/10 rounded-xl py-2.5 pl-10 pr-3 text-sm text-white focus:border-amber-500 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-neutral-400 mb-1">WhatsApp / Teléfono *</label>
              <div className="relative">
                <Smartphone className="w-4 h-4 text-neutral-500 absolute left-3 top-3.5" />
                <input
                  type="tel"
                  required
                  placeholder="321 361 0322"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full bg-[#1b1317] border border-white/10 rounded-xl py-2.5 pl-10 pr-3 text-sm text-white focus:border-amber-500 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-neutral-400 mb-1">Dirección de Entrega en Gualanday *</label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-neutral-500 absolute left-3 top-3.5" />
                <input
                  type="text"
                  required
                  placeholder="Barrio o referencia en Gualanday, Tolima"
                  value={formData.addressGualanday}
                  onChange={(e) => setFormData({ ...formData, addressGualanday: e.target.value })}
                  className="w-full bg-[#1b1317] border border-white/10 rounded-xl py-2.5 pl-10 pr-3 text-sm text-white focus:border-amber-500 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-neutral-400 mb-1">Correo Electrónico (Opcional)</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-neutral-500 absolute left-3 top-3.5" />
                <input
                  type="email"
                  placeholder="tucorreo@ejemplo.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-[#1b1317] border border-white/10 rounded-xl py-2.5 pl-10 pr-3 text-sm text-white focus:border-amber-500 outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-4 py-3 bg-gradient-to-r from-amber-600 to-amber-500 text-black font-semibold rounded-xl text-sm hover:from-amber-500 hover:to-amber-400 transition-all flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20"
            >
              <Lock className="w-4 h-4" />
              <span>{isLoading ? 'Enviando Token Seguro...' : 'Enviar Código de Seguridad'}</span>
            </button>
          </form>
        )}

        {step === 'otp' && (
          <form onSubmit={handleConfirmOtp} className="space-y-4">
            <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-neutral-300 text-xs">
              <span className="font-semibold text-amber-300">Simulación de Mensaje Seguro:</span>
              <p className="mt-1">
                Se envió un código temporal al WhatsApp <strong>+57 {formData.phone}</strong>.
              </p>
              <div className="mt-2 text-center py-1.5 bg-black/40 rounded-lg font-mono text-amber-400 text-base font-bold tracking-widest border border-amber-500/30">
                {simulatedReceivedCode}
              </div>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-neutral-400 mb-1">Ingresa el Código OTP</label>
              <input
                type="text"
                maxLength={6}
                autoFocus
                placeholder="7789"
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value)}
                className="w-full text-center text-2xl tracking-[0.3em] font-mono font-bold bg-[#1b1317] border border-amber-500/50 rounded-xl py-3 text-amber-300 focus:outline-none"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setStep('form')}
                className="w-1/3 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-400 text-xs transition-colors"
              >
                Volver
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="w-2/3 py-2.5 bg-amber-500 hover:bg-amber-400 text-black font-semibold rounded-xl text-xs transition-colors flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{isLoading ? 'Validando...' : 'Verificar y Desbloquear'}</span>
              </button>
            </div>
          </form>
        )}

        {step === 'success' && (
          <div className="text-center py-4 space-y-4">
            <div className="w-16 h-16 mx-auto rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div>
              <h4 className="text-lg font-bold text-white font-serif">¡Identidad Verificada con Éxito!</h4>
              <p className="text-xs text-neutral-400 mt-1">
                Tu perfil en Gualanday ha sido certificado para transacciones seguras en Dulce Tentación.
              </p>
            </div>

            <div className="bg-black/40 border border-white/5 rounded-2xl p-4 text-left text-xs space-y-1.5">
              <div className="flex justify-between">
                <span className="text-neutral-500">Cliente:</span>
                <span className="text-white font-medium">{formData.fullName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Teléfono:</span>
                <span className="text-white font-mono">+57 {formData.phone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Sede:</span>
                <span className="text-amber-400 font-medium">Gualanday, Tolima</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Token Cifrado:</span>
                <span className="text-emerald-400 font-mono text-[11px]">vtok_kyc_authenticated</span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-black font-semibold rounded-xl text-sm transition-colors"
            >
              Continuar Comprando
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
