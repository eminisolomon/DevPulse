import { useDebounce as useDebounceOriginal } from 'use-debounce';

/**
 * A custom hook that delays updating a value until a specified time has passed.
 * This is useful for preventing expensive operations (like API calls) from triggering too frequently,
 * such as when a user is typing in a search field.
 *
 * @template T The type of the value being debounced.
 * @param {T} value The value to be debounced.
 * @param {number} delay The delay in milliseconds before the value is updated.
 * @returns {T} The debounced value.
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue] = useDebounceOriginal(value, delay);
  return debouncedValue;
}
