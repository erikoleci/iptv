export interface RawChannel {
  id: string
  name: string
  alt_names?: string[]
  network?: string | null
  owners?: string[]
  country: string
  subdivision?: string | null
  city?: string | null
  categories?: string[]
  is_nsfw?: boolean
  launched?: string | null
  closed?: string | null
  replaced_by?: string | null
  website?: string | null
  logo?: string | null
}

export interface RawStream {
  channel: string | null
  feed?: string | null
  title?: string
  url: string
  referrer?: string | null
  user_agent?: string | null
  quality?: string | null
}

export interface RawCountry {
  name: string
  code: string
  languages: string[]
  flag: string
}

export interface RawCategory {
  id: string
  name: string
}

export interface Channel {
  id: string
  name: string
  logo: string | null
  countryCode: string
  countryName: string
  categories: string[]
  streamUrl: string
  quality?: string | null
  referrer?: string | null
  userAgent?: string | null
}
