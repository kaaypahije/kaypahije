const { Op } = require("sequelize");
const { Subcategory, Category, Business } = require("../models");
const ApiError = require("../utils/ApiError");
const asyncHandler = require("../utils/asyncHandler");
const { toPublicFilePath, removeLocalFile } = require("../utils/file");
const { generateUniqueSlug } = require("../utils/slugify");

const categorySelect = ["id", "name", "slug", "status"];

const createSubcategory = asyncHandler(async (req, res) => {
  const { categoryId, name, slug, description, status } = req.body;

  const category = await Category.findByPk(categoryId);
  if (!category) {
    throw new ApiError(404, "Category not found");
  }

  const finalSlug = await generateUniqueSlug(Subcategory, slug || name);

  const image = req.file ? toPublicFilePath(req.file.path) : null;

  const subcategory = await Subcategory.create({
    categoryId,
    name: name.trim(),
    slug: finalSlug,
    image,
    description: description || null,
    status: status || "active",
  });

  res.status(201).json({
    success: true,
    message: "Subcategory created successfully",
    data: subcategory,
  });
});

const getSubcategories = asyncHandler(async (req, res) => {
  const page = Number(req.query.page || 1);
  const limit = Number(req.query.limit || 10);
  const offset = (page - 1) * limit;
  const search = req.query.search ? String(req.query.search).trim() : "";
  const status = req.query.status ? String(req.query.status) : null;
  const categoryId = req.query.categoryId ? Number(req.query.categoryId) : null;

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

  if (categoryId) {
    where.categoryId = categoryId;
  }

  const result = await Subcategory.findAndCountAll({
    where,
    include: [
      {
        model: Category,
        as: "category",
        attributes: categorySelect,
      },
    ],
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

const getSubcategoriesByCategory = asyncHandler(async (req, res) => {
  const categoryId = Number(req.params.categoryId);

  const subcategories = await Subcategory.findAll({
    where: {
      categoryId,
      status: "active",
    },
    attributes: ["id", "name", "slug", "categoryId", "status"],
    order: [["name", "ASC"]],
  });

  res.status(200).json({
    success: true,
    data: subcategories,
  });
});

const updateSubcategory = asyncHandler(async (req, res) => {
  const subcategory = await Subcategory.findByPk(req.params.id);
  if (!subcategory) {
    throw new ApiError(404, "Subcategory not found");
  }

  const { categoryId, name, slug, description, status } = req.body;

  if (categoryId !== undefined) {
    const category = await Category.findByPk(categoryId);
    if (!category) {
      throw new ApiError(404, "Category not found");
    }
    subcategory.categoryId = Number(categoryId);
  }

  if (name !== undefined) {
    subcategory.name = name.trim();
  }

  if (slug || name) {
    subcategory.slug = await generateUniqueSlug(
      Subcategory,
      slug || name || subcategory.name,
      subcategory.id,
    );
  }

  if (description !== undefined) {
    subcategory.description = description || null;
  }

  if (status !== undefined) {
    subcategory.status = status;
  }

  if (req.file) {
    if (subcategory.image) {
      removeLocalFile(subcategory.image);
    }
    subcategory.image = toPublicFilePath(req.file.path);
  }

  await subcategory.save();

  res.status(200).json({
    success: true,
    message: "Subcategory updated successfully",
    data: subcategory,
  });
});

const deleteSubcategory = asyncHandler(async (req, res) => {
  const subcategory = await Subcategory.findByPk(req.params.id);
  if (!subcategory) {
    throw new ApiError(404, "Subcategory not found");
  }

  const businessCount = await Business.count({ where: { subcategoryId: subcategory.id } });

  if (businessCount > 0) {
    throw new ApiError(
      400,
      "Cannot delete subcategory while businesses exist under this subcategory",
    );
  }

  if (subcategory.image) {
    removeLocalFile(subcategory.image);
  }

  await subcategory.destroy();

  res.status(200).json({
    success: true,
    message: "Subcategory deleted successfully",
  });
});

module.exports = {
  createSubcategory,
  getSubcategories,
  getSubcategoriesByCategory,
  updateSubcategory,
  deleteSubcategory,
};
