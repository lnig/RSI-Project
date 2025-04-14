import {
    SoapAction,
    GetAllFlightsPayload,
    GetFlightPayload,
    SearchFlightsPayload
} from '../api/types';

export const parseXmlResponse = (xmlString: string, namespace: string) => {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlString, "text/xml");
    
    const parserError = xmlDoc.getElementsByTagName("parsererror");
    if (parserError.length > 0) {
      throw new Error("XML parsing error: " + parserError[0].textContent);
    }
  
    return xmlDoc;
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
        bodyContent = `<flt:getFlightRequest><flt:id>${(payload as GetFlightPayload).id}</flt:id></flt:getFlightRequest>`;
        break;
      case 'searchFlights':
        { const searchPayload = payload as SearchFlightsPayload;
        const returnDateXml = searchPayload.returnDate 
          ? `<flt:returnDate>${searchPayload.returnDate}</flt:returnDate>`
          : '';
        bodyContent = `
          <flt:searchFlightsRequest>
            <flt:departureCityId>${searchPayload.departureCityId}</flt:departureCityId>
            <flt:arrivalCityId>${searchPayload.arrivalCityId}</flt:arrivalCityId>
            <flt:departureDate>${searchPayload.departureDate}</flt:departureDate>
            ${returnDateXml}
          </flt:searchFlightsRequest>
        `;
        break; }
      case 'getAllFlights':
        bodyContent = `<flt:getAllFlightsRequest></flt:getAllFlightsRequest>`;
        break;
    }
  
    return `
      <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" 
                        xmlns:flt="${serviceNS}">
        <soapenv:Header/>
        <soapenv:Body>
          ${bodyContent}
        </soapenv:Body>
      </soapenv:Envelope>
    `;
  };