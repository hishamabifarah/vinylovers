
import Logo from '@/assets/viny.png'
import Image from "next/image";

import { useState } from 'react';
import { Home, Star, Music, MessageCircle , Menu } from 'lucide-react';

const Sidebar: React.FC = () => {
    const [isOpen, setIsOpen] = useState<boolean>(true); // State to toggle sidebar

    return (
        <div className={`flex flex-col h-screen bg-[#18181d] text-white ${isOpen ? 'w-64' : 'w-16'} transition-width duration-300`}>
            <div className="flex items-center justify-between h-16 p-4 mt-5">
            <Image className=" w-[100%] h-10 hidden md:block " src={Logo} alt="Vinylovers Logo" />

               <button onClick={() => setIsOpen(!isOpen)} className="md:hidden">
                    <Menu className="w-6 h-6" />
                </button>
            </div>
            <nav className="flex-1">
                <ul className="space-y-4 p-4">
                    <li className="flex items-center space-x-2 cursor-pointer">
                        <Home className="w-6 h-6" />
                        {isOpen && <span>Explore</span>}
                    </li>
                    <li className="flex items-center space-x-2 cursor-pointer">
                        <Star className="w-6 h-6" />
                        {isOpen && <span>Favorites</span>}
                    </li>
                    <li className="flex items-center space-x-2 cursor-pointer">
                        <Music className="w-6 h-6" />
                        {isOpen && <span>Genres</span>}
                    </li>
                    <li className="flex items-center space-x-2 cursor-pointer">
                        <MessageCircle className="w-6 h-6" />
                        {isOpen && <span>Messages</span>}
                    </li>
                </ul>
            </nav>
        </div>
    );
};

export default Sidebar;