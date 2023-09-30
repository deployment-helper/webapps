export function cookies(): Map<string, string> {
  const cookiesStr = document.cookie;
  const cookiesMap = new Map<string, string>();
  for (const cookie of cookiesStr.split(";")) {
    const cookieAr = cookie.split("=");
    cookiesMap.set(cookieAr[0]?.trim(), cookieAr[1]?.trim());
  }

  return cookiesMap;
}

export default cookies;
