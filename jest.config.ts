export default {
    preset: 'ts-jest',
    clearMocks: true,
    collectCoverage: true,
    coverageDirectory: "coverage",
    moduleFileExtensions: ['ts', 'js', 'json', 'tsx'],
    moduleDirectories: ['node_modules', 'src'],
    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/src/$1'
    },
    transform: {
        '^.+\\.ts?$': ['ts-jest', { tsconfig: 'tsconfig.test.json' }],
    },
    // 引入jest-enzyme扩展断言支持
    setupFilesAfterEnv: ['./node_modules/jest-enzyme/lib/index.js']
};
