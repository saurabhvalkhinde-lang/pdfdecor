export interface CertificateData {
  recipientName: string;
  certificateTitle: string;
  description: string;
  date: string;
  signatureName: string;
  signatureTitle: string;
  organizationName: string;
  serialNumber?: string;
  courseName?: string;
}

interface CertificateTemplateProps {
  data: CertificateData;
  isPro?: boolean;
}

export function CertificateTemplate1({ data }: CertificateTemplateProps) {
  return (
    <div className="bg-white p-16 max-w-[1000px] mx-auto relative" style={{ minHeight: '706px', aspectRatio: '1.414' }}>
      <div className="border-8 border-double border-blue-600 p-12 h-full flex flex-col justify-between">
        <div className="text-center">
          <h2 className="text-2xl text-blue-600 mb-4 tracking-wider">CERTIFICATE OF</h2>
          <h1 className="text-5xl font-bold text-gray-800 mb-8">{data.certificateTitle}</h1>
          <p className="text-xl mb-8">This certificate is proudly presented to</p>
          <h2 className="text-4xl font-serif text-blue-600 mb-8 border-b-2 border-blue-600 pb-2 inline-block px-8">
            {data.recipientName}
          </h2>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto mb-8 leading-relaxed">
            {data.description}
          </p>
        </div>
        
        <div className="flex justify-between items-end">
          <div className="text-center">
            <div className="border-t-2 border-gray-800 w-48 mb-2"></div>
            <p className="font-semibold">{data.signatureName}</p>
            <p className="text-sm text-gray-600">{data.signatureTitle}</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-2">Date</p>
            <p className="font-semibold">{data.date}</p>
          </div>
        </div>
        
        <div className="text-center mt-4">
          <p className="text-gray-600">{data.organizationName}</p>
        </div>
      </div>
    </div>
  );
}

export function CertificateTemplate2({ data }: CertificateTemplateProps) {
  return (
    <div className="bg-gradient-to-br from-purple-100 via-pink-50 to-blue-100 p-16 max-w-[1000px] mx-auto" style={{ minHeight: '706px', aspectRatio: '1.414' }}>
      <div className="bg-white p-12 h-full shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600"></div>
        <div className="absolute bottom-0 left-0 w-full h-2 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600"></div>
        
        <div className="text-center h-full flex flex-col justify-between">
          <div>
            <div className="inline-block bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-2 mb-6">
              <p className="text-lg tracking-widest">CERTIFICATE</p>
            </div>
            <h1 className="text-6xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-8">
              {data.certificateTitle}
            </h1>
            
            <p className="text-xl mb-4">Presented to</p>
            <h2 className="text-5xl font-serif text-gray-800 mb-8">
              {data.recipientName}
            </h2>
            
            <div className="max-w-2xl mx-auto">
              <p className="text-lg text-gray-700 leading-relaxed">
                {data.description}
              </p>
            </div>
          </div>
          
          <div className="flex justify-between items-end pt-8">
            <div>
              <div className="w-48 border-t-2 border-gray-400 mb-2"></div>
              <p className="font-semibold text-lg">{data.signatureName}</p>
              <p className="text-gray-600">{data.signatureTitle}</p>
            </div>
            
            <div className="text-right">
              <div className="bg-gradient-to-r from-purple-100 to-pink-100 p-3 rounded">
                <p className="text-xs text-gray-600">Date Issued</p>
                <p className="font-semibold">{data.date}</p>
              </div>
            </div>
          </div>
          
          <div className="mt-4">
            <p className="text-gray-600 font-medium">{data.organizationName}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function CertificateTemplate3({ data }: CertificateTemplateProps) {
  return (
    <div className="bg-amber-50 p-16 max-w-[1000px] mx-auto" style={{ minHeight: '706px', aspectRatio: '1.414' }}>
      <div className="bg-white p-12 h-full border-4 border-amber-600 relative">
        <div className="absolute top-4 left-4 right-4 bottom-4 border-2 border-amber-400"></div>
        
        <div className="relative z-10 h-full flex flex-col justify-between">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-amber-600 rounded-full flex items-center justify-center">
                <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>
            </div>
            
            <h2 className="text-2xl text-amber-700 mb-2 tracking-widest uppercase">Certificate of</h2>
            <h1 className="text-5xl font-bold text-amber-900 mb-8 uppercase">{data.certificateTitle}</h1>
            
            <div className="my-8">
              <p className="text-xl text-gray-700 mb-3">This is to certify that</p>
              <div className="bg-amber-50 py-4 px-8 inline-block">
                <h2 className="text-4xl font-serif text-amber-800">{data.recipientName}</h2>
              </div>
            </div>
            
            <p className="text-lg text-gray-700 max-w-2xl mx-auto leading-relaxed mb-8">
              {data.description}
            </p>
          </div>
          
          <div className="flex justify-between items-end">
            <div className="text-left">
              <div className="border-t-2 border-amber-600 w-48 mb-2 pt-2">
                <p className="font-bold text-lg">{data.signatureName}</p>
                <p className="text-sm text-gray-600">{data.signatureTitle}</p>
                <p className="text-sm text-gray-600 mt-2">{data.organizationName}</p>
              </div>
            </div>
            
            <div className="text-right">
              <div className="border-2 border-amber-600 p-3 bg-amber-50">
                <p className="text-xs text-gray-600 uppercase">Date</p>
                <p className="font-bold text-amber-800">{data.date}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
