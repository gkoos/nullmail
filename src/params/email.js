/** @type {import('@sveltejs/kit').ParamMatcher} */
export function match(param) {
  // Simple email validation (adjust as needed)
  return /^[^@]+@[^@]+\.[^@]+$/.test(param);
}