
import React from 'react'
import HowitWork from './components/Home/HowitWork';
import SearchBar from './components/Home/SearchBar';
import EventAct from './components/Home/EventAct';


const Home = () => {
    return (
        <div>
            <SearchBar/>
            <HowitWork/>
            <EventAct/>
        </div>
    )
}

export default Home