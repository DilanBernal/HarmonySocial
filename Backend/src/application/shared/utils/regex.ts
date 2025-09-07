type ValidationType = {
  name: string;
  regex: RegExp;
};
export const userValidations: Array<ValidationType> = [
  { name: "usernameRegex", regex: /^[a-zA-Z0-9_*\-#$!|°.+]{2,50}$/ },
  {
    name: "fullNameRegex",
    regex: /^[A-Za-zÁÉÍÓÚáéíóúÑñÜüÇç.'-]+(?:\s[A-Za-zÁÉÍÓÚáéíóúÑñÜüÇç.'-]+){0,5}$/,
  },
  {
    name: "userOrEmailRegex",
    regex: /^(?:[a-zA-Z0-9_*\-#$!|°.+]{2,50}|[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/,
  },
  { name: "passwordRegex", regex: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#\$%\^&\*])(.){8,}$/ },
  { name: "emailRegex", regex: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/ },
  { name: "profileImageRegex", regex: /^(https?|ftp|http),\/\/[^\s/$.?#].[^\s]*$/ },
];

export const findRegex = (name: string): RegExp =>
  userValidations.find((x) => x.name === name)!.regex;
