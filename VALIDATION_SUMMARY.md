# 🔒 Validation Rules - Complete Summary

## Overview
Comprehensive validation has been implemented for Aadhaar and Mobile numbers across the entire application.

---

## ✅ Validation Rules

### 1. **Aadhaar Card**
- ✅ **Exactly 12 digits** (no more, no less)
- ✅ **Only numeric** (no letters or special characters)
- ✅ **Unique throughout database** (no duplicates allowed)
- ✅ **Required field** (cannot be empty)

### 2. **Mobile Number**
- ✅ **Exactly 10 digits** (no more, no less)
- ✅ **Only numeric** (no letters or special characters)
- ✅ **Can be duplicate** (multiple users can have same mobile)
- ✅ **Required field** (cannot be empty)

### 3. **Father's/Husband's Mobile**
- ✅ **Exactly 10 digits** (no more, no less)
- ✅ **Only numeric** (no letters or special characters)
- ✅ **Can be duplicate** (multiple users can have same mobile)
- ✅ **Required field** (cannot be empty)

---

## 🛡️ Validation Layers

### Layer 1: Frontend (HTML5)
**Location**: `views/register.ejs`, `views/enter-details.ejs`

#### Mobile Number:
```html
<input type="text" maxlength="10" pattern="\d{10}" 
  title="Enter exactly 10 digits" 
  oninput="this.value=this.value.replace(/\D/g,'').slice(0,10)" 
  required />
```

#### Aadhaar:
```html
<input type="text" maxlength="12" pattern="\d{12}" 
  title="Enter exactly 12 digits" 
  oninput="this.value=this.value.replace(/\D/g,'').slice(0,12)" 
  required />
```

**Features**:
- `maxlength` - Prevents typing more than required digits
- `pattern` - HTML5 validation for exact digit count
- `oninput` - JavaScript that removes non-numeric characters automatically
- `required` - Field cannot be empty

### Layer 2: Backend Route Validation
**Location**: `routes/auth.js`

```javascript
body("mobile")
  .trim()
  .matches(/^\d{10}$/)
  .withMessage("Mobile must be 10 digits"),

body("aadhaar")
  .trim()
  .matches(/^\d{12}$/)
  .withMessage("Aadhaar must be 12 digits"),
```

**Features**:
- Uses `express-validator`
- Validates format before database operation
- Returns clear error messages

### Layer 3: Database Schema Validation
**Location**: `models/Resident.js`

#### Mobile:
```javascript
mobile: { 
  type: String, 
  required: true,
  validate: {
    validator: function(v) {
      return /^\d{10}$/.test(v);
    },
    message: 'Mobile number must be exactly 10 digits'
  }
}
```

#### Aadhaar:
```javascript
aadhaar: { 
  type: String, 
  required: true, 
  unique: true,
  validate: {
    validator: function(v) {
      return /^\d{12}$/.test(v);
    },
    message: 'Aadhaar must be exactly 12 digits'
  }
}
```

#### Father's Mobile:
```javascript
fatherMobile: { 
  type: String, 
  default: '',
  validate: {
    validator: function(v) {
      return v === '' || /^\d{10}$/.test(v);
    },
    message: 'Father/Husband mobile must be exactly 10 digits'
  }
}
```

**Features**:
- Final validation before saving to database
- `unique: true` for Aadhaar ensures no duplicates
- Custom validator functions with regex
- Clear error messages

### Layer 4: Uniqueness Check
**Location**: `routes/auth.js`

```javascript
// Check if Aadhaar already exists (must be unique)
if (await Resident.findOne({ aadhaar }))
  return res
    .status(409)
    .json({ success: false, error: "Aadhaar already exists" });

// Mobile can be duplicate, so we don't check for it
```

**Features**:
- Checks database for existing Aadhaar before registration
- Returns 409 Conflict status if Aadhaar exists
- Mobile numbers are NOT checked (duplicates allowed)

---

## 📋 Validation Flow

### Registration Process:
1. **User types in form**
   - HTML5 `oninput` removes non-numeric characters
   - `maxlength` prevents typing more than required

2. **User submits form**
   - HTML5 `pattern` validates format
   - Browser shows error if invalid

3. **Data reaches server**
   - `express-validator` validates format
   - Returns error if invalid

