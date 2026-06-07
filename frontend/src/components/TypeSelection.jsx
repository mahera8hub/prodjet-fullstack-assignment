import React from 'react'

const USER_TYPES = [
  {
    id: 'STUDENT',
    label: 'Student',
    description: 'Join as a student',
    icon: '🎓',
  },
  {
    id: 'BRAND',
    label: 'Brand',
    description: 'Join as a brand',
    icon: '💼',
  },
  {
    id: 'COLLEGE',
    label: 'College',
    description: 'Join as a college',
    icon: '🏛️',
  },
]

function TypeSelection({ selected, onSelect, onContinue }) {
  return (
    <div className="screen">
      <h1 className="screen-title">Join the PRODJET Waitlist</h1>
      <p className="screen-subtitle">
        Be the first to access exclusive updates and early access.
      </p>

      <p className="type-label">I am a...</p>

      <div className="type-cards">
        {USER_TYPES.map((type) => (
          <button
            key={type.id}
            className={`type-card ${selected === type.id ? 'selected' : ''}`}
            onClick={() => onSelect(type.id)}
          >
            <div className="icon">{type.icon}</div>
            <div className="card-text">
              <h3>{type.label}</h3>
              <p>{type.description}</p>
            </div>
          </button>
        ))}
      </div>

      <button
        className="btn-primary"
        onClick={onContinue}
        disabled={!selected}
      >
        Continue
      </button>
    </div>
  )
}

export default TypeSelection
