/**
 * Validates if the input string looks like a URL.
 */
export function isValidUrl(str: string): boolean {
  try {
    new URL(str);
    return true;
  } catch {
    return false;
  }
}

/**
 * Returns QR code configuration options.
 */
export function getQrOptions(size: number, darkColor: string, lightColor: string) {
  return {
    width: size,
    margin: 2,
    color: {
      dark: darkColor,
      light: lightColor,
    },
  };
}
