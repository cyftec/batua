export const uniqueIdRegex = /^[a-zA-Z0-9._@-]+$/;
export const nameRegex = /^[a-zA-Z0-9' -]+$/;

export const capitalize = (str: string) =>
  `${str.charAt(0).toUpperCase()}${str.slice(1)}`;

export const removeSpaces = (input: string) =>
  input.replace(/\s+/g, "").replaceAll("&nbsp;", "");

export const deepTrim = (input: string): string =>
  input.replaceAll("&nbsp;", " ").replace(/\s+/g, " ").trim();

export const deepTrimmedLowercase = (input: string): string =>
  deepTrim(input).toLowerCase();

export const getValidName = (input: string): string =>
  deepTrim(input).replace(/[^a-zA-Z0-9' -]/g, "");

export const getLowercaseTagName = (input: string): string =>
  removeSpaces(getValidName(input)).toLowerCase();
