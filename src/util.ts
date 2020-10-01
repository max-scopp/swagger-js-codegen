export function safeName(unsave: string): string {
  return unsave.replace(/[^\w]*/gi, "");
}
