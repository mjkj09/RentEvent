import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

function VenueDetails() {
    const { id } = useParams()  // /venues/:id
    const [venue, setVenue] = useState(null)

    useEffect(() => {
        fetch(`http://localhost:5000/api/venues/${id}`)
            .then(res => res.json())
            .then(data => setVenue(data))
            .catch(err => console.error(err))
    }, [id])

    if (!venue) return <div>Ładowanie...</div>

    return (
        <div className="venue-details">
            <h1>{venue.name}</h1>
            <p><strong>Kategoria:</strong> {venue.category}</p>
            <p><strong>Miasto:</strong> {venue.location?.city}</p>
            <p><strong>Ulica:</strong> {venue.location?.street}</p>
            <p><strong>Województwo:</strong> {venue.location?.region}</p>
            <p><strong>Właściciel:</strong> {venue.owner ? `${venue.owner.name} ${venue.owner.surname}` : 'Nieznany'}</p>
            <p><strong>Opis:</strong> {venue.description}</p>
            <p><strong>Cena minimalna:</strong> {venue.pricing?.minPricePerPerson}</p>
            <p><strong>Cena maksymalna:</strong> {venue.pricing?.maxPricePerPerson}</p>
            <p><strong>Czy cena jest ukryta:</strong> {venue.pricing?.isPriceHidden ? 'Tak' : 'Nie'}</p>
            <p className='availability'><strong>Zarezerwowane terminy:</strong> 
                <ul>
                    {venue.availability?.map((a, index) => (
                        <li key={index}>
                            {new Date(a.date).toLocaleDateString()} - {a.status}
                        </li>
                    ))}
                </ul>
            </p>
            <p><strong>Data utworzenia:</strong> {new Date(venue.createdAt).toLocaleDateString()}</p>
        </div>
    )
}
export default VenueDetails
