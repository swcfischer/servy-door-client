const getOS = () => {
  const userAgent = window.navigator.userAgent;

  if (userAgent.includes("Win")) return "Windows";
  if (userAgent.includes("Mac")) return "macOS";
  if (userAgent.includes("Linux")) return "Linux";
  return "Unknown";
};

export default getOS;
