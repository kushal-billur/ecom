import { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';

const LOCATIONS = [
    { id: 'loc-1', name: 'Home', address: '123, Green Park, New Delhi - 110001', type: 'home' },
    { id: 'loc-2', name: 'Office', address: '456, Connaught Place, New Delhi - 110001', type: 'office' },
    { id: 'loc-3', name: 'Other', address: '789, Karol Bagh, New Delhi - 110005', type: 'other' }
];

export default function LocationSelector({ onLocationSelect, selectedLocation }) {
    const [locations, setLocations] = useState(LOCATIONS);
    const [showAddForm, setShowAddForm] = useState(false);
    const [newLocation, setNewLocation] = useState({ name: '', address: '', type: 'home' });

    const handleLocationSelect = (location) => {
        onLocationSelect(location);
    };

    const handleAddLocation = () => {
        if (newLocation.name && newLocation.address) {
            const location = {
                id: `loc-${Date.now()}`,
                ...newLocation
            };
            setLocations([...locations, location]);
            setNewLocation({ name: '', address: '', type: 'home' });
            setShowAddForm(false);
            onLocationSelect(location);
        }
    };

    return (
        <div className="location-selector">
            <div className="location-header">
                <h3>📍 Select Delivery Location</h3>
                <button 
                    className="add-location-btn"
                    onClick={() => setShowAddForm(!showAddForm)}
                >
                    + Add New
                </button>
            </div>

            {showAddForm && (
                <div className="add-location-form">
                    <input
                        type="text"
                        placeholder="Location Name (e.g., Home, Office)"
                        value={newLocation.name}
                        onChange={(e) => setNewLocation({ ...newLocation, name: e.target.value })}
                        className="location-input"
                    />
                    <input
                        type="text"
                        placeholder="Full Address"
                        value={newLocation.address}
                        onChange={(e) => setNewLocation({ ...newLocation, address: e.target.value })}
                        className="location-input"
                    />
                    <select
                        value={newLocation.type}
                        onChange={(e) => setNewLocation({ ...newLocation, type: e.target.value })}
                        className="location-type-select"
                    >
                        <option value="home">🏠 Home</option>
                        <option value="office">🏢 Office</option>
                        <option value="other">📍 Other</option>
                    </select>
                    <div className="form-buttons">
                        <button onClick={handleAddLocation} className="save-btn">
                            Save Location
                        </button>
                        <button onClick={() => setShowAddForm(false)} className="cancel-btn">
                            Cancel
                        </button>
                    </div>
                </div>
            )}

            <div className="locations-list">
                {locations.map(location => (
                    <div
                        key={location.id}
                        className={`location-card ${selectedLocation?.id === location.id ? 'selected' : ''}`}
                        onClick={() => handleLocationSelect(location)}
                    >
                        <div className="location-icon">
                            {location.type === 'home' ? '🏠' : location.type === 'office' ? '🏢' : '📍'}
                        </div>
                        <div className="location-info">
                            <div className="location-name">{location.name}</div>
                            <div className="location-address">{location.address}</div>
                        </div>
                        <div className="location-check">
                            {selectedLocation?.id === location.id && '✓'}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
