'use client';

import { Phone, MessageCircle } from 'lucide-react';

interface ContactButtonsProps {
  phone: string;
  title: string;
}

export default function ContactButtons({ phone, title }: ContactButtonsProps) {
  // Format phone for WhatsApp link (remove non-digits)
  const cleanPhone = phone.replace(/\D/g, '');
  const whatsappMessage = encodeURIComponent(`Hi, I'm interested in your listing: ${title}`);
  const whatsappUrl = `https://wa.me/${cleanPhone}?text=${whatsappMessage}`;

  return (
    <div className="space-y-3">
      <a 
        href={`tel:${phone}`}
        className="w-full bg-[#1F3A5F] hover:bg-[#152845] text-white h-14 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-xl hover:-translate-y-0.5"
      >
        <Phone className="w-5 h-5" />
        Call {phone}
      </a>

      <a 
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="w-full bg-[#25D366] hover:bg-[#1DA851] text-white h-14 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-xl hover:-translate-y-0.5"
      >
        <MessageCircle className="w-5 h-5" />
        WhatsApp
      </a>
    </div>
  );
}