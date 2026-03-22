export interface EstimateData {
  estimateNumber: string;
  date: string;
  validUntil: string;
  companyName: string;
  companyAddress: string;
  companyPhone: string;
  companyEmail: string;
  companyGST?: string;
  clientName: string;
  clientAddress: string;
  clientPhone: string;
  clientEmail?: string;
  items: Array<{ description: string; quantity: number; rate: number; amount: number }>;
  subtotal: number;
  taxRate: number;
  tax: number;
  total: number;
  notes?: string;
  paymentTerms?: string;
}

interface Props { data: EstimateData; isPro?: boolean; }

export function EstimateTemplate1({ data, isPro = false }: Props) {
  return (
    <div style={{ backgroundColor: '#fff', padding: '48px', maxWidth: '800px', margin: '0 auto', minHeight: '1056px', fontFamily: 'system-ui, sans-serif', position: 'relative' }}>
      {!isPro && <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%) rotate(-45deg)', fontSize: '48px', fontWeight: 'bold', color: 'rgba(128,128,128,0.12)', pointerEvents: 'none', whiteSpace: 'nowrap', zIndex: 9999 }}>PDFDecor Free</div>}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '3px solid #f59e0b', paddingBottom: '20px', marginBottom: '28px' }}>
        <div>
          <h1 style={{ fontSize: '36px', fontWeight: '900', color: '#d97706', margin: 0, letterSpacing: '2px' }}>ESTIMATE</h1>
          <p style={{ color: '#6b7280', margin: '4px 0 0', fontSize: '13px' }}>#{data.estimateNumber}</p>
        </div>
        <div style={{ textAlign: 'right', fontSize: '13px', color: '#374151' }}>
          <p style={{ margin: '2px 0' }}>Date: {data.date}</p>
          <p style={{ margin: '2px 0' }}>Valid Until: {data.validUntil}</p>
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '28px', marginBottom: '28px' }}>
        <div>
          <h3 style={{ color: '#d97706', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px', margin: '0 0 8px' }}>From</h3>
          <p style={{ fontWeight: 'bold', fontSize: '16px', margin: '0 0 4px' }}>{data.companyName}</p>
          <p style={{ color: '#6b7280', fontSize: '13px', margin: '2px 0' }}>{data.companyAddress}</p>
          <p style={{ color: '#6b7280', fontSize: '13px', margin: '2px 0' }}>{data.companyPhone}</p>
          <p style={{ color: '#6b7280', fontSize: '13px', margin: '2px 0' }}>{data.companyEmail}</p>
          {data.companyGST && <p style={{ color: '#6b7280', fontSize: '13px', margin: '2px 0' }}>GST: {data.companyGST}</p>}
        </div>
        <div>
          <h3 style={{ color: '#d97706', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px', margin: '0 0 8px' }}>Estimate For</h3>
          <p style={{ fontWeight: 'bold', fontSize: '16px', margin: '0 0 4px' }}>{data.clientName}</p>
          <p style={{ color: '#6b7280', fontSize: '13px', margin: '2px 0' }}>{data.clientAddress}</p>
          <p style={{ color: '#6b7280', fontSize: '13px', margin: '2px 0' }}>{data.clientPhone}</p>
          {data.clientEmail && <p style={{ color: '#6b7280', fontSize: '13px', margin: '2px 0' }}>{data.clientEmail}</p>}
        </div>
      </div>
      <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '24px' }}>
        <thead>
          <tr style={{ background: '#f59e0b' }}>
            <th style={{ textAlign: 'left', padding: '10px 12px', fontSize: '13px', color: '#fff' }}>Description</th>
            <th style={{ textAlign: 'right', padding: '10px 12px', fontSize: '13px', color: '#fff' }}>Qty</th>
            <th style={{ textAlign: 'right', padding: '10px 12px', fontSize: '13px', color: '#fff' }}>Rate</th>
            <th style={{ textAlign: 'right', padding: '10px 12px', fontSize: '13px', color: '#fff' }}>Amount</th>
          </tr>
        </thead>
        <tbody>
          {data.items.map((item, i) => (
            <tr key={i} style={{ borderBottom: '1px solid #fef3c7', backgroundColor: i % 2 === 0 ? '#fffbeb' : '#fff' }}>
              <td style={{ padding: '10px 12px', fontSize: '13px' }}>{item.description}</td>
              <td style={{ textAlign: 'right', padding: '10px 12px', fontSize: '13px' }}>{item.quantity}</td>
              <td style={{ textAlign: 'right', padding: '10px 12px', fontSize: '13px' }}>₹{item.rate.toFixed(2)}</td>
              <td style={{ textAlign: 'right', padding: '10px 12px', fontSize: '13px' }}>₹{item.amount.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ maxWidth: '300px' }}>
          {data.notes && <p style={{ fontSize: '12px', color: '#6b7280', marginBottom: '8px' }}><strong>Notes:</strong> {data.notes}</p>}
          {data.paymentTerms && <p style={{ fontSize: '12px', color: '#6b7280' }}><strong>Terms:</strong> {data.paymentTerms}</p>}
          <div style={{ marginTop: '12px', background: '#fffbeb', border: '1px solid #fde68a', borderRadius: '8px', padding: '12px' }}>
            <p style={{ fontSize: '12px', color: '#92400e', margin: 0 }}>⚠️ This is an estimate. Final amount may vary.</p>
          </div>
        </div>
        <div style={{ width: '220px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #e5e7eb' }}>
            <span style={{ fontSize: '13px', color: '#6b7280' }}>Subtotal</span><span style={{ fontSize: '13px' }}>₹{data.subtotal.toFixed(2)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #e5e7eb' }}>
            <span style={{ fontSize: '13px', color: '#6b7280' }}>GST ({data.taxRate}%)</span><span style={{ fontSize: '13px' }}>₹{data.tax.toFixed(2)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', background: '#f59e0b', color: '#fff', padding: '10px 12px', borderRadius: '8px', marginTop: '8px' }}>
            <span style={{ fontWeight: 'bold' }}>ESTIMATE TOTAL</span><span style={{ fontWeight: 'bold' }}>₹{data.total.toFixed(2)}</span>
          </div>
        </div>
      </div>
      {!isPro && <p style={{ textAlign: 'center', fontSize: '11px', color: '#9ca3af', marginTop: '32px' }}>Generated by PDFDecor.in</p>}
    </div>
  );
}

export function EstimateTemplate2({ data, isPro = false }: Props) {
  return (
    <div style={{ backgroundColor: '#fff', padding: '48px', maxWidth: '800px', margin: '0 auto', minHeight: '1056px', fontFamily: 'system-ui, sans-serif', position: 'relative' }}>
      {!isPro && <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%) rotate(-45deg)', fontSize: '48px', fontWeight: 'bold', color: 'rgba(128,128,128,0.12)', pointerEvents: 'none', whiteSpace: 'nowrap', zIndex: 9999 }}>PDFDecor Free</div>}
      <div style={{ background: 'linear-gradient(135deg, #0ea5e9, #0284c7)', color: '#fff', padding: '28px', borderRadius: '12px', marginBottom: '28px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: '900', margin: 0, letterSpacing: '2px' }}>ESTIMATE</h1>
            <p style={{ opacity: 0.8, margin: '4px 0 0', fontSize: '13px' }}>#{data.estimateNumber} · Valid until {data.validUntil}</p>
          </div>
          <div style={{ textAlign: 'right', opacity: 0.9 }}>
            <p style={{ fontWeight: 'bold', fontSize: '18px', margin: 0 }}>{data.companyName}</p>
            <p style={{ fontSize: '12px', margin: '4px 0 0' }}>{data.date}</p>
          </div>
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
        <div style={{ background: '#f0f9ff', padding: '16px', borderRadius: '8px' }}>
          <p style={{ fontSize: '11px', color: '#0284c7', textTransform: 'uppercase', letterSpacing: '1px', margin: '0 0 8px' }}>Prepared By</p>
          <p style={{ fontWeight: 'bold', fontSize: '15px', margin: '0 0 4px' }}>{data.companyName}</p>
          <p style={{ color: '#6b7280', fontSize: '12px', margin: '2px 0' }}>{data.companyAddress}</p>
          <p style={{ color: '#6b7280', fontSize: '12px', margin: '2px 0' }}>{data.companyPhone}</p>
        </div>
        <div style={{ background: '#f0f9ff', padding: '16px', borderRadius: '8px' }}>
          <p style={{ fontSize: '11px', color: '#0284c7', textTransform: 'uppercase', letterSpacing: '1px', margin: '0 0 8px' }}>Prepared For</p>
          <p style={{ fontWeight: 'bold', fontSize: '15px', margin: '0 0 4px' }}>{data.clientName}</p>
          <p style={{ color: '#6b7280', fontSize: '12px', margin: '2px 0' }}>{data.clientAddress}</p>
          <p style={{ color: '#6b7280', fontSize: '12px', margin: '2px 0' }}>{data.clientPhone}</p>
        </div>
      </div>
      <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '24px' }}>
        <thead>
          <tr style={{ background: '#0ea5e9', color: '#fff' }}>
            <th style={{ textAlign: 'left', padding: '10px 12px', fontSize: '13px' }}>Description</th>
            <th style={{ textAlign: 'right', padding: '10px 12px', fontSize: '13px' }}>Qty</th>
            <th style={{ textAlign: 'right', padding: '10px 12px', fontSize: '13px' }}>Rate</th>
            <th style={{ textAlign: 'right', padding: '10px 12px', fontSize: '13px' }}>Amount</th>
          </tr>
        </thead>
        <tbody>
          {data.items.map((item, i) => (
            <tr key={i} style={{ borderBottom: '1px solid #e0f2fe', backgroundColor: i % 2 === 0 ? '#f0f9ff' : '#fff' }}>
              <td style={{ padding: '10px 12px', fontSize: '13px' }}>{item.description}</td>
              <td style={{ textAlign: 'right', padding: '10px 12px', fontSize: '13px' }}>{item.quantity}</td>
              <td style={{ textAlign: 'right', padding: '10px 12px', fontSize: '13px' }}>₹{item.rate.toFixed(2)}</td>
              <td style={{ textAlign: 'right', padding: '10px 12px', fontSize: '13px' }}>₹{item.amount.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <div style={{ width: '240px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0' }}><span style={{ fontSize: '13px', color: '#6b7280' }}>Subtotal</span><span style={{ fontSize: '13px' }}>₹{data.subtotal.toFixed(2)}</span></div>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #e5e7eb' }}><span style={{ fontSize: '13px', color: '#6b7280' }}>GST ({data.taxRate}%)</span><span style={{ fontSize: '13px' }}>₹{data.tax.toFixed(2)}</span></div>
          <div style={{ display: 'flex', justifyContent: 'space-between', background: '#0ea5e9', color: '#fff', padding: '10px 12px', borderRadius: '8px', marginTop: '8px' }}><span style={{ fontWeight: 'bold' }}>Estimate Total</span><span style={{ fontWeight: 'bold' }}>₹{data.total.toFixed(2)}</span></div>
        </div>
      </div>
      {!isPro && <p style={{ textAlign: 'center', fontSize: '11px', color: '#9ca3af', marginTop: '32px' }}>Generated by PDFDecor.in</p>}
    </div>
  );
}

export function EstimateTemplate3({ data, isPro = false }: Props) {
  return (
    <div style={{ backgroundColor: '#fff', padding: '48px', maxWidth: '800px', margin: '0 auto', minHeight: '1056px', fontFamily: 'Georgia, serif', position: 'relative', borderLeft: '6px solid #1f2937' }}>
      {!isPro && <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%) rotate(-45deg)', fontSize: '48px', fontWeight: 'bold', color: 'rgba(128,128,128,0.12)', pointerEvents: 'none', whiteSpace: 'nowrap', zIndex: 9999 }}>PDFDecor Free</div>}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderBottom: '2px solid #1f2937', paddingBottom: '20px', marginBottom: '28px' }}>
        <div>
          <h1 style={{ fontSize: '40px', fontWeight: 'bold', color: '#1f2937', margin: 0, letterSpacing: '4px' }}>ESTIMATE</h1>
          <p style={{ color: '#6b7280', margin: '4px 0 0', fontSize: '13px' }}>No. {data.estimateNumber}</p>
        </div>
        <div style={{ textAlign: 'right', fontSize: '13px', color: '#374151' }}>
          <p style={{ margin: '2px 0' }}>Issued: {data.date}</p>
          <p style={{ margin: '2px 0' }}>Valid: {data.validUntil}</p>
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '28px' }}>
        <div><p style={{ fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px', color: '#6b7280', margin: '0 0 8px' }}>Prepared By</p>
          <p style={{ fontWeight: 'bold', fontSize: '16px', margin: '0 0 4px' }}>{data.companyName}</p>
          <p style={{ color: '#6b7280', fontSize: '13px', margin: '2px 0' }}>{data.companyAddress}</p></div>
        <div><p style={{ fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px', color: '#6b7280', margin: '0 0 8px' }}>Prepared For</p>
          <p style={{ fontWeight: 'bold', fontSize: '16px', margin: '0 0 4px' }}>{data.clientName}</p>
          <p style={{ color: '#6b7280', fontSize: '13px', margin: '2px 0' }}>{data.clientAddress}</p></div>
      </div>
      <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '24px' }}>
        <thead>
          <tr style={{ borderBottom: '2px solid #1f2937' }}>
            <th style={{ textAlign: 'left', padding: '8px 4px', fontSize: '13px' }}>Description</th>
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
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0' }}><span style={{ fontSize: '13px' }}>Subtotal</span><span style={{ fontSize: '13px' }}>₹{data.subtotal.toFixed(2)}</span></div>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', borderBottom: '1px solid #e5e7eb' }}><span style={{ fontSize: '13px' }}>Tax ({data.taxRate}%)</span><span style={{ fontSize: '13px' }}>₹{data.tax.toFixed(2)}</span></div>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderTop: '2px solid #1f2937', marginTop: '8px' }}><span style={{ fontWeight: 'bold', fontSize: '15px' }}>ESTIMATE</span><span style={{ fontWeight: 'bold', fontSize: '15px' }}>₹{data.total.toFixed(2)}</span></div>
        </div>
      </div>
      {!isPro && <p style={{ textAlign: 'center', fontSize: '11px', color: '#9ca3af', marginTop: '32px' }}>Generated by PDFDecor.in</p>}
    </div>
  );
}

export function EstimateTemplate4({ data, isPro = false }: Props) {
  return (
    <div style={{ backgroundColor: '#f0fdf4', padding: '48px', maxWidth: '800px', margin: '0 auto', minHeight: '1056px', fontFamily: 'system-ui, sans-serif', position: 'relative' }}>
      <div style={{ background: '#fff', borderRadius: '16px', padding: '32px', boxShadow: '0 4px 24px rgba(0,0,0,0.06)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '2px solid #d1fae5', paddingBottom: '16px', marginBottom: '24px' }}>
          <div><h1 style={{ fontSize: '28px', fontWeight: '900', color: '#059669', margin: 0 }}>ESTIMATE</h1><p style={{ color: '#6b7280', margin: '4px 0 0', fontSize: '13px' }}>#{data.estimateNumber}</p></div>
          <div style={{ textAlign: 'right', fontSize: '13px' }}><p style={{ margin: '2px 0', color: '#374151' }}>Date: {data.date}</p><p style={{ margin: '2px 0', color: '#374151' }}>Valid: {data.validUntil}</p></div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
          <div style={{ background: '#f0fdf4', padding: '12px', borderRadius: '8px' }}>
            <p style={{ color: '#059669', fontSize: '11px', textTransform: 'uppercase', margin: '0 0 6px' }}>From</p>
            <p style={{ fontWeight: 'bold', margin: '0 0 2px' }}>{data.companyName}</p>
            <p style={{ color: '#6b7280', fontSize: '12px', margin: '2px 0' }}>{data.companyPhone}</p>
          </div>
          <div style={{ background: '#f0fdf4', padding: '12px', borderRadius: '8px' }}>
            <p style={{ color: '#059669', fontSize: '11px', textTransform: 'uppercase', margin: '0 0 6px' }}>For</p>
            <p style={{ fontWeight: 'bold', margin: '0 0 2px' }}>{data.clientName}</p>
            <p style={{ color: '#6b7280', fontSize: '12px', margin: '2px 0' }}>{data.clientPhone}</p>
          </div>
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px' }}>
          <thead><tr style={{ background: '#10b981', color: '#fff' }}>
            <th style={{ padding: '10px 12px', textAlign: 'left', fontSize: '13px' }}>Description</th>
            <th style={{ padding: '10px 12px', textAlign: 'right', fontSize: '13px' }}>Qty</th>
            <th style={{ padding: '10px 12px', textAlign: 'right', fontSize: '13px' }}>Rate</th>
            <th style={{ padding: '10px 12px', textAlign: 'right', fontSize: '13px' }}>Total</th>
          </tr></thead>
          <tbody>{data.items.map((item, i) => (
            <tr key={i} style={{ borderBottom: '1px solid #d1fae5' }}>
              <td style={{ padding: '10px 12px', fontSize: '13px' }}>{item.description}</td>
              <td style={{ textAlign: 'right', padding: '10px 12px', fontSize: '13px' }}>{item.quantity}</td>
              <td style={{ textAlign: 'right', padding: '10px 12px', fontSize: '13px' }}>₹{item.rate.toFixed(2)}</td>
              <td style={{ textAlign: 'right', padding: '10px 12px', fontSize: '13px' }}>₹{item.amount.toFixed(2)}</td>
            </tr>
          ))}</tbody>
        </table>
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <div style={{ width: '220px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0' }}><span style={{ fontSize: '13px', color: '#6b7280' }}>Subtotal</span><span style={{ fontSize: '13px' }}>₹{data.subtotal.toFixed(2)}</span></div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #d1fae5' }}><span style={{ fontSize: '13px', color: '#6b7280' }}>Tax ({data.taxRate}%)</span><span style={{ fontSize: '13px' }}>₹{data.tax.toFixed(2)}</span></div>
            <div style={{ display: 'flex', justifyContent: 'space-between', background: '#10b981', color: '#fff', padding: '10px 12px', borderRadius: '8px', marginTop: '8px' }}><span style={{ fontWeight: 'bold' }}>Estimate</span><span style={{ fontWeight: 'bold' }}>₹{data.total.toFixed(2)}</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function EstimateTemplate5({ data, isPro = false }: Props) {
  return (
    <div style={{ backgroundColor: '#0f172a', padding: '48px', maxWidth: '800px', margin: '0 auto', minHeight: '1056px', fontFamily: 'system-ui, sans-serif', color: '#e2e8f0' }}>
      <div style={{ borderBottom: '1px solid #334155', paddingBottom: '20px', marginBottom: '28px', display: 'flex', justifyContent: 'space-between' }}>
        <div><h1 style={{ fontSize: '32px', fontWeight: '900', color: '#a78bfa', margin: 0 }}>ESTIMATE</h1><p style={{ color: '#64748b', margin: '4px 0 0', fontSize: '12px' }}>#{data.estimateNumber}</p></div>
        <div style={{ textAlign: 'right', fontSize: '12px', color: '#94a3b8' }}><p style={{ margin: '2px 0' }}>Date: {data.date}</p><p style={{ margin: '2px 0' }}>Valid: {data.validUntil}</p><p style={{ margin: '6px 0 0', fontSize: '16px', fontWeight: 'bold', color: '#a78bfa' }}>₹{data.total.toFixed(2)}</p></div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '24px' }}>
        <div><p style={{ fontSize: '10px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '2px', margin: '0 0 6px' }}>From</p>
          <p style={{ fontWeight: 'bold', color: '#f1f5f9', margin: '0 0 2px' }}>{data.companyName}</p>
          <p style={{ color: '#94a3b8', fontSize: '12px', margin: '2px 0' }}>{data.companyPhone}</p></div>
        <div><p style={{ fontSize: '10px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '2px', margin: '0 0 6px' }}>For</p>
          <p style={{ fontWeight: 'bold', color: '#f1f5f9', margin: '0 0 2px' }}>{data.clientName}</p>
          <p style={{ color: '#94a3b8', fontSize: '12px', margin: '2px 0' }}>{data.clientPhone}</p></div>
      </div>
      <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '24px' }}>
        <thead><tr style={{ borderBottom: '1px solid #334155' }}>
          <th style={{ textAlign: 'left', padding: '10px 4px', fontSize: '11px', color: '#64748b', textTransform: 'uppercase' }}>Description</th>
          <th style={{ textAlign: 'right', padding: '10px 4px', fontSize: '11px', color: '#64748b', textTransform: 'uppercase' }}>Qty</th>
          <th style={{ textAlign: 'right', padding: '10px 4px', fontSize: '11px', color: '#64748b', textTransform: 'uppercase' }}>Rate</th>
          <th style={{ textAlign: 'right', padding: '10px 4px', fontSize: '11px', color: '#64748b', textTransform: 'uppercase' }}>Amount</th>
        </tr></thead>
        <tbody>{data.items.map((item, i) => (
          <tr key={i} style={{ borderBottom: '1px solid #1e293b' }}>
            <td style={{ padding: '10px 4px', fontSize: '13px', color: '#cbd5e1' }}>{item.description}</td>
            <td style={{ textAlign: 'right', padding: '10px 4px', fontSize: '13px', color: '#cbd5e1' }}>{item.quantity}</td>
            <td style={{ textAlign: 'right', padding: '10px 4px', fontSize: '13px', color: '#cbd5e1' }}>₹{item.rate.toFixed(2)}</td>
            <td style={{ textAlign: 'right', padding: '10px 4px', fontSize: '13px' }}>₹{item.amount.toFixed(2)}</td>
          </tr>
        ))}</tbody>
      </table>
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <div style={{ width: '220px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #334155' }}><span style={{ fontSize: '12px', color: '#64748b' }}>Subtotal</span><span style={{ fontSize: '12px' }}>₹{data.subtotal.toFixed(2)}</span></div>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #334155' }}><span style={{ fontSize: '12px', color: '#64748b' }}>Tax ({data.taxRate}%)</span><span style={{ fontSize: '12px' }}>₹{data.tax.toFixed(2)}</span></div>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', marginTop: '8px' }}><span style={{ fontWeight: 'bold', color: '#a78bfa' }}>TOTAL EST.</span><span style={{ fontWeight: 'bold', color: '#a78bfa' }}>₹{data.total.toFixed(2)}</span></div>
        </div>
      </div>
    </div>
  );
}
