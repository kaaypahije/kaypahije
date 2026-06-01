const { Op } = require("sequelize");
const { Category, Subcategory, Business } = require("../models");
const ApiError = require("../utils/ApiError");
const asyncHandler = require("../utils/asyncHandler");
const { toPublicFilePath, removeLocalFile } = require("../utils/file");
const { generateUniqueSlug } = require("../utils/slugify");

function parseBoolean(value, fallback = false) {
  if (value === undefined || value === null || value === "") {
    return fallback;
  }
  if (typeof value === "boolean") {
    return value;
  }
  return String(value).toLowerCase() === "true";
}

const createCategory = asyncHandler(async (req, res) => {
  const { name, slug, description, status } = req.body;

  const finalSlug = await generateUniqueSlug(Category, slug || name);

  const image = req.file ? toPublicFilePath(req.file.path) : null;

  const category = await Category.create({
    name: name.trim(),
    slug: finalSlug,
    image,
    description: description || null,
    featured: parseBoolean(req.body.featured, false),
    status: status || "active",
  });

  res.status(201).json({
    success: true,
    message: "Category created successfully",
    data: category,
  });
});

const getCategories = asyncHandler(async (req, res) => {
  const page = Number(req.query.page || 1);
  const limit = Number(req.query.limit || 10);
  const offset = (page - 1) * limit;
  const search = req.query.search ? String(req.query.search).trim() : "";
  const status = req.query.status ? String(req.query.status) : null;
  const featured = req.query.featured;

  const where = {};

  if (search) {
    where[Op.or] = [
      { name: { [Op.like]: `%${search}%` } },
      { description: { [Op.like]: `%${search}%` } },
      { slug: { [Op.like]: `%${search}%` } },
    ];
  }

  if (status) {
    where.status = status;
  }

  if (featured !== undefined) {
    where.featured = String(featured).toLowerCase() === "true";
  }

  const result = await Category.findAndCountAll({
    where,
    offset,
    limit,
    order: [["createdAt", "DESC"]],
  });

  res.status(200).json({
    success: true,
    data: result.rows,
    pagination: {
      page,
      limit,
      total: result.count,
      totalPages: Math.ceil(result.count / limit),
    },
  });
});

const getCategoryById = asyncHandler(async (req, res) => {
  const category = await Category.findByPk(req.params.id);

  if (!category) {
    throw new ApiError(404, "Category not found");
  }

  res.status(200).json({
    success: true,
    data: category,
  });
});

const updateCategory = asyncHandler(async (req, res) => {
  const category = await Category.findByPk(req.params.id);

  if (!category) {
    throw new ApiError(404, "Category not found");
  }

  const { name, slug, description, status } = req.body;

  if (name !== undefined) {
    category.name = name.trim();
  }

  if (slug || name) {
    category.slug = await generateUniqueSlug(
      Category,
      slug || name || category.name,
      category.id,
    );
  }

  if (description !== undefined) {
    category.description = description || null;
  }

  if (req.body.featured !== undefined) {
    category.featured = parseBoolean(req.body.featured, category.featured);
  }

  if (status !== undefined) {
    category.status = status;
  }

  if (req.file) {
    if (category.image) {
      removeLocalFile(category.image);
    }
    category.image = toPublicFilePath(req.file.path);
  }

  await category.save();

  res.status(200).json({
    success: true,
    message: "Category updated successfully",
    data: category,
  });
});

const deleteCategory = asyncHandler(async (req, res) => {
  const category = await Category.findByPk(req.params.id);

  if (!category) {
    throw new ApiError(404, "Category not found");
  }

  const businessCount = await Business.count({ where: { categoryId: category.id } });

  if (businessCount > 0) {
    throw new ApiError(
      400,
      "Cannot delete category while businesses exist under this category",
    );
  }

  const subcategories = await Subcategory.findAll({ where: { categoryId: category.id } });
  for (const sub of subcategories) {
    if (sub.image) {
      removeLocalFile(sub.image);
    }
  }

  if (category.image) {
    removeLocalFile(category.image);
  }

  await Category.destroy({ where: { id: category.id } });

  res.status(200).json({
    success: true,
    message: "Category deleted successfully",
  });
});

module.exports = {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
};
