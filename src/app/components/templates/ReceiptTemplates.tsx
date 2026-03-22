import { useEffect, useState } from 'react';
import QRCode from 'qrcode';

export interface ReceiptData {
  receiptNumber: string;
  date: string;
  companyName: string;
  companyAddress: string;
  companyPhone: string;
  companyEmail: string;
  companyGST?: string;
  clientName: string;
  clientPhone: string;
  clientEmail?: string;
  items: Array<{ description: string; quantity: number; rate: number; amount: number }>;
  subtotal: number;
  taxRate: number;
  tax: number;
  total: number;
  paymentMethod: string;
  notes?: string;
  upiId?: string;
}

interface Props { data: ReceiptData; isPro?: boolean; }

export function ReceiptTemplate1({ data, isPro = false }: Props) {
  const [qr, setQr] = useState('');
  useEffect(() => {
    if (data.upiId) {
      const upiUrl = `upi://pay?pa=${data.upiId}&pn=${encodeURIComponent(data.companyName)}&am=${data.total}&cu=INR`;
      QRCode.toDataURL(upiUrl, { width: 100, margin: 1 }).then(setQr).catch(console.error);
    }
  }, [data.upiId, data.companyName, data.total]);

  return (
    <div style={{ backgroundColor: '#fff', padding: '40px', maxWidth: '800px', margin: '0 auto', minHeight: '1056px', fontFamily: 'system-ui, sans-serif', position: 'relative' }}>
      {!isPro && <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%) rotate(-45deg)', fontSize: '48px', fontWeight: 'bold', color: 'rgba(128,128,128,0.12)', pointerEvents: 'none', whiteSpace: 'nowrap', zIndex: 9999 }}>PDFDecor Free</div>}
      <div style={{ background: 'linear-gradient(135deg, #10b981, #059669)', color: '#fff', padding: '24px', borderRadius: '12px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: 'bold', margin: 0 }}>RECEIPT</h1>
            <p style={{ margin: '4px 0 0', opacity: 0.85, fontSize: '14px' }}>#{data.receiptNumber}</p>
          </div>
          <div style={{ textAlign: 'right', fontSize: '13px', opacity: 0.9 }}>
            <p style={{ margin: '2px 0' }}>{data.date}</p>
            <p style={{ margin: '2px 0', fontWeight: 'bold' }}>PAID ✓</p>
          </div>
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
        <div style={{ background: '#f0fdf4', padding: '16px', borderRadius: '8px' }}>
          <h3 style={{ color: '#059669', fontWeight: '600', margin: '0 0 8px', fontSize: '13px', textTransform: 'uppercase' }}>From</h3>
          <p style={{ fontWeight: 'bold', margin: '0 0 4px', fontSize: '16px' }}>{data.companyName}</p>
          <p style={{ color: '#6b7280', margin: '2px 0', fontSize: '13px' }}>{data.companyAddress}</p>
          <p style={{ color: '#6b7280', margin: '2px 0', fontSize: '13px' }}>{data.companyPhone}</p>
          <p style={{ color: '#6b7280', margin: '2px 0', fontSize: '13px' }}>{data.companyEmail}</p>
          {data.companyGST && <p style={{ color: '#6b7280', margin: '2px 0', fontSize: '13px' }}>GST: {data.companyGST}</p>}
        </div>
        <div style={{ background: '#f0fdf4', padding: '16px', borderRadius: '8px' }}>
          <h3 style={{ color: '#059669', fontWeight: '600', margin: '0 0 8px', fontSize: '13px', textTransform: 'uppercase' }}>Received From</h3>
          <p style={{ fontWeight: 'bold', margin: '0 0 4px', fontSize: '16px' }}>{data.clientName}</p>
          <p style={{ color: '#6b7280', margin: '2px 0', fontSize: '13px' }}>{data.clientPhone}</p>
          {data.clientEmail && <p style={{ color: '#6b7280', margin: '2px 0', fontSize: '13px' }}>{data.clientEmail}</p>}
        </div>
      </div>
      <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '24px' }}>
        <thead>
          <tr style={{ backgroundColor: '#10b981', color: '#fff' }}>
            <th style={{ textAlign: 'left', padding: '10px 12px', fontSize: '13px' }}>Description</th>
            <th style={{ textAlign: 'right', padding: '10px 12px', fontSize: '13px' }}>Qty</th>
            <th style={{ textAlign: 'right', padding: '10px 12px', fontSize: '13px' }}>Rate</th>
            <th style={{ textAlign: 'right', padding: '10px 12px', fontSize: '13px' }}>Amount</th>
          </tr>
        </thead>
        <tbody>
          {data.items.map((item, i) => (
            <tr key={i} style={{ borderBottom: '1px solid #d1fae5', backgroundColor: i % 2 === 0 ? '#f0fdf4' : '#fff' }}>
              <td style={{ padding: '10px 12px', fontSize: '13px' }}>{item.description}</td>
              <td style={{ textAlign: 'right', padding: '10px 12px', fontSize: '13px' }}>{item.quantity}</td>
              <td style={{ textAlign: 'right', padding: '10px 12px', fontSize: '13px' }}>₹{item.rate.toFixed(2)}</td>
              <td style={{ textAlign: 'right', padding: '10px 12px', fontSize: '13px' }}>₹{item.amount.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          {qr && (
            <div style={{ textAlign: 'center' }}>
              <img src={qr} alt="UPI QR" style={{ width: '90px', height: '90px' }} />
              <p style={{ fontSize: '11px', color: '#6b7280', margin: '4px 0 0' }}>Scan to Pay UPI</p>
            </div>
          )}
          <div style={{ marginTop: '12px', padding: '10px 14px', background: '#d1fae5', borderRadius: '8px' }}>
            <p style={{ margin: 0, fontSize: '13px', fontWeight: '600', color: '#059669' }}>Payment: {data.paymentMethod}</p>
          </div>
        </div>
        <div style={{ width: '220px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #e5e7eb' }}>
            <span style={{ fontSize: '13px', color: '#6b7280' }}>Subtotal</span>
            <span style={{ fontSize: '13px' }}>₹{data.subtotal.toFixed(2)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #e5e7eb' }}>
            <span style={{ fontSize: '13px', color: '#6b7280' }}>GST ({data.taxRate}%)</span>
            <span style={{ fontSize: '13px' }}>₹{data.tax.toFixed(2)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 12px', background: '#10b981', color: '#fff', borderRadius: '8px', marginTop: '8px' }}>
            <span style={{ fontWeight: 'bold', fontSize: '15px' }}>TOTAL PAID</span>
            <span style={{ fontWeight: 'bold', fontSize: '15px' }}>₹{data.total.toFixed(2)}</span>
          </div>
        </div>
      </div>
      {data.notes && <p style={{ marginTop: '20px', fontSize: '12px', color: '#6b7280', borderTop: '1px solid #e5e7eb', paddingTop: '12px' }}>{data.notes}</p>}
      {!isPro && <p style={{ textAlign: 'center', fontSize: '11px', color: '#9ca3af', marginTop: '20px' }}>Generated by PDFDecor.in — Upgrade to Pro to remove this footer</p>}
    </div>
  );
}

export function ReceiptTemplate2({ data, isPro = false }: Props) {
  return (
    <div style={{ backgroundColor: '#fff', padding: '40px', maxWidth: '800px', margin: '0 auto', minHeight: '1056px', fontFamily: 'Georgia, serif', position: 'relative' }}>
      {!isPro && <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%) rotate(-45deg)', fontSize: '48px', fontWeight: 'bold', color: 'rgba(128,128,128,0.12)', pointerEvents: 'none', whiteSpace: 'nowrap', zIndex: 9999 }}>PDFDecor Free</div>}
      <div style={{ borderTop: '6px solid #1f2937', borderBottom: '2px solid #1f2937', padding: '20px 0', marginBottom: '28px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '32px', fontWeight: 'bold', color: '#1f2937', margin: 0, letterSpacing: '4px' }}>RECEIPT</h1>
          <p style={{ color: '#6b7280', margin: '4px 0 0', fontSize: '13px' }}>No. {data.receiptNumber}</p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <p style={{ fontWeight: 'bold', margin: 0, fontSize: '18px' }}>{data.companyName}</p>
          <p style={{ color: '#6b7280', margin: '4px 0 0', fontSize: '13px' }}>Date: {data.date}</p>
        </div>
      </div>
      <div style={{ marginBottom: '24px' }}>
        <p style={{ fontSize: '14px', color: '#374151' }}>Received with thanks from: <strong>{data.clientName}</strong></p>
        <p style={{ fontSize: '14px', color: '#374151' }}>Phone: {data.clientPhone} · Payment: {data.paymentMethod}</p>
      </div>
      <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '24px' }}>
        <thead>
          <tr style={{ borderBottom: '2px solid #1f2937' }}>
            <th style={{ textAlign: 'left', padding: '8px 4px', fontSize: '13px', color: '#1f2937' }}>Description</th>
            <th style={{ textAlign: 'right', padding: '8px 4px', fontSize: '13px' }}>Qty</th>
            <th style={{ textAlign: 'right', padding: '8px 4px', fontSize: '13px' }}>Rate</th>
            <th style={{ textAlign: 'right', padding: '8px 4px', fontSize: '13px' }}>Amount</th>
          </tr>
        </thead>
        <tbody>
          {data.items.map((item, i) => (
            <tr key={i} style={{ borderBottom: '1px solid #e5e7eb' }}>
              <td style={{ padding: '8px 4px', fontSize: '13px' }}>{item.description}</td>
              <td style={{ textAlign: 'right', padding: '8px 4px', fontSize: '13px' }}>{item.quantity}</td>
              <td style={{ textAlign: 'right', padding: '8px 4px', fontSize: '13px' }}>₹{item.rate.toFixed(2)}</td>
              <td style={{ textAlign: 'right', padding: '8px 4px', fontSize: '13px' }}>₹{item.amount.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <div style={{ width: '220px', borderTop: '2px solid #1f2937', paddingTop: '12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0' }}>
            <span style={{ fontSize: '13px' }}>Subtotal:</span><span style={{ fontSize: '13px' }}>₹{data.subtotal.toFixed(2)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0' }}>
            <span style={{ fontSize: '13px' }}>Tax ({data.taxRate}%):</span><span style={{ fontSize: '13px' }}>₹{data.tax.toFixed(2)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderTop: '2px solid #1f2937', marginTop: '8px' }}>
            <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Total Paid:</span>
            <span style={{ fontWeight: 'bold', fontSize: '16px' }}>₹{data.total.toFixed(2)}</span>
          </div>
        </div>
      </div>
      {!isPro && <p style={{ textAlign: 'center', fontSize: '11px', color: '#9ca3af', marginTop: '40px' }}>Generated by PDFDecor.in</p>}
    </div>
  );
}

export function ReceiptTemplate3({ data, isPro = false }: Props) {
  return (
    <div style={{ backgroundColor: '#fff', padding: '40px', maxWidth: '800px', margin: '0 auto', minHeight: '1056px', fontFamily: 'system-ui, sans-serif', position: 'relative' }}>
      {!isPro && <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%) rotate(-45deg)', fontSize: '48px', fontWeight: 'bold', color: 'rgba(128,128,128,0.12)', pointerEvents: 'none', whiteSpace: 'nowrap', zIndex: 9999 }}>PDFDecor Free</div>}
      <div style={{ background: 'linear-gradient(135deg, #7c3aed, #4f46e5)', color: '#fff', borderRadius: '16px', padding: '28px', marginBottom: '28px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div>
            <h1 style={{ fontSize: '30px', fontWeight: '800', margin: 0, letterSpacing: '2px' }}>RECEIPT</h1>
            <p style={{ margin: '8px 0 0', opacity: 0.85, fontSize: '22px', fontWeight: 'bold' }}>₹{data.total.toFixed(2)}</p>
            <p style={{ margin: '4px 0 0', opacity: 0.7, fontSize: '13px' }}>Received Successfully</p>
          </div>
          <div style={{ textAlign: 'right', opacity: 0.9, fontSize: '13px' }}>
            <p style={{ margin: '2px 0', fontWeight: '600' }}>{data.receiptNumber}</p>
            <p style={{ margin: '2px 0' }}>{data.date}</p>
            <p style={{ margin: '2px 0' }}>{data.paymentMethod}</p>
          </div>
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '24px' }}>
        <div>
          <p style={{ fontSize: '11px', fontWeight: '700', color: '#7c3aed', textTransform: 'uppercase', letterSpacing: '1px', margin: '0 0 6px' }}>Merchant</p>
          <p style={{ fontWeight: 'bold', margin: '0 0 2px', fontSize: '15px' }}>{data.companyName}</p>
          <p style={{ color: '#6b7280', margin: '2px 0', fontSize: '12px' }}>{data.companyAddress}</p>
          <p style={{ color: '#6b7280', margin: '2px 0', fontSize: '12px' }}>{data.companyPhone}</p>
        </div>
        <div>
          <p style={{ fontSize: '11px', fontWeight: '700', color: '#7c3aed', textTransform: 'uppercase', letterSpacing: '1px', margin: '0 0 6px' }}>Customer</p>
          <p style={{ fontWeight: 'bold', margin: '0 0 2px', fontSize: '15px' }}>{data.clientName}</p>
          <p style={{ color: '#6b7280', margin: '2px 0', fontSize: '12px' }}>{data.clientPhone}</p>
        </div>
      </div>
      <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px' }}>
        <thead>
          <tr style={{ backgroundColor: '#ede9fe' }}>
            <th style={{ textAlign: 'left', padding: '10px', fontSize: '12px', color: '#7c3aed', fontWeight: '700', textTransform: 'uppercase' }}>Item</th>
            <th style={{ textAlign: 'right', padding: '10px', fontSize: '12px', color: '#7c3aed', fontWeight: '700', textTransform: 'uppercase' }}>Qty</th>
            <th style={{ textAlign: 'right', padding: '10px', fontSize: '12px', color: '#7c3aed', fontWeight: '700', textTransform: 'uppercase' }}>Rate</th>
            <th style={{ textAlign: 'right', padding: '10px', fontSize: '12px', color: '#7c3aed', fontWeight: '700', textTransform: 'uppercase' }}>Total</th>
          </tr>
        </thead>
        <tbody>
          {data.items.map((item, i) => (
            <tr key={i} style={{ borderBottom: '1px solid #ede9fe' }}>
              <td style={{ padding: '10px', fontSize: '13px' }}>{item.description}</td>
              <td style={{ textAlign: 'right', padding: '10px', fontSize: '13px' }}>{item.quantity}</td>
              <td style={{ textAlign: 'right', padding: '10px', fontSize: '13px' }}>₹{item.rate.toFixed(2)}</td>
              <td style={{ textAlign: 'right', padding: '10px', fontSize: '13px' }}>₹{item.amount.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <div style={{ background: '#f5f3ff', borderRadius: '12px', padding: '16px', width: '220px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
            <span style={{ fontSize: '13px', color: '#6b7280' }}>Subtotal</span><span style={{ fontSize: '13px' }}>₹{data.subtotal.toFixed(2)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
            <span style={{ fontSize: '13px', color: '#6b7280' }}>Tax ({data.taxRate}%)</span><span style={{ fontSize: '13px' }}>₹{data.tax.toFixed(2)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', background: '#7c3aed', color: '#fff', padding: '10px 12px', borderRadius: '8px' }}>
            <span style={{ fontWeight: 'bold', fontSize: '14px' }}>Amount Paid</span>
            <span style={{ fontWeight: 'bold', fontSize: '14px' }}>₹{data.total.toFixed(2)}</span>
          </div>
        </div>
      </div>
      {!isPro && <p style={{ textAlign: 'center', fontSize: '11px', color: '#9ca3af', marginTop: '40px' }}>Generated by PDFDecor.in</p>}
    </div>
  );
}

// Template 4 - Pro Only: Minimal Corporate
export function ReceiptTemplate4({ data, isPro = false }: Props) {
  return (
    <div style={{ backgroundColor: '#0f172a', padding: '40px', maxWidth: '800px', margin: '0 auto', minHeight: '1056px', fontFamily: 'system-ui, sans-serif', color: '#e2e8f0' }}>
      <div style={{ borderBottom: '1px solid #334155', paddingBottom: '20px', marginBottom: '28px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <span style={{ fontSize: '11px', color: '#64748b', letterSpacing: '3px', textTransform: 'uppercase' }}>Payment</span>
          <h1 style={{ fontSize: '36px', fontWeight: '800', color: '#22d3ee', margin: '4px 0 0', letterSpacing: '2px' }}>RECEIPT</h1>
        </div>
        <div style={{ textAlign: 'right' }}>
          <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#22d3ee', margin: 0 }}>₹{data.total.toFixed(2)}</p>
          <p style={{ fontSize: '12px', color: '#64748b', margin: '4px 0 0' }}>{data.date}</p>
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '28px' }}>
        <div>
          <p style={{ fontSize: '10px', color: '#64748b', letterSpacing: '2px', textTransform: 'uppercase', margin: '0 0 8px' }}>From</p>
          <p style={{ fontWeight: 'bold', color: '#f1f5f9', margin: '0 0 4px' }}>{data.companyName}</p>
          <p style={{ color: '#94a3b8', fontSize: '12px', margin: '2px 0' }}>{data.companyPhone}</p>
        </div>
        <div>
          <p style={{ fontSize: '10px', color: '#64748b', letterSpacing: '2px', textTransform: 'uppercase', margin: '0 0 8px' }}>To</p>
          <p style={{ fontWeight: 'bold', color: '#f1f5f9', margin: '0 0 4px' }}>{data.clientName}</p>
          <p style={{ color: '#94a3b8', fontSize: '12px', margin: '2px 0' }}>{data.clientPhone}</p>
        </div>
      </div>
      <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '24px' }}>
        <thead>
          <tr style={{ borderBottom: '1px solid #334155' }}>
            <th style={{ textAlign: 'left', padding: '10px 4px', fontSize: '11px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px' }}>Description</th>
            <th style={{ textAlign: 'right', padding: '10px 4px', fontSize: '11px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px' }}>Qty</th>
            <th style={{ textAlign: 'right', padding: '10px 4px', fontSize: '11px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px' }}>Rate</th>
            <th style={{ textAlign: 'right', padding: '10px 4px', fontSize: '11px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px' }}>Total</th>
          </tr>
        </thead>
        <tbody>
          {data.items.map((item, i) => (
            <tr key={i} style={{ borderBottom: '1px solid #1e293b' }}>
              <td style={{ padding: '10px 4px', fontSize: '13px', color: '#cbd5e1' }}>{item.description}</td>
              <td style={{ textAlign: 'right', padding: '10px 4px', fontSize: '13px', color: '#cbd5e1' }}>{item.quantity}</td>
              <td style={{ textAlign: 'right', padding: '10px 4px', fontSize: '13px', color: '#cbd5e1' }}>₹{item.rate.toFixed(2)}</td>
              <td style={{ textAlign: 'right', padding: '10px 4px', fontSize: '13px', color: '#e2e8f0' }}>₹{item.amount.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <div style={{ width: '220px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #334155' }}>
            <span style={{ fontSize: '12px', color: '#64748b' }}>Subtotal</span><span style={{ fontSize: '12px' }}>₹{data.subtotal.toFixed(2)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #334155' }}>
            <span style={{ fontSize: '12px', color: '#64748b' }}>Tax ({data.taxRate}%)</span><span style={{ fontSize: '12px' }}>₹{data.tax.toFixed(2)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', marginTop: '8px' }}>
            <span style={{ fontWeight: 'bold', fontSize: '15px', color: '#22d3ee' }}>PAID</span>
            <span style={{ fontWeight: 'bold', fontSize: '15px', color: '#22d3ee' }}>₹{data.total.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// Template 5 - Pro Only: Warm Orange
export function ReceiptTemplate5({ data, isPro = false }: Props) {
  return (
    <div style={{ backgroundColor: '#fff7ed', padding: '40px', maxWidth: '800px', margin: '0 auto', minHeight: '1056px', fontFamily: 'system-ui, sans-serif', position: 'relative' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px', paddingBottom: '20px', borderBottom: '3px solid #f97316' }}>
        <div>
          <h1 style={{ fontSize: '40px', fontWeight: '900', color: '#ea580c', margin: 0 }}>RECEIPT</h1>
          <p style={{ color: '#9a3412', fontSize: '13px', margin: '6px 0 0' }}>{data.companyName}</p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <p style={{ fontSize: '28px', fontWeight: 'bold', color: '#ea580c', margin: 0 }}>₹{data.total.toFixed(2)}</p>
          <p style={{ color: '#9a3412', fontSize: '13px', margin: '4px 0 0' }}>Receipt #{data.receiptNumber}</p>
          <p style={{ color: '#9a3412', fontSize: '13px', margin: '2px 0' }}>{data.date}</p>
        </div>
      </div>
      <div style={{ background: '#fff', borderRadius: '12px', padding: '20px', marginBottom: '24px', border: '1px solid #fed7aa' }}>
        <p style={{ fontSize: '14px', color: '#374151', margin: 0 }}>
          Received payment of <strong style={{ color: '#ea580c' }}>₹{data.total.toFixed(2)}</strong> from <strong>{data.clientName}</strong> ({data.clientPhone}) via <strong>{data.paymentMethod}</strong>.
        </p>
      </div>
      <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '24px' }}>
        <thead>
          <tr style={{ backgroundColor: '#f97316', color: '#fff' }}>
            <th style={{ textAlign: 'left', padding: '10px 14px', fontSize: '13px' }}>Description</th>
            <th style={{ textAlign: 'right', padding: '10px 14px', fontSize: '13px' }}>Qty</th>
            <th style={{ textAlign: 'right', padding: '10px 14px', fontSize: '13px' }}>Rate</th>
            <th style={{ textAlign: 'right', padding: '10px 14px', fontSize: '13px' }}>Amount</th>
          </tr>
        </thead>
        <tbody>
          {data.items.map((item, i) => (
            <tr key={i} style={{ borderBottom: '1px solid #fed7aa', backgroundColor: i % 2 === 0 ? '#fff7ed' : '#fff' }}>
              <td style={{ padding: '10px 14px', fontSize: '13px' }}>{item.description}</td>
              <td style={{ textAlign: 'right', padding: '10px 14px', fontSize: '13px' }}>{item.quantity}</td>
              <td style={{ textAlign: 'right', padding: '10px 14px', fontSize: '13px' }}>₹{item.rate.toFixed(2)}</td>
              <td style={{ textAlign: 'right', padding: '10px 14px', fontSize: '13px' }}>₹{item.amount.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <div style={{ background: '#fff', borderRadius: '12px', border: '2px solid #f97316', padding: '16px', width: '220px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
            <span style={{ fontSize: '13px', color: '#6b7280' }}>Subtotal</span><span style={{ fontSize: '13px' }}>₹{data.subtotal.toFixed(2)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
            <span style={{ fontSize: '13px', color: '#6b7280' }}>Tax ({data.taxRate}%)</span><span style={{ fontSize: '13px' }}>₹{data.tax.toFixed(2)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', background: '#f97316', color: '#fff', padding: '10px 12px', borderRadius: '8px' }}>
            <span style={{ fontWeight: 'bold', fontSize: '14px' }}>Total Paid</span>
            <span style={{ fontWeight: 'bold', fontSize: '14px' }}>₹{data.total.toFixed(2)}</span>
          </div>
        </div>
      </div>
      {!isPro && <p style={{ textAlign: 'center', fontSize: '11px', color: '#9ca3af', marginTop: '40px' }}>Generated by PDFDecor.in</p>}
    </div>
  );
}
