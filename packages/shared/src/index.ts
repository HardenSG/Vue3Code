export const isObject: <T>(params: T) => boolean = (params) => {
  return typeof params === "object" ? true : false;
};
