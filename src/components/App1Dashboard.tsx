"use client "
import App1DashboardH from './App1DashboardH'
import App1DashBoardS from './App1DashBoardS'
import App1DashBoardF from './App1DashBoardF'
import React from 'react'
import Test from './AñadirRecursos'

const App1Dashboard = () => {
    return (
    <section className='p-2 flex flex-col flex-wrap gap-2'>
        <App1DashboardH  />
        <App1DashBoardS />
        <App1DashBoardF />
        <Test />
    </section>
  )
}

export default App1Dashboard