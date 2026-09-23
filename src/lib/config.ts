export const SITE_CONFIG = {
  name: "Mariam's Market",
  whatsappNumber: '+447909846560', 
  tagline: 'Luxury Perfumes, Skincare & Wellness Supplements in Tanzania',
  currency: 'TZS',
  socials: {
    whatsappLink: (message?: string) => {
      const text = message ? `?text=${encodeURIComponent(message)}` : '';
      return `https://wa.me/${SITE_CONFIG.whatsappNumber}${text}`;
    },
  },
};