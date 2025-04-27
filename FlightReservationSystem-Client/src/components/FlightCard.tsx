import { Armchair, Calendar1, CircleAlert, Flag, KeyRound, MapPin, Plane, PlaneLanding, PlaneTakeoff } from "lucide-react";
import Button from "./Button";
import { Flight, Reservation } from "../api/types";
import Tag from "./Tag";
import Modal from "./Modal";
import { useState } from "react";
import NumberInput from "./NumberInput";
import Input from "./Input";
import { createReservation } from "../api/flightSoapClient";

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
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState({
    firstName: false,
    lastName: false,
    email: false,
    seats: false
  });
  const [isBooking, setIsBooking] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [reservationDetails, setReservationDetails] = useState<Reservation | null>(null);

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
    setFirstName('');
    setLastName('');
    setEmail('');
    setErrors({
      firstName: false,
      lastName: false,
      email: false,
      seats: false
    });
  };

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleSubmitBooking = async () => {
    setIsBooking(true);
    setErrors({
      firstName: false,
      lastName: false,
      email: false,
      seats: false
    });

    // Validate form
    let isValid = true;
    const newErrors = { ...errors };

    if (!firstName.trim()) {
      newErrors.firstName = true;
      isValid = false;
    }

    if (!lastName.trim()) {
      newErrors.lastName = true;
      isValid = false;
    }

    if (!email.trim() || !validateEmail(email)) {
      newErrors.email = true;
      isValid = false;
    }

    if (selectedSeats.length !== passengerCount) {
      newErrors.seats = true;
      isValid = false;
    }

    setErrors(newErrors);

    if (!isValid) {
      setIsBooking(false);
      return;
    }

    try {
      // Create the reservation
      const reservation = await createReservation({
        flightId: id,
        passengerFirstname: firstName,
        passengerLastname: lastName,
        passengerEmail: email,
        seatsReserved: passengerCount
      });

      // Set reservation details and show success modal
      setReservationDetails(reservation);
      setShowSuccessModal(true);
      handleModalClose();
    } catch (error) {
      console.error("Booking failed:", error);
      alert(`Booking failed: ${error instanceof Error ? error.message : "Unknown error"}`);
    } finally {
      setIsBooking(false);
    }
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

  const handleFirstNameChange = (firstName: string | number) => {
    setFirstName(String(firstName));
  }

  const handleLastNameChange = (lastName: string | number) => {
    setLastName(String(lastName));
  }

  const handleEmailChange = (email: string | number) => {
    setEmail(String(email));
  }

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

          <div className="flex w-full gap-4">
            <div className="mt-4 w-1/2">
              <label className="block mb-1 font-medium text-[#16191E]">First Name</label>
              <Input 
                type="text"
                value={firstName}
                onValueChange={handleFirstNameChange}
                placeholder="eg. John"
                width="w-full"
                size="l"
              />
              {errors.firstName && (
                <p className="mt-1 text-sm text-red-500">First name is required</p>
              )}
            </div>

            <div className="mt-4 w-1/2">
              <label className="block mb-1 font-medium text-[#16191E]">Last Name</label>
              <Input 
                type="text"
                value={lastName}
                onValueChange={handleLastNameChange}
                placeholder="eg. Smith"
                width="w-full"
                size="l"
              />
              {errors.lastName && (
                <p className="mt-1 text-sm text-red-500">Last name is required</p>
              )}
            </div>
          </div>

          <div className="mt-4">
            <label className="block mb-1 font-medium text-[#16191E]">Email</label>
            <Input 
              type="text"
              value={email}
              onValueChange={handleEmailChange}
              placeholder="eg. john.doe@example.com"
              width="w-full"
              size="l"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-500">
                {!email ? "Email is required" : "Please enter a valid email"}
              </p>
            )}
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
              {errors.seats && (
                <span className="ml-2 text-sm text-red-500">Please select all seats</span>
              )}
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
                text={isBooking ? "Processing..." : "Confirm Booking"}
                type="primary"
                onClick={handleSubmitBooking}
                disabled={selectedSeats.length !== passengerCount || isBooking}

              />
            </div>
          </div>
        </div>
      </Modal>

      {showSuccessModal && reservationDetails && (
        <Modal 
          isOpen={showSuccessModal} 
          onClose={() => setShowSuccessModal(false)}
          title="Booking Confirmed"
        >
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-center gap-2 p-4 bg-green-50 rounded">
              <CircleAlert className="text-green-500" size={24} />
              <p className="text-green-800 font-medium">Your booking was successful!</p>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-[#565D6D]">Reservation Code:</span>
                <span className="font-medium">{reservationDetails.reservationCode}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#565D6D]">Flight:</span>
                <span className="font-medium">{reservationDetails.flight.flightCode}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#565D6D]">Passenger:</span>
                <span className="font-medium">{reservationDetails.passengerFirstname} {reservationDetails.passengerLastname}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#565D6D]">Seats:</span>
                <span className="font-medium">{reservationDetails.seatsReserved}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#565D6D]">Total Price:</span>
                <span className="font-medium">${reservationDetails.totalPrice.toFixed(2)}</span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t">
              <p className="text-sm text-[#8E94A0]">
                A confirmation has been sent to {reservationDetails.passengerEmail}
              </p>
            </div>

            <div className="flex justify-end mt-4">
              <Button
                text="Close"
                type="secondary"
                onClick={() => setShowSuccessModal(false)}
              />
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default FlightCard;