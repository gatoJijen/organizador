/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars*/


"use client "
import App1DashboardH from './App1DashboardH'
import App1DashBoardS from './App1DashBoardS'
import App1DashBoardF from './App1DashBoardF'
import React from 'react'

const App1Dashboard = () => {
    return (
    <section className='p-2 flex flex-col overflow-x-hidden overflow-y-auto gap-2'>
        <App1DashboardH  />
        <App1DashBoardS />
        <App1DashBoardF />
    </section>
  )
}

export default App1Dashboard/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars*/
