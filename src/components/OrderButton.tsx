'use client';

interface OrderButtonProps {
  projectTitle: string;
  priceTZS: number;
  whatsappNumber: string; // e.g. "255700000000"
}

export default function OrderButton({ projectTitle, priceTZS, whatsappNumber }: OrderButtonProps) {
  const handleOrder = () => {
    const text = encodeURIComponent(
      `Hujambo! I am interested in purchasing the project: "${projectTitle}" (TZS ${priceTZS.toLocaleString()}). Please let me know how to proceed with payment.`
    );
    window.open(`https://wa.me/${whatsappNumber}?text=${text}`, '_blank');
  };

  return (
    <button
      onClick={handleOrder}
      className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
    >
      Order via WhatsApp
    </button>
  );
}