import ky from "ky";

/**
 * Your `kyInstance` configuration looks good with the custom JSON parser for date fields. 
 * This will automatically convert any properties ending with "At" 
 * (like createdAt, updatedAt) to JavaScript Date objects, which is a nice feature.
 */
const kyInstance = ky.create({
  parseJson: (text) =>
    JSON.parse(text, (key, value) => {
      if (key.endsWith("At")) return new Date(value);
      return value;
    }),
});

export default kyInstance;