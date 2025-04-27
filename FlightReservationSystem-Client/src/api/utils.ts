import {
    SoapAction,
    GetAllFlightsPayload,
    GetFlightPayload,
    SearchFlightsPayload,
    CreateReservationPayload,
    CancelReservationPayload,
    GetReservationByCodePayload,
    GetReservationPdfPayload
} from '../api/types';

export const parseXmlResponse = (xmlString: string, namespace: string) => {
  try {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlString, "text/xml");
    
    // Sprawdź błędy parsera XML
    const parserError = xmlDoc.getElementsByTagName("parsererror");
    if (parserError.length > 0) {
      console.error("XML parsing error:", parserError[0].textContent);
      throw new Error("Invalid XML response from server");
    }

    // Debugowanie - logowanie pełnej odpowiedzi
    console.log("Full SOAP Response:", xmlString);
    console.log("Parsed XML Document:", xmlDoc);

    return xmlDoc;
  } catch (error) {
    console.error("Error parsing XML:", error);
    throw new Error(`Failed to parse XML response: ${error instanceof Error ? error.message : String(error)}`);
  }
};
  
export const getXmlValue = (parent: Element, tagName: string, namespace?: string) => {
  const elements = namespace 
      ? parent.getElementsByTagNameNS(namespace, tagName)
      : parent.getElementsByTagName(tagName);
  return elements.length > 0 ? elements[0].textContent : null;
};
  
export const buildSoapRequest = (action: SoapAction, payload: GetFlightPayload | SearchFlightsPayload | GetAllFlightsPayload): string => {
  const serviceNS = "http://example.org/flightreservationsystem";
  
  let bodyContent = '';
  switch (action) {
    case 'getFlight':
      bodyContent = `<flig:getFlightRequest><flig:id>${(payload as GetFlightPayload).id}</flig:id></flig:getFlightRequest>`;
      break;
      case 'searchFlights':
        { 
        const searchPayload = payload as SearchFlightsPayload;
        const returnDateXml = searchPayload.returnDate 
          ? `<flig:returnDate>${searchPayload.returnDate}</flig:returnDate>`
          : '';
        bodyContent = `
          <flig:searchFlightsRequest>
            <flig:departureCityId>${searchPayload.departureCityId}</flig:departureCityId>
            <flig:arrivalCityId>${searchPayload.arrivalCityId}</flig:arrivalCityId>
            <flig:departureDate>${searchPayload.departureDate}</flig:departureDate>
            ${returnDateXml}
          </flig:searchFlightsRequest>
        `;
        break; 
      }
    case 'getAllFlights':
      bodyContent = `<flig:getAllFlightsRequest/>`;
      break;

      case 'createReservation':
        {
          const reservationPayload = payload as CreateReservationPayload;
          bodyContent = `
            <flig:createReservationRequest>
              <flig:flightId>${reservationPayload.flightId}</flig:flightId>
              <flig:passengerFirstname>${reservationPayload.passengerFirstname}</flig:passengerFirstname>
              <flig:passengerLastname>${reservationPayload.passengerLastname}</flig:passengerLastname>
              <flig:passengerEmail>${reservationPayload.passengerEmail}</flig:passengerEmail>
              <flig:seatsReserved>${reservationPayload.seatsReserved}</flig:seatsReserved>
              ${reservationPayload.reservationDate ? 
                `<flig:reservationDate>${reservationPayload.reservationDate}</flig:reservationDate>` : ''}
            </flig:createReservationRequest>
          `;
          break;
        }
        case 'cancelReservation':
      {
        const cancelPayload = payload as CancelReservationPayload;
        bodyContent = `
          <flig:cancelReservationRequest>
            <flig:reservationCode>${cancelPayload.reservationCode}</flig:reservationCode>
          </flig:cancelReservationRequest>
        `;
        break;
      }
      case 'getReservationByCode':
      bodyContent = `
        <flig:getReservationByCodeRequest>
          <flig:reservationCode>${(payload as GetReservationByCodePayload).reservationCode}</flig:reservationCode>
        </flig:getReservationByCodeRequest>
      `;
      break;
      case 'getReservationPdf':
      bodyContent = `
        <flig:getReservationPdfRequest>
          <flig:reservationCode>${(payload as GetReservationPdfPayload).reservationCode}</flig:reservationCode>
        </flig:getReservationPdfRequest>
      `;
      break;
  }


  return `
    <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" 
                      xmlns:flig="${serviceNS}">
      <soapenv:Header/>
      <soapenv:Body>
        ${bodyContent}
      </soapenv:Body>
    </soapenv:Envelope>
  `;
};