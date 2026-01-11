import React from 'react'
import { Link, Outlet, Navigate } from 'react-router-dom'

const AdminLayout = ({ adminUser, onLogout }) => {
  // Redirect to login if not authenticated
  if (!adminUser) {
    return <Navigate to="/admin/login" replace />
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-blue-600 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold">Neighbourhood Emergency Contact</h1>
              <p className="text-blue-100 text-sm">Administrator Panel</p>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-blue-100">Welcome, {adminUser.username}</span>
              <Link 
                to="/" 
                className="bg-white text-blue-600 px-4 py-2 rounded-lg font-semibold hover:bg-blue-50 transition duration-200"
              >
                Client Interface
              </Link>
              <button
                onClick={onLogout}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-semibold transition duration-200"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8 py-4">
            <Link to="/admin" className="text-blue-600 font-semibold border-b-2 border-blue-600">Dashboard</Link>
            <Link to="/admin/incidents" className="text-gray-600 hover:text-blue-600">Incidents</Link>
            <Link to="/admin/residents" className="text-gray-600 hover:text-blue-600">Residents</Link>
            <Link to="/admin/contacts" className="text-gray-600 hover:text-blue-600">Contacts</Link>
            <Link to="/admin/services" className="text-gray-600 hover:text-blue-600">Services</Link>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>
    </div>
  )
}

export default AdminLayout