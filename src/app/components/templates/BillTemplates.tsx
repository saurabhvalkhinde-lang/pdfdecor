export interface BillData {
  billNumber: string;
  date: string;
  dueDate: string;
  companyName: string;
  companyAddress: string;
  companyPhone: string;
  companyEmail: string;
  clientName: string;
  clientAddress: string;
  items: Array<{
    description: string;
    quantity: number;
    rate: number;
    amount: number;
  }>;
  subtotal: number;
  tax: number;
  total: number;
  paymentMethod: string;
}

interface BillTemplateProps {
  data: BillData;
}

export function BillTemplate1({ data }: BillTemplateProps) {
  return (
    <div className="bg-white p-12 max-w-[800px] mx-auto" style={{ minHeight: '1056px' }}>
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-5xl font-bold text-orange-600 mb-2">BILL</h1>
          <p className="text-gray-600">#{data.billNumber}</p>
        </div>
        <div className="text-right">
          <p className="font-bold text-xl">{data.companyName}</p>
          <p className="text-sm text-gray-600">{data.companyAddress}</p>
          <p className="text-sm text-gray-600">{data.companyPhone}</p>
          <p className="text-sm text-gray-600">{data.companyEmail}</p>
        </div>
      </div>

      <div className="bg-orange-50 p-4 rounded mb-8">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-gray-600 mb-1">Bill To:</p>
            <p className="font-bold">{data.clientName}</p>
            <p className="text-sm text-gray-600">{data.clientAddress}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-600 mb-1">Bill Date:</p>
            <p className="font-semibold">{data.date}</p>
            <p className="text-xs text-gray-600 mb-1 mt-2">Due Date:</p>
            <p className="font-semibold">{data.dueDate}</p>
          </div>
        </div>
      </div>

      <table className="w-full mb-8">
        <thead>
          <tr className="bg-orange-600 text-white">
            <th className="text-left p-3">Item Description</th>
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

      <div className="flex justify-end mb-8">
        <div className="w-72">
          <div className="flex justify-between py-2">
            <span className="text-gray-600">Subtotal:</span>
            <span className="font-semibold">${data.subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between py-2">
            <span className="text-gray-600">Tax (10%):</span>
            <span className="font-semibold">${data.tax.toFixed(2)}</span>
          </div>
          <div className="flex justify-between py-4 bg-orange-600 text-white px-4 mt-2 rounded">
            <span className="font-bold text-xl">Total Amount:</span>
            <span className="font-bold text-xl">${data.total.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-300 pt-6">
        <div className="bg-gray-50 p-4 rounded">
          <p className="text-sm text-gray-600 mb-2">
            <span className="font-semibold">Payment Method:</span> {data.paymentMethod}
          </p>
          <p className="text-sm text-gray-600">
            Thank you for your business! Please make payment by the due date.
          </p>
        </div>
      </div>
    </div>
  );
}

export function BillTemplate2({ data }: BillTemplateProps) {
  return (
    <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-12 max-w-[800px] mx-auto" style={{ minHeight: '1056px' }}>
      <div className="bg-white p-8 shadow-lg">
        <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white p-6 -mx-8 -mt-8 mb-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-4xl font-bold mb-2">BILL</h1>
              <p className="font-semibold">{data.companyName}</p>
              <p className="text-sm opacity-90">{data.companyAddress}</p>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold">#{data.billNumber}</p>
              <p className="text-sm opacity-90">{data.companyPhone}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6 mb-8">
          <div>
            <h3 className="font-semibold text-orange-600 mb-2">BILLED TO:</h3>
            <p className="font-bold text-lg">{data.clientName}</p>
            <p className="text-sm text-gray-600">{data.clientAddress}</p>
          </div>
          <div className="text-right">
            <div className="bg-amber-50 p-3 rounded inline-block">
              <p className="text-xs text-gray-600">Bill Date</p>
              <p className="font-semibold">{data.date}</p>
              <p className="text-xs text-gray-600 mt-2">Due Date</p>
              <p className="font-semibold text-orange-600">{data.dueDate}</p>
            </div>
          </div>
        </div>

        <table className="w-full mb-8">
          <thead>
            <tr className="bg-gradient-to-r from-amber-100 to-orange-100">
              <th className="text-left p-3 text-gray-800">Description</th>
              <th className="text-right p-3 text-gray-800">Qty</th>
              <th className="text-right p-3 text-gray-800">Rate</th>
              <th className="text-right p-3 text-gray-800">Amount</th>
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
          <div className="w-72">
            <div className="flex justify-between py-2 border-b border-gray-200">
              <span className="text-gray-600">Subtotal:</span>
              <span>${data.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-200">
              <span className="text-gray-600">Tax:</span>
              <span>${data.tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-4 mt-3 rounded">
              <span className="font-bold text-xl">TOTAL:</span>
              <span className="font-bold text-xl">${data.total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-6">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
            <span className="font-semibold text-gray-800">Payment Information</span>
          </div>
          <div className="bg-amber-50 p-4 rounded">
            <p className="text-sm text-gray-700 mb-2">
              <span className="font-semibold">Preferred Method:</span> {data.paymentMethod}
            </p>
            <p className="text-sm text-gray-600">
              Payment is due by {data.dueDate}. Thank you for your prompt payment.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function BillTemplate3({ data }: BillTemplateProps) {
  return (
    <div className="bg-gray-100 p-12 max-w-[800px] mx-auto" style={{ minHeight: '1056px' }}>
      <div className="bg-white p-10">
        <div className="flex justify-between items-start border-b-4 border-red-600 pb-6 mb-8">
          <div>
            <h1 className="text-6xl font-bold text-gray-800">BILL</h1>
            <p className="text-xl text-red-600 font-semibold mt-2">#{data.billNumber}</p>
          </div>
          <div className="text-right">
            <p className="font-bold text-2xl text-gray-800">{data.companyName}</p>
            <p className="text-sm text-gray-600 mt-1">{data.companyAddress}</p>
            <p className="text-sm text-gray-600">{data.companyPhone}</p>
            <p className="text-sm text-gray-600">{data.companyEmail}</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="col-span-2 bg-gray-50 p-4">
            <p className="text-xs text-gray-500 uppercase mb-1">Bill To</p>
            <p className="font-bold text-lg">{data.clientName}</p>
            <p className="text-sm text-gray-600">{data.clientAddress}</p>
          </div>
          <div className="space-y-3">
            <div className="bg-red-50 p-3 rounded">
              <p className="text-xs text-gray-600">Date</p>
              <p className="font-semibold">{data.date}</p>
            </div>
            <div className="bg-red-50 p-3 rounded">
              <p className="text-xs text-gray-600">Due</p>
              <p className="font-semibold text-red-600">{data.dueDate}</p>
            </div>
          </div>
        </div>

        <table className="w-full mb-6">
          <thead>
            <tr className="bg-red-600 text-white">
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

        <div className="flex justify-end mb-8">
          <div className="w-80">
            <div className="space-y-2">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal:</span>
                <span>${data.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Tax (10%):</span>
                <span>${data.tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between bg-red-600 text-white p-4 mt-3 rounded">
                <span className="font-bold text-2xl">TOTAL</span>
                <span className="font-bold text-2xl">${data.total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t-2 border-gray-200 pt-6">
          <div className="flex items-start gap-3">
            <div className="w-1 h-12 bg-red-600"></div>
            <div>
              <p className="font-semibold text-gray-800 mb-1">Payment Details</p>
              <p className="text-sm text-gray-600">Method: {data.paymentMethod}</p>
              <p className="text-sm text-gray-600 mt-2">
                Please ensure payment is received by the due date to avoid late fees.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
