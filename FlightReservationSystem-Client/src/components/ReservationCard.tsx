import { PlaneTakeoff, PlaneLanding, Calendar1, Plane, KeyRound, Armchair, User, Mail, Ticket, Download, DownloadIcon } from 'lucide-react';
import Button from './Button';
import Tag from './Tag';
import { getReservationPdf } from '../api/flightSoapClient';
import { toast } from 'react-toastify';

interface ReservationCardProps {
  id: number;
  reservationCode: string;
  passengerFirstname: string;
  passengerLastname: string;
  passengerEmail: string;
  seatsReserved: number;
  totalPrice: number;
  reservationDate: string;
  flight: {
    id: number;
    flightCode: string;
    departureCity: {
      cityName: string;
      country: string;
    };
    arrivalCity: {
      cityName: string;
      country: string;
    };
    departureDatetime: string;
    arrivalDatetime: string;
    totalSeats: number;
    availableSeats: number;
    basePrice: number;
  };
  onCancel?: (reservationCode: string) => void;
}

const ReservationCard = ({
  id,
  reservationCode,
  passengerFirstname,
  passengerLastname,
  passengerEmail,
  seatsReserved,
  totalPrice,
  reservationDate,
  flight,
  onCancel
}: ReservationCardProps) => {

  const handleCancel = async () => {
    if (onCancel) {
      try {
        const response = await onCancel(reservationCode);
        if (response.success) {
          toast.success('Reservation canceled successfully');
        } else {
          toast.error(`Failed to cancel reservation: ${response.message}`);
        }
      } catch (error) {
        console.error('Cancel error:', error);
        toast.error('Error canceling reservation');
      }
    }
  };

  const handleDownloadPdf = async () => {
    try {
      await getReservationPdf(reservationCode);
      toast.success('PDF download started');
    } catch (error) {
      console.error('Download error:', error);
      toast.error('Failed to download reservation PDF');
    }
  };

  const calculateFlightDuration = () => {
    const departure = new Date(flight.departureDatetime);
    const arrival = new Date(flight.arrivalDatetime);
    const duration = arrival.getTime() - departure.getTime();
    
    const hours = Math.floor(duration / (1000 * 60 * 60));
    const minutes = Math.floor((duration % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${hours}h ${minutes}m`;
  };

  const extractTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const extractDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString([], { day: 'numeric', month: 'short', year: 'numeric' });
  };

  return (
    <div className="w-full flex flex-col h-fit p-4 border rounded border-[#DEE1E5]" key={id}>
      <div className='flex justify-between items-center mb-4'>
        <div className="flex items-center gap-2">
          <Ticket size={24} color="#313642"/>
          <p className="text-[#313642] font-medium text-xl">{reservationCode}</p>
          <p className="text-[#8E94A0] text-sm ml-4">Booked on {extractDate(reservationDate)}</p>
        </div>

        <Button 
          width="w-36"
          size="m"
          type="icon"
          Icon={DownloadIcon}
          onClick={handleDownloadPdf}
        />
      </div>
     
      <div className="flex items-center">
        <div className="flex flex-col gap-1 w-fit">
          <div className="flex items-center gap-2 w-32">
            <PlaneTakeoff size={16} color="#565D6D"/>
            <p className="text-[#565D6D] text-base font-medium mt-[2px]">
              {flight.departureCity.cityName}
            </p>
          </div>
          <p className="text-xl font-bold text-[#16191E] w-32">
            {extractTime(flight.departureDatetime)}
          </p>
          <div className="flex items-center gap-2 w-32">
            <Calendar1 size={14} color="#8E94A0"/>
            <p className="text-[#8E94A0] text-sm">
              {extractDate(flight.departureDatetime)}
            </p>
          </div>
        </div>

        <div className="flex items-center mx-8 w-full">
          <div className="w-2 h-2 rounded-full bg-[#EA4B60]"/>
          <div className="w-4/12 h-[2px] rounded-full bg-[#EA4B60]"/>
          <div className="w-2/12 h-[2px] rounded-full bg-[#BDC0C9]"/>
          <div className="flex flex-col items-center justify-center px-4 w-32">
            <Plane size={28} color='#EA4B60'/>
            <p className="text-[#16191E] font-medium">
              {calculateFlightDuration()}
            </p>
          </div>
          <div className="w-2/12 h-[2px] rounded-full bg-[#BDC0C9]"/>
          <div className="w-4/12 h-[2px] rounded-full bg-[#EA4B60]"/>
          <div className="w-2 h-2 rounded-full bg-[#EA4B60]"/>
        </div>

        <div className="flex flex-col gap-1 w-fit text-right">
          <div className="flex flex-row-reverse items-center gap-2 w-32">
            <p className="text-[#565D6D] text-base font-medium mt-[2px]">
              {flight.arrivalCity.cityName}
            </p>
            <PlaneLanding size={16} color="#565D6D" />
          </div>
          <p className="text-xl font-bold text-[#16191E] w-32">
            {extractTime(flight.arrivalDatetime)}
          </p>
          <div className="flex items-center gap-2 w-32 justify-end">
            <Calendar1 size={14} color="#8E94A0" />
            <p className="text-[#8E94A0] text-sm">
              {extractDate(flight.arrivalDatetime)}
            </p>
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center mt-4 gap-8">
        <div className="flex items-center gap-4">
          <Tag text={flight.flightCode} Icon={KeyRound} size="s"/>
          <Tag text={`${seatsReserved} seat${seatsReserved > 1 ? 's' : ''} booked`} Icon={Armchair} size="s"/>
        </div>

        <div className="flex items-center gap-4">
          <p className="text-[#16191E] font-bold text-2xl">
            {totalPrice.toFixed(2)} $
          </p>
        </div>
      </div>

      <div className='flex items-end justify-between'>
        <div className='flex flex-col'>
          <div className="flex items-center mt-8 gap-2">
            <User size={24} color="#16191E"/>
            <p className="text-[#16191E] font-medium text-xl">
              {passengerFirstname} {passengerLastname}
            </p>
          </div>

          <div className="flex items-center justify-between mt-1">
            <div className="flex items-center gap-2 ml-[2px]">
              <Mail size={20} color="#565D6D"/>
              <p className="text-[#565D6D] ml-1">{passengerEmail}</p>
            </div>
          </div>
        </div>

        <Button 
          width="w-36"
          size="m"
          text="Cancel Booking"
          type="secondary"
          onClick={handleCancel}
        />
      </div>
    </div>
  );
};

export default ReservationCard;