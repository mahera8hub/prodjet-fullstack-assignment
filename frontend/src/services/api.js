const BASE_URL = 'http://localhost:5000'

// sends registration data to the backend
// throws an error if the server returns a non-ok status
async function registerOnWaitlist(formData) {
  const response = await fetch(`${BASE_URL}/waitlist/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(formData),
  })

  const data = await response.json()

  if (!response.ok) {
    // backend sends { error: "..." } for bad requests
    throw new Error(data.error || 'Registration failed. Please try again.')
  }

  return data
}

export { registerOnWaitlist }
