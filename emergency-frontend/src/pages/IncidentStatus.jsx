import React, { useState, useEffect } from 'react'
import { incidentAPI } from '../services/api'

const IncidentStatus = () => {
  const [currentIncident, setCurrentIncident] = useState(null)
  const [loading, setLoading] = useState(true)
  const [hasIncidents, setHasIncidents] = useState(false)
  const [currentResident, setCurrentResident] = useState(null)

  useEffect(() => {
    // Get the current resident from localStorage (set by EmergencyReport component)
    const savedResident = localStorage.getItem('currentResident')
    
    console.log('Saved resident from localStorage:', savedResident)
    
    if (savedResident) {
      try {
        const resident = JSON.parse(savedResident)
        setCurrentResident(resident)
        fetchUserIncidents(resident.Resident_ID)
      } catch (error) {
        console.error('Error parsing saved resident:', error)
        // Fallback to default user
        setCurrentResident({ Resident_ID: 1, Name: 'Default User' })
        fetchUserIncidents(1)
      }
    } else {
      // If no resident is selected, use default
      console.log('No resident found in localStorage, using default')
      const defaultResident = {
        Resident_ID: 1,
        Name: 'Default User'
      }
      setCurrentResident(defaultResident)
      fetchUserIncidents(1)
    }
  }, [])

  const fetchUserIncidents = async (residentId) => {
    try {
      console.log('Fetching incidents for resident ID:', residentId)
      
      // METHOD 1: Try the direct API call first
      try {
        const response = await incidentAPI.getByResident(residentId)
        const userIncidents = response.data
        
        console.log('Incidents received from API:', userIncidents)
        
        if (userIncidents && userIncidents.length > 0) {
          // Get the most recent incident for THIS user
          const latestUserIncident = userIncidents.sort((a, b) => 
            new Date(b.Date_Time) - new Date(a.Date_Time)
          )[0]
          
          console.log('Latest incident for user:', latestUserIncident)
          setCurrentIncident(latestUserIncident)
          setHasIncidents(true)
          return
        } else {
          console.log('No incidents found for this user via direct API')
          setHasIncidents(false)
        }
      } catch (apiError) {
        console.log('Direct API call failed, trying fallback...', apiError)
      }
      
      // METHOD 2: Fallback - get all incidents and filter
      console.log('Trying fallback method...')
      const response = await incidentAPI.getAll()
      const allIncidents = response.data
      
      // Filter incidents for this specific resident
      const userIncidents = allIncidents.filter(incident => 
        incident.Resident_ID == residentId
      )
      
      console.log('Filtered incidents for user:', userIncidents)
      
      if (userIncidents && userIncidents.length > 0) {
        const latestUserIncident = userIncidents.sort((a, b) => 
          new Date(b.Date_Time) - new Date(a.Date_Time)
        )[0]
        
        console.log('Latest user incident (fallback):', latestUserIncident)
        setCurrentIncident(latestUserIncident)
        setHasIncidents(true)
      } else {
        console.log('No incidents found for user in fallback method')
        setHasIncidents(false)
      }
    } catch (error) {
      console.error('Error fetching user incidents:', error)
      setHasIncidents(false)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'resolved': return 'bg-green-100 text-green-800 border-green-200'
      case 'dispatched': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'en route': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'reported': return 'bg-orange-100 text-orange-800 border-orange-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStatusDescription = (status) => {
    switch (status?.toLowerCase()) {
      case 'reported': return 'Your emergency has been reported and is being processed'
      case 'dispatched': return 'Emergency services have been dispatched to your location'
      case 'en route': return 'Help is on the way to your location'
      case 'resolved': return 'Your emergency situation has been resolved'
      default: return 'Processing your emergency request'
    }
  }

  const formatDateTime = (dateTime) => {
    return new Date(dateTime).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Checking emergency reports...</p>
          {currentResident && (
            <p className="text-gray-500 text-sm mt-2">for {currentResident.Name}</p>
          )}
        </div>
      </div>
    )
  }

  if (!hasIncidents) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md mx-auto px-4">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
            <div className="text-6xl mb-4">📋</div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">No Emergency Reports</h2>
            <p className="text-gray-600 mb-4">
              {currentResident ? `${currentResident.Name} hasn't reported any emergencies yet.` : 'No emergency reports found.'}
            </p>
            <div className="space-y-3">
              <a 
                href="/report-emergency" 
                className="block bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition duration-200"
              >
                Report New Emergency
              </a>
              <button 
                onClick={() => window.location.reload()}
                className="block bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-semibold transition duration-200"
              >
                Refresh Status
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        {/* User Info Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-800 mb-2">
                {currentResident ? `${currentResident.Name}'s Emergency Status` : 'Your Emergency Status'}
              </h1>
              <p className="text-gray-600">
                {currentResident ? `Most recent emergency report for ${currentResident.Name}` : 'Real-time status of your reported emergency'}
              </p>
            </div>
            <button 
              onClick={() => window.location.reload()}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold transition duration-200 text-sm"
            >
              Refresh
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {/* Status Header */}
          <div className="bg-blue-50 px-6 py-4 border-b border-blue-100">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-blue-800">
                  {currentResident ? `${currentResident.Name}'s Active Emergency` : 'Your Active Emergency'}
                </h2>
                <p className="text-blue-600 text-sm">
                  Reported on {formatDateTime(currentIncident.Date_Time)}
                </p>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(currentIncident.Status)}`}>
                {currentIncident.Status}
              </span>
            </div>
          </div>

          {/* Emergency Details */}
          <div className="p-6 space-y-6">
            {/* Status Overview */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-800 mb-2">Current Status</h3>
              <p className="text-gray-700">{getStatusDescription(currentIncident.Status)}</p>
            </div>

            {/* Emergency Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-gray-700 mb-3">Emergency Details</h3>
                <div className="space-y-3">
                  <div>
                    <span className="text-sm text-gray-600">Emergency Type:</span>
                    <p className="text-gray-800 font-medium">{currentIncident.Emergency_Type}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Location:</span>
                    <p className="text-gray-800 font-medium">{currentIncident.Location}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Description:</span>
                    <p className="text-gray-800">{currentIncident.Description}</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-gray-700 mb-3">Response Information</h3>
                <div className="space-y-3">
                  {currentIncident.Service_Name && (
                    <div>
                      <span className="text-sm text-gray-600">Assigned Service:</span>
                      <p className="text-gray-800 font-medium">{currentIncident.Service_Name}</p>
                    </div>
                  )}
                  {currentIncident.Service_Contact && (
                    <div>
                      <span className="text-sm text-gray-600">Service Contact:</span>
                      <p className="text-gray-800 font-medium">{currentIncident.Service_Contact}</p>
                    </div>
                  )}
                  <div>
                    <span className="text-sm text-gray-600">Reference ID:</span>
                    <p className="text-gray-800 font-medium">#{currentIncident.Incident_ID}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Reported By:</span>
                    <p className="text-gray-800 font-medium">{currentIncident.Resident_Name}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Response Timeline */}
            <div>
              <h3 className="font-semibold text-gray-700 mb-4">Response Timeline</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-gray-800 font-medium">Emergency Reported</p>
                    <p className="text-gray-600 text-sm">{formatDateTime(currentIncident.Date_Time)}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${
                    ['dispatched', 'en route', 'resolved'].includes(currentIncident.Status.toLowerCase()) 
                      ? 'bg-green-500' : 'bg-gray-300'
                  }`}></div>
                  <div className="flex-1">
                    <p className="text-gray-800 font-medium">Service Dispatched</p>
                    <p className="text-gray-600 text-sm">
                      {['dispatched', 'en route', 'resolved'].includes(currentIncident.Status.toLowerCase()) 
                        ? 'Response team activated' 
                        : 'Coordinating response...'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${
                    ['en route', 'resolved'].includes(currentIncident.Status.toLowerCase()) 
                      ? 'bg-green-500' : 'bg-gray-300'
                  }`}></div>
                  <div className="flex-1">
                    <p className="text-gray-800 font-medium">Help En Route</p>
                    <p className="text-gray-600 text-sm">
                      {['en route', 'resolved'].includes(currentIncident.Status.toLowerCase()) 
                        ? 'Emergency services heading to location' 
                        : 'Awaiting dispatch...'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${
                    currentIncident.Status.toLowerCase() === 'resolved' 
                      ? 'bg-green-500' : 'bg-gray-300'
                  }`}></div>
                  <div className="flex-1">
                    <p className="text-gray-800 font-medium">Situation Resolved</p>
                    <p className="text-gray-600 text-sm">
                      {currentIncident.Status.toLowerCase() === 'resolved' 
                        ? 'Emergency has been contained' 
                        : 'Response in progress...'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Support Information */}
        <div className="mt-6 text-center">
          <p className="text-gray-600 text-sm mb-3">
            {currentResident ? `Viewing incidents for ${currentResident.Name}` : 'Need to update information?'}
          </p>
          <div className="space-x-3">
            <a 
              href="/report-emergency" 
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition duration-200"
            >
              Report New Emergency
            </a>
            <button 
              onClick={() => window.location.reload()}
              className="inline-block bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-semibold transition duration-200"
            >
              Refresh Status
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default IncidentStatus