export const findItemById = <T extends { id: string }>(
  list: T[],
  id: string
): T | undefined => {
  let found;

  for (let i = 0; i < list.length; i++) {
    if (list[i].id === id) {
      found = list[i];
      break;
    }
  }

  return found;
};

export const isValidUUID = (uuid: string): boolean => {
  if (typeof uuid === 'string' && uuid.length === 36) {
    // to minimize ReDoS attack
    return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/.test(
      uuid
    );
  }

  return false;
};
