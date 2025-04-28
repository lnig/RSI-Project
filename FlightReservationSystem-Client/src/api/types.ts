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
}

export interface CreateReservationPayload {
  flightId: string;
  passengerFirstname: string;
  passengerLastname: string;
  passengerEmail: string;
  seatsReserved: string;
  reservationDate?: string;
}

export interface CancelReservationPayload {
  reservationCode: string;
}

export interface CancelReservationResponse {
  success: boolean;
  message: string;
}

export interface GetReservationByCodePayload {
  reservationCode: string;
}

export interface GetReservationPdfPayload {
  reservationCode: string;
}

export interface GetReservationPdfResponse {
  success: boolean;
  message?: string;
  pdfData?: string;
  fileName?: string;
}

export type SoapAction = 
'getFlight' | 'searchFlights' | 'getAllFlights' | 
'createReservation' | 'cancelReservation' | 
'getReservationByCode' | 'getReservationPdf';
  
export type Payload = 
| { action: 'getFlight', payload: GetFlightPayload }
| { action: 'searchFlights', payload: SearchFlightsPayload }
| { action: 'getAllFlights', payload: GetAllFlightsPayload }
| { action: 'createReservation', payload: CreateReservationPayload }
| { action: 'cancelReservation', payload: CancelReservationPayload }
| { action: 'getReservationByCode', payload: GetReservationByCodePayload };