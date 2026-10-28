import { describe, expect, it } from 'vitest';
import {
  getTextfieldEndIcon,
  isValidTextfieldValue,
  resolveTextfieldInputType,
  shouldShowTextfieldClear
} from '../textfield-logic';

describe('isValidTextfieldValue', () => {
  it('returns true for empty values', () => {
    expect(
      isValidTextfieldValue({ value: '', type: 'text', min: null, max: null, minlength: null, maxlength: null })
    ).toBe(true);
  });

  it('validates email', () => {
    expect(
      isValidTextfieldValue({ value: 'a@b.com', type: 'email', min: null, max: null, minlength: null, maxlength: null })
    ).toBe(true);
    expect(
      isValidTextfieldValue({ value: 'abc', type: 'email', min: null, max: null, minlength: null, maxlength: null })
    ).toBe(false);
  });

  it('defers url validation to the native input', () => {
    expect(
      isValidTextfieldValue({
        value: 'https://example.com',
        type: 'url',
        min: null,
        max: null,
        minlength: null,
        maxlength: null
      })
    ).toBe(true);
    expect(
      isValidTextfieldValue({ value: 'not-a-url', type: 'url', min: null, max: null, minlength: null, maxlength: null })
    ).toBe(true);
  });

  it('defers tel validation to the native input', () => {
    expect(
      isValidTextfieldValue({
        value: '+1 (555) 123-4567',
        type: 'tel',
        min: null,
        max: null,
        minlength: null,
        maxlength: null
      })
    ).toBe(true);
    expect(
      isValidTextfieldValue({ value: '12', type: 'tel', min: null, max: null, minlength: null, maxlength: null })
    ).toBe(true);
  });

  it('validates number with min and max', () => {
    expect(
      isValidTextfieldValue({ value: '5', type: 'number', min: '1', max: '10', minlength: null, maxlength: null })
    ).toBe(true);
    expect(
      isValidTextfieldValue({ value: '0', type: 'number', min: '1', max: '10', minlength: null, maxlength: null })
    ).toBe(false);
    expect(
      isValidTextfieldValue({ value: '11', type: 'number', min: '1', max: '10', minlength: null, maxlength: null })
    ).toBe(false);
    expect(
      isValidTextfieldValue({ value: 'abc', type: 'number', min: null, max: null, minlength: null, maxlength: null })
    ).toBe(false);
  });

  it('validates minlength and maxlength for non-number types', () => {
    expect(
      isValidTextfieldValue({ value: 'hi', type: 'text', min: null, max: null, minlength: '2', maxlength: '5' })
    ).toBe(true);
    expect(
      isValidTextfieldValue({ value: 'h', type: 'text', min: null, max: null, minlength: '2', maxlength: null })
    ).toBe(false);
    expect(
      isValidTextfieldValue({ value: 'toolong', type: 'text', min: null, max: null, minlength: null, maxlength: '5' })
    ).toBe(false);
  });

  it('does not enforce minlength/maxlength on number type', () => {
    expect(
      isValidTextfieldValue({ value: '5', type: 'number', min: null, max: null, minlength: '10', maxlength: '20' })
    ).toBe(true);
  });
});

describe('getTextfieldEndIcon', () => {
  it('returns eye/eye-off for password', () => {
    expect(getTextfieldEndIcon('password', 'default', false, false)).toBe('eye');
    expect(getTextfieldEndIcon('password', 'default', false, true)).toBe('eye-off');
  });
  it('returns state icons for variants', () => {
    expect(getTextfieldEndIcon('text', 'success', false, false)).toBe('check-circle');
    expect(getTextfieldEndIcon('text', 'warning', false, false)).toBe('warning-triangle');
    expect(getTextfieldEndIcon('text', 'error', false, false)).toBe('xmark-circle');
    expect(getTextfieldEndIcon('text', 'default', false, false)).toBe('');
  });
  it('prefers error when autoError is true', () => {
    expect(getTextfieldEndIcon('text', 'success', true, false)).toBe('xmark-circle');
  });
});

describe('shouldShowTextfieldClear', () => {
  it('shows only when clearable, has value, not disabled/readonly, not password', () => {
    expect(shouldShowTextfieldClear(true, 'hi', false, false, 'text')).toBe(true);
    expect(shouldShowTextfieldClear(false, 'hi', false, false, 'text')).toBe(false);
    expect(shouldShowTextfieldClear(true, '', false, false, 'text')).toBe(false);
    expect(shouldShowTextfieldClear(true, 'hi', true, false, 'text')).toBe(false);
    expect(shouldShowTextfieldClear(true, 'hi', false, true, 'text')).toBe(false);
    expect(shouldShowTextfieldClear(true, 'hi', false, false, 'password')).toBe(false);
  });
});

describe('resolveTextfieldInputType', () => {
  it('shows password as text when visible', () => {
    expect(resolveTextfieldInputType('password', true)).toBe('text');
    expect(resolveTextfieldInputType('password', false)).toBe('password');
    expect(resolveTextfieldInputType('email', true)).toBe('email');
  });
});
