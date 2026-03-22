import { useState } from 'react';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { DocumentPageWrapper } from '../components/DocumentPageWrapper';
import { generatePDF } from '../utils/pdfGenerator';
import { useAuth } from '../contexts/AuthContext';
import {
  EventPassData, EventPassTemplate1, EventPassTemplate2, EventPassTemplate3,
  EventPassTemplate4, EventPassTemplate5,
} from '../components/templates/EventPassTemplates';

const PASS_TYPES = ['General', 'VIP', 'VVIP', 'Media', 'Speaker', 'Staff', 'Volunteer', 'Sponsor', 'Press', 'Gold', 'Platinum'];

export function EventPass() {
  const { isPro, user } = useAuth();
  const bp = user?.businessProfile || {};
  const [selectedTemplate, setSelectedTemplate] = useState(1);

  const [formData, setFormData] = useState<EventPassData>({
    eventName: 'Tech Summit 2025',
    eventDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    eventTime: '10:00 AM',
    eventVenue: 'Convention Center, Mumbai',
    passHolder: 'Amit Desai',
    passType: 'VIP',
    passNumber: `PASS-${Date.now().toString().slice(-6)}`,
    organizerName: bp.companyName || 'Event Organizer',
    organizerContact: bp.companyPhone || '+91 98765 43210',
    description: 'Valid for full-day access including lunch, keynote sessions, and networking dinner.',
  });

  const set = (field: keyof EventPassData, value: string) => setFormData(p => ({ ...p, [field]: value }));

  const templates = [
    { id: 1, name: 'Purple Elegant', component: EventPassTemplate1, locked: false, designIntent: 'Elegant' },
    { id: 2, name: 'Dark Corporate', component: EventPassTemplate2, locked: false, designIntent: 'Corporate' },
    { id: 3, name: 'Festival Gradient', component: EventPassTemplate3, locked: false, designIntent: 'Vibrant' },
    { id: 4, name: 'Green Official', component: EventPassTemplate4, locked: !isPro, designIntent: 'Pro' },
    { id: 5, name: 'Neon Festival', component: EventPassTemplate5, locked: !isPro, designIntent: 'Pro' },
  ];

  const formContent = (
    <div className="space-y-4">
      <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-3">
        <h3 className="font-semibold text-gray-800 text-sm">Event Details</h3>
        <div className="grid grid-cols-2 gap-3">
          <div className="col-span-2"><Label className="text-xs">Event Name</Label><Input value={formData.eventName} onChange={e => set('eventName', e.target.value)} className="mt-1 h-8 text-sm" /></div>
          <div><Label className="text-xs">Event Date</Label><Input type="date" value={formData.eventDate} onChange={e => set('eventDate', e.target.value)} className="mt-1 h-8 text-sm" /></div>
          <div><Label className="text-xs">Event Time</Label><Input value={formData.eventTime} onChange={e => set('eventTime', e.target.value)} className="mt-1 h-8 text-sm" /></div>
          <div className="col-span-2"><Label className="text-xs">Venue</Label><Input value={formData.eventVenue} onChange={e => set('eventVenue', e.target.value)} className="mt-1 h-8 text-sm" /></div>
          <div className="col-span-2"><Label className="text-xs">Organizer</Label><Input value={formData.organizerName} onChange={e => set('organizerName', e.target.value)} className="mt-1 h-8 text-sm" /></div>
          <div><Label className="text-xs">Organizer Contact</Label><Input value={formData.organizerContact || ''} onChange={e => set('organizerContact', e.target.value)} className="mt-1 h-8 text-sm" /></div>
        </div>
      </div>
      <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-3">
        <h3 className="font-semibold text-gray-800 text-sm">Pass Details</h3>
        <div className="grid grid-cols-2 gap-3">
          <div className="col-span-2"><Label className="text-xs">Pass Holder Name</Label><Input value={formData.passHolder} onChange={e => set('passHolder', e.target.value)} className="mt-1 h-8 text-sm" /></div>
          <div><Label className="text-xs">Pass Type</Label>
            <select value={formData.passType} onChange={e => set('passType', e.target.value)}
              className="mt-1 w-full border border-gray-200 rounded-lg px-3 h-8 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
              {PASS_TYPES.map(t => <option key={t}>{t}</option>)}
            </select>
          </div>
          <div><Label className="text-xs">Pass Number</Label><Input value={formData.passNumber} onChange={e => set('passNumber', e.target.value)} className="mt-1 h-8 text-sm" /></div>
        </div>
        <div><Label className="text-xs">Pass Description / Access Details</Label>
          <Textarea value={formData.description || ''} onChange={e => set('description', e.target.value)} rows={2} className="mt-1 text-sm" />
        </div>
      </div>
    </div>
  );

  return (
    <DocumentPageWrapper
      title="Create Event Pass"
      subtitle="Professional event passes with QR code verification — VIP, General, Media & more"
      previewId="eventpass-preview"
      templates={templates}
      formContent={formContent}
      selectedTemplate={selectedTemplate}
      onTemplateSelect={setSelectedTemplate}
      formData={formData}
      onDownload={async () => { await generatePDF('eventpass-preview', `event-pass-${formData.passNumber}.pdf`, { isPro }); }}
      documentType="event-pass"
      faqs={[
        { q: 'Can I generate multiple passes?', a: 'Yes, simply change the pass holder name and pass number to generate a new pass. Pro users can save history and re-edit. Bulk generation coming soon.' },
        { q: 'Does the pass have a QR code?', a: 'Yes, all event pass templates include a scannable QR code containing the pass number, event name, and holder details for easy verification at the door.' },
      ]}
    />
  );
}
