export function transformDataId(data: Record<string, unknown>) {
  const result: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(data)) {
    if (key.endsWith('_id')) {
      const newKey = key.replace(/_id$/, '');
      result[newKey] = { id: value };
    } else {
      result[key] = value;
    }
  }
  return result;
}
