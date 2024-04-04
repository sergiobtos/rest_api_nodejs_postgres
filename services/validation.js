function checkRequiredFields(fields, body) {
  for (const field of fields) {
    if (!body[field]) {
      return {
        field,
        error: `${field.charAt(0).toUpperCase() + field.slice(1)} is required`,
      };
    }
  }
  return null;
}

module.exports = { checkRequiredFields };
