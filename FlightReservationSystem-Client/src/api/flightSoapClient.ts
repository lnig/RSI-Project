import axios from 'axios';
import { 
  parseXmlResponse,
  getXmlValue,
  buildSoapRequest,
} from '../api/utils';
import {
    SoapAction, 
    Flight,
    GetAllFlightsPayload,
    GetFlightPayload,
    SearchFlightsPayload
} from '../api/types';

const SOAP_ENDPOINT = '/api/ws/flights.wsdl';
const SERVICE_NS = "http://example.org/flightreservationsystem";
const SOAP_NS = "http://schemas.xmlsoap.org/soap/envelope/";

export const callSoapService = async <T>(
  action: SoapAction,
  payload: GetFlightPayload | SearchFlightsPayload | GetAllFlightsPayload
): Promise<T> => {
  const soapRequest = buildSoapRequest(action, payload);
  const soapAction = `http://example.org/flightreservationsystem/${action}`;

  const headers = {
    'Content-Type': 'text/xml;charset=UTF-8',
    'SOAPAction': soapAction
  };

  try {
    const response = await axios.post(SOAP_ENDPOINT, soapRequest, {
      headers,
      responseType: 'text'
    });

    const xmlDoc = parseXmlResponse(response.data, SERVICE_NS);
    const soapBody = xmlDoc.getElementsByTagNameNS(SOAP_NS, "Body")[0];
    
    if (!soapBody) {
      throw new Error("SOAP Body not found in response");
    }

    console.log("SOAP Response:", response.data);
    
    return parseSoapResponse(action, soapBody);
  } catch (error) {
    console.error("SOAP Request Error:", error);
    throw error;
  }
};

const parseSoapResponse = <T>(action: SoapAction, soapBody: Element): T => {
  switch (action) {
    case 'getFlight':
      return parseFlightResponse(soapBody) as T;
    case 'searchFlights':
      return parseFlightsResponse(soapBody) as T;
    case 'getAllFlights':
      return parseFlightsResponse(soapBody) as T;
    default:
      throw new Error(`Unsupported action: ${action}`);
  }
};

const parseFlightResponse = (soapBody: Element): Flight => {
  const flightElement = soapBody.getElementsByTagNameNS(SERVICE_NS, "flight")[0];
  if (!flightElement) {
    throw new Error("Flight element not found in response");
  }

  return {
    id: parseInt(getXmlValue(flightElement, "id", SERVICE_NS) || "0"),
    flightCode: getXmlValue(flightElement, "flightCode", SERVICE_NS) || "",
    departureCity: {
      id: parseInt(getXmlValue(flightElement.getElementsByTagNameNS(SERVICE_NS, "departureCity")[0], "id", SERVICE_NS) || "0"),
      cityName: getXmlValue(flightElement.getElementsByTagNameNS(SERVICE_NS, "departureCity")[0], "cityName", SERVICE_NS) || "",
      country: getXmlValue(flightElement.getElementsByTagNameNS(SERVICE_NS, "departureCity")[0], "country", SERVICE_NS) || ""
    },
    arrivalCity: {
      id: parseInt(getXmlValue(flightElement.getElementsByTagNameNS(SERVICE_NS, "arrivalCity")[0], "id", SERVICE_NS) || "0"),
      cityName: getXmlValue(flightElement.getElementsByTagNameNS(SERVICE_NS, "arrivalCity")[0], "cityName", SERVICE_NS) || "",
      country: getXmlValue(flightElement.getElementsByTagNameNS(SERVICE_NS, "arrivalCity")[0], "country", SERVICE_NS) || ""
    },
    departureDatetime: getXmlValue(flightElement, "departureDatetime", SERVICE_NS) || "",
    arrivalDatetime: getXmlValue(flightElement, "arrivalDatetime", SERVICE_NS) || "",
    totalSeats: parseInt(getXmlValue(flightElement, "totalSeats", SERVICE_NS) || "0"),
    availableSeats: parseInt(getXmlValue(flightElement, "availableSeats", SERVICE_NS) || "0"),
    basePrice: parseFloat(getXmlValue(flightElement, "basePrice", SERVICE_NS) || "0")
  };
};

const parseFlightsResponse = (soapBody: Element): Flight[] => {
  const flights: Flight[] = [];
  
  const responseElement = soapBody.getElementsByTagNameNS(SERVICE_NS, "getAllFlightsResponse")[0];
  if (!responseElement) return flights;

  const flightElements = responseElement.getElementsByTagNameNS(SERVICE_NS, "flights");
  
  for (let i = 0; i < flightElements.length; i++) {
    const flightElement = flightElements[i];
    flights.push({
      id: parseInt(getXmlValue(flightElement, "id", SERVICE_NS) || "0"),
      flightCode: getXmlValue(flightElement, "flightCode", SERVICE_NS) || "",
      departureCity: {
        id: parseInt(getXmlValue(flightElement.getElementsByTagNameNS(SERVICE_NS, "departureCity")[0], "id", SERVICE_NS) || "0"),
        cityName: getXmlValue(flightElement.getElementsByTagNameNS(SERVICE_NS, "departureCity")[0], "cityName", SERVICE_NS) || "",
        country: getXmlValue(flightElement.getElementsByTagNameNS(SERVICE_NS, "departureCity")[0], "country", SERVICE_NS) || ""
      },
      arrivalCity: {
        id: parseInt(getXmlValue(flightElement.getElementsByTagNameNS(SERVICE_NS, "arrivalCity")[0], "id", SERVICE_NS) || "0"),
        cityName: getXmlValue(flightElement.getElementsByTagNameNS(SERVICE_NS, "arrivalCity")[0], "cityName", SERVICE_NS) || "",
        country: getXmlValue(flightElement.getElementsByTagNameNS(SERVICE_NS, "arrivalCity")[0], "country", SERVICE_NS) || ""
      },
      departureDatetime: getXmlValue(flightElement, "departureDatetime", SERVICE_NS) || "",
      arrivalDatetime: getXmlValue(flightElement, "arrivalDatetime", SERVICE_NS) || "",
      totalSeats: parseInt(getXmlValue(flightElement, "totalSeats", SERVICE_NS) || "0"),
      availableSeats: parseInt(getXmlValue(flightElement, "availableSeats", SERVICE_NS) || "0"),
      basePrice: parseFloat(getXmlValue(flightElement, "basePrice", SERVICE_NS) || "0")
    });
  }

  return flights;
};


export const getFlight = (id: number): Promise<Flight> => 
  callSoapService<Flight>('getFlight', { id: id.toString() });

export const searchFlights = (params: {
  departureCityId: number;
  arrivalCityId: number;
  departureDate: string;
  returnDate?: string;
}): Promise<Flight[]> => {
  // Walidacja parametrów
  if (!params.departureDate) {
    throw new Error("Departure date is required");
  }
  
  return callSoapService<Flight[]>('searchFlights', {
    departureCityId: params.departureCityId.toString(),
    arrivalCityId: params.arrivalCityId.toString(),
    departureDate: params.departureDate,
    returnDate: params.returnDate
  });
};

export const getAllFlights = (): Promise<Flight[]> => 
  callSoapService<Flight[]>('getAllFlights', {});