export function concatWithPlus(...strings: string[]): string {
  return strings.join(" ").replace(/ /g, "+");
}
