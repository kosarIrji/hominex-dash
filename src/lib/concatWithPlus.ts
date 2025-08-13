export function concatWithPlus(...strings) {
  return strings.join(" ").replace(/ /g, "+");
}
