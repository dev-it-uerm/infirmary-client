export const required = (val) => {
  return val == null || val === "" ? "This field is required." : undefined;
};

export const year = (val) => {
  return /[1-9]{1}[0-9]{3}/.test(val) ? undefined : "Invalid year.";
};
