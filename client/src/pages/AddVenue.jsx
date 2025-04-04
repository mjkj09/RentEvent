import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function AddVenue() {
    const [name, setName] = useState('')
    const [category, setCategory] = useState('')
    const [location, setLocation] = useState({ city: '' })
    const navigate = useNavigate()

    function handleSubmit(e) {
        e.preventDefault()
        fetch('http://localhost:5000/api/venues', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, category, location })
        })
            .then(res => res.json())
            .then(data => {
                console.log('Utworzono venue:', data)
                navigate('/venues')
            })
            .catch(err => console.error(err))
    }

    return (
        <form onSubmit={handleSubmit} className="add-venue-form">
            <label>Nazwa obiektu:</label>
            <input value={name} onChange={e => setName(e.target.value)} />

            <label>Miasto:</label>
            <input value={location.city} onChange={e => setLocation({ city: e.target.value })} />

            <label>Kategoria:</label>
            <input value={category} onChange={e => setCategory(e.target.value)} />

            <button type="submit">Dodaj</button>
        </form>
    )
}
export default AddVenue
