import { X } from "lucide-react";
import { ReactNode } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

const Modal = ({ isOpen, onClose, title, children }: ModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="bg-white flex justify-between items-center p-4 z-10">
          <h3 className="text-xl font-semibold text-[#313642]">{title}</h3>
          <button 
            onClick={onClose}
            className="hover:cursor-pointer rounded hover:bg-[#F2F3F4]"
            aria-label="Close modal"
          >
            <X size={20} color="#16191E"/>
          </button>
        </div>
        <div className="p-4 overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;