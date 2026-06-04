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

const defaultYashaswiniBusinesses = [
  {
    slug: "ym-fresh-groceries",
    businessName: "Green Basket Supermarket",
    categoryName: "Supermarket",
    price: 99,
    priceLabel: "onwards",
    mobile: "+919812340101",
    whatsapp: "919812340101",
    city: "Pune",
    state: "Maharashtra",
    area: "Karve Nagar",
    address: "Karve Nagar, Pune",
    description: "Fresh produce, dairy, staples, and household needs with quick doorstep delivery.",
    services: ["Fresh Produce", "Daily Essentials", "Delivery"],
    image: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=900&q=70",
  },
  {
    slug: "ym-home-kitchen",
    businessName: "Urban Home Needs",
    categoryName: "Home Essentials",
    price: 49,
    priceLabel: "onwards",
    mobile: "+919812340102",
    whatsapp: "919812340102",
    city: "Pune",
    state: "Maharashtra",
    area: "Kothrud",
    address: "Kothrud, Pune",
    description: "Kitchen tools, storage jars, cleaning supplies, and daily utility products.",
    services: ["Kitchenware", "Storage", "Cleaning"],
    image: "https://images.unsplash.com/photo-1556911220-bff31c812dba?auto=format&fit=crop&w=900&q=70",
  },
  {
    slug: "ym-snacks-beverages",
    businessName: "Snack Street Foods",
    categoryName: "Snacks & Beverages",
    price: 29,
    priceLabel: "onwards",
    mobile: "+919812340103",
    whatsapp: "919812340103",
    city: "Pune",
    state: "Maharashtra",
    area: "Erandwane",
    address: "Erandwane, Pune",
    description: "Cookies, namkeen, juices, cold drinks, and ready-to-eat family packs.",
    services: ["Quick Bites", "Cold Drinks", "Family Packs"],
    image: "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&w=900&q=70",
  },
  {
    slug: "ym-personal-care",
    businessName: "GlowCare Beauty & Wellness",
    categoryName: "Personal Care",
    price: 149,
    priceLabel: "onwards",
    mobile: "+919812340104",
    whatsapp: "919812340104",
    city: "Pune",
    state: "Maharashtra",
    area: "Deccan",
    address: "Deccan, Pune",
    description: "Skincare, grooming, hygiene, and wellness essentials from trusted brands.",
    services: ["Skincare", "Grooming", "Wellness"],
    image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=900&q=70",
  },
];

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

