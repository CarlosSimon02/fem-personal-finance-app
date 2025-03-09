export function normalizeNewLines(key: string): string {
  return key.replace(/\\n/g, "\n");
}
