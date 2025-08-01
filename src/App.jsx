import React from 'react'
import Nav from './index/nav'
import Cart from './index/Cart'
import Home from './index/Home'
import { Input } from "@/components/ui/input"
import SearchBar from './index/components/Home/SearchBar'
import HowitWork from './index/components/Home/HowitWork'
import Event from './index/Event'
import Register from './index/Register'
import Login from './index/Login'
import Photographerinfo from './index/Photographerinfo'
import EventAll from './index/components/Event/EventAll'
import PicLoad from './index/components/Download/PicLoad'

const App = () => {
  return (
    <div>
      <Nav/>
      <SearchBar />
      <div className="">
        
        <Home />
        {/* <Event/> */}
        {/* <Register /> */}
        {/* <Photographerinfo/> */}
        {/* <Cart/> */}
        {/* <PicLoad/> */}
      </div>
    </div>
  )
}
export default App