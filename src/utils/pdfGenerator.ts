import { jsPDF } from 'jspdf';
import { Order } from '../types';

export function generateInvoicePDF(order: Order): void {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  // Background and Accent Colors
  const darkBrown = '#281712';
  const goldAccent = '#b45309';
  const roseSoft = '#fbe8ea';
  const textDark = '#1c1917';
  const textMuted = '#78716c';

  // Header Banner
  doc.setFillColor(40, 23, 18);
  doc.rect(0, 0, 210, 42, 'F');

  // Decorative Gold Line
  doc.setFillColor(217, 119, 6);
  doc.rect(0, 42, 210, 2, 'F');

  // Brand Titles
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.text('DULCE TENTACIÓN', 15, 18);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(251, 232, 234);
  doc.text('Emprendimiento de Venta de Donas Artesanas Gourmet', 15, 26);
  doc.text('Gualanday, Tolima · I.E. Marco Fidel Suárez', 15, 33);

  // Invoice Code on Header Right
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(253, 230, 138);
  doc.text(`FACTURA DIGITAL`, 140, 18);
  doc.setFontSize(11);
  doc.setTextColor(255, 255, 255);
  doc.text(`Nº ${order.orderNumber}`, 140, 26);
  doc.setFontSize(9);
  doc.text(`Fecha: ${new Date(order.createdAt).toLocaleDateString('es-CO')}`, 140, 33);

  // Client Details Box
  let currentY = 54;
  doc.setFillColor(250, 248, 245);
  doc.roundedRect(15, currentY, 180, 38, 3, 3, 'F');
  doc.setDrawColor(230, 220, 210);
  doc.roundedRect(15, currentY, 180, 38, 3, 3, 'S');

  doc.setTextColor(textDark);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('DATOS DEL CLIENTE (VERIFICADO)', 22, currentY + 9);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.setTextColor(textMuted);
  doc.text(`Cliente:`, 22, currentY + 17);
  doc.setTextColor(textDark);
  doc.text(`${order.customer.fullName || 'Cliente Gourmet'}`, 45, currentY + 17);

  doc.setTextColor(textMuted);
  doc.text(`Dirección:`, 22, currentY + 24);
  doc.setTextColor(textDark);
  doc.text(`${order.customer.addressGualanday || 'Gualanday, Tolima'}`, 45, currentY + 24);

  doc.setTextColor(textMuted);
  doc.text(`WhatsApp:`, 22, currentY + 31);
  doc.setTextColor(textDark);
  doc.text(`+57 ${order.customer.phone || '3213610322'}`, 45, currentY + 31);

  // Right column inside box
  doc.setTextColor(textMuted);
  doc.text(`Método de Pago:`, 115, currentY + 17);
  doc.setTextColor(180, 83, 9);
  doc.setFont('helvetica', 'bold');
  doc.text(
    order.paymentMethod === 'nequi' 
      ? 'Nequi (3213610322)' 
      : order.paymentMethod === 'pse' 
      ? 'PSE / Débito Bancario' 
      : 'Efectivo Contra Entrega',
    148,
    currentY + 17
  );

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(textMuted);
  doc.text(`Seguridad KYC:`, 115, currentY + 24);
  doc.setTextColor(16, 120, 70);
  doc.text(`Verificado Oficial`, 148, currentY + 24);

  doc.setTextColor(textMuted);
  doc.text(`Entrega Estimada:`, 115, currentY + 31);
  doc.setTextColor(textDark);
  doc.text(order.estimatedDeliveryTime || '35 - 45 min', 148, currentY + 31);

  // Items Table Header
  currentY = 102;
  doc.setFillColor(40, 23, 18);
  doc.rect(15, currentY, 180, 8, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.text('DESCRIPCIÓN DEL PRODUCTO', 20, currentY + 5.5);
  doc.text('CANT.', 130, currentY + 5.5);
  doc.text('V. UNIT', 148, currentY + 5.5);
  doc.text('SUBTOTAL', 174, currentY + 5.5);

  // Items List
  currentY += 8;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);

  order.items.forEach((item, index) => {
    const isEven = index % 2 === 0;
    if (isEven) {
      doc.setFillColor(252, 250, 248);
      doc.rect(15, currentY, 180, 14, 'F');
    }

    doc.setTextColor(textDark);
    doc.setFont('helvetica', 'bold');
    doc.text(`${item.name} (${item.presentation})`, 20, currentY + 5.5);

    // Details line
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(textMuted);
    const details = [
      item.baseGlaze ? `Base: ${item.baseGlaze}` : '',
      item.toppings && item.toppings.length > 0 ? `Toppings: ${item.toppings.join(', ')}` : '',
      item.sauce ? `Salsa: ${item.sauce}` : '',
    ].filter(Boolean).join(' | ');

    doc.text(details || 'Receta clásica de la casa', 20, currentY + 10.5);

    // Numbers
    doc.setFontSize(9);
    doc.setTextColor(textDark);
    doc.text(`${item.quantity}`, 134, currentY + 7);
    doc.text(`$${item.unitPriceCOP.toLocaleString('es-CO')}`, 148, currentY + 7);
    doc.setFont('helvetica', 'bold');
    doc.text(`$${item.subtotalCOP.toLocaleString('es-CO')}`, 174, currentY + 7);

    currentY += 14;
  });

  // Totals Box
  currentY += 5;
  const totalsX = 120;
  doc.setDrawColor(230, 220, 210);
  doc.line(15, currentY, 195, currentY);

  currentY += 6;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(textMuted);
  doc.text('Subtotal Productos:', totalsX, currentY);
  doc.setTextColor(textDark);
  doc.text(`$${order.subtotalCOP.toLocaleString('es-CO')} COP`, 174, currentY);

  if (order.discountCOP > 0) {
    currentY += 6;
    doc.setTextColor(180, 83, 9);
    doc.text('Descuento Lealtad:', totalsX, currentY);
    doc.text(`-$${order.discountCOP.toLocaleString('es-CO')} COP`, 174, currentY);
  }

  currentY += 6;
  doc.setTextColor(textMuted);
  doc.text('Domicilio en Gualanday:', totalsX, currentY);
  doc.setTextColor(textDark);
  doc.text(order.deliveryFeeCOP === 0 ? 'GRATIS' : `$${order.deliveryFeeCOP.toLocaleString('es-CO')} COP`, 174, currentY);

  currentY += 8;
  doc.setFillColor(254, 243, 199);
  doc.roundedRect(totalsX - 5, currentY - 5, 80, 12, 2, 2, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(146, 64, 14);
  doc.text('TOTAL A PAGAR:', totalsX, currentY + 3);
  doc.text(`$${order.totalCOP.toLocaleString('es-CO')} COP`, 166, currentY + 3);

  // Security and Institution Stamp at bottom
  currentY = 240;
  doc.setFillColor(245, 243, 240);
  doc.roundedRect(15, currentY, 180, 30, 3, 3, 'F');
  doc.setDrawColor(217, 119, 6);
  doc.setLineWidth(0.5);
  doc.roundedRect(15, currentY, 180, 30, 3, 3, 'S');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(146, 64, 14);
  doc.text('CERTIFICACIÓN Y COMPROMISO ARTESANAL', 20, currentY + 7);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(textMuted);
  doc.text('• Proceso de elaboración higiénico y artesanal realizado por estudiantes de la I.E. Marco Fidel Suárez.', 20, currentY + 13);
  doc.text('• Materias primas de alta calidad: Harina de alta proteína, mantequilla sin grasas trans, chocolate real y frutas frescas.', 20, currentY + 19);
  doc.text('• Soporte y pedidos WhatsApp: 3213610322 | Gualanday, Tolima. Sistema verificado con IA y sincronización Cloud.', 20, currentY + 25);

  // Save PDF
  doc.save(`Factura_DulceTentacion_${order.orderNumber}.pdf`);
}
