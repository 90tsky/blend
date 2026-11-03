// Files in public/ are served under the app's base path (/blend/ on GitHub Pages).
export function asset(path: string) {
  return import.meta.env.BASE_URL + path.replace(/^\//, '')
}
