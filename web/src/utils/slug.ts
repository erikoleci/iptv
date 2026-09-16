export function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

// Friendly aliases so common short names in URLs resolve correctly,
// e.g. /country/uk and /country/usa
const ALIASES: Record<string, string> = {
  uk: 'gb',
  usa: 'us',
  america: 'us',
}

export interface CountryLike {
  code: string
  name: string
}

export function resolveCountry<T extends CountryLike>(countries: T[], slug: string): T | undefined {
  const normalized = slug.toLowerCase()
  const aliased = ALIASES[normalized] || normalized

  return countries.find(
    c =>
      c.code.toLowerCase() === aliased ||
      c.code.toLowerCase() === normalized ||
      slugify(c.name) === normalized
  )
}
