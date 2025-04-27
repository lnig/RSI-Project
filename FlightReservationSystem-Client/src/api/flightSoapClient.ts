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
    SearchFlightsPayload,
    City,
    Reservation,
    CancelReservationResponse,
    GetReservationPdfResponse
} from '../api/types';

const SOAP_ENDPOINT = '/api/ws/flights.wsdl';
const SERVICE_NS = "http://example.org/flightreservationsystem";
const SOAP_NS = "http://schemas.xmlsoap.org/soap/envelope/";

export const callSoapService = async <T>(
  action: SoapAction,
  payload: any
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

    console.log("SOAP Request:", soapRequest);
    console.log("SOAP Response:", response.data);

    const xmlDoc = parseXmlResponse(response.data, SERVICE_NS);
    
    // Znajdź ciało SOAP na różne sposoby
    let soapBody = xmlDoc.documentElement;
    if (!soapBody) {
      throw new Error("No root element in XML response");
    }

    // Alternatywne metody znajdowania Body
    let bodyElement = soapBody.getElementsByTagNameNS(SOAP_NS, "Body")[0];
    if (!bodyElement) {
      bodyElement = soapBody.getElementsByTagName("Body")[0];
    }
    if (!bodyElement && soapBody.localName === "Body") {
      bodyElement = soapBody;
    }

    if (!bodyElement) {
      console.error("SOAP Body not found in:", soapBody);
      throw new Error("SOAP Body element not found in response");
    }

    return parseSoapResponse(action, bodyElement);
  } catch (error) {
    console.error("SOAP Request Error:", {
      error,
      config: error.config,
      response: error.response?.data
    });
    throw new Error(`SOAP Request Failed: ${getErrorMessage(error)}`);
  }
};

function getErrorMessage(error: any): string {
  if (error.response) {
    if (error.response.data) {
      if (typeof error.response.data === 'string') {
        if (error.response.data.includes('<faultstring>')) {
          const faultString = error.response.data.match(/<faultstring>(.*?)<\/faultstring>/)?.[1];
          return faultString || error.response.data;
        }
        return error.response.data;
      }
      return JSON.stringify(error.response.data);
    }
    return `Server responded with status ${error.response.status}`;
  } else if (error.request) {
    return "No response received from server";
  }
  return error.message || "Unknown error occurred";
}


const parseSoapResponse = <T>(action: SoapAction, soapBody: Element): T => {
  try {
    switch (action) {
      case 'getFlight':
        return parseFlightResponse(soapBody) as T;
      case 'searchFlights':
        return parseFlightsResponse(soapBody) as T;
      case 'getAllFlights':
        return parseFlightsResponse(soapBody) as T;
      case 'createReservation':
        return parseCreateReservationResponse(soapBody) as T;
      case 'cancelReservation':
        return parseCancelReservationResponse(soapBody) as T;
      case 'getReservationByCode':
        return parseReservationResponse(soapBody) as T;
      case 'getReservationPdf':
        return parseReservationPdfResponse(soapBody) as T;
      default:
        throw new Error(`Unsupported action: ${action}`);
    }
  } catch (error) {
    console.error('Error parsing SOAP response:', error);
    throw new Error(`Failed to parse SOAP response for action ${action}`);
  }
};

const parseReservationResponse = (soapBody: Element): Reservation => {
  const responseElement = soapBody.getElementsByTagNameNS(SERVICE_NS, "getReservationByCodeResponse")[0];
  if (!responseElement) {
      throw new Error("getReservationByCodeResponse element not found");
  }

  const reservationElement = responseElement.getElementsByTagNameNS(SERVICE_NS, "reservation")[0];
  if (!reservationElement) {
      throw new Error("Reservation element not found in response");
  }

  return parseReservationElement(reservationElement);
};

