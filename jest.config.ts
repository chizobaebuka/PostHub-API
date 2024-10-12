module.exports = {
    // Specifies the preset configuration used by Jest for TypeScript support
    preset: 'ts-jest',

    // Defines the testing environment to be 'node', as you're running a backend Node.js application
    testEnvironment: 'node',

    // Specifies the root directories for Jest to look for test files
    roots: ['<rootDir>/src', '<rootDir>/__tests__'],

    // Specifies the file extensions that will be processed by Jest
    moduleFileExtensions: ['ts', 'js', 'json'],

    // Specifies the glob patterns Jest uses to detect test files
    testMatch: ['**/__tests__/**/*.test.ts'],

    // Sets the test execution timeout in milliseconds (useful for async operations)
    testTimeout: 10000,

    // Indicates whether to collect code coverage information from test runs
    collectCoverage: true,

    // Specifies the glob patterns for files from which coverage information will be collected
    // Excludes TypeScript definition files (*.d.ts) from coverage collection
    collectCoverageFrom: [
        'src/**/*.ts', // All TypeScript files in the src folder
        '!src/**/*.d.ts', // Exclude definition files
    ],

    // Determines where coverage reports should be output
    coverageDirectory: '<rootDir>/coverage',

    // Enables verbose output for individual test results
    verbose: true,

    // Increases the number of workers Jest will spawn for test execution
    maxWorkers: '50%', // Useful for improving test speed by running in parallel
    
    // Ensures that the tests run in a deterministic order
    randomize: false,

    // Enables watching for file changes and re-running tests accordingly
    watchPathIgnorePatterns: ['node_modules'],

    // Forces Jest to exit after the test run, which helps to avoid hanging processes
    forceExit: true,
};
