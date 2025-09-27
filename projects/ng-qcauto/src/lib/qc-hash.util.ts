export function hashBase36(input: string): string {
  let h1 = 0x811c9dc5, h2 = 0x811c9dc5;
  for (let i = 0; i < input.length; i++) {
    const c = input.charCodeAt(i);
    h1 ^= c; h1 = Math.imul(h1, 0x01000193);
    h2 ^= (c << 1); h2 = Math.imul(h2, 0x01000193);
  }
  const mixed = (h1 ^ (h2 >>> 7)) >>> 0;
  return mixed.toString(36);
}
