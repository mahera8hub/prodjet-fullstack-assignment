import React, { useState } from 'react'

// fields that every user type must fill
const COMMON_FIELDS = [
  { name: 'fullName',     label: 'Full Name',     type: 'text',  placeholder: 'Rahul Sharma' },
  { name: 'email',        label: 'Email',         type: 'email', placeholder: 'you@example.com' },
  { name: 'phoneNumber',  label: 'Phone Number',  type: 'tel',   placeholder: '9876543210' },
]

// extra fields per user type
const TYPE_FIELDS = {
  STUDENT: [
    { name: 'collegeName',     label: 'College Name',     type: 'text',   placeholder: 'ABC College' },
    { name: 'course',          label: 'Course / Degree',  type: 'text',   placeholder: 'B.Tech CSE' },
    { name: 'graduationYear',  label: 'Graduation Year',  type: 'number', placeholder: '2026' },
    { name: 'city',            label: 'City',             type: 'text',   placeholder: 'Bangalore' },
  ],
  BRAND: [
    { name: 'brandName',        label: 'Brand Name',        type: 'text', placeholder: 'UrbanWear' },
    { name: 'industry',         label: 'Industry',          type: 'text', placeholder: 'Fashion' },
    {
      name: 'companySize',
      label: 'Company Size',
      type: 'select',
      options: ['1-10', '11-50', '51-200', '201-500', '500+'],
    },
    { name: 'website',           label: 'Website',           type: 'url',  placeholder: 'https://urbanwear.com' },
    { name: 'contactPersonName', label: 'Contact Person',    type: 'text', placeholder: 'Priya Mehta' },
  ],
  COLLEGE: [
    { name: 'collegeName',       label: 'College Name',         type: 'text',   placeholder: 'XYZ University' },
    { name: 'designation',       label: 'Designation',          type: 'text',   placeholder: 'Placement Officer' },
    { name: 'numberOfStudents',  label: 'Number of Students',   type: 'number', placeholder: '1200' },
    { name: 'city',              label: 'City',                 type: 'text',   placeholder: 'Delhi' },
    { name: 'officialEmail',     label: 'Official Email',       type: 'email',  placeholder: 'placement@xyz.edu' },
  ],
}

const TYPE_LABELS = {
  STUDENT: 'Student Details',
  BRAND: 'Brand Details',
  COLLEGE: 'College Details',
}

// simple per-field frontend validation before we even hit the server
function validateField(name, value) {
  if (!value || String(value).trim() === '') return 'This field is required'
  if (name === 'email' || name === 'officialEmail') {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Enter a valid email'
  }
  if (name === 'phoneNumber') {
    if (!/^\d{10}$/.test(value)) return 'Must be exactly 10 digits'
  }
  if (name === 'website') {
    try { new URL(value) } catch { return 'Enter a valid URL (include https://)' }
  }
  if (name === 'graduationYear') {
    const y = Number(value)
    if (!y || y < 2024 || y > 2035) return 'Enter a valid graduation year (2024–2035)'
  }
  return null
}

function WaitlistForm({ userType, onSubmit, loading, apiError }) {
  const [values, setValues] = useState({})
  const [errors, setErrors] = useState({})

  const allFields = [...COMMON_FIELDS, ...TYPE_FIELDS[userType]]

  function handleChange(name, value) {
    setValues((prev) => ({ ...prev, [name]: value }))
    // clear the error for this field as soon as user starts fixing it
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }))
    }
  }

  function handleSubmit() {
    // validate every field before sending
    const newErrors = {}
    for (const field of allFields) {
      const err = validateField(field.name, values[field.name])
      if (err) newErrors[field.name] = err
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    // pass data up to App which calls the API
    onSubmit({ ...values, userType })
  }

  return (
    <div className="screen">
      <h2 className="screen-title">{TYPE_LABELS[userType]}</h2>
      <p className="screen-subtitle">Please fill in your details</p>

      <div className="form-fields">
        {/* common fields */}
        {COMMON_FIELDS.map((field) => (
          <FieldInput
            key={field.name}
            field={field}
            value={values[field.name] || ''}
            error={errors[field.name]}
            onChange={handleChange}
          />
        ))}

        {/* divider before type-specific fields */}
        <div className="section-divider">{TYPE_LABELS[userType]}</div>

        {/* type-specific fields */}
        {TYPE_FIELDS[userType].map((field) => (
          <FieldInput
            key={field.name}
            field={field}
            value={values[field.name] || ''}
            error={errors[field.name]}
            onChange={handleChange}
          />
        ))}
      </div>

      {apiError && <div className="api-error">{apiError}</div>}

      <button className="btn-primary" onClick={handleSubmit} disabled={loading}>
        {loading ? 'Submitting...' : 'Submit'}
      </button>
    </div>
  )
}

// a single reusable field — renders either input or select
function FieldInput({ field, value, error, onChange }) {
  const inputClass = error ? 'has-error' : ''

  return (
    <div className="field-group">
      <label htmlFor={field.name}>{field.label}</label>

      {field.type === 'select' ? (
        <select
          id={field.name}
          className={inputClass}
          value={value}
          onChange={(e) => onChange(field.name, e.target.value)}
        >
          <option value="">Select...</option>
          {field.options.map((opt) => (
            <option key={opt} value={opt}>{opt} Employees</option>
          ))}
        </select>
      ) : (
        <input
          id={field.name}
          type={field.type}
          className={inputClass}
          placeholder={field.placeholder}
          value={value}
          onChange={(e) => onChange(field.name, e.target.value)}
        />
      )}

      {error && <span className="field-error">{error}</span>}
    </div>
  )
}

export default WaitlistForm
