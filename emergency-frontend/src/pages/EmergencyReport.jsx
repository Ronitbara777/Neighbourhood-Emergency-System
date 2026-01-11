import React, { useState, useEffect, useRef } from 'react'
import { incidentAPI, residentAPI } from '../services/api'


const EmergencyReport = () => {
  const [messages, setMessages] = useState([])
  const [allResidents, setAllResidents] = useState([])
  const [userInput, setUserInput] = useState('')
  const [emergencyType, setEmergencyType] = useState('')
  const [userName, setUserName] = useState('')
  const [userAddress, setUserAddress] = useState('')
  const [emergencyDescription, setEmergencyDescription] = useState('')
  const [loading, setLoading] = useState(false)
  const [currentResident, setCurrentResident] = useState(null)
  const [residentContacts, setResidentContacts] = useState([])
  const messagesEndRef = useRef(null)

  const emergencyTypes = [
    { type: 'Fire', description: 'Fire or smoke emergency' },
    { type: 'Medical', description: 'Medical emergency or injury' },
    { type: 'Police', description: 'Crime or security threat' },
    { type: 'Accident', description: 'Traffic or industrial accident' },
    { type: 'Natural Disaster', description: 'Earthquake, flood, or storm' },
    { type: 'Other', description: 'Other emergency situation' }
  ]

  const safetyInstructions = {
    'Fire': [
      'Evacuate the building immediately using the nearest safe exit',
      'Stay low to the ground to avoid smoke inhalation',
      'Do not use elevators during a fire emergency',
      'Check doors for heat before opening them',
      'Proceed to the designated assembly point and do not re-enter the building'
    ],
    'Medical': [
      'Do not move the injured person unless they are in immediate danger',
      'Check for responsiveness and breathing',
      'If trained, provide basic first aid while waiting for professionals',
      'Keep the person warm and comfortable',
      'Have any relevant medical information ready for responders'
    ],
    'Police': [
      'Secure all doors and windows immediately',
      'Move to a safe, interior room if possible',
      'Remain quiet and keep phone lines clear',
      'Do not confront or approach any suspicious individuals',
      'Note physical descriptions and vehicle information if safe to observe'
    ],
    'Accident': [
      'Activate hazard lights and set up warning devices if available',
      'Move to a safe location away from traffic if able',
      'Check all involved parties for injuries',
      'Do not attempt to move seriously injured persons',
      'Wait for emergency services to arrive on scene'
    ],
    'Natural Disaster': [
      'Take immediate cover under sturdy furniture or in reinforced areas',
      'Stay away from windows, glass, and exterior walls',
      'If flooding occurs, move to higher ground immediately',
      'Monitor emergency broadcasts for official instructions',
      'Have emergency supplies ready including water and medications'
    ],
    'Other': [
      'Move to a secure and safe location immediately',
      'Keep communication devices charged and accessible',
      'Remain with others if possible for safety',
      'Have emergency contact numbers readily available',
      'Follow instructions from emergency response personnel'
    ]
  }

  // Initialize with welcome message and detect resident
  useEffect(() => {
    detectResidentAndContacts()
  }, [])

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const detectResidentAndContacts = async () => {
  try {
    const residentsResponse = await residentAPI.getAll()
    setAllResidents(residentsResponse.data)
    
    
    if (residentsResponse.data.length > 0) {
      const defaultUser = residentsResponse.data[0] 
      setCurrentResident(defaultUser)
      setUserName(defaultUser.Name)
      
      const contactsResponse = await residentAPI.getContacts(defaultUser.Resident_ID)
      setResidentContacts(contactsResponse.data)
      
      setMessages([
        {
          id: 1,
          text: `Welcome back, ${defaultUser.Name}! Emergency Response System is ready. What type of emergency are you experiencing?`,
          sender: 'bot',
          timestamp: new Date()
        }
      ])
    }
  } catch (error) {
    console.error('Error detecting resident:', error)
  }
}

  const addMessage = (text, sender = 'user') => {
  const newMessage = {
    id: `msg-${Date.now()}-${Math.floor(Math.random() * 1000)}`, 
    text,
    sender,
    timestamp: new Date()
  }
  setMessages(prev => [...prev, newMessage])
  }
  const generateContactMessages = (contacts) => {
    if (!contacts || contacts.length === 0) {
      return ['No emergency contacts found in your profile.']
    }

    const messages = []
    
    const highPriorityContacts = contacts.filter(contact => contact.Priority_level === 1)
    highPriorityContacts.forEach(contact => {
      messages.push(`Your ${contact.Relationship_Type.toLowerCase()} ${contact.Name} has been contacted with high priority.`)
    })

    const regularContacts = contacts.filter(contact => contact.Priority_level > 1)
    regularContacts.forEach(contact => {
      messages.push(`Your ${contact.Relationship_Type.toLowerCase()} ${contact.Name} has been notified.`)
    })

    return messages
  }

  const handleEmergencySelect = (type) => {
    setEmergencyType(type)
    addMessage(type, 'user')
    
    setTimeout(() => {
      if (currentResident) {
        addMessage(`Emergency type confirmed: ${type}. We have your information on file. Please confirm your current location.`, 'bot')
      } else {
        addMessage(`Emergency type confirmed: ${type}. Please provide your current location or address where emergency services should respond.`, 'bot')
      }
    }, 1000)
  }

  const handleAddressSubmit = () => {
    if (userInput.trim()) {
      setUserAddress(userInput.trim())
      addMessage(userInput.trim(), 'user')
      
      setTimeout(() => {
        addMessage(`Location confirmed. Please provide a brief description of the emergency:`, 'bot')
      }, 1000)
      
      setUserInput('')
    }
  }

  const handleDescriptionSubmit = () => {
  if (userInput.trim()) {
    const userDescription = userInput.trim()
    console.log('Setting emergencyDescription to:', userDescription)
    setEmergencyDescription(userDescription)
    addMessage(userDescription, 'user')
    
    setTimeout(() => {
      // Pass the description directly instead of relying on state
      handleSubmitEmergency(userDescription)
    }, 1000)
    
    setUserInput('')
  }
}

const handleSubmitEmergency = async (userDesc = null) => {
  setLoading(true)
  
  console.log('Current emergencyDescription state:', emergencyDescription)
  console.log('Direct description parameter:', userDesc)
  
  // Use the direct parameter first, then fallback to state
  const finalDescription = userDesc || emergencyDescription || "No description provided"
  
  console.log('Final description being sent:', finalDescription)
  
  setTimeout(() => {
    addMessage('Processing emergency request and notifying your emergency contacts...', 'bot')
  }, 500)

  try {
    const incidentData = {
      resident_id: currentResident?.Resident_ID || 2,
      emergency_type: emergencyType,
      description: finalDescription,
      location: userAddress,
      user_name: userName
    }

    const response = await incidentAPI.create(incidentData)

    // Generate contact notification messages
    const contactMessages = generateContactMessages(residentContacts)

    setTimeout(() => {
      // First show contact notifications
      contactMessages.forEach((message, index) => {
        setTimeout(() => {
          addMessage(message, 'bot')
        }, (index + 1) * 800)
      })

      // Then show the main response
      setTimeout(() => {
        const responseMessage = 
          `EMERGENCY RESPONSE CONFIRMED\n\n` +
          `Service Dispatched: ${emergencyType} Emergency Services\n` +
          `Response Location: ${userAddress}\n` +
          `Incident Reference: #${response.data.incident_id}\n\n` +
          `CRITICAL SAFETY INSTRUCTIONS:\n` +
          safetyInstructions[emergencyType].join('\n• ') +
          `\n\nHelp is en route. Maintain communication if safe to do so.`
        
        addMessage(responseMessage, 'bot')
      }, (contactMessages.length + 1) * 800)

    }, 2000)

  } catch (error) {
    console.error('Error reporting incident:', error)
    addMessage('System unable to process emergency request. Please call emergency services directly.', 'bot')
  } finally {
    setLoading(false)
  }
}

  const handleSendMessage = () => {
    if (!userInput.trim()) return

    if (!emergencyType) {
      handleEmergencySelect(userInput)
    } else if (!userAddress) {
      handleAddressSubmit()
    } else if (!emergencyDescription) {
      handleDescriptionSubmit()
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const resetChat = () => {
    setMessages([
      {
        id: 1,
        text: `Welcome back, ${currentResident?.Name || 'User'}! Emergency Response System is ready. What type of emergency are you experiencing?`,
        sender: 'bot',
        timestamp: new Date()
      }
    ])
    setEmergencyType('')
    setUserAddress('')
    setEmergencyDescription('')
    setUserInput('')
  }

  const getCurrentStepPlaceholder = () => {
    if (!emergencyType) {
      return "Describe your emergency or select above..."
    } else if (!userAddress) {
      return "Enter your current location/address..."
    } else if (!emergencyDescription) {
      return "Describe what happened..."
    }
    return "Type your response..."
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Chat Header */}
      <div className="bg-blue-600 text-white p-4 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
              <span className="text-blue-600 font-bold text-lg">NEC</span>
            </div>
            <div>
              <h1 className="font-bold text-lg">Neighbourhood Emergency Contact</h1>
              {/* In your header section, replace the current select with: */}
              <select 
  value={currentResident?.Resident_ID || ''} 
  onChange={async (e) => {
  const selectedId = parseInt(e.target.value)
  const selectedResident = allResidents.find(r => r.Resident_ID === selectedId)
  
  if (selectedResident) {
    setCurrentResident(selectedResident)
    setUserName(selectedResident.Name)
    
    // Save to localStorage for IncidentStatus to use
    localStorage.setItem('currentResident', JSON.stringify(selectedResident))
    
    // Fetch contacts for the newly selected resident
    try {
      const contactsResponse = await residentAPI.getContacts(selectedId)
      setResidentContacts(contactsResponse.data)
    } catch (error) {
      console.error('Error fetching contacts:', error)
      setResidentContacts([])
    }
    
    // Update welcome message
    setMessages([
      {
        id: 1,
        text: `Welcome back, ${selectedResident.Name}! Emergency Response System is ready. What type of emergency are you experiencing?`,
        sender: 'bot',
        timestamp: new Date()
      }
    ])
  }
  }}
  className="bg-white text-black border border-gray-300 rounded px-3 py-1 ml-3 text-sm"
>
  <option value="">Select Resident</option>
  {allResidents.map(resident => (
    <option key={resident.Resident_ID} value={resident.Resident_ID}>
      {resident.Name}
    </option>
  ))}
</select>
            </div>
          </div>
          <button
            onClick={resetChat}
            className="bg-white text-blue-600 px-1 py-2 rounded font-semibold hover:bg-blue-50 transition duration-200 text-sm"
          >
            New Report
          </button>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs lg:max-w-2xl px-4 py-3 rounded-lg ${
                message.sender === 'user'
                  ? 'bg-blue-600 text-white rounded-br-none'
                  : 'bg-white text-gray-800 rounded-bl-none shadow border border-gray-200'
              }`}
            >
              <div className="whitespace-pre-line text-sm leading-relaxed">{message.text}</div>
              <div className={`text-xs mt-2 ${message.sender === 'user' ? 'text-blue-200' : 'text-gray-500'}`}>
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </div>
        ))}
        
        {loading && (
          <div className="flex justify-start">
            <div className="bg-white text-gray-800 px-4 py-3 rounded-lg rounded-bl-none shadow border border-gray-200">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Options (Show when no emergency type selected) */}
      {!emergencyType && messages.length <= 1 && (
        <div className="bg-white border-t p-4">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {emergencyTypes.map((emergency) => (
              <button
                key={emergency.type}
                onClick={() => handleEmergencySelect(emergency.type)}
                className="p-3 text-left border border-gray-300 rounded hover:bg-blue-50 transition duration-200 text-sm"
              >
                <div className="font-semibold text-gray-800 mb-1">{emergency.type}</div>
                <div className="text-xs text-gray-600">{emergency.description}</div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className="bg-white border-t p-4">
        <div className="flex space-x-3">
          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={getCurrentStepPlaceholder()}
            className="flex-1 px-4 py-3 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            disabled={loading}
          />
          <button
            onClick={handleSendMessage}
            disabled={!userInput.trim() || loading}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white px-6 py-3 rounded font-semibold transition duration-200 text-sm"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  )
}

export default EmergencyReport