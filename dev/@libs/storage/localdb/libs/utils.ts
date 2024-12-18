export const getKeyPaths = (keyPathsShorthand: string) =>
  keyPathsShorthand.includes("+")
    ? keyPathsShorthand.split("+")
    : keyPathsShorthand;

export const getCreateIndexOption = (option: string) => ({ [option]: true });
