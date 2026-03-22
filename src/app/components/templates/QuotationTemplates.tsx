export interface QuotationData {
  quotationNumber: string;
  date: string;
  validUntil: string;
  companyName: string;
  companyAddress: string;
  companyPhone: string;
  companyEmail: string;
  clientName: string;
  clientAddress: string;
  clientPhone: string;
  clientEmail: string;
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
  terms: string;
}

interface QuotationTemplateProps {
  data: QuotationData;
}

export function QuotationTemplate1({ data }: QuotationTemplateProps) {
  return (
    <div className="bg-white p-12 max-w-[800px] mx-auto" style={{ minHeight: '1056px' }}>
      <div className="border-b-4 border-green-600 pb-6 mb-6">
        <h1 className="text-4xl font-bold text-green-600 mb-2">QUOTATION</h1>
        <div className="flex justify-between">
          <div>
            <p className="text-gray-600">Quote #: {data.quotationNumber}</p>
            <p className="text-gray-600">Date: {data.date}</p>
            <p className="text-gray-600">Valid Until: {data.validUntil}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-8 mb-8">
        <div>
          <h3 className="font-semibold text-gray-800 mb-2">From:</h3>
          <p className="font-bold text-lg">{data.companyName}</p>
          <p className="text-gray-600">{data.companyAddress}</p>
          <p className="text-gray-600">{data.companyPhone}</p>
          <p className="text-gray-600">{data.companyEmail}</p>
        </div>
        <div>
          <h3 className="font-semibold text-gray-800 mb-2">Quote For:</h3>
          <p className="font-bold text-lg">{data.clientName}</p>
          <p className="text-gray-600">{data.clientAddress}</p>
          <p className="text-gray-600">{data.clientPhone}</p>
          <p className="text-gray-600">{data.clientEmail}</p>
        </div>
      </div>

      <table className="w-full mb-8">
        <thead>
          <tr className="bg-green-600 text-white">
            <th className="text-left p-3">Description</th>
            <th className="text-right p-3">Qty</th>
            <th className="text-right p-3">Rate</th>
            <th className="text-right p-3">Amount</th>
          </tr>
        </thead>
        <tbody>
          {data.items.map((item, index) => (
            <tr key={index} className="border-b border-gray-200">
              <td className="p-3">{item.description}</td>
              <td className="text-right p-3">{item.quantity}</td>
              <td className="text-right p-3">${item.rate.toFixed(2)}</td>
              <td className="text-right p-3">${item.amount.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex justify-end mb-8">
        <div className="w-64">
          <div className="flex justify-between py-2 border-b border-gray-200">
            <span className="text-gray-600">Subtotal:</span>
            <span className="font-semibold">${data.subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-gray-200">
            <span className="text-gray-600">Tax:</span>
            <span className="font-semibold">${data.tax.toFixed(2)}</span>
          </div>
          <div className="flex justify-between py-3 bg-green-50 px-3 mt-2">
            <span className="font-bold text-lg">Total:</span>
            <span className="font-bold text-lg text-green-600">${data.total.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {data.terms && (
        <div className="border-t border-gray-200 pt-4 mb-4">
          <h3 className="font-semibold text-gray-800 mb-2">Terms & Conditions:</h3>
          <p className="text-gray-600 text-sm">{data.terms}</p>
        </div>
      )}

      {data.notes && (
        <div className="border-t border-gray-200 pt-4">
          <h3 className="font-semibold text-gray-800 mb-2">Notes:</h3>
          <p className="text-gray-600">{data.notes}</p>
        </div>
      )}
    </div>
  );
}

export function QuotationTemplate2({ data }: QuotationTemplateProps) {
  return (
    <div className="bg-gradient-to-br from-teal-50 to-cyan-50 p-12 max-w-[800px] mx-auto" style={{ minHeight: '1056px' }}>
      <div className="bg-white p-8 shadow-lg">
        <div className="flex justify-between items-start mb-8 bg-gradient-to-r from-teal-600 to-cyan-600 text-white p-6 -mx-8 -mt-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">QUOTATION</h1>
            <p className="font-semibold">{data.companyName}</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold">#{data.quotationNumber}</p>
            <p className="text-sm">Valid: {data.validUntil}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6 mb-8">
          <div className="bg-gray-50 p-4">
            <h3 className="font-semibold text-teal-600 mb-2">QUOTE FROM:</h3>
            <p className="text-sm text-gray-600">{data.companyAddress}</p>
            <p className="text-sm text-gray-600">{data.companyPhone}</p>
            <p className="text-sm text-gray-600">{data.companyEmail}</p>
          </div>
          <div className="bg-gray-50 p-4">
            <h3 className="font-semibold text-cyan-600 mb-2">QUOTE FOR:</h3>
            <p className="font-bold">{data.clientName}</p>
            <p className="text-sm text-gray-600">{data.clientAddress}</p>
            <p className="text-sm text-gray-600">{data.clientPhone}</p>
          </div>
        </div>

        <div className="mb-2">
          <span className="text-sm text-gray-600">Date: {data.date}</span>
        </div>

        <table className="w-full mb-8">
          <thead>
            <tr className="bg-gradient-to-r from-teal-100 to-cyan-100">
              <th className="text-left p-3">Description</th>
              <th className="text-right p-3">Qty</th>
              <th className="text-right p-3">Rate</th>
              <th className="text-right p-3">Amount</th>
            </tr>
          </thead>
          <tbody>
            {data.items.map((item, index) => (
              <tr key={index} className="border-b border-gray-200">
                <td className="p-3">{item.description}</td>
                <td className="text-right p-3">{item.quantity}</td>
                <td className="text-right p-3">${item.rate.toFixed(2)}</td>
                <td className="text-right p-3 font-semibold">${item.amount.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex justify-end mb-6">
          <div className="w-64">
            <div className="flex justify-between py-2">
              <span className="text-gray-600">Subtotal:</span>
              <span>${data.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-gray-600">Tax:</span>
              <span>${data.tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between py-3 bg-gradient-to-r from-teal-600 to-cyan-600 text-white px-3 mt-2">
              <span className="font-bold text-lg">TOTAL:</span>
              <span className="font-bold text-lg">${data.total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {data.terms && (
          <div className="bg-teal-50 p-4 mb-4">
            <h3 className="font-semibold text-teal-700 mb-2">Terms & Conditions:</h3>
            <p className="text-gray-700 text-sm">{data.terms}</p>
          </div>
        )}

        {data.notes && (
          <div className="border-t border-gray-200 pt-4">
            <h3 className="font-semibold text-gray-800 mb-2">Notes:</h3>
            <p className="text-gray-600 text-sm">{data.notes}</p>
          </div>
        )}
      </div>
    </div>
  );
}
