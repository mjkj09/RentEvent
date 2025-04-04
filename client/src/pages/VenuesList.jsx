import { useEffect, useState } from 'react'

function VenuesList() {
    const [venues, setVenues] = useState([])

    function fetchVenues() {
        fetch('http://localhost:5000/api/venues')
            .then(res => res.json())
            .then(data => setVenues(data))
            .catch(err => console.error(err))
    }

    useEffect(() => {
        fetchVenues()
    }, [])

    return (
        <div className="venues-list">
            <ul className="venues-list__items">
                {venues.map(v => (
                    <li class key={v._id}>{v.name} in {v.location?.city} ({v.category})</li>
                ))}
            </ul>

            <button onClick={fetchVenues}>Odśwież</button>
        </div>
    )
}
export default VenuesList
