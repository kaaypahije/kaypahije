const { Op } = require("sequelize");
const {
  sequelize,
  Business,
  BusinessGallery,
  Category,
  Subcategory,
} = require("../models");
const ApiError = require("../utils/ApiError");
const asyncHandler = require("../utils/asyncHandler");
const { toPublicFilePath, removeLocalFile } = require("../utils/file");
const { generateUniqueSlug } = require("../utils/slugify");

const categoryInclude = {
  model: Category,
  as: "category",
  attributes: ["id", "name", "slug", "status"],
};

const subcategoryInclude = {
  model: Subcategory,
  as: "subcategory",
  attributes: ["id", "name", "slug", "status", "categoryId"],
};

const galleryInclude = {
  model: BusinessGallery,
  as: "gallery",
  attributes: ["id", "image"],
};

function parseBoolean(value, fallback = false) {
  if (value === undefined || value === null || value === "") {
    return fallback;
  }
  if (typeof value === "boolean") {
    return value;
  }
  return String(value).toLowerCase() === "true";
}

function parseServices(value) {
  if (value === undefined || value === null || value === "") {
    return [];
  }
  if (Array.isArray(value)) {
    return value.map((item) => String(item).trim()).filter(Boolean);
  }
  return String(value)
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function buildWhere(query) {
  const where = {};

  if (query.status) {
    where.status = String(query.status);
  }

  if (query.categoryId) {
    where.categoryId = Number(query.categoryId);
  }

  if (query.subcategoryId) {
    where.subcategoryId = Number(query.subcategoryId);
  }

  if (query.featured !== undefined) {
    where.featured = String(query.featured).toLowerCase() === "true";
  }

  if (query.verified !== undefined) {
    where.verified = String(query.verified).toLowerCase() === "true";
  }

  if (query.city) {
    where.city = {
      [Op.like]: `%${String(query.city).trim()}%`,
    };
  }

  if (query.search) {
    const search = String(query.search).trim();
    where[Op.or] = [
      { businessName: { [Op.like]: `%${search}%` } },
      { description: { [Op.like]: `%${search}%` } },
      { city: { [Op.like]: `%${search}%` } },
      { area: { [Op.like]: `%${search}%` } },
      { services: { [Op.like]: `%${search}%` } },
      { slug: { [Op.like]: `%${search}%` } },
    ];
  }

  return where;
}

async function validateCategorySubcategory(categoryId, subcategoryId) {
  const category = await Category.findByPk(categoryId);
  if (!category) {
    throw new ApiError(404, "Category not found");
  }

  const subcategory = await Subcategory.findByPk(subcategoryId);
  if (!subcategory) {
    throw new ApiError(404, "Subcategory not found");
  }

  if (Number(subcategory.categoryId) !== Number(categoryId)) {
    throw new ApiError(400, "Selected subcategory does not belong to selected category");
  }
}

const createBusiness = asyncHandler(async (req, res) => {
  const data = req.body;

  await validateCategorySubcategory(data.categoryId, data.subcategoryId);

  const finalSlug = await generateUniqueSlug(Business, data.slug || data.businessName);

  const logoPath = req.files?.logo?.[0] ? toPublicFilePath(req.files.logo[0].path) : null;
  const bannerPath = req.files?.banner?.[0] ? toPublicFilePath(req.files.banner[0].path) : null;
  const galleryFiles = req.files?.gallery || [];

  const transaction = await sequelize.transaction();

  try {
    const business = await Business.create(
      {
        categoryId: Number(data.categoryId),
        subcategoryId: Number(data.subcategoryId),
        businessName: data.businessName.trim(),
        slug: finalSlug,
        logo: logoPath,
        banner: bannerPath,
        mobile: data.mobile,
        whatsapp: data.whatsapp || null,
        email: data.email || null,
        website: data.website || null,
        address: data.address,
        area: data.area || null,
        city: data.city,
        state: data.state,
        pincode: data.pincode || null,
        mapLink: data.mapLink || null,
        latitude: data.latitude || null,
        longitude: data.longitude || null,
        description: data.description || null,
        services: parseServices(data.services),
        openingTime: data.openingTime || null,
        closingTime: data.closingTime || null,
        featured: parseBoolean(data.featured, false),
        verified: parseBoolean(data.verified, false),
        status: data.status || "active",
        seoTitle: data.seoTitle || null,
        seoDescription: data.seoDescription || null,
      },
      { transaction },
    );

    if (galleryFiles.length > 0) {
      const rows = galleryFiles.map((file) => ({
        businessId: business.id,
        image: toPublicFilePath(file.path),
      }));
      await BusinessGallery.bulkCreate(rows, { transaction });
    }

    await transaction.commit();

    const created = await Business.findByPk(business.id, {
      include: [categoryInclude, subcategoryInclude, galleryInclude],
    });

    res.status(201).json({
      success: true,
      message: "Business created successfully",
      data: created,
    });
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
});

const getBusinesses = asyncHandler(async (req, res) => {
  const page = Number(req.query.page || 1);
  const limit = Number(req.query.limit || 10);
  const offset = (page - 1) * limit;

  const where = buildWhere(req.query);

  const result = await Business.findAndCountAll({
    where,
    include: [categoryInclude, subcategoryInclude, galleryInclude],
    order: [["createdAt", "DESC"]],
    offset,
    limit,
    distinct: true,
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

const getBusinessById = asyncHandler(async (req, res) => {
  const identifier = String(req.params.id || "");
  const where = /^\d+$/.test(identifier)
    ? { id: Number(identifier) }
    : { slug: identifier };

  const business = await Business.findOne({
    where,
    include: [categoryInclude, subcategoryInclude, galleryInclude],
  });

  if (!business) {
    throw new ApiError(404, "Business not found");
  }

  res.status(200).json({
    success: true,
    data: business,
  });
});

const updateBusiness = asyncHandler(async (req, res) => {
  const business = await Business.findByPk(req.params.id, { include: [galleryInclude] });

  if (!business) {
    throw new ApiError(404, "Business not found");
  }

  const data = req.body;

  const nextCategoryId = data.categoryId !== undefined ? Number(data.categoryId) : business.categoryId;
  const nextSubcategoryId =
    data.subcategoryId !== undefined ? Number(data.subcategoryId) : business.subcategoryId;

  if (data.categoryId !== undefined || data.subcategoryId !== undefined) {
    await validateCategorySubcategory(nextCategoryId, nextSubcategoryId);
  }

  const logoPath = req.files?.logo?.[0] ? toPublicFilePath(req.files.logo[0].path) : null;
  const bannerPath = req.files?.banner?.[0] ? toPublicFilePath(req.files.banner[0].path) : null;
  const galleryFiles = req.files?.gallery || [];

  const oldLogo = business.logo;
  const oldBanner = business.banner;

  if (data.businessName !== undefined) {
    business.businessName = data.businessName.trim();
  }

  if (data.slug || data.businessName) {
    business.slug = await generateUniqueSlug(
      Business,
      data.slug || data.businessName || business.businessName,
      business.id,
    );
  }

  const fields = [
    ["categoryId", nextCategoryId],
    ["subcategoryId", nextSubcategoryId],
    ["mobile", data.mobile],
    ["whatsapp", data.whatsapp],
    ["email", data.email],
    ["website", data.website],
    ["address", data.address],
    ["area", data.area],
    ["city", data.city],
    ["state", data.state],
    ["pincode", data.pincode],
    ["mapLink", data.mapLink],
    ["latitude", data.latitude],
    ["longitude", data.longitude],
    ["description", data.description],
    ["openingTime", data.openingTime],
    ["closingTime", data.closingTime],
    ["status", data.status],
    ["seoTitle", data.seoTitle],
    ["seoDescription", data.seoDescription],
  ];

  for (const [field, value] of fields) {
    if (value !== undefined) {
      business[field] = value === "" ? null : value;
    }
  }

  if (data.services !== undefined) {
    business.services = parseServices(data.services);
  }

  if (data.featured !== undefined) {
    business.featured = parseBoolean(data.featured, business.featured);
  }

  if (data.verified !== undefined) {
    business.verified = parseBoolean(data.verified, business.verified);
  }

  if (logoPath) {
    business.logo = logoPath;
  }

  if (bannerPath) {
    business.banner = bannerPath;
  }

  const transaction = await sequelize.transaction();

  try {
    await business.save({ transaction });

    if (galleryFiles.length > 0) {
      const rows = galleryFiles.map((file) => ({
        businessId: business.id,
        image: toPublicFilePath(file.path),
      }));
      await BusinessGallery.bulkCreate(rows, { transaction });
    }

    if (data.removeGalleryIds) {
      const ids = String(data.removeGalleryIds)
        .split(",")
        .map((x) => Number(x.trim()))
        .filter(Boolean);

      if (ids.length > 0) {
        const galleryRows = await BusinessGallery.findAll({
          where: {
            id: ids,
            businessId: business.id,
          },
          transaction,
        });

        for (const row of galleryRows) {
          removeLocalFile(row.image);
          await row.destroy({ transaction });
        }
      }
    }

    await transaction.commit();

    if (logoPath && oldLogo && oldLogo !== logoPath) {
      removeLocalFile(oldLogo);
    }

    if (bannerPath && oldBanner && oldBanner !== bannerPath) {
      removeLocalFile(oldBanner);
    }

    const updated = await Business.findByPk(business.id, {
      include: [categoryInclude, subcategoryInclude, galleryInclude],
    });

    res.status(200).json({
      success: true,
      message: "Business updated successfully",
      data: updated,
    });
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
});

const deleteBusiness = asyncHandler(async (req, res) => {
  const business = await Business.findByPk(req.params.id, {
    include: [galleryInclude],
  });

  if (!business) {
    throw new ApiError(404, "Business not found");
  }

  const transaction = await sequelize.transaction();

  try {
    await BusinessGallery.destroy({
      where: { businessId: business.id },
      transaction,
    });

    await business.destroy({ transaction });
    await transaction.commit();

    if (business.logo) {
      removeLocalFile(business.logo);
    }
    if (business.banner) {
      removeLocalFile(business.banner);
    }
    for (const image of business.gallery) {
      removeLocalFile(image.image);
    }

    res.status(200).json({
      success: true,
      message: "Business deleted successfully",
    });
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
});

const getFeaturedBusinesses = asyncHandler(async (req, res) => {
  const limit = Number(req.query.limit || 20);

  const businesses = await Business.findAll({
    where: { featured: true, status: "active" },
    include: [categoryInclude, subcategoryInclude, galleryInclude],
    order: [["createdAt", "DESC"]],
    limit,
  });

  res.status(200).json({
    success: true,
    data: businesses,
  });
});

const getVerifiedBusinesses = asyncHandler(async (req, res) => {
  const limit = Number(req.query.limit || 20);

  const businesses = await Business.findAll({
    where: { verified: true, status: "active" },
    include: [categoryInclude, subcategoryInclude, galleryInclude],
    order: [["createdAt", "DESC"]],
    limit,
  });

  res.status(200).json({
    success: true,
    data: businesses,
  });
});

const getBusinessesByCategory = asyncHandler(async (req, res) => {
  const categoryId = Number(req.params.id);
  const page = Number(req.query.page || 1);
  const limit = Number(req.query.limit || 10);
  const offset = (page - 1) * limit;

  const result = await Business.findAndCountAll({
    where: { categoryId, status: "active" },
    include: [categoryInclude, subcategoryInclude, galleryInclude],
    order: [["createdAt", "DESC"]],
    offset,
    limit,
    distinct: true,
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

const getBusinessesBySubcategory = asyncHandler(async (req, res) => {
  const subcategoryId = Number(req.params.id);
  const page = Number(req.query.page || 1);
  const limit = Number(req.query.limit || 10);
  const offset = (page - 1) * limit;

  const result = await Business.findAndCountAll({
    where: { subcategoryId, status: "active" },
    include: [categoryInclude, subcategoryInclude, galleryInclude],
    order: [["createdAt", "DESC"]],
    offset,
    limit,
    distinct: true,
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

const searchBusinesses = asyncHandler(async (req, res) => {
  const search = req.query.q ? String(req.query.q).trim() : "";
  const limit = Number(req.query.limit || 20);

  if (!search) {
    return res.status(200).json({
      success: true,
      data: [],
    });
  }

  const businesses = await Business.findAll({
    where: {
      status: "active",
      [Op.or]: [
        { businessName: { [Op.like]: `%${search}%` } },
        { description: { [Op.like]: `%${search}%` } },
        { city: { [Op.like]: `%${search}%` } },
        { area: { [Op.like]: `%${search}%` } },
        { services: { [Op.like]: `%${search}%` } },
      ],
    },
    include: [categoryInclude, subcategoryInclude, galleryInclude],
    order: [["featured", "DESC"], ["verified", "DESC"], ["createdAt", "DESC"]],
    limit,
  });

  return res.status(200).json({
    success: true,
    data: businesses,
  });
});

module.exports = {
  createBusiness,
  getBusinesses,
  getBusinessById,
  updateBusiness,
  deleteBusiness,
  getFeaturedBusinesses,
  getVerifiedBusinesses,
  getBusinessesByCategory,
  getBusinessesBySubcategory,
  searchBusinesses,
};
