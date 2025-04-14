import { useState } from "react";
import { getAllFlights, getFlight, searchFlights } from "../api/flightSoapClient";
import { Flight, SoapAction } from "../api/types";

const StartPage: React.FC = () => {
  const [action, setAction] = useState<SoapAction>('getFlight');
  const [params, setParams] = useState({
    flightId: 1,
    departureCityId: 1,
    arrivalCityId: 2,
    departureDate: '2025-06-01',
    returnDate: '',
  });
  const [flight, setFlight] = useState<Flight | null>(null);
  const [flights, setFlights] = useState<Flight[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    setFlight(null);
    setFlights([]);
    
    try {
      switch (action) {
        case 'getFlight':
          { const flightData = await getFlight(params.flightId);
          setFlight(flightData);
          break; }
        case 'searchFlights':
          { const searchedFlights = await searchFlights({
            departureCityId: params.departureCityId,
            arrivalCityId: params.arrivalCityId,
            departureDate: params.departureDate,
            returnDate: params.returnDate || undefined
          });
          setFlights(searchedFlights);
          break; }
        case 'getAllFlights':
          { const allFlights = await getAllFlights();
          setFlights(allFlights);
          break; }
        default:
          throw new Error(`Unknown action: ${action}`);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      console.error("API Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleParamChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setParams(prev => ({
      ...prev,
      [name]: name.includes('Id') ? parseInt(value) || 0 : value
    }));
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Flight SOAP API Tester</h1>
      
      <div className="mb-4">
        <label className="block mb-2">
          Action:
          <select
            value={action}
            onChange={(e) => setAction(e.target.value as SoapAction)}
            className="ml-2 p-2 border rounded"
          >
            <option value="getFlight">Get Flight</option>
            <option value="searchFlights">Search Flights</option>
            <option value="getAllFlights">Get All Flights</option>
          </select>
        </label>
      </div>

      {action === 'getFlight' && (
        <div className="mb-4 p-4 border rounded">
          <h2 className="text-xl font-semibold mb-2">Get Flight Parameters</h2>
          <label className="block mb-2">
            Flight ID:
            <input
              type="number"
              name="flightId"
              value={params.flightId}
              onChange={handleParamChange}
              className="ml-2 p-2 border rounded"
            />
          </label>
        </div>
      )}

      {action === 'searchFlights' && (
        <div className="mb-4 p-4 border rounded">
          <h2 className="text-xl font-semibold mb-2">Search Flights Parameters</h2>
          <label className="block mb-2">
            Departure City ID:
            <input
              type="number"
              name="departureCityId"
              value={params.departureCityId}
              onChange={handleParamChange}
              className="ml-2 p-2 border rounded"
            />
          </label>
          <label className="block mb-2">
            Arrival City ID:
            <input
              type="number"
              name="arrivalCityId"
              value={params.arrivalCityId}
              onChange={handleParamChange}
              className="ml-2 p-2 border rounded"
            />
          </label>
          <label className="block mb-2">
            Departure Date:
            <input
              type="date"
              name="departureDate"
              value={params.departureDate}
              onChange={handleParamChange}
              className="ml-2 p-2 border rounded"
            />
          </label>
          <label className="block mb-2">
            Return Date (optional):
            <input
              type="date"
              name="returnDate"
              value={params.returnDate}
              onChange={handleParamChange}
              className="ml-2 p-2 border rounded"
            />
          </label>
        </div>
      )}

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
      >
        {loading ? 'Loading...' : 'Submit'}
      </button>

      {error && (
        <div className="mt-4 p-4 bg-red-100 text-red-700 rounded">
          Error: {error}
        </div>
      )}

      <div className="mt-6">
        {flight && (
          <div>
            <h2 className="text-xl font-semibold mb-2">Flight Details</h2>
            <div className="p-4 border rounded">
              <p><strong>ID:</strong> {flight.id}</p>
              <p><strong>Flight Code:</strong> {flight.flightCode}</p>
              <p><strong>Departure:</strong> {flight.departureCity.cityName} ({flight.departureDatetime})</p>
              <p><strong>Arrival:</strong> {flight.arrivalCity.cityName} ({flight.arrivalDatetime})</p>
              <p><strong>Available Seats:</strong> {flight.availableSeats}/{flight.totalSeats}</p>
              <p><strong>Price:</strong> ${flight.basePrice}</p>
            </div>
          </div>
        )}

        {flights.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold mb-2">Flights List ({flights.length})</h2>
            <div className="space-y-4">
              {flights.map(f => (
                <div key={f.id} className="p-4 border rounded">
                  <p><strong>ID:</strong> {f.id}</p>
                  <p><strong>Flight Code:</strong> {f.flightCode}</p>
                  <p><strong>Route:</strong> {f.departureCity.cityName} → {f.arrivalCity.cityName}</p>
                  <p><strong>Departure:</strong> {f.departureDatetime}</p>
                  <p><strong>Seats:</strong> {f.availableSeats}/{f.totalSeats}</p>
                  <p><strong>Price:</strong> ${f.basePrice}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StartPage;