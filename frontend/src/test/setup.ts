// Test setup file
import { beforeAll, afterAll, beforeEach } from 'vitest';

// Global test configuration
beforeAll(() => {
  // Set up any global test configuration
  console.log('Starting API tests...');
});

afterAll(() => {
  console.log('API tests completed.');
});

beforeEach(() => {
  // Reset any state before each test
});

// Environment setup
process.env.VITE_API_URL = 'http://localhost:8000';
