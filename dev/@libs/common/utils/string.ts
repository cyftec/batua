export const uniqueIdRegex = /^[a-zA-Z0-9._@-]+$/;
export const nameRegex = /^[A-Za-z0-9 _\-&'()]+$/;

export const capitalize = (str: string) =>
  `${str.charAt(0).toUpperCase()}${str.slice(1)}`;

export const removeSpaces = (input: string) =>
  input.replace(/\s+/g, "").replaceAll("&nbsp;", "");

export const deepTrim = (input: string): string =>
  input.replaceAll("&nbsp;", " ").replace(/\s+/g, " ").trim();

export const deepTrimmedLowercase = (input: string): string =>
  deepTrim(input).toLowerCase();

export const getLowercaseTagName = (input: string): string => {
  if (!nameRegex.test(input))
    throw `Invalid tag name. Provide a valid name first.`;
  return removeSpaces(input).toLowerCase();
};

export const areNamesSimilar = (str1: string, str2: string) =>
  getLowercaseTagName(str1) === getLowercaseTagName(str2);
