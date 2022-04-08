module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    coverageDirectory: './coverage',
    collectCoverageFrom: [
        'src/**/*.{ts,tsx}',
        '!**/node_modules/**'
    ],
    roots: [
        '<rootDir>/src/'
    ]
};
