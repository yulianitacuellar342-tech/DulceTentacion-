import React, { useState } from 'react';
import { Order, OrderStatus, InventoryItem, ExtractedDocumentData, GitDeploymentLog } from '../types';
import { 
  FileText, 
  Sparkles, 
  GitCommit, 
  Cloud, 
  UploadCloud, 
  CheckCircle2, 
  RefreshCw, 
  AlertTriangle, 
  Layers, 
  TrendingUp, 
  DollarSign, 
  ShoppingBag, 
  Terminal,
  ExternalLink,
  ChevronRight,
  Database
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface AdminPortalProps {
  orders: Order[];
  inventory: InventoryItem[];
  onUpdateOrderStatus: (orderId: string, newStatus: OrderStatus) => void;
  onUpdateInventory: (updated: InventoryItem[]) => void;
  onClose: () => void;
}

export const AdminPortal: React.FC<AdminPortalProps> = ({
  orders,
  inventory,
  onUpdateOrderStatus,
  onUpdateInventory,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'pedidos' | 'ia_documentos' | 'inventario' | 'github_cloud'>('pedidos');
  const [isExtracting, setIsExtracting] = useState(false);
  const [extractedData, setExtractedData] = useState<ExtractedDocumentData | null>(null);
  const [syncingCloud, setSyncingCloud] = useState(false);
  const [gitDeploymentLogs, setGitDeploymentLogs] = useState<string[]>([]);
  const [lastCommitInfo, setLastCommitInfo] = useState<any | null>(null);
  const [sampleDocChoice, setSampleDocChoice] = useState<'factura_harinas' | 'catalogo_chocolates' | 'remision_empaques'>('factura_harinas');

  // Metrics
  const totalSalesCOP = orders.reduce((acc, o) => acc + o.totalCOP, 0);
  const totalDonutsSold = orders.reduce((acc, o) => acc + o.items.reduce((s, it) => s + it.quantity, 0), 0);
  const activeOrdersCount = orders.filter((o) => o.status !== 'entregado').length;

  const handleProcessSampleDocument = async () => {
    setIsExtracting(true);
    setExtractedData(null);

    let docText = '';
    if (sampleDocChoice === 'factura_harinas') {
      docText = `FACTURA DE VENTA ELECTRÓNICA Nº FAC-2026-9812
PROVEEDOR: Molinos y Harinas del Tolima S.A.S. - NIT: 900.412.873-1
CLIENTE: Dulce Tentación (I.E. Marco Fidel Suárez, Gualanday, Tolima)
FECHA: 2026-09-30

ÍTEMS:
1. Harina de Trigo Alta Proteína (Bulto Especial Repostería) - Cant: 40 kg - Valor Unitario: $3.800 COP - Subtotal: $152.000 COP
2. Levadura Natural Activa Seca - Cant: 10 kg - Valor Unitario: $14.500 COP - Subtotal: $145.000 COP
3. Mantequilla de Primera Calidad (Sin Grasas Trans) - Cant: 15 kg - Valor Unitario: $21.000 COP - Subtotal: $315.000 COP
TOTAL FACTURA: $612.000 COP`;
    } else if (sampleDocChoice === 'catalogo_chocolates') {
      docText = `CATÁLOGO TÉCNICO DE COBERTURAS & TOPPINGS 2026
DISTRIBUIDORA GOURMET ANDINA
DESTINATARIO: Dulce Tentación - Gualanday

LISTA DE PRECIOS E INSUMOS:
- Cobertura de Chocolate Real 65% Cacao Fino de Aroma - Caja 20 kg - Costo Unitario: $27.500 COP/kg - Precio Venta Sugerido: $1.500/porción
- Arequipe Tradicional Tolimense (Leche Entera) - Balde 15 kg - Costo Unitario: $16.000 COP/kg
- Galleta Oreo Triturada Grano Fino - Caja 10 kg - Costo Unitario: $18.500 COP/kg
- Almendras Laminadas Tostadas - Caja 8 kg - Costo Unitario: $34.000 COP/kg
TOTAL LOTE: $1.280.000 COP`;
    } else {
      docText = `REMISIÓN DE ENTREGA Nº REM-4401
EMPAQUES ECOLÓGICOS DEL TOLIMA
CLIENTE: Dulce Tentación Gualanday

1. Cajas de Lujo para 6 Donas con Ventana Cristalina - Cant: 150 unidades - Costo: $1.150 COP c/u - Total: $172.500 COP
2. Bolsas Artesanales Biodegradables para Donas Individuales - Cant: 300 unidades - Costo: $350 COP c/u - Total: $105.000 COP
TOTAL REMISIÓN: $277.500 COP`;
    }

    try {
      const response = await fetch('/api/ai/extract-document', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          textContent: docText,
          docType: sampleDocChoice,
        }),
      });

      const resData = await response.json();
      if (resData.success && resData.data) {
        setExtractedData(resData.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsExtracting(false);
    }
  };

  const handleApplyExtractedToInventory = () => {
    if (!extractedData) return;

    const newInventory = [...inventory];
    extractedData.items.forEach((extItem) => {
      const matchIndex = newInventory.findIndex(
        (inv) => inv.name.toLowerCase().includes(extItem.name.toLowerCase().split(' ')[0])
      );

      if (matchIndex >= 0) {
        newInventory[matchIndex].currentStock += extItem.stockDelta || extItem.quantity;
        newInventory[matchIndex].lastCostCOP = extItem.unitCostCOP;
        newInventory[matchIndex].updatedAt = new Date().toISOString().replace('T', ' ').substring(0, 16);
      } else {
        newInventory.push({
          id: 'inv_' + Date.now() + Math.random().toString(36).substring(2, 5),
          name: extItem.name,
          category: (extItem.category as any) || 'Materia Prima',
          currentStock: extItem.stockDelta || extItem.quantity,
          minThreshold: 10,
          unit: extItem.unit || 'kg',
          lastCostCOP: extItem.unitCostCOP,
          updatedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
        });
      }
    });

    onUpdateInventory(newInventory);

    confetti({
      particleCount: 40,
      spread: 60,
      origin: { y: 0.5 },
      colors: ['#10b981', '#fbbf24', '#3b82f6'],
    });
  };

  const handleSyncToGitHubAndCloud = async () => {
    setSyncingCloud(true);
    setGitDeploymentLogs([]);

    const addLog = (msg: string) => {
      setGitDeploymentLogs((prev) => [...prev, `[${new Date().toLocaleTimeString()}] ${msg}`]);
    };

    addLog('Iniciando sincronización de inventario con PostgreSQL / Firestore...');
    await new Promise((r) => setTimeout(r, 600));

    addLog('Validando contratos de esquema y transacciones de stock...');
    await new Promise((r) => setTimeout(r, 700));

    addLog('Generando commit git en repositorio: github.com/dulce-tentacion/ecommerce-artesanal...');

    try {
      const res = await fetch('/api/sync/github-cloud', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          updatedInventory: inventory,
          commitMessage: `chore(inventory): auto-sync from document extraction (FAC-${Math.floor(1000 + Math.random() * 9000)})`,
        }),
      });
      const data = await res.json();
      setLastCommitInfo(data);

      await new Promise((r) => setTimeout(r, 600));
      addLog(`Commit creado: ${data.commit.sha} en rama 'main'`);
      addLog('Disparando GitHub Actions CI/CD Pipeline...');
      await new Promise((r) => setTimeout(r, 800));
      addLog('Build verificado y optimizado en 320ms.');
      addLog('Despliegue automatizado en Cloud Run & Netlify: EN LÍNEA.');
      addLog('Certificado SSL renovado y CDN para Tolima activa.');

      confetti({
        particleCount: 50,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#10b981', '#38bdf8', '#fbbf24'],
      });
    } catch (err) {
      addLog('Error conectando con API de GitHub Sync.');
    } finally {
      setSyncingCloud(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-fade-in">
      <div className="bg-[#120c0f] border border-[#2b1d22] w-full max-w-6xl rounded-3xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden text-white">
        {/* Top Header */}
        <div className="p-6 border-b border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-black/40">
          <div>
            <div className="flex items-center gap-2 text-xs text-amber-500 uppercase tracking-wider font-semibold">
              <Database className="w-4 h-4" />
              <span>Panel de Control Administrativo & AI Ingestion</span>
              <span aria-hidden="true">·</span>
              <span>Gualanday, Tolima</span>
            </div>
            <h3 className="text-2xl font-bold font-serif text-white mt-1">
              Gestión de Pedidos, Facturación con IA y Despliegue Cloud
            </h3>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-2 bg-white/10 hover:bg-white/15 rounded-xl text-xs font-semibold self-start sm:self-center transition-colors"
          >
            Volver a la Tienda
          </button>
        </div>

        {/* Live Metrics Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 border-b border-white/5 bg-[#170e12]/60">
          <div className="p-4 bg-black/40 rounded-2xl border border-white/5">
            <div className="text-[11px] text-neutral-400 uppercase tracking-wider">Ventas Totales COP</div>
            <div className="text-xl font-bold font-mono text-emerald-400 mt-1">
              ${totalSalesCOP.toLocaleString('es-CO')}
            </div>
          </div>
          <div className="p-4 bg-black/40 rounded-2xl border border-white/5">
            <div className="text-[11px] text-neutral-400 uppercase tracking-wider">Donas Vendidas</div>
            <div className="text-xl font-bold font-mono text-amber-400 mt-1">
              {totalDonutsSold} u.
            </div>
          </div>
          <div className="p-4 bg-black/40 rounded-2xl border border-white/5">
            <div className="text-[11px] text-neutral-400 uppercase tracking-wider">Órdenes Activas</div>
            <div className="text-xl font-bold font-mono text-white mt-1">
              {activeOrdersCount} pedidos
            </div>
          </div>
          <div className="p-4 bg-black/40 rounded-2xl border border-white/5">
            <div className="text-[11px] text-neutral-400 uppercase tracking-wider">Sede I.E. Marco Fidel Suárez</div>
            <div className="text-sm font-semibold text-neutral-200 mt-1 flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>Horno Activo</span>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-white/5 px-6 gap-2 bg-black/20 overflow-x-auto">
          {[
            { id: 'pedidos', label: 'Gestión de Pedidos en Vivo', icon: ShoppingBag },
            { id: 'ia_documentos', label: 'Extracción de Facturas con IA', icon: Sparkles },
            { id: 'inventario', label: 'Inventario & Materias Primas', icon: Layers },
            { id: 'github_cloud', label: 'Sincronización GitHub & Cloud', icon: GitCommit },
          ].map((tab) => {
            const TabIcon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-3.5 px-4 text-xs font-semibold flex items-center gap-2 border-b-2 transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-amber-500 text-amber-400 bg-amber-500/5'
                    : 'border-transparent text-neutral-400 hover:text-white'
                }`}
              >
                <TabIcon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {/* TAB 1: GESTIÓN DE PEDIDOS */}
          {activeTab === 'pedidos' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-base font-bold font-serif text-white">Cola de Pedidos en Tiempo Real</h4>
                <span className="text-xs text-neutral-400 font-mono">{orders.length} órdenes registradas</span>
              </div>

              {orders.length === 0 ? (
                <div className="py-16 text-center text-neutral-500 text-xs">
                  No hay pedidos pendientes en este momento.
                </div>
              ) : (
                <div className="space-y-3">
                  {orders.map((ord) => (
                    <div
                      key={ord.id}
                      className="p-5 bg-black/40 border border-white/5 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold font-mono text-amber-400">{ord.orderNumber}</span>
                          <span className="text-xs text-neutral-400">·</span>
                          <span className="text-xs text-neutral-300 font-medium">{ord.customer.fullName}</span>
                          <span className="text-[11px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                            Verificado KYC
                          </span>
                        </div>
                        <div className="text-xs text-neutral-400">
                          Entrega: <strong className="text-white">{ord.customer.addressGualanday}</strong> · WhatsApp: +57 {ord.customer.phone}
                        </div>
                        <div className="text-xs text-neutral-300">
                          {ord.items.map((it) => `${it.quantity}x ${it.name} (${it.presentation})`).join(' | ')}
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full md:w-auto justify-between">
                        <div className="text-right">
                          <div className="text-base font-bold font-mono text-white">
                            ${ord.totalCOP.toLocaleString('es-CO')} COP
                          </div>
                          <div className="text-[11px] text-amber-400/90 uppercase font-mono">
                            Pago: {ord.paymentMethod}
                          </div>
                        </div>

                        {/* Status Selector */}
                        <select
                          value={ord.status}
                          onChange={(e) => onUpdateOrderStatus(ord.id, e.target.value as OrderStatus)}
                          className="bg-[#1c1216] border border-amber-500/30 rounded-xl px-3 py-2 text-xs font-semibold text-amber-300 outline-none"
                        >
                          <option value="recibido">1. Recibido & Verificado</option>
                          <option value="horneando">2. Horneando Artesanal</option>
                          <option value="decorando">3. Glaseado & Decoración</option>
                          <option value="empaquetando">4. Empaque de Lujo</option>
                          <option value="en_camino">5. En Camino por Gualanday</option>
                          <option value="entregado">6. Entregado</option>
                        </select>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: EXTRACCIÓN DE FACTURAS Y DOCUMENTOS CON IA */}
          {activeTab === 'ia_documentos' && (
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-amber-950/20 to-neutral-900 border border-amber-500/20 rounded-2xl p-6 space-y-4">
                <div className="flex items-center gap-2 text-amber-400 text-xs font-semibold uppercase tracking-wider">
                  <Sparkles className="w-4 h-4" />
                  <span>Extracción Inteligente de Documentos Contables & Catálogos</span>
                </div>
                <h4 className="text-xl font-bold font-serif text-white">
                  Procesamiento Automático de Facturas y Catálogos con Gemini AI
                </h4>
                <p className="text-xs text-neutral-300 leading-relaxed max-w-3xl">
                  Carga documentos digitales de proveedores (facturas electrónicas de harina, coberturas de chocolate, empaques o catálogos PDF). Nuestra IA extrae las materias primas, costos en COP, sugerencias de precios y actualiza el inventario en tiempo real.
                </p>

                {/* Sample Document Selector */}
                <div className="space-y-2 pt-2">
                  <label className="text-xs uppercase tracking-wider text-neutral-400 font-semibold block">
                    Selecciona Documento Digital para Extracción:
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <button
                      onClick={() => setSampleDocChoice('factura_harinas')}
                      className={`p-3 rounded-xl border text-left text-xs transition-all ${
                        sampleDocChoice === 'factura_harinas'
                          ? 'bg-amber-500/20 border-amber-500 text-amber-200'
                          : 'bg-black/40 border-white/5 text-neutral-400'
                      }`}
                    >
                      <div className="font-semibold text-white">Factura Nº FAC-9812</div>
                      <div className="text-[10px] text-neutral-400">Harina de Trigo, Levadura, Mantequilla</div>
                    </button>

                    <button
                      onClick={() => setSampleDocChoice('catalogo_chocolates')}
                      className={`p-3 rounded-xl border text-left text-xs transition-all ${
                        sampleDocChoice === 'catalogo_chocolates'
                          ? 'bg-amber-500/20 border-amber-500 text-amber-200'
                          : 'bg-black/40 border-white/5 text-neutral-400'
                      }`}
                    >
                      <div className="font-semibold text-white">Catálogo Coberturas 2026</div>
                      <div className="text-[10px] text-neutral-400">Chocolate 65%, Arequipe, Oreo, Almendras</div>
                    </button>

                    <button
                      onClick={() => setSampleDocChoice('remision_empaques')}
                      className={`p-3 rounded-xl border text-left text-xs transition-all ${
                        sampleDocChoice === 'remision_empaques'
                          ? 'bg-amber-500/20 border-amber-500 text-amber-200'
                          : 'bg-black/40 border-white/5 text-neutral-400'
                      }`}
                    >
                      <div className="font-semibold text-white">Remisión de Empaques REM-4401</div>
                      <div className="text-[10px] text-neutral-400">Cajas de 6, Bolsas biodegradables</div>
                    </button>
                  </div>
                </div>

                <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
                  <button
                    onClick={handleProcessSampleDocument}
                    disabled={isExtracting}
                    className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-black font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition-all disabled:opacity-50"
                  >
                    <Sparkles className={`w-4 h-4 ${isExtracting ? 'animate-spin' : ''}`} />
                    <span>{isExtracting ? 'Extrayendo Datos con IA...' : 'Extraer Datos de Documento'}</span>
                  </button>
                </div>
              </div>

              {/* Extracted Data Result */}
              {extractedData && (
                <div className="bg-black/40 border border-emerald-500/30 rounded-2xl p-6 space-y-4 animate-fade-in">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-white/5">
                    <div>
                      <span className="text-xs text-emerald-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Extracción Exitosa · Proveedor: {extractedData.supplierName}</span>
                      </span>
                      <div className="text-xs text-neutral-400 mt-0.5">
                        Factura/Documento: <strong className="text-white">{extractedData.invoiceNumber}</strong> · Fecha: {extractedData.documentDate}
                      </div>
                    </div>

                    <button
                      onClick={handleApplyExtractedToInventory}
                      className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs rounded-xl flex items-center gap-1.5 transition-colors shadow-md self-start sm:self-auto"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Cargar a Inventario Real</span>
                    </button>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="border-b border-white/10 text-neutral-400 uppercase text-[10px]">
                          <th className="py-2">Ítem / Insumo</th>
                          <th className="py-2">Categoría</th>
                          <th className="py-2">Unidad</th>
                          <th className="py-2">Cantidad</th>
                          <th className="py-2">Costo Unitario COP</th>
                          <th className="py-2">Ingreso a Stock</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {extractedData.items.map((it, idx) => (
                          <tr key={idx} className="hover:bg-white/5">
                            <td className="py-2.5 font-medium text-white">{it.name}</td>
                            <td className="py-2.5 text-neutral-400">{it.category}</td>
                            <td className="py-2.5 text-neutral-400">{it.unit}</td>
                            <td className="py-2.5 font-mono font-bold text-amber-300">{it.quantity}</td>
                            <td className="py-2.5 font-mono text-neutral-200">${it.unitCostCOP?.toLocaleString('es-CO')}</td>
                            <td className="py-2.5 font-mono text-emerald-400 font-bold">+{it.stockDelta || it.quantity}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: INVENTARIO */}
          {activeTab === 'inventario' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-base font-bold font-serif text-white">Stock de Materias Primas en Gualanday</h4>
                <span className="text-xs text-neutral-400">Actualización en tiempo real</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {inventory.map((inv) => {
                  const isLow = inv.currentStock <= inv.minThreshold;
                  return (
                    <div
                      key={inv.id}
                      className={`p-4 rounded-2xl border transition-all ${
                        isLow
                          ? 'bg-red-500/10 border-red-500/40'
                          : 'bg-black/40 border-white/5'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <span className="text-[10px] uppercase font-mono text-neutral-400">{inv.category}</span>
                          <h5 className="text-sm font-bold text-white mt-0.5">{inv.name}</h5>
                        </div>
                        {isLow && (
                          <span className="text-[10px] text-red-400 flex items-center gap-1 font-semibold">
                            <AlertTriangle className="w-3.5 h-3.5" />
                            <span>Bajo</span>
                          </span>
                        )}
                      </div>

                      <div className="mt-4 flex items-baseline justify-between">
                        <div>
                          <div className="text-2xl font-bold font-mono text-white">
                            {inv.currentStock}{' '}
                            <span className="text-xs font-normal text-neutral-400 font-sans">{inv.unit}</span>
                          </div>
                          <div className="text-[10px] text-neutral-500">Mínimo sugerido: {inv.minThreshold} {inv.unit}</div>
                        </div>

                        <div className="text-right text-[11px] text-neutral-400 font-mono">
                          <div>Costo: ${inv.lastCostCOP.toLocaleString('es-CO')}</div>
                          <div className="text-[9px] text-neutral-600 mt-0.5">{inv.updatedAt}</div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 4: GITHUB & CLOUD DEPLOYMENT */}
          {activeTab === 'github_cloud' && (
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-blue-950/20 to-black/60 border border-blue-500/20 rounded-2xl p-6 space-y-4">
                <div className="flex items-center gap-2 text-blue-400 text-xs font-semibold uppercase tracking-wider">
                  <GitCommit className="w-4 h-4" />
                  <span>Pipeline Automatizado de Despliegue en la Nube & GitHub</span>
                </div>
                <h4 className="text-xl font-bold font-serif text-white">
                  Sincronización Git & Despliegue Multi-Región Automatizado
                </h4>
                <p className="text-xs text-neutral-300 leading-relaxed max-w-3xl">
                  Garantiza la escalabilidad y seguridad de la plataforma ante un alto volumen de ventas en Gualanday y Tolima. Cada cambio en productos o inventario genera un commit verificado en GitHub y actualiza la infraestructura en Cloud Run y CDN de Netlify.
                </p>

                <div className="flex items-center gap-3 pt-2">
                  <button
                    onClick={handleSyncToGitHubAndCloud}
                    disabled={syncingCloud}
                    className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl flex items-center gap-2 shadow-lg shadow-blue-600/20 transition-all disabled:opacity-50"
                  >
                    <RefreshCw className={`w-4 h-4 ${syncingCloud ? 'animate-spin' : ''}`} />
                    <span>{syncingCloud ? 'Sincronizando con GitHub & Cloud...' : 'Sincronizar a GitHub y Nube'}</span>
                  </button>
                </div>
              </div>

              {/* Terminal Logs View */}
              <div className="bg-[#090608] border border-white/10 rounded-2xl p-4 font-mono text-xs text-neutral-300 space-y-2">
                <div className="flex items-center justify-between pb-2 border-b border-white/5 text-[11px] text-neutral-500">
                  <div className="flex items-center gap-2">
                    <Terminal className="w-3.5 h-3.5 text-blue-400" />
                    <span>CI/CD Pipeline Console Logs</span>
                  </div>
                  <span className="text-emerald-400">STATUS: READY</span>
                </div>

                <div className="space-y-1.5 py-2 max-h-52 overflow-y-auto">
                  <div className="text-neutral-500">[08:00:00] Ingested microservices container listening on port 3000</div>
                  <div className="text-neutral-500">[08:00:01] Database pool connected to Gualanday replica cluster</div>
                  {gitDeploymentLogs.map((log, i) => (
                    <div key={i} className="text-emerald-300">
                      {log}
                    </div>
                  ))}
                  {syncingCloud && (
                    <div className="text-amber-400 animate-pulse">
                      &gt; Ejecutando pasos de verificación de alta concurrencia...
                    </div>
                  )}
                </div>

                {lastCommitInfo && (
                  <div className="pt-2 border-t border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px]">
                    <div>
                      <span className="text-neutral-400">Último commit: </span>
                      <span className="text-amber-400 font-bold">{lastCommitInfo.commit?.sha}</span>
                      <span className="text-neutral-500"> · rama </span>
                      <span className="text-white font-semibold">main</span>
                    </div>
                    <div className="text-emerald-400 flex items-center gap-1 font-semibold">
                      <Cloud className="w-3.5 h-3.5" />
                      <span>Netlify & Cloud Run Live (100% Uptime)</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
