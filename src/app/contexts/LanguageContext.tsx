import { createContext, useContext, useState, ReactNode } from 'react';

export type Language = 'en' | 'hi' | 'mr';

interface Translations {
  // Nav
  home: string;
  invoice: string;
  certificate: string;
  quotation: string;
  bill: string;
  receipt: string;
  estimate: string;
  offerLetter: string;
  appointmentLetter: string;
  idCard: string;
  eventPass: string;
  login: string;
  logout: string;
  pricing: string;
  profile: string;
  history: string;
  upgradeToPro: string;
  // Common
  download: string;
  preview: string;
  share: string;
  whatsapp: string;
  email: string;
  selectTemplate: string;
  generate: string;
  save: string;
  cancel: string;
  // Fields
  companyName: string;
  companyAddress: string;
  companyPhone: string;
  companyEmail: string;
  gstNumber: string;
  clientName: string;
  clientAddress: string;
  date: string;
  dueDate: string;
  notes: string;
  subtotal: string;
  tax: string;
  total: string;
  upiId: string;
  // Plan
  free: string;
  pro: string;
  watermarkNotice: string;
}

const translations: Record<Language, Translations> = {
  en: {
    home: 'Home', invoice: 'Invoice', certificate: 'Certificate',
    quotation: 'Quotation', bill: 'Bill', receipt: 'Receipt',
    estimate: 'Estimate', offerLetter: 'Offer Letter',
    appointmentLetter: 'Appointment Letter', idCard: 'ID Card',
    eventPass: 'Event Pass', login: 'Login', logout: 'Logout',
    pricing: 'Pricing', profile: 'Profile', history: 'History',
    upgradeToPro: 'Upgrade to Pro', download: 'Download PDF',
    preview: 'Preview', share: 'Share', whatsapp: 'WhatsApp',
    email: 'Email', selectTemplate: 'Select Template',
    generate: 'Generate PDF', save: 'Save', cancel: 'Cancel',
    companyName: 'Company Name', companyAddress: 'Company Address',
    companyPhone: 'Company Phone', companyEmail: 'Company Email',
    gstNumber: 'GST Number', clientName: 'Client Name',
    clientAddress: 'Client Address', date: 'Date', dueDate: 'Due Date',
    notes: 'Notes', subtotal: 'Subtotal', tax: 'Tax',
    total: 'Total Amount', upiId: 'UPI ID',
    free: 'Free', pro: 'Pro',
    watermarkNotice: 'Free version: PDFs include watermark.',
  },
  hi: {
    home: 'होम', invoice: 'इनवॉइस', certificate: 'प्रमाणपत्र',
    quotation: 'कोटेशन', bill: 'बिल', receipt: 'रसीद',
    estimate: 'अनुमान', offerLetter: 'ऑफर लेटर',
    appointmentLetter: 'नियुक्ति पत्र', idCard: 'आईडी कार्ड',
    eventPass: 'इवेंट पास', login: 'लॉगिन', logout: 'लॉगआउट',
    pricing: 'मूल्य निर्धारण', profile: 'प्रोफ़ाइल', history: 'इतिहास',
    upgradeToPro: 'प्रो में अपग्रेड करें', download: 'PDF डाउनलोड करें',
    preview: 'पूर्वावलोकन', share: 'शेयर करें', whatsapp: 'व्हाट्सएप',
    email: 'ईमेल', selectTemplate: 'टेम्पलेट चुनें',
    generate: 'PDF बनाएं', save: 'सहेजें', cancel: 'रद्द करें',
    companyName: 'कंपनी का नाम', companyAddress: 'कंपनी का पता',
    companyPhone: 'कंपनी फोन', companyEmail: 'कंपनी ईमेल',
    gstNumber: 'GST नंबर', clientName: 'ग्राहक का नाम',
    clientAddress: 'ग्राहक का पता', date: 'तारीख', dueDate: 'देय तिथि',
    notes: 'नोट्स', subtotal: 'उप-योग', tax: 'कर',
    total: 'कुल राशि', upiId: 'UPI आईडी',
    free: 'मुफ्त', pro: 'प्रो',
    watermarkNotice: 'मुफ्त संस्करण: PDF पर वॉटरमार्क लगेगा।',
  },
  mr: {
    home: 'मुखपृष्ठ', invoice: 'इनव्हॉइस', certificate: 'प्रमाणपत्र',
    quotation: 'कोटेशन', bill: 'बिल', receipt: 'पावती',
    estimate: 'अंदाजपत्रक', offerLetter: 'ऑफर लेटर',
    appointmentLetter: 'नियुक्ती पत्र', idCard: 'आयडी कार्ड',
    eventPass: 'इव्हेंट पास', login: 'लॉगिन', logout: 'लॉगआउट',
    pricing: 'किंमत', profile: 'प्रोफाइल', history: 'इतिहास',
    upgradeToPro: 'प्रो वर वापरा', download: 'PDF डाउनलोड करा',
    preview: 'पूर्वावलोकन', share: 'शेअर करा', whatsapp: 'व्हॉट्सअॅप',
    email: 'ईमेल', selectTemplate: 'टेम्पलेट निवडा',
    generate: 'PDF तयार करा', save: 'जतन करा', cancel: 'रद्द करा',
    companyName: 'कंपनीचे नाव', companyAddress: 'कंपनीचा पत्ता',
    companyPhone: 'कंपनी फोन', companyEmail: 'कंपनी ईमेल',
    gstNumber: 'GST नंबर', clientName: 'ग्राहकाचे नाव',
    clientAddress: 'ग्राहकाचा पत्ता', date: 'तारीख', dueDate: 'देय तारीख',
    notes: 'नोंदी', subtotal: 'उप-एकूण', tax: 'कर',
    total: 'एकूण रक्कम', upiId: 'UPI आयडी',
    free: 'मोफत', pro: 'प्रो',
    watermarkNotice: 'मोफत आवृत्ती: PDF वर वॉटरमार्क असेल।',
  },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>(() => {
    return (localStorage.getItem('pdfdecor_lang') as Language) || 'en';
  });

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('pdfdecor_lang', lang);
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t: translations[language] }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within LanguageProvider');
  return context;
}
