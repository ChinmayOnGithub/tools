export const CONVERSIONS: Record<string, { base: string; factors: Record<string, number> }> = {
  length: {
    base: 'm',
    factors: {
      m: 1,
      mm: 0.001,
      cm: 0.01,
      km: 1000,
      in: 0.0254,
      ft: 0.3048,
      yd: 0.9144,
      mi: 1609.344,
    },
  },
  weight: {
    base: 'kg',
    factors: {
      g: 0.001,
      kg: 1,
      mg: 0.000001,
      lb: 0.45359237,
      oz: 0.028349523,
    },
  },
  area: {
    base: 'm2',
    factors: {
      m2: 1,
      cm2: 0.0001,
      km2: 1000000,
      ft2: 0.09290304,
      in2: 0.00064516,
      ac: 4046.8564,
      ha: 10000,
    },
  },
  volume: {
    base: 'l',
    factors: {
      ml: 0.001,
      l: 1,
      m3: 1000,
      gal: 3.78541178,
      qt: 0.946352946,
      pt: 0.473176473,
      cup: 0.236588236,
    },
  },
  time: {
    base: 's',
    factors: {
      ms: 0.001,
      s: 1,
      min: 60,
      hr: 3600,
      day: 86400,
      week: 604800,
    },
  },
  speed: {
    base: 'm_s',
    factors: {
      m_s: 1,
      km_h: 1 / 3.6,
      mph: 0.44704,
      knot: 0.514444,
    },
  },
};

export function convertTemperature(value: number, from: string, to: string): number {
  if (from === to) return value;
  
  let celsius = value;
  if (from === 'f') {
    celsius = (value - 32) * (5 / 9);
  } else if (from === 'k') {
    celsius = value - 273.15;
  }

  if (to === 'c') return celsius;
  if (to === 'f') return celsius * (9 / 5) + 32;
  if (to === 'k') return celsius + 273.15;

  return value;
}

/**
 * Converts a numeric value from one unit to another within a conversion category.
 */
export function convertUnit(
  category: string,
  value: number,
  from: string,
  to: string
): number {
  if (category === 'temperature') {
    return convertTemperature(value, from, to);
  }

  const catData = CONVERSIONS[category];
  if (!catData) return value;

  const fromFactor = catData.factors[from];
  const toFactor = catData.factors[to];

  if (fromFactor === undefined || toFactor === undefined) return value;

  // Convert to base unit, then convert to target unit
  const valueInBase = value * fromFactor;
  return valueInBase / toFactor;
}
