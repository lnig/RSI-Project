import { LogOut, Menu, X } from "lucide-react";
import { createContext, useState, useContext, ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";

const SidebarContext = createContext({});

type SidebarProps = {
  background?: string,
  children: ReactNode,
  onLogout?: () => void,
};

export default function Sidebar({ children, onLogout, background = "#fcfcfc" }: SidebarProps) {
  return (
    <aside className="lg:w-64"
      style={{background: background}}
      >
      <nav className="flex flex-col">
        <SidebarContext.Provider value={{}}>
          <ul
            className={`
              flex-1 px-3 py-4 lg:block
              lg:h-auto lg:overflow-y-auto
              overflow-y-auto max-h-[calc(100vh-64px)]
            `}
          >
            {children}
          </ul>
        </SidebarContext.Provider>
      </nav>
    </aside>
  );
}

type SidebarHeaderProps = {
  children: ReactNode,
}

type SidebarFooterProps = {
  children: ReactNode
}


type SidebarItemsGroupProps = {
  children: ReactNode,
  direction?: 'column' | 'row',
  gap?: number
}

export const SidebarItemsGroup: React.FC<SidebarItemsGroupProps> = ({
  direction = 'column',
  gap = 4,
  children
}) => {

  return (
    <div className="flex" style={{gap: gap, flexDirection: direction}}>
      {children}
    </div>
  )
}

export const SidebarHeader: React.FC<SidebarHeaderProps> = ({
  children
}) => {

  return (
    <div className="flex gap-2 items-center sticky h-fit">
      {children}
    </div>
  )
}






type SidebarItemProps = {
  text: string,
  path: string,
  Icon: React.ElementType,
  onClick?: () => void,
  badge?: boolean,
  primaryColor?: string,
  hoverColor?: string,
  activeColor?: string,
  textColor?: string
};

export const SidebarItem: React.FC<SidebarItemProps> = ({
  text,
  path,
  Icon,
  onClick,
  badge = false,
  primaryColor,
  hoverColor,
  activeColor,
  textColor
}) => {
  const location = useLocation();
  const isActive = location.pathname === path;

  return (
    <Link
      to={path}
      onClick={onClick}
      className={`relative flex items-center py-3 px-3 font-medium rounded-md cursor-pointer transition-colors ${
        isActive ? "bg-[#FCEFF1] text-[#EA4B60]" : "hover:bg-[#F2F3F4] text-[#565D6D]"
      }`}
    >
      <Icon />
      <span className="w-32 ml-3">{text}</span>
      {badge && <div className="absolute right-2 w-2 h-2 rounded bg-primary-500" />}
    </Link>
  );
};


type DropdownItem = {
  text: string,
  path: string,
  onClick?: () => void,
};

type SidebarDropdownProps = {
  text: string,
  Icon: React.ElementType,
  items: DropdownItem[],
  badge?: boolean,
};

export const SidebarDropdown: React.FC<SidebarDropdownProps> = ({
  text,
  Icon,
  items,
  badge = false
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const toggleDropdown = () => setIsOpen(!isOpen);
  const isActive = items.some(item => location.pathname === item.path);

  return (
    <div className="relative">
      <div
        onClick={toggleDropdown}
        className={`relative flex items-center py-3 px-3 font-medium rounded-md cursor-pointer transition-colors ${
          isActive ? "bg-[#FCEFF1] text-[#EA4B60]" : "hover:bg-[#F2F3F4] text-[#565D6D]"
        }`}
      >
        <Icon />
        <span className="w-32 ml-3">{text}</span>
        {badge && <div className="absolute right-2 w-2 h-2 rounded bg-primary-500" />}
      </div>
      {isOpen && (
        <div className="ml-8 mt-2 flex flex-col gap-2">
          {items.map((item, index) => (
            <Link
              key={index}
              to={item.path}
              onClick={item.onClick}
              className={`block py-2 px-3 font-medium rounded-md transition-colors ${
                location.pathname === item.path ? "bg-[#FCEFF1] text-[#EA4B60]" : "hover:bg-[#F2F3F4] text-[#565D6D]"
              }`}
            >
              {item.text}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};
