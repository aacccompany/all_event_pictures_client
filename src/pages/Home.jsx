import React from 'react'
import EventContainer from '@/components/Home/EventContainer';
import DashBoardContainer from '@/components/Dashboard/DashBoardContainer';
import AdminDashBoard from '@/components/AdminDashboard/AdminDashBoard';


const Home = () => {
    return (
        <div>
            {/* <EventContainer/> */}
            {/* <DashBoardContainer/> */}
            <AdminDashBoard/>
        </div>
    )
}

export default Home