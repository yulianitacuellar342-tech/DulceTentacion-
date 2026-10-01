import React, { useState } from 'react';
import { Bell, BellRing, Sparkles, Tag, Check, X, Flame } from 'lucide-react';

interface PushNotificationCenterProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPromo: (promoText: string) => void;
}

interface NotificationItem {
  id: string;
  title: string;
  body: string;
  category: 'promo' | 'order' | 'nuevo';
  time: string;
  isRead: boolean;
  cta?: string;
}

export const PushNotificationCenter: React.FC<PushNotificationCenterProps> = ({
  isOpen,
  onClose,
  onSelectPromo,
}) => {
  const [permissionGranted, setPermissionGranted] = useState(true);
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: 'notif_1',
      title: '🍩 ¡Promo Relámpago en Gualanday!',
      body: '2x1 en Donas de Autor con glaseado de Mora Andina durante las próximas 2 horas.',
      category: 'promo',
      time: 'Hace 15 min',
      isRead: false,
      cta: 'Ver Catálogo',
    },
    {
      id: 'notif_2',
      title: '✨ Nuevo Lote Horneado en I.E. Marco Fidel Suárez',
      body: 'Acaban de salir del horno las Cajas de 6 Unidades con cobertura de chocolate real y arequipe.',
      category: 'nuevo',
      time: 'Hace 1 hora',
      isRead: false,
    },
    {
      id: 'notif_3',
      title: '👑 Donas Doradas Acreditadas',
      body: 'Has recibido +150 puntos en tu cuenta por compras recientes en el municipio.',
      category: 'order',
      time: 'Ayer',
      isRead: true,
    },
  ]);

  if (!isOpen) return null;

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const handleAction = (item: NotificationItem) => {
    onSelectPromo(item.body);
    setNotifications((prev) =>
      prev.map((n) => (n.id === item.id ? { ...n, isRead: true } : n))
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-end p-4 sm:p-6 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#140e11] border border-[#2e1f24] w-full max-w-sm rounded-3xl p-5 text-white shadow-2xl mt-16 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/5">
          <div className="flex items-center gap-2">
            <BellRing className="w-5 h-5 text-amber-500" />
            <h4 className="text-base font-bold font-serif">Notificaciones Push</h4>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-white/10 text-neutral-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Permission Toggle */}
        <div className="p-3 bg-black/40 border border-white/5 rounded-2xl flex items-center justify-between">
          <div className="text-xs">
            <div className="font-semibold text-neutral-200">Alertas en Tiempo Real</div>
            <div className="text-neutral-500 text-[10px]">Promociones exclusivas de donas</div>
          </div>
          <button
            onClick={() => setPermissionGranted(!permissionGranted)}
            className={`w-11 h-6 rounded-full transition-colors relative p-0.5 ${
              permissionGranted ? 'bg-amber-500' : 'bg-neutral-800'
            }`}
          >
            <div
              className={`w-5 h-5 rounded-full bg-white transition-transform ${
                permissionGranted ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {/* Notifications List */}
        <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1">
          {notifications.map((item) => (
            <div
              key={item.id}
              onClick={() => handleAction(item)}
              className={`p-3 rounded-2xl border transition-all cursor-pointer ${
                item.isRead
                  ? 'bg-black/20 border-white/5 opacity-70'
                  : 'bg-amber-500/10 border-amber-500/30'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <span className="text-xs font-bold text-white flex-1">{item.title}</span>
                <span className="text-[10px] text-neutral-500 font-mono shrink-0">{item.time}</span>
              </div>
              <p className="text-xs text-neutral-300 mt-1 leading-relaxed">{item.body}</p>
              {item.cta && (
                <div className="mt-2 text-[11px] text-amber-400 font-semibold flex items-center gap-1">
                  <span>{item.cta}</span>
                  <span>→</span>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="pt-2 border-t border-white/5 flex items-center justify-between text-xs">
          <button
            onClick={markAllAsRead}
            className="text-neutral-400 hover:text-white transition-colors"
          >
            Marcar todas como leídas
          </button>
          <span className="text-amber-500 font-mono text-[11px]">Gualanday, Tolima</span>
        </div>
      </div>
    </div>
  );
};
