export function getTokenAliases<T extends object>(tokens: T, pattern: string) {
  const regex = new RegExp(`^${pattern.replace("{alias}", "([a-z0-9-]+)")}$`);
  const aliases = Object.keys(tokens)
    .filter((token) => regex.test(token))
    .map((token) => (token.match(regex) as RegExpMatchArray)[1]);
  return aliases as string[];
}
