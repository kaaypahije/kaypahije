const slugifyLib = require("slugify");

function slugify(text) {
  return slugifyLib(String(text || ""), {
    lower: true,
    strict: true,
    trim: true,
  });
}

async function generateUniqueSlug(Model, source, excludeId = null, candidateField = "slug") {
  const base = slugify(source) || `item-${Date.now()}`;
  let nextSlug = base;
  let counter = 1;

  // eslint-disable-next-line no-constant-condition
  while (true) {
    // eslint-disable-next-line no-await-in-loop
    const existing = await Model.findOne({ where: { [candidateField]: nextSlug } });
    if (!existing || (excludeId && existing.id === Number(excludeId))) {
      return nextSlug;
    }
    nextSlug = `${base}-${counter}`;
    counter += 1;
  }
}

module.exports = {
  slugify,
  generateUniqueSlug,
};
