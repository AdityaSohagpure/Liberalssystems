const PixelPitchSpec = require('../models/PixelPitchSpec');

const seedSpecsData = [
  {
    pitch: 'P1.5',
    type: 'indoor',
    label: 'LIBERAL Ultra-Fine P1.5',
    optimalViewingDistanceMin: 1.5,
    optimalViewingDistanceMax: 15.0,
    refreshRate: '≥ 3,840 Hz',
    maxPowerPerSqm: 650,
    avgPowerPerSqm: 210,
    cabinetDimensions: '600mm x 337.5mm x 45mm',
    pixelDensityPerSqm: 444444,
    notes: 'Ultra-fine resolution designed for close-up viewing environments like control rooms, premium executive boardrooms, and luxury retail visual walls.'
  },
  {
    pitch: 'P2.0',
    type: 'indoor',
    label: 'LIBERAL Fine-Pitch P2.0',
    optimalViewingDistanceMin: 2.0,
    optimalViewingDistanceMax: 20.0,
    refreshRate: '≥ 3,840 Hz',
    maxPowerPerSqm: 600,
    avgPowerPerSqm: 190,
    cabinetDimensions: '600mm x 337.5mm x 45mm',
    pixelDensityPerSqm: 250000,
    notes: 'Excellent balance of resolution and value for premium indoor advertising, medium boardrooms, and high-impact digital signage.'
  },
  {
    pitch: 'P2.5',
    type: 'indoor',
    label: 'LIBERAL Standard Indoor P2.5',
    optimalViewingDistanceMin: 2.5,
    optimalViewingDistanceMax: 25.0,
    refreshRate: '≥ 3,840 Hz',
    maxPowerPerSqm: 580,
    avgPowerPerSqm: 180,
    cabinetDimensions: '480mm x 480mm x 55mm',
    pixelDensityPerSqm: 160000,
    notes: 'The industry-standard choice for indoor auditoriums, churches, houses of worship, and staging rental backdrops.'
  },
  {
    pitch: 'P3.0',
    type: 'indoor',
    label: 'LIBERAL Indoor P3.0',
    optimalViewingDistanceMin: 3.0,
    optimalViewingDistanceMax: 30.0,
    refreshRate: '≥ 3,840 Hz',
    maxPowerPerSqm: 550,
    avgPowerPerSqm: 170,
    cabinetDimensions: '480mm x 480mm x 55mm',
    pixelDensityPerSqm: 111111,
    notes: 'Highly cost-effective indoor LED screen option, suitable for retail environments and exhibitions where viewing distances exceed 3 meters.'
  },
  {
    pitch: 'P4.0',
    type: 'outdoor',
    label: 'LIBERAL Premium Outdoor P4.0',
    optimalViewingDistanceMin: 4.0,
    optimalViewingDistanceMax: 40.0,
    refreshRate: '≥ 3,840 Hz',
    maxPowerPerSqm: 800,
    avgPowerPerSqm: 270,
    cabinetDimensions: '960mm x 960mm x 100mm',
    pixelDensityPerSqm: 62500,
    notes: 'State-of-the-art fine-pitch outdoor display, offering incredible image detail for high-end digital billboards and street-level advertising.'
  },
  {
    pitch: 'P5.0',
    type: 'outdoor',
    label: 'LIBERAL Outdoor P5.0',
    optimalViewingDistanceMin: 5.0,
    optimalViewingDistanceMax: 50.0,
    refreshRate: '≥ 3,840 Hz',
    maxPowerPerSqm: 780,
    avgPowerPerSqm: 260,
    cabinetDimensions: '960mm x 960mm x 100mm',
    pixelDensityPerSqm: 40000,
    notes: 'Highly versatile, high-brightness outdoor cabinet, popular for perimeter displays at arenas, highway screens, and outdoor concert stages.'
  },
  {
    pitch: 'P8.0',
    type: 'outdoor',
    label: 'LIBERAL Outdoor P8.0',
    optimalViewingDistanceMin: 8.0,
    optimalViewingDistanceMax: 80.0,
    refreshRate: '≥ 1,920 Hz',
    maxPowerPerSqm: 750,
    avgPowerPerSqm: 240,
    cabinetDimensions: '960mm x 960mm x 110mm',
    pixelDensityPerSqm: 15625,
    notes: 'Heavy-duty building facade display. Incredible brightness and contrast for viewing from long distances, e.g., highway traffic.'
  },
  {
    pitch: 'P10.0',
    type: 'outdoor',
    label: 'LIBERAL Landmark Outdoor P10.0',
    optimalViewingDistanceMin: 10.0,
    optimalViewingDistanceMax: 100.0,
    refreshRate: '≥ 1,920 Hz',
    maxPowerPerSqm: 700,
    avgPowerPerSqm: 220,
    cabinetDimensions: '960mm x 960mm x 110mm',
    pixelDensityPerSqm: 10000,
    notes: 'The classic large-scale landmark advertising screen choice, built to withstand extreme weather environments while optimizing energy consumption.'
  }
];

const seedSpecs = async () => {
  try {
    const count = await PixelPitchSpec.countDocuments();
    if (count === 0) {
      console.log('[Seed] Seeding default pixel pitch specifications...');
      const created = await PixelPitchSpec.create(seedSpecsData);
      console.log(`[Seed] Successfully seeded ${created.length} specifications.`);
      return created;
    } else {
      console.log('[Seed] Specifications already exist, skipping specs seed.');
      return await PixelPitchSpec.find();
    }
  } catch (error) {
    console.error('[Seed] Error seeding specifications:', error.message);
    throw error;
  }
};

module.exports = { seedSpecs, seedSpecsData };
