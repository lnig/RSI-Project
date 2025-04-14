import { Armchair, Calendar1, CircleAlert, Flag, KeyRound, MapPin, Plane, PlaneLanding, PlaneTakeoff } from "lucide-react";
import Button from "./Button";
import { Flight } from "../api/types";
import Tag from "./Tag";

interface FlightCardProps extends Flight {}

const FlightCard: React.FC<FlightCardProps> = ({
  id,
  flightCode,
  departureCity,
  arrivalCity,
  departureDatetime,
  arrivalDatetime,
  totalSeats,
  availableSeats,
  basePrice
}) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const extractDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-Us', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    })
  }

  const extractTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-Us', {
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const calculateFlightDuration = () => {
    const departure = new Date(departureDatetime);
    const arrival = new Date(arrivalDatetime);
    const durationMs = arrival.getTime() - departure.getTime();
    
    const hours = Math.floor(durationMs / (1000 * 60 * 60));
    const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${hours}h ${minutes}m`;
  }

  return (
    <div className="w-full flex flex-col p-4 border rounded border-[#DEE1E5]" key={id}>
      <div className="flex items-center">
        <div className="flex flex-col gap-1 w-fit">
            <div className="flex items-center gap-2 w-32">
                <PlaneTakeoff size={16} color="#565D6D"/>
                <p className="text-[#565D6D] text-base font-medium mt-[2px]">{departureCity.cityName}</p>
            </div>
            <p className="text-xl font-bold text-[#16191E] w-32">{extractTime(departureDatetime)}</p>
            <div className="flex items-center gap-2 w-32">
              <Calendar1 size={14} color="#8E94A0"/>
              <p className="text-[#8E94A0] text-sm">{extractDate(departureDatetime)}</p>
            </div>
        </div>

        <div className="flex items-center mx-8 w-full">
          <div className="w-2 h-2 rounded-full bg-[#EA4B60]"/>
          <div className="w-4/12 h-[2px] rounded-full bg-[#EA4B60]"/>
          <div className="w-2/12 h-[2px] rounded-full bg-[#BDC0C9]"/>
          <div className="flex flex-col items-center justify-center px-4 w-32">
            <Plane size={28} color='#EA4B60'/>
            <p className="text-[#16191E] font-medium">{calculateFlightDuration()}</p>
          </div>
          <div className="w-2/12 h-[2px] rounded-full bg-[#BDC0C9]"/>
          <div className="w-4/12 h-[2px] rounded-full bg-[#EA4B60]"/>
          <div className="w-2 h-2 rounded-full bg-[#EA4B60]"/>
        </div>

        <div className="flex flex-col gap-1 w-fit">
          <div className="flex items-center gap-2 w-32">
              <PlaneLanding size={16} color="#565D6D"/>
              <p className="text-[#565D6D] text-base font-medium mt-[2px] w-32">{arrivalCity.cityName}</p>
          </div>
          <p className="text-xl font-bold text-[#16191E] w-32">{extractTime(arrivalDatetime)}</p>
          <div className="flex items-center gap-2 w-32">
            <Calendar1 size={14} color="#8E94A0"/>
            <p className="text-[#8E94A0] text-sm">{extractDate(departureDatetime)}</p>
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center mt-4 gap-8">
        <div className="flex items-center gap-4">
          <Tag text={flightCode} Icon={KeyRound} size="s"/>
          <Tag text={availableSeats.toString() + ' seats left'} Icon={Armchair} size="s"/>
        </div>

        <div className="flex items-center gap-4">
          <p className="text-[#16191E] font-bold text-2xl">{basePrice} $</p>
        
          <Button 
            width="w-36"
            size="m"
            text="Book Flight"
            type="primary"
          />
        </div>
        
      </div>
    </div>
    );
  };
  
  export default FlightCard;