const parseCreateReservationResponse = (soapBody: Element): Reservation => {
  try {
    // Debugowanie struktury odpowiedzi
    console.log("SOAP Body content:", soapBody.innerHTML);

    // Próbuj różne ścieżki dostępu do odpowiedzi
    let responseElement = soapBody.querySelector("*|createReservationResponse, createReservationResponse");
    if (!responseElement) {
      // Sprawdź czy odpowiedź jest bezpośrednio w Body
      if (soapBody.children.length === 1) {
        responseElement = soapBody.firstElementChild;
      }
    }

    if (!responseElement) {
      console.error("Response element not found in:", soapBody);
      throw new Error("Could not find reservation response in SOAP body");
    }

    // Debugowanie elementu odpowiedzi
    console.log("Response element:", responseElement.outerHTML);

    let reservationElement = responseElement.querySelector("*|reservation, reservation");
    if (!reservationElement && responseElement.children.length === 1) {
      reservationElement = responseElement.firstElementChild;
    }

    if (!reservationElement) {
      console.error("Reservation element not found in:", responseElement);
      throw new Error("Could not find reservation data in response");
    }

    // Debugowanie elementu rezerwacji
    console.log("Reservation element:", reservationElement.outerHTML);

    return parseReservationElement(reservationElement);
  } catch (error) {
    console.error("Error parsing reservation response:", error);
    throw new Error(`Failed to parse reservation: ${error instanceof Error ? error.message : String(error)}`);
  }
};

const parseCancelReservationResponse = (soapBody: Element): CancelReservationResponse => {
  const responseElement = soapBody.getElementsByTagNameNS(SERVICE_NS, "cancelReservationResponse")[0];
  if (!responseElement) {
      throw new Error("cancelReservationResponse element not found");
  }

  return {
      success: getXmlValue(responseElement, "success", SERVICE_NS)?.toLowerCase() === 'true',
      message: getXmlValue(responseElement, "message", SERVICE_NS) || ''
  };
};

const parseReservationElement = (reservationElement: Element): Reservation => {
  const getValue = (tagName: string): string => {
    const element = reservationElement.getElementsByTagNameNS(SERVICE_NS, tagName)[0] || 
                   reservationElement.getElementsByTagName(tagName)[0];
    return element?.textContent || '';
  };

  const flightElement = reservationElement.getElementsByTagNameNS(SERVICE_NS, "flight")[0] ||
                       reservationElement.getElementsByTagName("flight")[0];
  
  // Parse basic flight info
  const flightId = parseInt(getXmlValue(flightElement, "id", SERVICE_NS) || "0");
  const totalSeats = parseInt(getXmlValue(flightElement, "totalSeats", SERVICE_NS) || "0");
  const availableSeats = parseInt(getXmlValue(flightElement, "availableSeats", SERVICE_NS) || "0");

  // Create minimal flight object
  const flight: Flight = {
    id: flightId,
    flightCode: getXmlValue(flightElement, "flightCode", SERVICE_NS) || "",
    departureCity: parseCityElement(flightElement.getElementsByTagNameNS(SERVICE_NS, "departureCity")[0]),
    arrivalCity: parseCityElement(flightElement.getElementsByTagNameNS(SERVICE_NS, "arrivalCity")[0]),
    departureDatetime: parseSoapDateTime(getXmlValue(flightElement, "departureDatetime", SERVICE_NS)),
    arrivalDatetime: parseSoapDateTime(getXmlValue(flightElement, "arrivalDatetime", SERVICE_NS)),
    totalSeats: totalSeats,
    availableSeats: availableSeats,
    basePrice: parseFloat(getXmlValue(flightElement, "basePrice", SERVICE_NS) || "0")
  };

  return {
    id: parseInt(getValue("id")) || 0,
    reservationCode: getValue("reservationCode"),
    passengerFirstname: getValue("passengerFirstname"),
    passengerLastname: getValue("passengerLastname"),
    passengerEmail: getValue("passengerEmail"),
    seatsReserved: parseInt(getValue("seatsReserved")) || 0,
    totalPrice: parseFloat(getValue("totalPrice")) || 0,
    reservationDate: parseSoapDateTime(getValue("reservationDate")),
    flight: flight
  };
};

const parseFlightResponse = (soapBody: Element): Flight => {
  const responseElement = soapBody.getElementsByTagNameNS(SERVICE_NS, "getFlightResponse")[0];
  if (!responseElement) {
      throw new Error("getFlightResponse element not found");
  }

  const flightElement = responseElement.getElementsByTagNameNS(SERVICE_NS, "flight")[0];
  if (!flightElement) {
      throw new Error("Flight element not found in response");
  }

  return {
      id: parseInt(getXmlValue(flightElement, "id", SERVICE_NS) || "0"),
      flightCode: getXmlValue(flightElement, "flightCode", SERVICE_NS) || "",
      departureCity: parseCity(flightElement.getElementsByTagNameNS(SERVICE_NS, "departureCity")[0]),
      arrivalCity: parseCity(flightElement.getElementsByTagNameNS(SERVICE_NS, "arrivalCity")[0]),
      departureDatetime: parseSoapDateTime(getXmlValue(flightElement, "departureDatetime", SERVICE_NS)),
      arrivalDatetime: parseSoapDateTime(getXmlValue(flightElement, "arrivalDatetime", SERVICE_NS)),
      totalSeats: parseInt(getXmlValue(flightElement, "totalSeats", SERVICE_NS) || "0"),
      availableSeats: parseInt(getXmlValue(flightElement, "availableSeats", SERVICE_NS) || "0"),
      basePrice: parseFloat(getXmlValue(flightElement, "basePrice", SERVICE_NS) || "0")
  };
};

