"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PRICES = void 0;
const stripe_1 = __importDefault(require("stripe"));
const stripe = new stripe_1.default(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2022-11-15',
});
exports.PRICES = {
    TASK1: { amount: 2000, name: 'IELTS Writing Task 1 Review' },
    TASK2: { amount: 2500, name: 'IELTS Writing Task 2 Review' },
};
exports.default = stripe;
