export function codeGenerator(prefix: string, countData: number): string {
  return `${prefix}${(countData + 1).toString().padStart(4, '0')}`;
}
