import { useEffect, useState } from 'react';
import QRCode from 'qrcode';

export interface InvoiceData {
  invoiceNumber: string;
  date: string;
  dueDate: string;
  companyName: string;
  companyAddress: string;
  companyPhone: string;
  companyEmail: string;
  companyGST?: string;
  clientName: string;
  clientAddress: string;
  clientPhone: string;
  clientEmail: string;
  clientGST?: string;
  items: Array<{
    description: string;
    quantity: number;
    rate: number;
    amount: number;
  }>;
  subtotal: number;
  tax: number;
  total: number;
  notes: string;
  upiId?: string;
}

interface InvoiceTemplateProps {
  data: InvoiceData;
  isPro?: boolean;
}

// Template 1: Modern Blue - Clean and Professional
export function InvoiceTemplate1({ data, isPro = false }: InvoiceTemplateProps) {
  const [qrCode, setQrCode] = useState<string>('');

  useEffect(() => {
    if (data.upiId) {
      const upiUrl = `upi://pay?pa=${data.upiId}&pn=${encodeURIComponent(data.companyName)}&am=${data.total}&cu=INR`;
      QRCode.toDataURL(upiUrl, { width: 120, margin: 1 })
        .then(setQrCode)
        .catch(console.error);
    }
  }, [data.upiId, data.companyName, data.total]);

  return (
    <div style={{ backgroundColor: '#ffffff', padding: '48px', maxWidth: '800px', margin: '0 auto', minHeight: '1056px', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <div style={{ borderBottom: '4px solid #2563eb', paddingBottom: '24px', marginBottom: '24px' }}>
        <h1 style={{ fontSize: '36px', fontWeight: 'bold', color: '#2563eb', marginBottom: '8px', margin: '0' }}>INVOICE</h1>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '16px' }}>
          <div>
            <p style={{ color: '#6b7280', margin: '4px 0', fontSize: '14px' }}>Invoice #: {data.invoiceNumber}</p>
            <p style={{ color: '#6b7280', margin: '4px 0', fontSize: '14px' }}>Date: {data.date}</p>
            <p style={{ color: '#6b7280', margin: '4px 0', fontSize: '14px' }}>Due Date: {data.dueDate}</p>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px', marginBottom: '32px' }}>
        <div>
          <h3 style={{ fontWeight: '600', color: '#1f2937', marginBottom: '8px', fontSize: '16px' }}>From:</h3>
          <p style={{ fontWeight: 'bold', fontSize: '18px', margin: '4px 0', color: '#000' }}>{data.companyName}</p>
          <p style={{ color: '#6b7280', margin: '4px 0', fontSize: '14px' }}>{data.companyAddress}</p>
          <p style={{ color: '#6b7280', margin: '4px 0', fontSize: '14px' }}>{data.companyPhone}</p>
          <p style={{ color: '#6b7280', margin: '4px 0', fontSize: '14px' }}>{data.companyEmail}</p>
          {data.companyGST && <p style={{ color: '#6b7280', margin: '4px 0', fontSize: '14px' }}>GST: {data.companyGST}</p>}
        </div>
        <div>
          <h3 style={{ fontWeight: '600', color: '#1f2937', marginBottom: '8px', fontSize: '16px' }}>Bill To:</h3>
          <p style={{ fontWeight: 'bold', fontSize: '18px', margin: '4px 0', color: '#000' }}>{data.clientName}</p>
          <p style={{ color: '#6b7280', margin: '4px 0', fontSize: '14px' }}>{data.clientAddress}</p>
          <p style={{ color: '#6b7280', margin: '4px 0', fontSize: '14px' }}>{data.clientPhone}</p>
          <p style={{ color: '#6b7280', margin: '4px 0', fontSize: '14px' }}>{data.clientEmail}</p>
          {data.clientGST && <p style={{ color: '#6b7280', margin: '4px 0', fontSize: '14px' }}>GST: {data.clientGST}</p>}
        </div>
      </div>

      <table style={{ width: '100%', marginBottom: '32px', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ backgroundColor: '#2563eb' }}>
            <th style={{ textAlign: 'left', padding: '12px', color: '#ffffff', fontSize: '14px', fontWeight: '600' }}>Description</th>
            <th style={{ textAlign: 'right', padding: '12px', color: '#ffffff', fontSize: '14px', fontWeight: '600' }}>Qty</th>
            <th style={{ textAlign: 'right', padding: '12px', color: '#ffffff', fontSize: '14px', fontWeight: '600' }}>Rate</th>
            <th style={{ textAlign: 'right', padding: '12px', color: '#ffffff', fontSize: '14px', fontWeight: '600' }}>Amount</th>
          </tr>
        </thead>
        <tbody>
          {data.items.map((item, index) => (
            <tr key={index} style={{ borderBottom: '1px solid #e5e7eb' }}>
              <td style={{ padding: '12px', fontSize: '14px', color: '#000' }}>{item.description}</td>
              <td style={{ textAlign: 'right', padding: '12px', fontSize: '14px', color: '#000' }}>{item.quantity}</td>
              <td style={{ textAlign: 'right', padding: '12px', fontSize: '14px', color: '#000' }}>₹{item.rate.toFixed(2)}</td>
              <td style={{ textAlign: 'right', padding: '12px', fontSize: '14px', color: '#000' }}>₹{item.amount.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '32px' }}>
        {qrCode && (
          <div style={{ textAlign: 'center' }}>
            <img src={qrCode} alt="UPI QR Code" style={{ width: '120px', height: '120px' }} />
            <p style={{ fontSize: '12px', color: '#6b7280', marginTop: '8px' }}>Scan to Pay</p>
          </div>
        )}
        <div style={{ width: '256px', marginLeft: 'auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #e5e7eb' }}>
            <span style={{ color: '#6b7280', fontSize: '14px' }}>Subtotal:</span>
            <span style={{ fontWeight: '600', fontSize: '14px', color: '#000' }}>₹{data.subtotal.toFixed(2)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #e5e7eb' }}>
            <span style={{ color: '#6b7280', fontSize: '14px' }}>Tax (GST):</span>
            <span style={{ fontWeight: '600', fontSize: '14px', color: '#000' }}>₹{data.tax.toFixed(2)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px', backgroundColor: '#eff6ff', marginTop: '8px' }}>
            <span style={{ fontWeight: 'bold', fontSize: '18px', color: '#000' }}>Total:</span>
            <span style={{ fontWeight: 'bold', fontSize: '18px', color: '#2563eb' }}>₹{data.total.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {data.notes && (
        <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '16px', marginTop: '32px' }}>
          <h3 style={{ fontWeight: '600', color: '#1f2937', marginBottom: '8px', fontSize: '14px' }}>Notes:</h3>
          <p style={{ color: '#6b7280', fontSize: '14px', lineHeight: '1.5' }}>{data.notes}</p>
        </div>
      )}

      <div style={{ marginTop: '48px', textAlign: 'center', fontSize: '12px', color: '#9ca3af' }}>
        <p style={{ margin: '4px 0' }}>Created with PDFDecor • Free Professional PDF Tool</p>
        <p style={{ margin: '4px 0' }}>https://pdfdecor.in</p>
      </div>
    </div>
  );
}

// Template 2: Professional Green - Corporate Style
export function InvoiceTemplate2({ data }: InvoiceTemplateProps) {
  const [qrCode, setQrCode] = useState<string>('');

  useEffect(() => {
    if (data.upiId) {
      const upiUrl = `upi://pay?pa=${data.upiId}&pn=${encodeURIComponent(data.companyName)}&am=${data.total}&cu=INR`;
      QRCode.toDataURL(upiUrl, { width: 120, margin: 1 })
        .then(setQrCode)
        .catch(console.error);
    }
  }, [data.upiId, data.companyName, data.total]);

  return (
    <div style={{ backgroundColor: '#f9fafb', padding: '48px', maxWidth: '800px', margin: '0 auto', minHeight: '1056px', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <div style={{ backgroundColor: '#ffffff', padding: '32px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px', marginBottom: '32px' }}>
          <div>
            <h1 style={{ fontSize: '48px', fontWeight: 'bold', color: '#1f2937', marginBottom: '16px', margin: '0' }}>INVOICE</h1>
            <div style={{ backgroundColor: '#10b981', padding: '16px', color: '#ffffff' }}>
              <p style={{ fontWeight: 'bold', margin: '4px 0', fontSize: '16px' }}>{data.companyName}</p>
              <p style={{ fontSize: '14px', margin: '4px 0' }}>{data.companyAddress}</p>
              <p style={{ fontSize: '14px', margin: '4px 0' }}>{data.companyPhone}</p>
              <p style={{ fontSize: '14px', margin: '4px 0' }}>{data.companyEmail}</p>
              {data.companyGST && <p style={{ fontSize: '14px', margin: '4px 0' }}>GST: {data.companyGST}</p>}
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ marginBottom: '16px' }}>
              <p style={{ fontSize: '14px', color: '#6b7280', margin: '4px 0' }}>Invoice Number</p>
              <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#10b981', margin: '4px 0' }}>{data.invoiceNumber}</p>
            </div>
            <div>
              <p style={{ fontSize: '14px', color: '#6b7280', margin: '4px 0' }}>Date: {data.date}</p>
              <p style={{ fontSize: '14px', color: '#6b7280', margin: '4px 0' }}>Due: {data.dueDate}</p>
            </div>
          </div>
        </div>

        <div style={{ backgroundColor: '#f3f4f6', padding: '16px', marginBottom: '32px' }}>
          <h3 style={{ fontWeight: '600', color: '#1f2937', marginBottom: '8px', fontSize: '14px' }}>BILL TO:</h3>
          <p style={{ fontWeight: 'bold', margin: '4px 0', fontSize: '16px', color: '#000' }}>{data.clientName}</p>
          <p style={{ fontSize: '14px', color: '#6b7280', margin: '4px 0' }}>{data.clientAddress}</p>
          <p style={{ fontSize: '14px', color: '#6b7280', margin: '4px 0' }}>{data.clientPhone}</p>
          <p style={{ fontSize: '14px', color: '#6b7280', margin: '4px 0' }}>{data.clientEmail}</p>
          {data.clientGST && <p style={{ fontSize: '14px', color: '#6b7280', margin: '4px 0' }}>GST: {data.clientGST}</p>}
        </div>

        <table style={{ width: '100%', marginBottom: '32px', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #10b981' }}>
              <th style={{ textAlign: 'left', padding: '12px', color: '#1f2937', fontSize: '14px', fontWeight: '600' }}>Description</th>
              <th style={{ textAlign: 'right', padding: '12px', color: '#1f2937', fontSize: '14px', fontWeight: '600' }}>Qty</th>
              <th style={{ textAlign: 'right', padding: '12px', color: '#1f2937', fontSize: '14px', fontWeight: '600' }}>Rate</th>
              <th style={{ textAlign: 'right', padding: '12px', color: '#1f2937', fontSize: '14px', fontWeight: '600' }}>Amount</th>
            </tr>
          </thead>
          <tbody>
            {data.items.map((item, index) => (
              <tr key={index} style={{ borderBottom: '1px solid #e5e7eb' }}>
                <td style={{ padding: '12px', fontSize: '14px', color: '#000' }}>{item.description}</td>
                <td style={{ textAlign: 'right', padding: '12px', fontSize: '14px', color: '#000' }}>{item.quantity}</td>
                <td style={{ textAlign: 'right', padding: '12px', fontSize: '14px', color: '#000' }}>₹{item.rate.toFixed(2)}</td>
                <td style={{ textAlign: 'right', padding: '12px', fontSize: '14px', fontWeight: '600', color: '#000' }}>₹{item.amount.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          {qrCode && (
            <div style={{ textAlign: 'center' }}>
              <img src={qrCode} alt="UPI QR Code" style={{ width: '120px', height: '120px' }} />
              <p style={{ fontSize: '12px', color: '#6b7280', marginTop: '8px' }}>Scan to Pay via UPI</p>
            </div>
          )}
          <div style={{ width: '256px', marginLeft: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0' }}>
              <span style={{ color: '#6b7280', fontSize: '14px' }}>Subtotal:</span>
              <span style={{ fontSize: '14px', color: '#000' }}>₹{data.subtotal.toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0' }}>
              <span style={{ color: '#6b7280', fontSize: '14px' }}>Tax (GST):</span>
              <span style={{ fontSize: '14px', color: '#000' }}>₹{data.tax.toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px', backgroundColor: '#10b981', color: '#ffffff', marginTop: '8px' }}>
              <span style={{ fontWeight: 'bold', fontSize: '18px' }}>TOTAL:</span>
              <span style={{ fontWeight: 'bold', fontSize: '18px' }}>₹{data.total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {data.notes && (
          <div style={{ marginTop: '32px', paddingTop: '16px', borderTop: '1px solid #e5e7eb' }}>
            <h3 style={{ fontWeight: '600', color: '#1f2937', marginBottom: '8px', fontSize: '14px' }}>Notes:</h3>
            <p style={{ color: '#6b7280', fontSize: '14px', lineHeight: '1.5' }}>{data.notes}</p>
          </div>
        )}

        <div style={{ marginTop: '48px', textAlign: 'center', fontSize: '12px', color: '#9ca3af' }}>
          <p style={{ margin: '4px 0' }}>Created with PDFDecor • Free Professional PDF Tool</p>
          <p style={{ margin: '4px 0' }}>https://pdfdecor.in</p>
        </div>
      </div>
    </div>
  );
}

// Template 3: Elegant Purple - Creative Style
export function InvoiceTemplate3({ data }: InvoiceTemplateProps) {
  const [qrCode, setQrCode] = useState<string>('');

  useEffect(() => {
    if (data.upiId) {
      const upiUrl = `upi://pay?pa=${data.upiId}&pn=${encodeURIComponent(data.companyName)}&am=${data.total}&cu=INR`;
      QRCode.toDataURL(upiUrl, { width: 120, margin: 1 })
        .then(setQrCode)
        .catch(console.error);
    }
  }, [data.upiId, data.companyName, data.total]);

  return (
    <div style={{ background: 'linear-gradient(135deg, #faf5ff 0%, #fce7f3 100%)', padding: '48px', maxWidth: '800px', margin: '0 auto', minHeight: '1056px', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <div style={{ backgroundColor: '#ffffff', padding: '32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '32px' }}>
          <div>
            <h1 style={{ fontSize: '56px', fontWeight: 'bold', background: 'linear-gradient(135deg, #9333ea 0%, #ec4899 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', margin: '0', lineHeight: '1' }}>
              INVOICE
            </h1>
          </div>
          <div style={{ textAlign: 'right' }}>
            <p style={{ fontSize: '28px', fontWeight: 'bold', color: '#9333ea', margin: '0' }}>#{data.invoiceNumber}</p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '32px' }}>
          <div style={{ borderLeft: '4px solid #9333ea', paddingLeft: '16px' }}>
            <h3 style={{ fontWeight: '600', color: '#9333ea', marginBottom: '12px', fontSize: '14px' }}>FROM</h3>
            <p style={{ fontWeight: 'bold', fontSize: '18px', margin: '4px 0', color: '#000' }}>{data.companyName}</p>
            <p style={{ fontSize: '14px', color: '#6b7280', margin: '4px 0' }}>{data.companyAddress}</p>
            <p style={{ fontSize: '14px', color: '#6b7280', margin: '4px 0' }}>{data.companyPhone}</p>
            <p style={{ fontSize: '14px', color: '#6b7280', margin: '4px 0' }}>{data.companyEmail}</p>
            {data.companyGST && <p style={{ fontSize: '14px', color: '#6b7280', margin: '4px 0' }}>GST: {data.companyGST}</p>}
          </div>
          <div style={{ borderLeft: '4px solid #ec4899', paddingLeft: '16px' }}>
            <h3 style={{ fontWeight: '600', color: '#ec4899', marginBottom: '12px', fontSize: '14px' }}>TO</h3>
            <p style={{ fontWeight: 'bold', fontSize: '18px', margin: '4px 0', color: '#000' }}>{data.clientName}</p>
            <p style={{ fontSize: '14px', color: '#6b7280', margin: '4px 0' }}>{data.clientAddress}</p>
            <p style={{ fontSize: '14px', color: '#6b7280', margin: '4px 0' }}>{data.clientPhone}</p>
            <p style={{ fontSize: '14px', color: '#6b7280', margin: '4px 0' }}>{data.clientEmail}</p>
            {data.clientGST && <p style={{ fontSize: '14px', color: '#6b7280', margin: '4px 0' }}>GST: {data.clientGST}</p>}
          </div>
        </div>

        <div style={{ display: 'flex', gap: '16px', marginBottom: '32px' }}>
          <div style={{ background: 'linear-gradient(135deg, #faf5ff 0%, #fce7f3 100%)', padding: '12px', borderRadius: '8px', flex: '1' }}>
            <p style={{ fontSize: '12px', color: '#6b7280', margin: '0' }}>Date</p>
            <p style={{ fontWeight: '600', margin: '4px 0', color: '#000' }}>{data.date}</p>
          </div>
          <div style={{ background: 'linear-gradient(135deg, #faf5ff 0%, #fce7f3 100%)', padding: '12px', borderRadius: '8px', flex: '1' }}>
            <p style={{ fontSize: '12px', color: '#6b7280', margin: '0' }}>Due Date</p>
            <p style={{ fontWeight: '600', margin: '4px 0', color: '#000' }}>{data.dueDate}</p>
          </div>
        </div>

        <table style={{ width: '100%', marginBottom: '24px', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: 'linear-gradient(135deg, #9333ea 0%, #ec4899 100%)', color: '#ffffff' }}>
              <th style={{ textAlign: 'left', padding: '12px', fontSize: '14px', fontWeight: '600' }}>Description</th>
              <th style={{ textAlign: 'right', padding: '12px', fontSize: '14px', fontWeight: '600' }}>Qty</th>
              <th style={{ textAlign: 'right', padding: '12px', fontSize: '14px', fontWeight: '600' }}>Rate</th>
              <th style={{ textAlign: 'right', padding: '12px', fontSize: '14px', fontWeight: '600' }}>Amount</th>
            </tr>
          </thead>
          <tbody>
            {data.items.map((item, index) => (
              <tr key={index} style={{ borderBottom: '1px solid #e5e7eb' }}>
                <td style={{ padding: '12px', fontSize: '14px', color: '#000' }}>{item.description}</td>
                <td style={{ textAlign: 'right', padding: '12px', fontSize: '14px', color: '#000' }}>{item.quantity}</td>
                <td style={{ textAlign: 'right', padding: '12px', fontSize: '14px', color: '#000' }}>₹{item.rate.toFixed(2)}</td>
                <td style={{ textAlign: 'right', padding: '12px', fontSize: '14px', fontWeight: '600', color: '#000' }}>₹{item.amount.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
          {qrCode && (
            <div style={{ textAlign: 'center' }}>
              <img src={qrCode} alt="UPI QR Code" style={{ width: '120px', height: '120px' }} />
              <p style={{ fontSize: '12px', color: '#6b7280', marginTop: '8px' }}>Pay via UPI</p>
            </div>
          )}
          <div style={{ width: '256px', marginLeft: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0' }}>
              <span style={{ color: '#6b7280', fontSize: '14px' }}>Subtotal:</span>
              <span style={{ fontSize: '14px', color: '#000' }}>₹{data.subtotal.toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0' }}>
              <span style={{ color: '#6b7280', fontSize: '14px' }}>Tax (GST):</span>
              <span style={{ fontSize: '14px', color: '#000' }}>₹{data.tax.toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '16px', background: 'linear-gradient(135deg, #9333ea 0%, #ec4899 100%)', color: '#ffffff', marginTop: '8px', borderRadius: '8px' }}>
              <span style={{ fontWeight: 'bold', fontSize: '20px' }}>TOTAL:</span>
              <span style={{ fontWeight: 'bold', fontSize: '20px' }}>₹{data.total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {data.notes && (
          <div style={{ background: 'linear-gradient(135deg, #faf5ff 0%, #fce7f3 100%)', padding: '16px', borderRadius: '8px' }}>
            <h3 style={{ fontWeight: '600', color: '#9333ea', marginBottom: '8px', fontSize: '14px' }}>Notes:</h3>
            <p style={{ color: '#6b7280', fontSize: '14px', lineHeight: '1.5' }}>{data.notes}</p>
          </div>
        )}

        <div style={{ marginTop: '48px', textAlign: 'center', fontSize: '12px', color: '#9ca3af' }}>
          <p style={{ margin: '4px 0' }}>Created with PDFDecor • Free Professional PDF Tool</p>
          <p style={{ margin: '4px 0' }}>https://pdfdecor.in</p>
        </div>
      </div>
    </div>
  );
}

// Template 4: Minimalist Black - Bold and Simple
export function InvoiceTemplate4({ data }: InvoiceTemplateProps) {
  const [qrCode, setQrCode] = useState<string>('');

  useEffect(() => {
    if (data.upiId) {
      const upiUrl = `upi://pay?pa=${data.upiId}&pn=${encodeURIComponent(data.companyName)}&am=${data.total}&cu=INR`;
      QRCode.toDataURL(upiUrl, { width: 120, margin: 1 })
        .then(setQrCode)
        .catch(console.error);
    }
  }, [data.upiId, data.companyName, data.total]);

  return (
    <div style={{ backgroundColor: '#ffffff', padding: '48px', maxWidth: '800px', margin: '0 auto', minHeight: '1056px', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <div style={{ borderBottom: '8px solid #000000', paddingBottom: '24px', marginBottom: '32px' }}>
        <h1 style={{ fontSize: '64px', fontWeight: 'bold', color: '#000000', margin: '0', letterSpacing: '-2px' }}>INVOICE</h1>
        <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#6b7280', margin: '8px 0' }}>#{data.invoiceNumber}</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '32px', marginBottom: '40px' }}>
        <div>
          <div style={{ marginBottom: '24px' }}>
            <h3 style={{ fontSize: '12px', fontWeight: '700', color: '#6b7280', marginBottom: '8px', letterSpacing: '1px' }}>FROM</h3>
            <p style={{ fontSize: '20px', fontWeight: 'bold', margin: '4px 0', color: '#000' }}>{data.companyName}</p>
            <p style={{ fontSize: '14px', color: '#6b7280', margin: '2px 0' }}>{data.companyAddress}</p>
            <p style={{ fontSize: '14px', color: '#6b7280', margin: '2px 0' }}>{data.companyPhone}</p>
            <p style={{ fontSize: '14px', color: '#6b7280', margin: '2px 0' }}>{data.companyEmail}</p>
            {data.companyGST && <p style={{ fontSize: '14px', color: '#6b7280', margin: '2px 0' }}>GST: {data.companyGST}</p>}
          </div>
          <div>
            <h3 style={{ fontSize: '12px', fontWeight: '700', color: '#6b7280', marginBottom: '8px', letterSpacing: '1px' }}>TO</h3>
            <p style={{ fontSize: '20px', fontWeight: 'bold', margin: '4px 0', color: '#000' }}>{data.clientName}</p>
            <p style={{ fontSize: '14px', color: '#6b7280', margin: '2px 0' }}>{data.clientAddress}</p>
            <p style={{ fontSize: '14px', color: '#6b7280', margin: '2px 0' }}>{data.clientPhone}</p>
            <p style={{ fontSize: '14px', color: '#6b7280', margin: '2px 0' }}>{data.clientEmail}</p>
            {data.clientGST && <p style={{ fontSize: '14px', color: '#6b7280', margin: '2px 0' }}>GST: {data.clientGST}</p>}
          </div>
        </div>
        <div>
          <div style={{ backgroundColor: '#f3f4f6', padding: '16px', marginBottom: '16px' }}>
            <p style={{ fontSize: '12px', color: '#6b7280', margin: '0' }}>Invoice Date</p>
            <p style={{ fontSize: '18px', fontWeight: 'bold', margin: '4px 0', color: '#000' }}>{data.date}</p>
          </div>
          <div style={{ backgroundColor: '#f3f4f6', padding: '16px' }}>
            <p style={{ fontSize: '12px', color: '#6b7280', margin: '0' }}>Due Date</p>
            <p style={{ fontSize: '18px', fontWeight: 'bold', margin: '4px 0', color: '#000' }}>{data.dueDate}</p>
          </div>
        </div>
      </div>

      <table style={{ width: '100%', marginBottom: '32px', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ borderBottom: '3px solid #000000' }}>
            <th style={{ textAlign: 'left', padding: '12px 0', color: '#000000', fontSize: '12px', fontWeight: '700', letterSpacing: '1px' }}>DESCRIPTION</th>
            <th style={{ textAlign: 'right', padding: '12px 0', color: '#000000', fontSize: '12px', fontWeight: '700', letterSpacing: '1px' }}>QTY</th>
            <th style={{ textAlign: 'right', padding: '12px 0', color: '#000000', fontSize: '12px', fontWeight: '700', letterSpacing: '1px' }}>RATE</th>
            <th style={{ textAlign: 'right', padding: '12px 0', color: '#000000', fontSize: '12px', fontWeight: '700', letterSpacing: '1px' }}>AMOUNT</th>
          </tr>
        </thead>
        <tbody>
          {data.items.map((item, index) => (
            <tr key={index} style={{ borderBottom: '1px solid #e5e7eb' }}>
              <td style={{ padding: '16px 0', fontSize: '14px', color: '#000' }}>{item.description}</td>
              <td style={{ textAlign: 'right', padding: '16px 0', fontSize: '14px', color: '#000' }}>{item.quantity}</td>
              <td style={{ textAlign: 'right', padding: '16px 0', fontSize: '14px', color: '#000' }}>₹{item.rate.toFixed(2)}</td>
              <td style={{ textAlign: 'right', padding: '16px 0', fontSize: '16px', fontWeight: 'bold', color: '#000' }}>₹{item.amount.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        {qrCode && (
          <div style={{ textAlign: 'center' }}>
            <img src={qrCode} alt="UPI QR Code" style={{ width: '120px', height: '120px', border: '3px solid #000' }} />
            <p style={{ fontSize: '12px', color: '#6b7280', marginTop: '8px', fontWeight: '600' }}>SCAN TO PAY</p>
          </div>
        )}
        <div style={{ width: '300px', marginLeft: 'auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid #e5e7eb' }}>
            <span style={{ color: '#6b7280', fontSize: '14px' }}>Subtotal</span>
            <span style={{ fontSize: '14px', color: '#000' }}>₹{data.subtotal.toFixed(2)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid #e5e7eb' }}>
            <span style={{ color: '#6b7280', fontSize: '14px' }}>Tax (GST)</span>
            <span style={{ fontSize: '14px', color: '#000' }}>₹{data.tax.toFixed(2)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '20px 0', borderTop: '3px solid #000000', marginTop: '8px' }}>
            <span style={{ fontWeight: 'bold', fontSize: '24px', color: '#000', letterSpacing: '-1px' }}>TOTAL</span>
            <span style={{ fontWeight: 'bold', fontSize: '24px', color: '#000', letterSpacing: '-1px' }}>₹{data.total.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {data.notes && (
        <div style={{ marginTop: '48px', paddingTop: '24px', borderTop: '2px solid #e5e7eb' }}>
          <h3 style={{ fontSize: '12px', fontWeight: '700', color: '#6b7280', marginBottom: '8px', letterSpacing: '1px' }}>NOTES</h3>
          <p style={{ color: '#374151', fontSize: '14px', lineHeight: '1.6' }}>{data.notes}</p>
        </div>
      )}

      <div style={{ marginTop: '64px', textAlign: 'center', fontSize: '11px', color: '#9ca3af' }}>
        <p style={{ margin: '4px 0' }}>Created with PDFDecor • Free Professional PDF Tool</p>
        <p style={{ margin: '4px 0' }}>https://pdfdecor.in</p>
      </div>
    </div>
  );
}

// Template 5: Orange Accent - Warm and Friendly
export function InvoiceTemplate5({ data }: InvoiceTemplateProps) {
  const [qrCode, setQrCode] = useState<string>('');

  useEffect(() => {
    if (data.upiId) {
      const upiUrl = `upi://pay?pa=${data.upiId}&pn=${encodeURIComponent(data.companyName)}&am=${data.total}&cu=INR`;
      QRCode.toDataURL(upiUrl, { width: 120, margin: 1 })
        .then(setQrCode)
        .catch(console.error);
    }
  }, [data.upiId, data.companyName, data.total]);

  return (
    <div style={{ backgroundColor: '#fff7ed', padding: '48px', maxWidth: '800px', margin: '0 auto', minHeight: '1056px', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <div style={{ backgroundColor: '#ffffff', padding: '40px', border: '3px solid #f97316', borderRadius: '12px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', paddingBottom: '24px', borderBottom: '2px solid #fed7aa' }}>
          <div>
            <h1 style={{ fontSize: '48px', fontWeight: 'bold', color: '#ea580c', margin: '0' }}>INVOICE</h1>
            <p style={{ fontSize: '18px', color: '#9a3412', margin: '8px 0' }}>Invoice #{data.invoiceNumber}</p>
          </div>
          <div style={{ backgroundColor: '#ffedd5', padding: '16px 24px', borderRadius: '8px', border: '2px solid #fb923c' }}>
            <p style={{ fontSize: '12px', color: '#9a3412', margin: '0' }}>Amount Due</p>
            <p style={{ fontSize: '32px', fontWeight: 'bold', color: '#ea580c', margin: '4px 0' }}>₹{data.total.toFixed(2)}</p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px', marginBottom: '32px' }}>
          <div style={{ backgroundColor: '#fff7ed', padding: '20px', borderRadius: '8px', borderLeft: '4px solid #f97316' }}>
            <h3 style={{ fontSize: '14px', fontWeight: '700', color: '#ea580c', marginBottom: '12px' }}>From:</h3>
            <p style={{ fontSize: '18px', fontWeight: 'bold', margin: '4px 0', color: '#000' }}>{data.companyName}</p>
            <p style={{ fontSize: '14px', color: '#78350f', margin: '4px 0' }}>{data.companyAddress}</p>
            <p style={{ fontSize: '14px', color: '#78350f', margin: '4px 0' }}>{data.companyPhone}</p>
            <p style={{ fontSize: '14px', color: '#78350f', margin: '4px 0' }}>{data.companyEmail}</p>
            {data.companyGST && <p style={{ fontSize: '14px', color: '#78350f', margin: '4px 0' }}>GST: {data.companyGST}</p>}
          </div>
          <div style={{ backgroundColor: '#fff7ed', padding: '20px', borderRadius: '8px', borderLeft: '4px solid #f97316' }}>
            <h3 style={{ fontSize: '14px', fontWeight: '700', color: '#ea580c', marginBottom: '12px' }}>To:</h3>
            <p style={{ fontSize: '18px', fontWeight: 'bold', margin: '4px 0', color: '#000' }}>{data.clientName}</p>
            <p style={{ fontSize: '14px', color: '#78350f', margin: '4px 0' }}>{data.clientAddress}</p>
            <p style={{ fontSize: '14px', color: '#78350f', margin: '4px 0' }}>{data.clientPhone}</p>
            <p style={{ fontSize: '14px', color: '#78350f', margin: '4px 0' }}>{data.clientEmail}</p>
            {data.clientGST && <p style={{ fontSize: '14px', color: '#78350f', margin: '4px 0' }}>GST: {data.clientGST}</p>}
          </div>
        </div>

        <div style={{ display: 'flex', gap: '16px', marginBottom: '32px' }}>
          <div style={{ flex: '1', backgroundColor: '#ffedd5', padding: '12px', borderRadius: '8px', textAlign: 'center' }}>
            <p style={{ fontSize: '12px', color: '#9a3412', margin: '0', fontWeight: '600' }}>Issue Date</p>
            <p style={{ fontSize: '16px', fontWeight: 'bold', margin: '4px 0', color: '#000' }}>{data.date}</p>
          </div>
          <div style={{ flex: '1', backgroundColor: '#ffedd5', padding: '12px', borderRadius: '8px', textAlign: 'center' }}>
            <p style={{ fontSize: '12px', color: '#9a3412', margin: '0', fontWeight: '600' }}>Due Date</p>
            <p style={{ fontSize: '16px', fontWeight: 'bold', margin: '4px 0', color: '#000' }}>{data.dueDate}</p>
          </div>
        </div>

        <table style={{ width: '100%', marginBottom: '32px', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#f97316', color: '#ffffff' }}>
              <th style={{ textAlign: 'left', padding: '14px', fontSize: '14px', fontWeight: '600', borderRadius: '8px 0 0 0' }}>Description</th>
              <th style={{ textAlign: 'center', padding: '14px', fontSize: '14px', fontWeight: '600' }}>Qty</th>
              <th style={{ textAlign: 'right', padding: '14px', fontSize: '14px', fontWeight: '600' }}>Rate</th>
              <th style={{ textAlign: 'right', padding: '14px', fontSize: '14px', fontWeight: '600', borderRadius: '0 8px 0 0' }}>Amount</th>
            </tr>
          </thead>
          <tbody>
            {data.items.map((item, index) => (
              <tr key={index} style={{ backgroundColor: index % 2 === 0 ? '#ffffff' : '#fff7ed', borderBottom: '1px solid #fed7aa' }}>
                <td style={{ padding: '14px', fontSize: '14px', color: '#000' }}>{item.description}</td>
                <td style={{ textAlign: 'center', padding: '14px', fontSize: '14px', color: '#000' }}>{item.quantity}</td>
                <td style={{ textAlign: 'right', padding: '14px', fontSize: '14px', color: '#000' }}>₹{item.rate.toFixed(2)}</td>
                <td style={{ textAlign: 'right', padding: '14px', fontSize: '14px', fontWeight: '600', color: '#000' }}>₹{item.amount.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          {qrCode && (
            <div style={{ textAlign: 'center', backgroundColor: '#fff7ed', padding: '16px', borderRadius: '8px', border: '2px solid #fb923c' }}>
              <img src={qrCode} alt="UPI QR Code" style={{ width: '120px', height: '120px' }} />
              <p style={{ fontSize: '12px', color: '#9a3412', marginTop: '8px', fontWeight: '600' }}>Scan to Pay</p>
            </div>
          )}
          <div style={{ width: '280px', marginLeft: 'auto' }}>
            <div style={{ backgroundColor: '#fff7ed', padding: '16px', borderRadius: '8px', marginBottom: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ color: '#78350f', fontSize: '14px' }}>Subtotal:</span>
                <span style={{ fontSize: '14px', fontWeight: '600', color: '#000' }}>₹{data.subtotal.toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#78350f', fontSize: '14px' }}>Tax (GST):</span>
                <span style={{ fontSize: '14px', fontWeight: '600', color: '#000' }}>₹{data.tax.toFixed(2)}</span>
              </div>
            </div>
            <div style={{ backgroundColor: '#f97316', color: '#ffffff', padding: '20px', borderRadius: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '18px', fontWeight: 'bold' }}>Total Due:</span>
                <span style={{ fontSize: '28px', fontWeight: 'bold' }}>₹{data.total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        {data.notes && (
          <div style={{ marginTop: '32px', backgroundColor: '#fff7ed', padding: '20px', borderRadius: '8px', borderLeft: '4px solid #f97316' }}>
            <h3 style={{ fontSize: '14px', fontWeight: '700', color: '#ea580c', marginBottom: '8px' }}>Additional Notes:</h3>
            <p style={{ color: '#78350f', fontSize: '14px', lineHeight: '1.6' }}>{data.notes}</p>
          </div>
        )}

        <div style={{ marginTop: '48px', textAlign: 'center', paddingTop: '24px', borderTop: '2px solid #fed7aa' }}>
          <p style={{ fontSize: '12px', color: '#9a3412', margin: '4px 0' }}>Created with PDFDecor • Free Professional PDF Tool</p>
          <p style={{ fontSize: '12px', color: '#9a3412', margin: '4px 0' }}>https://pdfdecor.in</p>
        </div>
      </div>
    </div>
  );
}