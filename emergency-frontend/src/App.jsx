import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import EmergencyReport from './pages/EmergencyReport'
import IncidentStatus from './pages/IncidentStatus'

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <h1 className="text-2xl font-bold text-gray-800"> Neighbourhood Emergency Contact</h1>
              <div className="flex space-x-4">
                <a href="/" className="text-blue-500 hover:text-blue-600">Report Emergency</a>
                <a href="/status" className="text-gray-600 hover:text-gray-800">Check Status</a>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main>
          <Routes>
            <Route path="/" element={<EmergencyReport />} />
            <Route path="/status" element={<IncidentStatus />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App