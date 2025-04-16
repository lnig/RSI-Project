import { Armchair, Calendar1, CircleAlert, Flag, KeyRound, MapPin, Plane, PlaneLanding, PlaneTakeoff } from "lucide-react";
import Button from "./Button";
import { Flight } from "../api/types";
import Tag from "./Tag";
import Modal from "./Modal";
import { useState } from "react";
import NumberInput from "./NumberInput";

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
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [passengerCount, setPassengerCount] = useState(1);
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);

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

  const handleBookFlight = () => {
    setIsBookingModalOpen(true);
  };

  const handleModalClose = () => {
    setIsBookingModalOpen(false);
    setPassengerCount(1);
    setSelectedSeats([]);
  };

  const handleSubmitBooking = () => {
    console.log("Booking details:", {
      flightId: id,
      passengers: passengerCount,
      seats: selectedSeats,
      totalPrice: basePrice * passengerCount
    });
    
    alert(`Flight ${flightCode} booked successfully!`);
    handleModalClose();
  };

  const toggleSeatSelection = (seat: string) => {
    if (selectedSeats.includes(seat)) {
      setSelectedSeats(selectedSeats.filter(s => s !== seat));
    } else {
      if (selectedSeats.length < passengerCount) {
        setSelectedSeats([...selectedSeats, seat]);
      }
    }
  };

  return (
    <div className="w-full flex flex-col h-fit p-4 border rounded border-[#DEE1E5]" key={id}>
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
            onClick={handleBookFlight}
          />
        </div>
        
      </div>

      <Modal 
        isOpen={isBookingModalOpen} 
        onClose={handleModalClose} 
        title={`Book Flight ${flightCode}`}
      >
        <div className="flex flex-col ">
          <div className="flex flex-row justify-between items-center gap-4 px-3 py-2 bg-[#F9F9F9] rounded">
            <div className="">
              <div className="flex items-center gap-2">
                <PlaneTakeoff size={14} color="#565D6D"/>
                <p className="text-[#565D6D] text-sm font-medium mt-[2px]">{departureCity.cityName}</p>
              </div>
              <p className="font-bold text-lg text-[#16191E]">{extractTime(departureDatetime)}</p>
              <div className="flex items-center gap-2">
                <Calendar1 size={14} color="#8E94A0"/>
                <p className="text-[#8E94A0] text-sm">{extractDate(departureDatetime)}</p>
              </div>
            </div>

            <div className="flex flex-col items-center justify-center px-4">
              <Plane size={20} color='#EA4B60'/>
              <p className="text-[#16191E] text-sm font-medium">{calculateFlightDuration()}</p>
            </div>
           
            <div>
              <div className="flex items-center gap-2">
                <PlaneTakeoff size={14} color="#565D6D"/>
                <p className="text-[#565D6D] text-sm font-medium mt-[2px]">{arrivalCity.cityName}</p>
              </div>
              <p className="font-bold text-lg text-[#16191E]">{extractTime(arrivalDatetime)}</p>
              <div className="flex items-center gap-2">
                <Calendar1 size={14} color="#8E94A0"/>
                <p className="text-[#8E94A0] text-sm">{extractDate(arrivalDatetime)}</p>
              </div>
            </div>
          </div>

          <div className="mt-4">
            <label className="block mb-1 font-medium text-[#16191E]">Passengers</label>
            <NumberInput 
              minValue={1}
              maxValue={availableSeats}
              value={passengerCount}
              onChange={(value) => {
                setPassengerCount(value);
                setSelectedSeats([]);
              }}
            />
          </div>

          {passengerCount > 0 && (
          <div className="mt-4">
            <label className="block mb-2 font-medium text-[#16191E]">
              Select Seats ({selectedSeats.length}/{passengerCount})
            </label>

            <div className="max-h-60 overflow-y-auto custom-scrollbar flex gap-8">
              <div className="flex-1">
                {Array.from({ length: Math.ceil(totalSeats / 6) }, (_, row) => {
                  return (
                    <div key={`left-row-${row}`} className="flex items-center w-full py-[2px] pl-1">
                      <div className="grid grid-cols-3 place-content-center w-full">
                        {[0, 1, 2].map((col) => {
                          const seatNumber = row * 6 + col + 1;
                          if (seatNumber > totalSeats) return null;
                          
                          const seatLabel = `${seatNumber}`;
                          const isAvailable = seatNumber <= availableSeats;
                          const isSelected = selectedSeats.includes(seatLabel);
                          
                          return (
                            <button 
                              key={seatNumber}
                              disabled={!isAvailable}
                              onClick={() => toggleSeatSelection(seatLabel)}
                              className={`flex items-center gap-1 p-1 rounded text-[#16191E] ${
                                isSelected 
                                  ? 'text-[#EA4B60] cursor-pointer' 
                                  : isAvailable 
                                    ? 'hover:text-[#565D6D] cursor-pointer' 
                                    : 'opacity-50 cursor-not-allowed'
                              }`}
                            >
                              <Armchair size={16}/>
                              <p className="text-base">{seatLabel}</p>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
              
              <div className="flex-1">
                {Array.from({ length: Math.ceil(totalSeats / 6) }, (_, row) => {
                  return (
                    <div key={`right-row-${row}`} className="flex items-center w-full py-[2px] pr-1">
                      <div className="grid grid-cols-3 place-content-center w-full">
                        {[3, 4, 5].map((col) => {
                          const seatNumber = row * 6 + col + 1;
                          if (seatNumber > totalSeats) return null;
                          
                          const seatLabel = `${seatNumber}`;
                          const isAvailable = seatNumber <= availableSeats;
                          const isSelected = selectedSeats.includes(seatLabel);
                          
                          return (
                            <button 
                              key={`seat-${seatNumber}`}
                              disabled={!isAvailable}
                              onClick={() => toggleSeatSelection(seatLabel)}
                              className={`flex items-center gap-1 p-1 rounded text-[#16191E] ${
                                isSelected 
                                  ? 'text-[#EA4B60] cursor-pointer' 
                                  : isAvailable 
                                    ? 'hover:text-[#565D6D] cursor-pointer' 
                                    : 'opacity-50 cursor-not-allowed'
                              }`}
                            >
                              <Armchair size={16}/>
                              <p className="text-base">{seatLabel}</p>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

          <div className="mt-4 pt-2 border-t">
            <div className="flex justify-between items-center mb-4">
              <p className="font-semibold text-[#313642]">Total</p>
              <p className="font-bold text-lg text-[#16191E]">${(basePrice * passengerCount).toFixed(2)}</p>
            </div>
            <div className="flex justify-end">
              <Button
                text="Confirm Booking"
                type="primary"
                onClick={handleSubmitBooking}
                disabled={selectedSeats.length !== passengerCount}
              />
            </div>
          </div>
        </div>
      </Modal>
    </div>
    );
  };
  
  export default FlightCard;