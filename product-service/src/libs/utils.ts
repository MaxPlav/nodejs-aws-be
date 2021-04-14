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