const parseSoapDateTime = (dateTimeStr: string | null): string => {
  if (!dateTimeStr) return "";
  
  try {
    const date = new Date(dateTimeStr);
    // Format to: 2025-06-01T10:00:00.000+02:00
    const pad = (num: number) => num.toString().padStart(2, '0');
    const ms = date.getMilliseconds().toString().padStart(3, '0');
    
    // Get timezone offset in +/-HH:mm format
    const offset = -date.getTimezoneOffset();
    const offsetHours = Math.floor(Math.abs(offset) / 60);
    const offsetMinutes = Math.abs(offset) % 60;
    const offsetSign = offset >= 0 ? '+' : '-';
    const offsetStr = `${offsetSign}${pad(offsetHours)}:${pad(offsetMinutes)}`;
    
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T` +
           `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}.${ms}${offsetStr}`;
  } catch (e) {
    console.warn("Failed to parse date:", dateTimeStr);
    return dateTimeStr;
  }
};

const parseCityElement = (cityElement: Element | undefined): City => {
  if (!cityElement) {
    return {
      id: 0,
      cityName: "",
      country: ""
    };
  }
  
  return {
    id: parseInt(getXmlValue(cityElement, "id", SERVICE_NS) || "0"),
    cityName: getXmlValue(cityElement, "cityName", SERVICE_NS) || "",
    country: getXmlValue(cityElement, "country", SERVICE_NS) || ""
  };
};

const parseFlightsResponse = (soapBody: Element): Flight[] => {
  const flights: Flight[] = [];
  
  // Szukaj odpowiedzi w różnych możliwych formach
  const responseElements = [
    ...Array.from(soapBody.getElementsByTagNameNS(SERVICE_NS, "searchFlightsResponse")),
    ...Array.from(soapBody.getElementsByTagNameNS(SERVICE_NS, "getAllFlightsResponse"))
  ];

  for (const responseElement of responseElements) {
    // Szukaj lotów w różnych możliwych formach
    const flightElements = [
      ...Array.from(responseElement.getElementsByTagNameNS(SERVICE_NS, "flights")),
      ...Array.from(responseElement.getElementsByTagNameNS(SERVICE_NS, "flight"))
    ];

    for (const flightElement of flightElements) {
      try {
        flights.push(parseFlightElement(flightElement));
      } catch (e) {
        console.error('Error parsing flight element:', e);
      }
    }
  }

  return flights;
};

export const getReservationByCode = async (reservationCode: string): Promise<Reservation> => {
  try {
    return await callSoapService<Reservation>('getReservationByCode', {
      reservationCode: reservationCode
    });
  } catch (error) {
    console.error('Get reservation by code error:', error);
    throw error;
  }
};

const parseFlightElement = (flightElement: Element): Flight => {
  const departureCityElement = flightElement.getElementsByTagNameNS(SERVICE_NS, "departureCity")[0] ||
                              flightElement.getElementsByTagName("departureCity")[0];
  
  const arrivalCityElement = flightElement.getElementsByTagNameNS(SERVICE_NS, "arrivalCity")[0] ||
                            flightElement.getElementsByTagName("arrivalCity")[0];

  return {
    id: parseInt(getXmlValue(flightElement, "id", SERVICE_NS) || "0"),
    flightCode: getXmlValue(flightElement, "flightCode", SERVICE_NS) || "",
    departureCity: parseCityElement(departureCityElement),
    arrivalCity: parseCityElement(arrivalCityElement),
    departureDatetime: parseSoapDateTime(getXmlValue(flightElement, "departureDatetime", SERVICE_NS)),
    arrivalDatetime: parseSoapDateTime(getXmlValue(flightElement, "arrivalDatetime", SERVICE_NS)),
    totalSeats: parseInt(getXmlValue(flightElement, "totalSeats", SERVICE_NS) || "0"),
    availableSeats: parseInt(getXmlValue(flightElement, "availableSeats", SERVICE_NS) || "0"),
    basePrice: parseFloat(getXmlValue(flightElement, "basePrice", SERVICE_NS) || "0")
  };
};


export const getFlight = (id: number): Promise<Flight> => 
  callSoapService<Flight>('getFlight', { id: id.toString() });

export const searchFlights = async (params: {
  departureCityId: number;
  arrivalCityId: number;
  departureDate: string;
  returnDate?: string;
}): Promise<Flight[]> => {
  try {
    // Formatowanie daty zgodnie z oczekiwaniami SOAP
    const formatDateForSoap = (dateString: string) => {
      const date = new Date(dateString);
      const offset = date.getTimezoneOffset();
      const adjustedDate = new Date(date.getTime() - (offset * 60 * 1000));
      return adjustedDate.toISOString().replace('Z', '+02:00');
    };

    const departureDate = formatDateForSoap(params.departureDate);
    const returnDate = params.returnDate ? formatDateForSoap(params.returnDate) : undefined;

    const results = await callSoapService<Flight[]>('searchFlights', {
      departureCityId: params.departureCityId.toString(),
      arrivalCityId: params.arrivalCityId.toString(),
      departureDate: departureDate,
      returnDate: returnDate
    });

    return results;
  } catch (error) {
    console.error('Search flights error:', error);
    return [];
  }
};

export const getAllFlights = (): Promise<Flight[]> => 
  callSoapService<Flight[]>('getAllFlights', {});

export const createReservation = async (params: {
  flightId: number;
  passengerFirstname: string;
  passengerLastname: string;
  passengerEmail: string;
  seatsReserved: number;
}): Promise<Reservation> => {
  console.log("Creating reservation with params:", params);
  try {
    // Format current date for SOAP request
    const reservationDate = new Date().toISOString();
    
    const result = await callSoapService<Reservation>('createReservation', {
      flightId: params.flightId.toString(),
      passengerFirstname: params.passengerFirstname,
      passengerLastname: params.passengerLastname,
      passengerEmail: params.passengerEmail,
      seatsReserved: params.seatsReserved.toString(),
      reservationDate: reservationDate // Add current date
    });
    console.log("Reservation created successfully:", result);
    return result;
  } catch (error) {
    console.error('Create reservation error:', {
      error,
      params
    });
    throw error;
  }
};

export const cancelReservation = async (reservationCode: string): Promise<CancelReservationResponse> => {
  try {
    const response = await callSoapService<CancelReservationResponse>('cancelReservation', {
      reservationCode: reservationCode
    });
    return response;
  } catch (error) {
    console.error('Cancel reservation error:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
};

const parseReservationPdfResponse = (soapBody: Element): GetReservationPdfResponse => {
  const responseElement = soapBody.getElementsByTagNameNS(SERVICE_NS, "getReservationPdfResponse")[0];
  if (!responseElement) {
    throw new Error("getReservationPdfResponse element not found");
  }

  return {
    success: getXmlValue(responseElement, "success", SERVICE_NS)?.toLowerCase() === 'true',
    message: getXmlValue(responseElement, "message", SERVICE_NS) || undefined,
    pdfData: getXmlValue(responseElement, "pdfData", SERVICE_NS) || undefined,
    fileName: getXmlValue(responseElement, "fileName", SERVICE_NS) || undefined
  };
};

export const getReservationPdf = async (reservationCode: string): Promise<void> => {
  try {
    const response = await callSoapService<GetReservationPdfResponse>('getReservationPdf', {
      reservationCode: reservationCode
    });

    if (response.success && response.pdfData) {
      // Konwertuj base64 na Blob
      const byteCharacters = atob(response.pdfData);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], {type: 'application/pdf'});

      // Utwórz link do pobrania
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = response.fileName || `reservation_${reservationCode}.pdf`;
      document.body.appendChild(a);
      a.click();
      
      // Sprzątanie
      window.URL.revokeObjectURL(url);
      a.remove();
    } else {
      throw new Error(response.message || 'Failed to generate PDF');
    }
  } catch (error) {
    console.error('Error getting reservation PDF:', error);
    throw error;
  }
};