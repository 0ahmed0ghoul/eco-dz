export const generateSlug = (name) => {
    if (!name) return "";
    return name
      .toLowerCase()
      .replace(/\s+/g, "-") // spaces → hyphens
      .replace(/'/g, "");   // remove apostrophes
  };
  