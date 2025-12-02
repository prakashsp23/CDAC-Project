import React from 'react'
import { Outlet } from 'react-router-dom'
import { NavLink } from 'react-router-dom'

function CustomersPanel() {
return (
  <div className="p-4">
    <Outlet />
  </div>
)
}

export default CustomersPanel