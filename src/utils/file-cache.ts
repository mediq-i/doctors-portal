// Create a global file cache to store files between components
// This is a simple in-memory solution that persists during the session
const fileCache = new Map<string, File>();

export default fileCache;
