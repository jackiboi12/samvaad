export const capitialize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

// Simple debounce implementation
export function debounce(fn, delay) {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
}