function parsePrice(value) {
  if (value === undefined || value === null || value === "") {
    return null;
  }

  const numericValue = Number(value);
  return Number.isFinite(numericValue) ? numericValue : null;
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

  if (query.minPrice !== undefined || query.maxPrice !== undefined) {
    where.price = {};

    if (query.minPrice !== undefined && query.minPrice !== "") {
      const minPrice = Number(query.minPrice);
      if (Number.isFinite(minPrice)) {
        where.price[Op.gte] = minPrice;
      }
    }

    if (query.maxPrice !== undefined && query.maxPrice !== "") {
      const maxPrice = Number(query.maxPrice);
      if (Number.isFinite(maxPrice)) {
        where.price[Op.lte] = maxPrice;
      }
    }

    if (Object.keys(where.price).length === 0) {
      delete where.price;
    }
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

async function resolveCategorySubcategory(categoryId, subcategoryId, transaction) {
  const category = await Category.findByPk(categoryId, { transaction });
  if (!category) {
    throw new ApiError(404, "Category not found");
  }

  if (subcategoryId === undefined || subcategoryId === null || subcategoryId === "") {
    const generalSubcategory = await getOrCreateGeneralSubcategory(category, transaction);
    return {
      category,
      subcategory: generalSubcategory,
    };
  }

  const numericSubcategoryId = Number(subcategoryId);
  if (!Number.isFinite(numericSubcategoryId) || numericSubcategoryId <= 0) {
    const generalSubcategory = await getOrCreateGeneralSubcategory(category, transaction);
    return {
      category,
      subcategory: generalSubcategory,
    };
  }

  const subcategory = await Subcategory.findByPk(numericSubcategoryId, { transaction });
  if (!subcategory) {
    throw new ApiError(404, "Subcategory not found");
  }

  if (Number(subcategory.categoryId) !== Number(categoryId)) {
    throw new ApiError(400, "Selected subcategory does not belong to selected category");
  }

  return {
    category,
    subcategory,
  };
}

async function getOrCreateCategoryForDefaults(name, transaction) {
  const existing = await Category.findOne({ where: { name }, transaction });
  if (existing) {
    return existing;
  }

  const slug = await generateUniqueSlug(Category, name);
  return Category.create(
    {
      name,
      slug,
      description: `${name} listings`,
      featured: false,
      status: "active",
    },
    { transaction },
  );
}

async function getOrCreateGeneralSubcategory(category, transaction) {
  const existing = await Subcategory.findOne({
    where: {
      categoryId: category.id,
      name: "General",
    },
    transaction,
  });

  if (existing) {
    return existing;
  }

  const slug = await generateUniqueSlug(Subcategory, `${category.slug}-general`);
  return Subcategory.create(
    {
      categoryId: category.id,
      name: "General",
      slug,
      description: `General under ${category.name}`,
      status: "active",
    },
    { transaction },
  );
}

const createBusiness = asyncHandler(async (req, res) => {
  const data = req.body;

  const finalSlug = await generateUniqueSlug(Business, data.slug || data.businessName);

  const logoPath = req.files?.logo?.[0] ? toPublicFilePath(req.files.logo[0].path) : null;
  const bannerPath = req.files?.banner?.[0] ? toPublicFilePath(req.files.banner[0].path) : null;
  const galleryFiles = req.files?.gallery || [];

  const transaction = await sequelize.transaction();

  try {
    const { subcategory } = await resolveCategorySubcategory(
      Number(data.categoryId),
      data.subcategoryId,
      transaction,
    );

    const business = await Business.create(
      {
        categoryId: Number(data.categoryId),
        subcategoryId: subcategory.id,
        businessName: data.businessName.trim(),
        slug: finalSlug,
        price: parsePrice(data.price),
        priceLabel: data.priceLabel ? String(data.priceLabel).trim() : null,
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

const seedYashaswiniDefaults = asyncHandler(async (_req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const created = [];
    const skipped = [];

    for (const item of defaultYashaswiniBusinesses) {
      // eslint-disable-next-line no-await-in-loop
      const existing = await Business.findOne({ where: { slug: item.slug }, transaction });
      if (existing) {
        let updatedExisting = false;

        if ((existing.price === null || existing.price === undefined) && item.price !== undefined) {
          existing.price = item.price;
          updatedExisting = true;
        }

        if (!existing.priceLabel && item.priceLabel) {
          existing.priceLabel = item.priceLabel;
          updatedExisting = true;
        }

        if (updatedExisting) {
          // eslint-disable-next-line no-await-in-loop
          await existing.save({ transaction });
        }

        skipped.push(item.slug);
        // eslint-disable-next-line no-continue
        continue;
      }

      // eslint-disable-next-line no-await-in-loop
      const category = await getOrCreateCategoryForDefaults(item.categoryName, transaction);
      // eslint-disable-next-line no-await-in-loop
      const subcategory = await getOrCreateGeneralSubcategory(category, transaction);

      const mapLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
        `${item.businessName}, ${item.address}`,
      )}`;

      // eslint-disable-next-line no-await-in-loop
      await Business.create(
        {
          categoryId: category.id,
          subcategoryId: subcategory.id,
          businessName: item.businessName,
          slug: item.slug,
          price: item.price,
          priceLabel: item.priceLabel,
          logo: item.image,
          banner: item.image,
          mobile: item.mobile,
          whatsapp: item.whatsapp,
          address: item.address,
          area: item.area,
          city: item.city,
          state: item.state,
          pincode: null,
          mapLink,
          description: item.description,
          services: item.services,
          openingTime: "09:00",
          closingTime: "21:00",
          featured: true,
          verified: true,
          status: "active",
          seoTitle: item.businessName,
          seoDescription: item.description,
        },
        { transaction },
      );

      created.push(item.slug);
    }

    await transaction.commit();

    res.status(200).json({
      success: true,
      message: "Yashaswini defaults synced successfully",
      data: {
        created,
        skipped,
      },
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

  let nextCategoryId = data.categoryId !== undefined ? Number(data.categoryId) : business.categoryId;
  let nextSubcategoryId =
    data.subcategoryId !== undefined ? Number(data.subcategoryId) : business.subcategoryId;

  const categoryChanged = data.categoryId !== undefined && Number(data.categoryId) !== Number(business.categoryId);
  const shouldResolveSubcategory =
    data.subcategoryId !== undefined || categoryChanged;

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

  if (data.price !== undefined) {
    business.price = parsePrice(data.price);
  }

  if (data.priceLabel !== undefined) {
    business.priceLabel = data.priceLabel === "" ? null : String(data.priceLabel).trim();
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
    if (shouldResolveSubcategory) {
      const requestedSubcategoryId = data.subcategoryId !== undefined ? data.subcategoryId : undefined;
      const { subcategory } = await resolveCategorySubcategory(
        nextCategoryId,
        requestedSubcategoryId,
        transaction,
      );
      nextSubcategoryId = subcategory.id;
      business.subcategoryId = nextSubcategoryId;
    }

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
  seedYashaswiniDefaults,
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
