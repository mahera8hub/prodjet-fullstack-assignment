import React, { useState } from 'react'

function SuccessScreen({ data, onGoHome }) {
  const [copied, setCopied] = useState(false)

  const referralLink = `prodjet.in/join?ref=${data.referralCode}`

  function handleCopy() {
    navigator.clipboard.writeText(referralLink).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <div className="success-screen">
      <div className="success-check">✓</div>

      <h2>Registration Complete!</h2>
      <p className="tagline">You are on the PRODJET waitlist.</p>

      <div className="result-card">
        <div className="result-row">
          <div className="result-label">Waitlist Number</div>
          <div className="result-value">#{data.waitlistNumber}</div>
        </div>

        <div className="result-row">
          <div className="result-label">Referral Code</div>
          <div className="result-value">{data.referralCode}</div>
        </div>

        <div className="referral-row">
          <span>{referralLink}</span>
          <button className="copy-btn" onClick={handleCopy}>
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>
      </div>

      <button className="btn-primary" onClick={onGoHome}>
        Go to Home
      </button>
    </div>
  )
}

export default SuccessScreen
