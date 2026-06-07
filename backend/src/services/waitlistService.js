const fs = require('fs')
const path = require('path')

// where we store registrations
const DB_PATH = path.join(__dirname, '../../data/waitlist.json')

// make sure the data folder and file exist
function ensureFile() {
  const dir = path.dirname(DB_PATH)
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
  if (!fs.existsSync(DB_PATH)) fs.writeFileSync(DB_PATH, JSON.stringify([]))
}

function readAll() {
  ensureFile()
  const raw = fs.readFileSync(DB_PATH, 'utf-8')
  return JSON.parse(raw)
}

function writeAll(data) {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2))
}

// small helper so throwing validation errors is clean
function validationError(message) {
  const err = new Error(message)
  err.isValidation = true
  return err
}

// fields required no matter what user type
const COMMON_FIELDS = ['fullName', 'email', 'phoneNumber', 'userType']

// extra fields required per user type
const EXTRA_FIELDS = {
  STUDENT: ['collegeName', 'course', 'graduationYear', 'city'],
  BRAND: ['brandName', 'industry', 'companySize', 'website', 'contactPersonName'],
  COLLEGE: ['collegeName', 'designation', 'numberOfStudents', 'city', 'officialEmail'],
}

function validateCommonFields(body) {
  for (const field of COMMON_FIELDS) {
    if (!body[field] || String(body[field]).trim() === '') {
      throw validationError(`${field} is required`)
    }
  }

  const validTypes = ['STUDENT', 'BRAND', 'COLLEGE']
  if (!validTypes.includes(body.userType)) {
    throw validationError('userType must be STUDENT, BRAND, or COLLEGE')
  }

  // basic email check
  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email)
  if (!emailOk) throw validationError('Please enter a valid email address')

  // phone: 10 digits
  const phoneOk = /^\d{10}$/.test(body.phoneNumber)
  if (!phoneOk) throw validationError('Phone number must be exactly 10 digits')
}

function validateTypeFields(body) {
  const required = EXTRA_FIELDS[body.userType]
  for (const field of required) {
    if (body[field] === undefined || body[field] === null || String(body[field]).trim() === '') {
      throw validationError(`${field} is required for ${body.userType}`)
    }
  }

  // extra check: graduation year should be a number
  if (body.userType === 'STUDENT') {
    const year = Number(body.graduationYear)
    if (!year || year < 2024 || year > 2035) {
      throw validationError('Graduation year must be between 2024 and 2035')
    }
  }

  // college: numberOfStudents should be a positive number
  if (body.userType === 'COLLEGE') {
    const count = Number(body.numberOfStudents)
    if (!count || count <= 0) {
      throw validationError('numberOfStudents must be a positive number')
    }
  }
}

function generateReferralCode(waitlistNumber) {
  return `USR${waitlistNumber}`
}

async function registerUser(body) {
  // step 1 — validate common fields
  validateCommonFields(body)

  // step 2 — validate type-specific fields
  validateTypeFields(body)

  // step 3 — check for duplicate email
  const existing = readAll()
  const duplicate = existing.find(
    (entry) => entry.email.toLowerCase() === body.email.toLowerCase()
  )
  if (duplicate) {
    throw validationError('This email is already on the waitlist')
  }

  // step 4 — figure out the next waitlist number
  const waitlistNumber = existing.length + 1
  const referralCode = generateReferralCode(waitlistNumber)

  // step 5 — build the record to save
  const newEntry = {
    waitlistNumber,
    referralCode,
    userType: body.userType,
    fullName: body.fullName.trim(),
    email: body.email.toLowerCase().trim(),
    phoneNumber: body.phoneNumber,
    registeredAt: new Date().toISOString(),
    // spread whatever extra fields came in (collegeName, course, etc.)
    ...buildTypeFields(body),
  }

  // step 6 — save to file
  existing.push(newEntry)
  writeAll(existing)

  // step 7 — return what the frontend needs
  return {
    message: 'Registration complete',
    waitlistNumber,
    referralCode,
  }
}

// pull only the relevant extra fields from the body so we don't save garbage
function buildTypeFields(body) {
  const fields = EXTRA_FIELDS[body.userType]
  const result = {}
  for (const field of fields) {
    result[field] = body[field]
  }
  return result
}

module.exports = { registerUser }
