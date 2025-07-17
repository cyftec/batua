export const uniqueIdRegex = /^[a-zA-Z0-9._@-]+$/;
export const nameRegex = /^[A-Za-z0-9]+([ '-][A-Za-z0-9]+)*$/;

export const capitalize = (str: string) =>
  `${str.charAt(0).toUpperCase()}${str.slice(1)}`;

export const getOnlyAlphaNumeric = (input: string): string =>
  input.replace(/[^a-zA-Z0-9]/g, "");

export const getLowercaseTagName = (input: string): string =>
  getOnlyAlphaNumeric(input).toLowerCase();
