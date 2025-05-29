const cleanStack = (
  stack: string | undefined,
  maxLines: number = 5,
): string => {
  if (!stack) return '';

  return stack
    .split('\n') // Split stack trace into lines
    .filter((line) => !line.includes('node:internal')) // Exclude internal Node.js modules
    .slice(0, maxLines) // Limit the number of lines
    .join('\n'); // Join the filtered lines back into a string
};

export default cleanStack;
