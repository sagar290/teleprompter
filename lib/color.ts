/** Convert `#rgb` / `#rrggbb` to `rgba(r,g,b,a)`. Falls back to white. */
export function hexToRgba(hex: string, alpha: number): string {
  const raw = hex.replace("#", "").trim();
  let r = 255;
  let g = 255;
  let b = 255;

  if (raw.length === 3) {
    r = parseInt(raw[0] + raw[0], 16);
    g = parseInt(raw[1] + raw[1], 16);
    b = parseInt(raw[2] + raw[2], 16);
  } else if (raw.length === 6) {
    r = parseInt(raw.slice(0, 2), 16);
    g = parseInt(raw.slice(2, 4), 16);
    b = parseInt(raw.slice(4, 6), 16);
  }

  if ([r, g, b].some((n) => Number.isNaN(n))) {
    return `rgba(255, 255, 255, ${alpha})`;
  }

  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
