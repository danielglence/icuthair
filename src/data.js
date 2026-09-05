import { Scissors, Sparkles, Blend, UserRound, ShowerHead, Baby, BadgeCheck, WandSparkles, Armchair, SprayCan, HeartHandshake, MapPin } from 'lucide-react';

export const business = {
  name: 'I Cut Hair Grooming Studio', shortName: 'I CUT', phone: '07902833507', internationalPhone: '+91 79028 33507',
  callUrl: 'tel:07902833507', whatsappNumber: '917902833507', whatsappBase: 'https://wa.me/917902833507',
  bookingUrl: 'https://wa.me/917902833507?text=Hello%20I%20Cut%20Hair%20Grooming%20Studio%2C%20I%20would%20like%20to%20book%20an%20appointment.',
  address: 'Mudavoor, near Scrub A Dubb Car Wash, Muvattupuzha, Kerala 686669',
  addressLines: ['Mudavoor, near Scrub A Dubb Car Wash', 'Muvattupuzha, Kerala 686669'],
  instagram: 'https://www.instagram.com/its.me._.arun/', instagramHandle: '@its.me._.arun', rating: '5.0', reviews: 35,
};
export const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`I Cut Hair Grooming Studio, ${business.address}`)}`;
export const mapEmbed = `https://www.google.com/maps?q=${encodeURIComponent(`I Cut Hair Grooming Studio, ${business.address}`)}&output=embed`;

export const services = [
  { name:'Hair Wash & Finish', description:'A refreshing cleanse followed by careful drying and a polished finish for effortlessly sharp hair.', icon:ShowerHead },
  { name:'Detan', description:'A refreshing detan treatment that helps remove dullness and restore a cleaner, brighter look.', icon:Sparkles },
  { name:'Beard Trim and Styling', description:'Precise shaping and clean detailing for a well-groomed beard.', icon:Blend },
  { name:'Haircut & Beard Combo', description:'A complete grooming experience pairing a precision haircut with expert beard shaping and a polished finish.', icon:UserRound },
  { name:'Hair Colouring', description:'Rich, even colour tailored to your style, finished with depth, shine, and a naturally confident look.', icon:Sparkles },
  { name:"Kids’ Haircut", description:'A patient, comfortable haircut experience tailored for younger guests.', icon:Baby },
];
export const serviceBookingUrl = (service) => `${business.whatsappBase}?text=${encodeURIComponent(`Hello I Cut Hair Grooming Studio, I would like to book the ${service} service.`)}`;
export const gallery = [
  { src:'/images/gallery-1.jpg', alt:'Barber carefully shaping a client’s haircut', label:'Precision cuts' },
  { src:'/images/gallery-2.jpg', alt:'Professional barber working on a modern hairstyle', label:'Modern styling' },
  { src:'/images/gallery-3.jpg', alt:'Premium modern salon interior with styling chairs', label:'Studio atmosphere' },
  { src:'/images/gallery-4.jpg', alt:'Detailed beard grooming by a professional barber', label:'Beard detailing' },
  { src:'/images/gallery-5.jpg', alt:'Professional barber tools arranged for service', label:'Tools of the craft' },
  { src:'/images/gallery-6.jpg', alt:'Relaxed premium grooming experience in a salon', label:'A considered experience' },
];
export const features = [
  { title:'Skilled and precise service', icon:BadgeCheck }, { title:'Clean and comfortable studio', icon:Armchair },
  { title:'Modern grooming techniques', icon:WandSparkles }, { title:'Personal attention', icon:HeartHandshake },
  { title:'Excellent customer satisfaction', icon:SprayCan }, { title:'Convenient Mudavoor location', icon:MapPin },
];
