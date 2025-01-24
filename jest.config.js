module.exports = {
    preset: 'ts-jest', // Usar o preset ts-jest para suportar TypeScript
    testEnvironment: 'node', // Define o ambiente como Node.js
    setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'], // Configurações adicionais de ambiente
    moduleFileExtensions: ['ts', 'js'], // Extensões suportadas
    transform: {
        '^.+\\.tsx?$': 'ts-jest', // Processar arquivos TypeScript
    },
    moduleDirectories: ['node_modules', 'src'], // Simplificar caminhos de importação
    testMatch: ['**/__tests__/**/*.ts', '**/?(*.)+(spec|test).ts'], // Padrões para localizar testes
};
