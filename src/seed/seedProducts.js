const Product = require('../models/Product');

const seedProductsData = [
  {
    name: 'Outdoor Building LED Display Screen',
    category: 'outdoor',
    type: 'OUTDOOR HIGH-BRIGHT',
    price: 5500,
    priceUnit: 'sq_ft',
    description: 'High-brightness, energy-efficient outdoor building LED screen featuring exceptional weatherproofing and high contrast for building facades and advertising billboards.',
    brightness: '> 6,500 Nits',
    cabinetType: 'IP65 Waterproof Aluminum',
    pixelPitchOptions: ['P4', 'P5', 'P6', 'P8', 'P10'],
    refreshRate: '3,840 Hz',
    resolution: 'Standard HD Configurable',
    cabinetDimensions: '960mm x 960mm x 120mm',
    powerConsumption: 'Avg 280W/sqm, Max 750W/sqm',
    images: ['https://images.unsplash.com/photo-1542744094-3a31f103e35f?q=80&w=600'],
    inStock: true
  },
  {
    name: 'P3 Indoor Fixed LED Screen',
    category: 'indoor',
    type: 'FINE PITCH SYSTEM',
    price: 31300,
    priceUnit: 'piece',
    description: 'Premium indoor LED panel with high refresh rate and fine pitch configuration. Perfect for corporate lobbies, boardrooms, auditoriums, and broadcast environments.',
    brightness: '1,200 Nits',
    cabinetType: 'Die-cast Slim Aluminum',
    pixelPitchOptions: ['P2', 'P2.5', 'P3'],
    refreshRate: '3,840 Hz',
    resolution: '166,666 pixels/sqm',
    cabinetDimensions: '480mm x 480mm x 60mm',
    powerConsumption: 'Avg 180W/sqm, Max 540W/sqm',
    images: ['https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=600'],
    inStock: true
  },
  {
    name: 'P 3.8 Transparent LED Video Wall',
    category: 'transparent',
    type: 'TRANSPARENT SYSTEM',
    price: 10000,
    priceUnit: 'sq_ft',
    description: 'Aesthetic, lightweight transparent LED panel offering over 70% transparency. Ideal for high-end retail shopfront windows, shopping centers, and creative architectural installations.',
    brightness: '3,500 - 5,000 Nits',
    cabinetType: 'Ultra-thin Frame',
    pixelPitchOptions: ['P3.8', 'P7.8'],
    refreshRate: '1,920 Hz',
    transparency: '70%',
    cabinetDimensions: '1000mm x 500mm x 40mm',
    powerConsumption: 'Avg 200W/sqm, Max 600W/sqm',
    images: ['https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=600'],
    inStock: true
  },
  {
    name: '360 Degree Hydraulic LED Wall',
    category: 'mobile-advertising',
    type: 'MOBILE ADVERTISING',
    price: 520000,
    priceUnit: 'piece',
    description: 'Mobile truck/trailer-mounted outdoor LED screen featuring a fully automated 360-degree hydraulic lift and rotating mechanism. Equipped with on-board silent generator for on-the-go events.',
    brightness: '> 5,500 Nits',
    cabinetType: 'Reinforced Steel Trailer',
    pixelPitchOptions: ['P4', 'P5', 'P6'],
    refreshRate: '3,840 Hz',
    hydraulicLift: true,
    onBoardGenerator: true,
    cabinetDimensions: '3000mm x 2000mm (Screen size)',
    powerConsumption: 'Generator: 15kVA Output',
    images: ['https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=600'],
    inStock: true
  }
];

const seedProducts = async () => {
  try {
    const count = await Product.countDocuments();
    if (count === 0) {
      console.log('[Seed] Seeding default products...');
      const created = await Product.create(seedProductsData);
      console.log(`[Seed] Successfully seeded ${created.length} products.`);
      return created;
    } else {
      console.log('[Seed] Products already exist in database, skipping product seed.');
      return await Product.find();
    }
  } catch (error) {
    console.error('[Seed] Error seeding products:', error.message);
    throw error;
  }
};

module.exports = { seedProducts, seedProductsData };
