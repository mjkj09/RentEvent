import { Routes, Route, useNavigate } from 'react-router-dom'
import VenuesList from './pages/VenuesList'
import VenueDetails from './pages/VenueDetails'
import AddVenue from './pages/AddVenue'

function App() {
  const navigate = useNavigate()

  return (
    <div>
      <nav>
        <button onClick={() => navigate('/venues')}>
          Lista Obiektów
        </button>

        <button onClick={() => navigate('/venues/new')}>
          Dodaj obiekt
        </button>
      </nav>

      <Routes>
        <Route path="/venues" element={<VenuesList />} />
        <Route path="/venues/new" element={<AddVenue />} />
        <Route path="/venues/:id" element={<VenueDetails />} />
        <Route path="*" element={<p>Strona nie znaleziona.</p>} />
      </Routes>
    </div>
  )
}

export default App
