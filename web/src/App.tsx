import { Routes, Route } from 'react-router-dom'
import { ChannelsProvider } from './data/ChannelsContext'
import { PlayerProvider } from './data/PlayerContext'
import { Header } from './components/Header'
import { PlayerModal } from './components/PlayerModal'
import { Home } from './pages/Home'
import { Channels } from './pages/Channels'
import { Countries } from './pages/Countries'
import { CountryPage } from './pages/Country'
import { Favorites } from './pages/Favorites'
import { Search } from './pages/Search'
import { NotFound } from './pages/NotFound'

export default function App() {
  return (
    <ChannelsProvider>
      <PlayerProvider>
        <Header />
        <main className="app-main">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/channels" element={<Channels />} />
            <Route path="/countries" element={<Countries />} />
            <Route path="/country/:code" element={<CountryPage />} />
            <Route path="/favorites" element={<Favorites />} />
            <Route path="/search" element={<Search />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <PlayerModal />
      </PlayerProvider>
    </ChannelsProvider>
  )
}