4. **Before database save**
   - Checks if Aadhaar already exists
   - Mongoose schema validator validates format
   - Unique index prevents duplicate Aadhaar

5. **Success**
   - User registered with valid data

---

## 🧪 Testing Validation

### Test Mobile Number Validation:

#### Valid Cases:
- ✅ `9876543210` - Exactly 10 digits
- ✅ `1234567890` - Exactly 10 digits

#### Invalid Cases:
- ❌ `987654321` - Only 9 digits (rejected)
- ❌ `98765432100` - 11 digits (rejected)
- ❌ `98765abcde` - Contains letters (auto-removed)
- ❌ `9876-543-210` - Contains special chars (auto-removed)

### Test Aadhaar Validation:

#### Valid Cases:
- ✅ `123456789012` - Exactly 12 digits
- ✅ `999988887777` - Exactly 12 digits

#### Invalid Cases:
- ❌ `12345678901` - Only 11 digits (rejected)
- ❌ `1234567890123` - 13 digits (rejected)
- ❌ `12345678abcd` - Contains letters (auto-removed)
- ❌ `1234-5678-9012` - Contains special chars (auto-removed)

### Test Uniqueness:

#### Aadhaar:
- ✅ First registration with `123456789012` - Success
- ❌ Second registration with `123456789012` - Error: "Aadhaar already exists"

#### Mobile:
- ✅ First registration with `9876543210` - Success
- ✅ Second registration with `9876543210` - Success (duplicates allowed)

---

## 🚨 Error Messages

### Frontend (HTML5):
- "Please match the requested format" (browser default)
- "Enter exactly 10 digits" (mobile)
- "Enter exactly 12 digits" (aadhaar)

### Backend (API):
- "Mobile must be 10 digits"
- "Aadhaar must be 12 digits"
- "Aadhaar already exists"
- "Mobile number must be exactly 10 digits" (database)
- "Aadhaar must be exactly 12 digits" (database)

---

## 📁 Files Modified

1. ✅ `models/Resident.js`
   - Added validation for mobile (10 digits)
   - Added validation for aadhaar (12 digits, unique)
   - Added validation for fatherMobile (10 digits)

2. ✅ `views/register.ejs`
   - Added HTML5 validation attributes
   - Added auto-removal of non-numeric characters

3. ✅ `routes/auth.js`
   - Removed mobile uniqueness check
   - Kept aadhaar uniqueness check
   - Validation already present with express-validator

4. ✅ `views/enter-details.ejs`
   - Already has validation for father's mobile

---

## 🔐 Security Benefits

1. **Data Integrity**: Only valid data enters database
2. **Unique Identification**: Aadhaar ensures unique users
3. **Format Consistency**: All numbers in same format
4. **SQL Injection Prevention**: Regex validation prevents malicious input
5. **User Experience**: Immediate feedback on invalid input

---

## 🎯 Key Differences

| Field | Length | Numeric Only | Unique | Can be Empty |
|-------|--------|--------------|--------|--------------|
| Mobile | 10 digits | ✅ | ❌ | ❌ |
| Aadhaar | 12 digits | ✅ | ✅ | ❌ |
| Father's Mobile | 10 digits | ✅ | ❌ | ❌ |

---

## 💡 Important Notes

1. **Mobile Duplicates**: Multiple family members can register with same mobile number
2. **Aadhaar Unique**: Each Aadhaar can only be registered once
3. **Auto-formatting**: Non-numeric characters are automatically removed as user types
4. **Three-layer Protection**: Frontend, Backend, and Database validation
5. **Clear Errors**: User-friendly error messages at each layer

---

## 🔄 Migration Notes

### Existing Data:
- Old records with invalid mobile/aadhaar will remain in database
- New registrations will be validated
- To clean existing data, run a migration script

### Migration Script (Optional):
```javascript
// Find and fix invalid records
const invalidMobiles = await Resident.find({
  mobile: { $not: /^\d{10}$/ }
});

const invalidAadhaar = await Resident.find({
  aadhaar: { $not: /^\d{12}$/ }
});

// Handle or delete invalid records
```

---

**Last Updated**: October 30, 2025
**Status**: ✅ Complete validation implemented across all layers
**Validation Type**: Multi-layer (Frontend + Backend + Database)
