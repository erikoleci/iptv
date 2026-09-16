import { useEffect, useState } from 'react'
import type { RawChannel, RawStream, RawCountry, RawCategory, Channel } from '../types'

const API_BASE = 'https://iptv-org.github.io/api'
const CACHE_KEY = 'iptv_channel_cache_v1'
const CACHE_TTL_MS = 1000 * 60 * 60 * 6 // 6 hours

interface CacheShape {
  savedAt: number
  channels: Channel[]
  countries: { code: string; name: string; flag: string }[]
  categories: { id: string; name: string }[]
}

async function fetchJson<T>(path: string): Promise<T> {
  const res = await fetch(`${API_BASE}/${path}`)
  if (!res.ok) throw new Error(`Failed to load ${path}: ${res.status}`)
  return res.json() as Promise<T>
}

function readCache(): CacheShape | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as CacheShape
    if (Date.now() - parsed.savedAt > CACHE_TTL_MS) return null
    return parsed
  } catch {
    return null
  }
}

function writeCache(data: CacheShape) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(data))
  } catch {
    // storage full or unavailable - ignore, app still works without cache
  }
}

async function buildChannelList(): Promise<CacheShape> {
  const [rawChannels, rawStreams, rawCountries, rawCategories] = await Promise.all([
    fetchJson<RawChannel[]>('channels.json'),
    fetchJson<RawStream[]>('streams.json'),
    fetchJson<RawCountry[]>('countries.json'),
    fetchJson<RawCategory[]>('categories.json'),
  ])

  const countryByCode = new Map(rawCountries.map(c => [c.code, c]))
  const categoryById = new Map(rawCategories.map(c => [c.id, c.name]))

  const channelById = new Map(
    rawChannels.filter(c => !c.is_nsfw && !c.closed).map(c => [c.id, c])
  )

  // Keep the first stream listed per channel id (streams.json is already curated/public)
  const seenChannel = new Set<string>()
  const channels: Channel[] = []

  for (const stream of rawStreams) {
    if (!stream.channel) continue
    if (seenChannel.has(stream.channel)) continue
    const meta = channelById.get(stream.channel)
    if (!meta) continue
    const country = countryByCode.get(meta.country)
    seenChannel.add(stream.channel)
    channels.push({
      id: meta.id,
      name: meta.name,
      logo: meta.logo || null,
      countryCode: meta.country,
      countryName: country?.name || meta.country,
      categories: (meta.categories || []).map(id => categoryById.get(id) || id),
      streamUrl: stream.url,
      quality: stream.quality,
      referrer: stream.referrer,
      userAgent: stream.user_agent,
    })
  }

  channels.sort((a, b) => a.name.localeCompare(b.name))

  const countries = rawCountries
    .filter(c => channels.some(ch => ch.countryCode === c.code))
    .map(c => ({ code: c.code, name: c.name, flag: c.flag }))
    .sort((a, b) => a.name.localeCompare(b.name))

  const usedCategoryNames = new Set(channels.flatMap(c => c.categories))
  const categories = rawCategories
    .filter(c => usedCategoryNames.has(c.name))
    .map(c => ({ id: c.id, name: c.name }))
    .sort((a, b) => a.name.localeCompare(b.name))

  return { savedAt: Date.now(), channels, countries, categories }
}

interface UseChannelsResult {
  channels: Channel[]
  countries: { code: string; name: string; flag: string }[]
  categories: { id: string; name: string }[]
  loading: boolean
  error: string | null
}

export function useChannels(): UseChannelsResult {
  const [state, setState] = useState<UseChannelsResult>({
    channels: [],
    countries: [],
    categories: [],
    loading: true,
    error: null,
  })

  useEffect(() => {
    let cancelled = false

    async function load() {
      const cached = readCache()
      if (cached) {
        if (!cancelled) {
          setState({
            channels: cached.channels,
            countries: cached.countries,
            categories: cached.categories,
            loading: false,
            error: null,
          })
        }
        return
      }

      try {
        const data = await buildChannelList()
        writeCache(data)
        if (!cancelled) {
          setState({
            channels: data.channels,
            countries: data.countries,
            categories: data.categories,
            loading: false,
            error: null,
          })
        }
      } catch (err) {
        if (!cancelled) {
          setState(s => ({
            ...s,
            loading: false,
            error:
              err instanceof Error
                ? err.message
                : 'Could not load the channel directory. Please try again later.',
          }))
        }
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [])

  return state
}
