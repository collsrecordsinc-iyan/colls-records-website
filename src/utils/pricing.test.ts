import test from 'node:test';
import assert from 'node:assert/strict';
import {
  formatTZS,
  formatDuration,
  calculateBookingTotal,
  validateEmail,
  validateTanzanianPhone
} from './pricing';

test('formatTZS formats Tanzanian Shillings with commas and prefix', () => {
  assert.equal(formatTZS(150000), 'TZS 150,000');
  assert.equal(formatTZS(0), 'TZS 0');
  assert.equal(formatTZS(1200000), 'TZS 1,200,000');
});

test('formatDuration formats seconds to MM:SS correctly', () => {
  assert.equal(formatDuration(225), '3:45');
  assert.equal(formatDuration(65), '1:05');
  assert.equal(formatDuration(0), '0:00');
});

test('calculateBookingTotal applies hours and percentage discount properly', () => {
  assert.equal(calculateBookingTotal(30000, 3, 0), 90000);
  assert.equal(calculateBookingTotal(100000, 1, 10), 90000);
  assert.equal(calculateBookingTotal(180000, 2, 20), 288000);
});

test('validateEmail validates valid and invalid emails', () => {
  assert.equal(validateEmail('collsrecords.inc@gmail.com'), true);
  assert.equal(validateEmail('artist@studio.tz'), true);
  assert.equal(validateEmail('invalid-email'), false);
  assert.equal(validateEmail(''), false);
});

test('validateTanzanianPhone validates East African Vodacom/Airtel/Tigo formats', () => {
  assert.equal(validateTanzanianPhone('+255741808971'), true);
  assert.equal(validateTanzanianPhone('0620742182'), true);
  assert.equal(validateTanzanianPhone('255755123456'), true);
  assert.equal(validateTanzanianPhone('+1234567890'), false);
  assert.equal(validateTanzanianPhone('invalid'), false);
});
