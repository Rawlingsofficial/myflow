"use client";
interface ContactButtonsProps {
  phone?: string;
  whatsapp?: string;
}

export default function ContactButtons({ phone, whatsapp }: ContactButtonsProps) {
  return (
    <div className="flex gap-2 mt-4">
      {phone && (
        <a href={`tel:${phone}`} className="bg-green-500 text-white px-4 py-2 rounded">
          Call
        </a>
      )}
      {whatsapp && (
        <a href={`https://wa.me/${whatsapp}`} target="_blank" rel="noopener noreferrer" className="bg-green-600 text-white px-4 py-2 rounded">
          WhatsApp
        </a>
      )}
    </div>
  );
}

