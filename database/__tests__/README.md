# Database Models Test Suite

This directory contains comprehensive unit tests for the MongoDB/Mongoose database models.

## Test Coverage

### Event Model Tests (`event.model.test.ts`)
- **Schema Validation**: Tests for all required fields and data types
- **Slug Generation**: Tests for automatic slug creation from titles with various formats
- **Date Normalization**: Tests for date format validation and normalization to ISO format
- **Time Normalization**: Tests for time parsing (12/24 hour formats, AM/PM)
- **Agenda Validation**: Tests for array validation and non-empty string requirements
- **Tags Validation**: Tests for array validation and non-empty string requirements
- **Mode Validation**: Tests for different event modes (online, offline, hybrid)
- **Pre-save Hooks**: Tests for validation logic in pre-save hooks
- **Timestamps**: Tests for automatic createdAt/updatedAt handling
- **Edge Cases**: Tests for special characters, long strings, concurrent operations

### Booking Model Tests (`booking.model.test.ts`)
- **Schema Validation**: Tests for required fields and data types
- **Email Validation**: Comprehensive tests for email format validation
- **Email Normalization**: Tests for lowercase conversion and trimming
- **Event Reference Validation**: Tests for pre-save hook that verifies event existence
- **Timestamps**: Tests for automatic timestamp management
- **Query Operations**: Tests for common database queries
- **Edge Cases**: Tests for concurrent bookings, deleted events, long emails

### Index Tests (`index.test.ts`)
- **Export Verification**: Tests that models are properly exported
- **Model Functionality**: Basic tests for exported model instantiation

## Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage report
npm run test:coverage
```

## Test Environment

Tests use **MongoDB Memory Server** to provide an isolated in-memory MongoDB instance for each test run. This ensures:
- Fast test execution
- No dependency on external databases
- Isolated test environment
- Automatic cleanup after tests

## Best Practices

1. **Isolation**: Each test is independent and doesn't rely on other tests
2. **Cleanup**: Database is cleared after each test via `afterEach` hook
3. **Comprehensive Coverage**: Tests cover happy paths, edge cases, and error conditions
4. **Descriptive Names**: Test names clearly describe what is being tested
5. **Realistic Data**: Test data mimics real-world scenarios

## Adding New Tests

When adding new features to the models:
1. Add corresponding test cases in the relevant test file
2. Ensure tests cover both success and failure scenarios
3. Test edge cases and boundary conditions
4. Run the full test suite to ensure no regressions