// Optional: configure or set up a testing framework before each test.
// If you delete this file, remove `setupFilesAfterEnv` from `jest.config.js`

// Used for __tests__/testing-library.js
// Learn more: https://github.com/testing-library/jest-dom
import "@testing-library/jest-dom";

// Fix for Node.js environment issues with MongoDB driver
global.TextEncoder = require("util").TextEncoder;
global.TextDecoder = require("util").TextDecoder;
