export interface City {
    id: number;
    cityName: string;
    country: string;
  }
  
  export interface Flight {
    id: number;
    flightCode: string;
    departureCity: City;
    arrivalCity: City;
    departureDatetime: string;
    arrivalDatetime: string;
    totalSeats: number;
    availableSeats: number;
    basePrice: number;
  }
  
  export interface Reservation {
    id: number;
    reservationCode: string;
    passengerFirstname: string;
    passengerLastname: string;
    passengerEmail: string;
    seatsReserved: number;
    totalPrice: number;
    reservationDate: string;
    flight: Flight;
  }
  
  export type SoapAction = 'getFlight' | 'searchFlights' | 'getAllFlights';

  export interface GetFlightPayload {
    id: string;
  }
  
  export interface SearchFlightsPayload {
    departureCityId: string;
    arrivalCityId: string;
    departureDate: string;
    returnDate?: string;
  }
  
  export interface GetAllFlightsPayload {
    // Może zawierać jakieś pola w przyszłości
  }
  
  export type Payload = 
    | { action: 'getFlight', payload: GetFlightPayload }
    | { action: 'searchFlights', payload: SearchFlightsPayload }
    | { action: 'getAllFlights', payload: GetAllFlightsPayload };