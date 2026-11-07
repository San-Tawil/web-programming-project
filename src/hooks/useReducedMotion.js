import useMediaQuery from './useMediaQuery.js';
export default function useReducedMotion() {
  return useMediaQuery('(prefers-reduced-motion: reduce)');
}
