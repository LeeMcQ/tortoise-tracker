import test from 'node:test';
import assert from 'node:assert/strict';
import { translationKeys } from '../src/i18n.js';

test('English and Afrikaans translation dictionaries have identical keys', () => {
  assert.deepEqual(translationKeys('af'), translationKeys('en'));
});
