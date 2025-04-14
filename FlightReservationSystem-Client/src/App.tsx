import React, { useEffect, useState, useMemo } from 'react';
import { Calendar1, PlaneLanding, PlaneTakeoff, Search } from 'lucide-react';
import DatePicker from './components/DatePicker';
import { Flight, City } from './api/types';
import { getAllFlights } from './api/flightSoapClient';
import FlightCard from './components/FlightCard';
import Select from './components/Select';
import Button from './components/Button';
import RangeSlider from './components/Slider';
import Checkbox from './components/Checkbox';

function App() {
  const [selectedDateDeparture, setSelectedDateDeparture] = useState<Date | null>(null);
  const [monthDeparture, setMonthDeparture] = useState<number>(new Date().getMonth());
  const [yearDeparture, setYearDeparture] = useState<number>(new Date().getFullYear());
  const [selectedDateArrival, setSelectedDateArrival] = useState<Date | null>(null);
  const [monthArrival, setMonthArrival] = useState<number>(new Date().getMonth());
  const [yearArrival, setYearArrival] = useState<number>(new Date().getFullYear());
  const [flights, setFlights] = useState<Flight[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [departureCity, setDepartureCity] = useState<City | null>(null);
  const [arrivalCity, setArrivalCity] = useState<City | null>(null);
  const [sortOption, setSortOption] = useState<string | null>(null);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [departureTimeFilter, setDepartureTimeFilter] = useState<string | null>(null);
  const [arrivalTimeFilter, setArrivalTimeFilter] = useState<string | null>(null);
  const [flyTimeFilters, setFlyTimeFilters] = useState({
    below2h: false,
    between2h4h: false,
    between4h8h: false,
    above8h: false
  });

  useEffect(() => {
    const fetchFlights = async () => {
      try {
        const allFlights = await getAllFlights();
        setFlights(allFlights);
        
        const uniqueCities: City[] = [];
        const cityMap = new Map<number, City>();
        
        allFlights.forEach(flight => {
          if (!cityMap.has(flight.departureCity.id)) {
            cityMap.set(flight.departureCity.id, flight.departureCity);
            uniqueCities.push(flight.departureCity);
          }
          if (!cityMap.has(flight.arrivalCity.id)) {
            cityMap.set(flight.arrivalCity.id, flight.arrivalCity);
            uniqueCities.push(flight.arrivalCity);
          }
        });
        
        setCities(uniqueCities);
        
        if (allFlights.length > 0) {
          const prices = allFlights.map(f => f.basePrice);
          const minPrice = Math.min(...prices);
          const maxPrice = Math.max(...prices);
          setPriceRange([minPrice, maxPrice]);
        }
      } catch (error) {
        console.error("Error fetching flights:", error);
      }
    };
  
    fetchFlights();
  }, []);

  const cityOptions = useMemo(() => {
    return cities.map(city => ({
      value: city.id.toString(),
      label: `${city.cityName}, ${city.country}`
    }));
  }, [cities]);

  const sortOptions = [
    { value: 'price-asc', label: 'Price (Low to High)' },
    { value: 'price-desc', label: 'Price (High to Low)' },
    { value: 'duration-asc', label: 'Duration (Shortest)' },
    { value: 'duration-desc', label: 'Duration (Longest)' },
    { value: 'departure-asc', label: 'Departure (Earliest)' },
    { value: 'departure-desc', label: 'Departure (Latest)' }
  ];

  const handleFlyTimeFilterChange = (filter: keyof typeof flyTimeFilters) => {
    setFlyTimeFilters(prev => ({
      ...prev,
      [filter]: !prev[filter]
    }));
  };

  const filteredFlights = useMemo(() => {
    return flights.filter(flight => {
      if (departureCity && flight.departureCity.id !== departureCity.id) {
        return false;
      }
      
      if (arrivalCity && flight.arrivalCity.id !== arrivalCity.id) {
        return false;
      }
      
      if (selectedDateDeparture) {
        const flightDepartureDate = new Date(flight.departureDatetime);
        const selectedDepartureDate = new Date(selectedDateDeparture);
        
        if (
          flightDepartureDate.getFullYear() !== selectedDepartureDate.getFullYear() ||
          flightDepartureDate.getMonth() !== selectedDepartureDate.getMonth() ||
          flightDepartureDate.getDate() !== selectedDepartureDate.getDate()
        ) {
          return false;
        }
      }

      if (selectedDateArrival) {
        const flightArrivalDate = new Date(flight.arrivalDatetime);
        const selectedArrivalDate = new Date(selectedDateArrival);
        
        if (
          flightArrivalDate.getFullYear() !== selectedArrivalDate.getFullYear() ||
          flightArrivalDate.getMonth() !== selectedArrivalDate.getMonth() ||
          flightArrivalDate.getDate() !== selectedArrivalDate.getDate()
        ) {
          return false;
        }
      }
      
      if (flight.basePrice < priceRange[0] || flight.basePrice > priceRange[1]) {
        return false;
      }
      
      if (departureTimeFilter) {
        const hours = new Date(flight.departureDatetime).getHours();
        if (departureTimeFilter === 'AM' && hours >= 12) {
          return false;
        }
        if (departureTimeFilter === 'PM' && hours < 12) {
          return false;
        }
      }
      
      if (arrivalTimeFilter) {
        const hours = new Date(flight.arrivalDatetime).getHours();
        if (arrivalTimeFilter === 'AM' && hours >= 12) {
          return false;
        }
        if (arrivalTimeFilter === 'PM' && hours < 12) {
          return false;
        }
      }
      
      const anyFlyTimeFilterSelected = Object.values(flyTimeFilters).some(Boolean);
      if (anyFlyTimeFilterSelected) {
        const departure = new Date(flight.departureDatetime);
        const arrival = new Date(flight.arrivalDatetime);
        const durationHours = (arrival.getTime() - departure.getTime()) / (1000 * 60 * 60);
        
        if (flyTimeFilters.below2h && durationHours < 2) return true;
        if (flyTimeFilters.between2h4h && durationHours >= 2 && durationHours < 4) return true;
        if (flyTimeFilters.between4h8h && durationHours >= 4 && durationHours < 8) return true;
        if (flyTimeFilters.above8h && durationHours >= 8) return true;
        
        return false;
      }
      
      return true;
    }).sort((a, b) => {
      if (!sortOption) return 0;
      
      const departureA = new Date(a.departureDatetime);
      const departureB = new Date(b.departureDatetime);
      const durationA = new Date(a.arrivalDatetime).getTime() - departureA.getTime();
      const durationB = new Date(b.arrivalDatetime).getTime() - departureB.getTime();
      
      switch (sortOption) {
        case 'price-asc': return a.basePrice - b.basePrice;
        case 'price-desc': return b.basePrice - a.basePrice;
        case 'duration-asc': return durationA - durationB;
        case 'duration-desc': return durationB - durationA;
        case 'departure-asc': return departureA.getTime() - departureB.getTime();
        case 'departure-desc': return departureB.getTime() - departureA.getTime();
        default: return 0;
      }
    });
  }, [
    flights, 
    departureCity, 
    arrivalCity, 
    selectedDateDeparture, 
    selectedDateArrival,
    priceRange, 
    departureTimeFilter, 
    arrivalTimeFilter, 
    flyTimeFilters, 
    sortOption
  ]);

  const handleSearch = () => {
    setFlights([...flights]);
  };

  const handlePriceChange = (newRange: [number, number]) => {
    setPriceRange(newRange);
  };

  const handleMonthChangeDeparture = (monthIndex: number) => {
    setMonthDeparture(monthIndex);
  }

  const handleYearChangeDeparture = (year: number) => {
    setYearDeparture(year);
  }

  const handleMonthChangeArrival = (monthIndex: number) => {
    setMonthArrival(monthIndex);
  }

  const handleYearChangeArrival = (year: number) => {
    setYearArrival(year);
  }

  return (
    <main className='flex flex-col w-full gap-8 py-6'>
      <div className='w-full h-48 bg-[#F8FBF8] px-6 flex flex-col'>
        <p className='font-semibold text-2xl'>Search a flight</p>
        
        <div className='w-full flex gap-4 justify-between'>
          <div className='flex gap-4 w-full'>
            <Select 
              options={cityOptions}
              value={departureCity?.id.toString() || null}
              onValueChange={(value) => {
                const city = cities.find(c => c.id.toString() === value);
                setDepartureCity(city || null);
              }}
              placeholder='Departure city'
              Icon={PlaneTakeoff}
              width='w-72'
            />

            <Select 
              options={cityOptions}
              value={arrivalCity?.id.toString() || null}
              onValueChange={(value) => {
                const city = cities.find(c => c.id.toString() === value);
                setArrivalCity(city || null);
              }}
              placeholder='Arrival city'
              Icon={PlaneLanding}
              width='w-72'
            />

            <DatePicker
              size='m'
              Icon={Calendar1}
              selectedDate={selectedDateDeparture}
              onDateSelect={setSelectedDateDeparture}
              currentMonthIndex={monthDeparture}
              onMonthChange={handleMonthChangeDeparture}
              baseYear={yearDeparture}
              onYearChange={handleYearChangeDeparture}
              placeholder='Departure date'
            />

            <DatePicker
              size='m'
              Icon={Calendar1}
              selectedDate={selectedDateArrival}
              onDateSelect={setSelectedDateArrival}
              currentMonthIndex={monthArrival}
              onMonthChange={handleMonthChangeArrival}
              baseYear={yearArrival}
              onYearChange={handleYearChangeArrival}
              placeholder='Arrival date'
            />

            <Button 
              text='Search'
              Icon={Search}
              width='w-48'
              size='m'
              onClick={handleSearch}
            />
          </div>
        </div>
      </div>
      
      <div className='flex gap-8 pl-6'>
        <div className='w-80 max-w-80 min-w-80 h-full'>
          <p className='text-[#16191E] text-lg font-medium mb-2'>Sort by</p>
          <Select
            options={sortOptions}
            searchable={false}
            value={sortOption}
            onValueChange={setSortOption}
            placeholder='Select sort option'
            width='w-full'
          />

          <div className='mt-4 mb-2'>
            <p className='text-[#16191E] text-lg font-medium mb-2 mt-4'>Price range</p>
            <RangeSlider
              min={0}
              max={1000}
              step={1}
              defaultValue={priceRange}
              onChange={handlePriceChange}
            />
          </div>
          
          <div>
            <p className='text-[#16191E] text-lg font-medium mb-2 mt-4'>Departure time</p>
            <div className='flex items-center gap-2'>
              <input 
                type='radio' 
                name='departureTime'
                className='accent-[#EA4B60]'
                checked={!departureTimeFilter}
                onChange={() => setDepartureTimeFilter(null)}
              />
              <label>Any time</label>
            </div>
            <div className='flex items-center gap-2'>
              <input 
                type='radio' 
                name='departureTime'
                checked={departureTimeFilter === 'AM'}
                className='accent-[#EA4B60]'
                onChange={() => setDepartureTimeFilter('AM')}
              />
              <label>12:00 AM - 11:59 AM</label>
            </div>
            <div className='flex items-center gap-2'>
              <input 
                type='radio' 
                name='departureTime'
                className='accent-[#EA4B60]'
                checked={departureTimeFilter === 'PM'}
                onChange={() => setDepartureTimeFilter('PM')}
              />
              <label>12:00 PM - 11:59 PM</label>
            </div>
          </div>
          
          <div>
            <p className='text-[#16191E] text-lg font-medium mb-2 mt-4'>Arrival time</p>
            <div className='flex items-center gap-2'>
              <input 
                type='radio' 
                name='arrivalTime'
                className='accent-[#EA4B60]'
                checked={!arrivalTimeFilter}
                onChange={() => setArrivalTimeFilter(null)}
              />
              <label>Any time</label>
            </div>
            <div className='flex items-center gap-2'>
              <input 
                type='radio' 
                name='arrivalTime'
                className='accent-[#EA4B60]'
                checked={arrivalTimeFilter === 'AM'}
                onChange={() => setArrivalTimeFilter('AM')}
              />
              <label>12:00 AM - 11:59 AM</label>
            </div>
            <div className='flex items-center gap-2'>
              <input 
                type='radio' 
                name='arrivalTime'
                className='accent-[#EA4B60]'
                checked={arrivalTimeFilter === 'PM'}
                onChange={() => setArrivalTimeFilter('PM')}
              />
              <label>12:00 PM - 11:59 PM</label>
            </div>
          </div>

          <div>
            <p className='text-[#16191E] text-lg font-medium mb-2 mt-4'>Flight duration</p>
            <div className='flex items-center gap-2'>
              <Checkbox 
                size={16}
                checked={flyTimeFilters.below2h}
                onChange={() => handleFlyTimeFilterChange('below2h')}
              />
              <label>Below 2 hours</label>
            </div>
            <div className='flex items-center gap-2'>
              <Checkbox 
                size={16}
                checked={flyTimeFilters.between2h4h}
                onChange={() => handleFlyTimeFilterChange('between2h4h')}
              />
              <label>2-4 hours</label>
            </div>
            <div className='flex items-center gap-2'>
              <Checkbox 
                size={16}
                checked={flyTimeFilters.between4h8h}
                onChange={() => handleFlyTimeFilterChange('between4h8h')}
              />
              <label>4-8 hours</label>
            </div>
            <div className='flex items-center gap-2'>
              <Checkbox 
                size={16}
                checked={flyTimeFilters.above8h}
                onChange={() => handleFlyTimeFilterChange('above8h')}
              />
              <label>Above 8 hours</label>
            </div>
          </div>
        </div>

        <div className='flex flex-wrap gap-4 w-fit h-[calc(100vh-290px)] overflow-y-auto pr-6'>
          {filteredFlights.length > 0 ? (
            filteredFlights.map((flight) => (
              <FlightCard key={flight.id} {...flight} />
            ))
          ) : (
            <div className='w-full text-center mt-8'>
              <p className='text-lg'>No flights match your search criteria</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default App;