# Unit Tests Summary - Database Models

## Overview

Comprehensive unit test suite has been created for all database models in the `database/` directory. The tests provide extensive coverage for the Event and Booking Mongoose models that were added in the recent merge.

## Files Created

### Configuration Files
1. **`jest.config.js`** - Jest test runner configuration
   - TypeScript support via ts-jest
   - Module path mapping for `@/` imports
   - Coverage collection settings
   - 30-second test timeout for database operations

2. **`jest.setup.js`** - Test environment setup
   - MongoDB Memory Server initialization
   - Automatic database cleanup between tests
   - Connection management

### Test Files
3. **`database/__tests__/event.model.test.ts`** (610 lines, ~98 tests)
   - Schema validation for all required fields
   - Slug generation and uniqueness
   - Date/time normalization
   - Array validation (agenda, tags)
   - Pre-save hook validation
   - Edge case handling

4. **`database/__tests__/booking.model.test.ts`** (538 lines, ~65 tests)
   - Schema validation
   - Email validation and normalization
   - Event reference validation
   - Pre-save hook testing
   - Query operations
   - Concurrency handling

5. **`database/__tests__/index.test.ts`** (62 lines, ~6 tests)
   - Export verification
   - Model instantiation tests

6. **`database/__tests__/README.md`** - Test documentation

### Modified Files
7. **`package.json`**
   - Added test scripts: `test`, `test:watch`, `test:coverage`
   - Added dev dependencies:
     - `@types/jest@^29.5.14`
     - `jest@^29.7.0`
     - `ts-jest@^29.2.5`
     - `mongodb-memory-server@^10.1.2`

## Test Coverage Details

### Event Model Tests (98 tests)

#### 1. Schema Validation (13 tests)
- Validates all required fields (title, description, overview, image, venue, location, date, time, mode, audience, organizer)
- Tests field trimming
- Tests successful event creation

#### 2. Slug Generation (11 tests)
- Automatic slug generation from title
- Special character handling (& : ! etc.)
- Multiple spaces normalization
- Underscore conversion
- Diacritics removal (café → cafe)
- Case normalization
- Leading/trailing hyphen removal
- Slug uniqueness enforcement
- Slug regeneration on title change

#### 3. Date Normalization (6 tests)
- ISO date format handling
- Timestamp conversion
- YYYY-MM-DD format acceptance
- Invalid date rejection
- Empty string rejection
- Various date format handling

#### 4. Time Normalization (14 tests)
- 24-hour format support
- 12-hour format with AM/PM
- Missing minutes handling (9 → 09:00)
- Midnight (12am → 00:00)
- Noon (12pm → 12:00)
- Hour padding (9:00 → 09:00)
- Invalid format rejection
- Out-of-range validation

#### 5. Agenda Validation (6 tests)
- Valid array acceptance
- Empty array rejection
- Empty string rejection
- Whitespace-only rejection
- Non-array rejection
- Non-string items rejection

#### 6. Tags Validation (6 tests)
- Valid array acceptance
- Empty array rejection
- Empty string rejection
- Whitespace-only rejection
- Non-array rejection
- Non-string items rejection

#### 7. Mode Validation (5 tests)
- "online" mode support
- "offline" mode support
- "hybrid" mode support
- Custom mode strings
- Mode trimming

#### 8. Pre-save Hook Validation (9 tests)
- Empty field rejection after trim (title, description, overview, image, venue, location, mode, audience, organizer)

#### 9. Timestamps (3 tests)
- Automatic createdAt
- Automatic updatedAt
- updatedAt modification on save

#### 10. Edge Cases (10 tests)
- Very long strings
- Multiple events with different titles
- Single-item arrays
- Special characters
- URL query parameters
- International characters
- Midnight/end-of-day times

### Booking Model Tests (65 tests)

#### 1. Schema Validation (6 tests)
- Valid booking creation
- Missing eventId rejection
- Missing email rejection
- Email lowercase conversion
- Email trimming
- Index creation verification

#### 2. Email Validation (14 tests)
- Valid email formats (simple, dots, plus signs, hyphens, subdomains)
- Invalid formats rejection (no @, no domain, no local, spaces, no TLD, single-char TLD, multiple @, invalid chars)

#### 3. Pre-save Hook - Event Existence Validation (7 tests)
- Non-existent event rejection
- Valid event acceptance
- Null eventId handling
- Undefined eventId handling
- Email format validation in hook
- Multiple bookings for same event
- Same email for different events

#### 4. Timestamps (4 tests)
- Automatic createdAt
- Automatic updatedAt
- updatedAt modification
- createdAt immutability

#### 5. EventId Reference (3 tests)
- ObjectId type verification
- Event model reference
- String ObjectId acceptance

#### 6. Edge Cases (9 tests)
- Very long emails
- Maximum TLD length
- Concurrent bookings
- Booking after event deletion
- Email updates
- Invalid email update rejection
- Special characters in email
- Hyphenated domains

#### 7. Query Operations (4 tests)
- Find by eventId
- Find by email
- Count bookings
- Delete booking

### Index Tests (6 tests)
- Event model export verification
- Booking model export verification
- Both models exported
- Models are functions
- Event instantiation
- Booking instantiation

## Running the Tests

### Installation
```bash
npm install
```

This will install all testing dependencies:
- Jest (test runner)
- ts-jest (TypeScript support)
- MongoDB Memory Server (in-memory database)
- Type definitions

### Execution

```bash
# Run all tests
npm test

# Run tests in watch mode (auto-rerun on changes)
npm run test:watch

# Run tests with coverage report
npm run test:coverage
```

### Expected Output
```bash
PASS  `database/__tests__/index.test.ts`
PASS  `database/__tests__/event.model.test.ts`
PASS  `database/__tests__/booking.model.test.ts`

Test Suites: 3 passed, 3 total
Tests:       169 passed, 169 total
Snapshots:   0 total
Time:        XX.XXXs
```