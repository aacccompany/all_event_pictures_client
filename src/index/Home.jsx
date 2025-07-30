import { Input } from '@/components/ui/input'
import React from 'react'
import { Search } from 'lucide-react';
import HowitWork from './components/Home/HowitWork';
import SearchBar from './components/Home/SearchBar';
import EventAct from './components/Home/EventAct';


const Home = () => {
    return (
        <div>
            <HowitWork/>
            <EventAct/>
        </div>
    )
}

export default Home