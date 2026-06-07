import React, { useState } from 'react'
import TypeSelection from './components/TypeSelection'
import WaitlistForm from './components/WaitlistForm'
import SuccessScreen from './components/SuccessScreen'
import { registerOnWaitlist } from './services/api'

// three screens in the flow
const SCREEN = {
  SELECT: 'select',
  FORM: 'form',
  SUCCESS: 'success',
}

function App() {
  const [screen, setScreen] = useState(SCREEN.SELECT)
  const [userType, setUserType] = useState(null)
  const [loading, setLoading] = useState(false)
  const [apiError, setApiError] = useState(null)
  const [result, setResult] = useState(null)

  // progress bar width based on current screen
  const progressMap = {
    [SCREEN.SELECT]: '33%',
    [SCREEN.FORM]: '66%',
    [SCREEN.SUCCESS]: '100%',
  }

  function handleContinue() {
    if (userType) setScreen(SCREEN.FORM)
  }

  async function handleFormSubmit(formData) {
    setLoading(true)
    setApiError(null)

    try {
      const data = await registerOnWaitlist(formData)
      setResult(data)
      setScreen(SCREEN.SUCCESS)
    } catch (err) {
      setApiError(err.message)
    } finally {
      setLoading(false)
    }
  }

  function handleGoHome() {
    // reset everything back to start
    setScreen(SCREEN.SELECT)
    setUserType(null)
    setResult(null)
    setApiError(null)
  }

  return (
    <div className="phone-wrap">
      {/* top bar */}
      <div className="top-bar">
        {screen === SCREEN.FORM && (
          <button className="back-btn" onClick={() => setScreen(SCREEN.SELECT)}>
            ←
          </button>
        )}
        <span className="logo">PRODJET</span>
      </div>

      {/* progress bar */}
      {screen !== SCREEN.SUCCESS && (
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: progressMap[screen] }} />
        </div>
      )}

      {/* screens */}
      {screen === SCREEN.SELECT && (
        <TypeSelection
          selected={userType}
          onSelect={setUserType}
          onContinue={handleContinue}
        />
      )}

      {screen === SCREEN.FORM && (
        <WaitlistForm
          userType={userType}
          onSubmit={handleFormSubmit}
          loading={loading}
          apiError={apiError}
        />
      )}

      {screen === SCREEN.SUCCESS && (
        <SuccessScreen data={result} onGoHome={handleGoHome} />
      )}
    </div>
  )
}

export default App
