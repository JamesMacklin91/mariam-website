export const SITE_CONFIG = {
  name: "Mariamz Market",
  whatsappNumber: '+447909846560', 
  tagline: 'Luxury Perfumes, Skincare & Wellness Supplements in Tanzania',
  url: "https://mariam-website-two.vercel.app/", // Replace with Mariam's custom domain or Vercel URL
  ogImage: "/logo.jpeg",
  currency: 'TZS',
  socials: {
    whatsappLink: (message?: string) => {
      const text = message ? `?text=${encodeURIComponent(message)}` : '';
      return `https://wa.me/${SITE_CONFIG.whatsappNumber}${text}`;
    },
  },
};