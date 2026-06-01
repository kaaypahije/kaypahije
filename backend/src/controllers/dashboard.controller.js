const { Op } = require("sequelize");
const { Category, Subcategory, Business } = require("../models");
const asyncHandler = require("../utils/asyncHandler");

function monthLabel(date) {
  return date.toLocaleString("en-IN", { month: "short" });
}

const getDashboardStats = asyncHandler(async (_req, res) => {
  const now = new Date();
  const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);

  const [
    totalCategories,
    totalSubcategories,
    totalBusinesses,
    featuredBusinesses,
    verifiedBusinesses,
    activeListings,
    recentBusinesses,
    monthlyBusinessRows,
  ] = await Promise.all([
    Category.count(),
    Subcategory.count(),
    Business.count(),
    Business.count({ where: { featured: true } }),
    Business.count({ where: { verified: true } }),
    Business.count({ where: { status: "active" } }),
    Business.findAll({
      attributes: ["id", "businessName", "city", "featured", "verified", "status", "createdAt"],
      include: [
        { model: Category, as: "category", attributes: ["id", "name"] },
        { model: Subcategory, as: "subcategory", attributes: ["id", "name"] },
      ],
      order: [["createdAt", "DESC"]],
      limit: 8,
    }),
    Business.findAll({
      attributes: ["createdAt"],
      where: {
        createdAt: {
          [Op.gte]: sixMonthsAgo,
        },
      },
      order: [["createdAt", "ASC"]],
      raw: true,
    }),
  ]);

  const labels = [];
  const map = {};

  for (let i = 5; i >= 0; i -= 1) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = `${date.getFullYear()}-${date.getMonth()}`;
    labels.push({ key, label: monthLabel(date), count: 0 });
    map[key] = labels[labels.length - 1];
  }

  for (const row of monthlyBusinessRows) {
    const date = new Date(row.createdAt);
    const key = `${date.getFullYear()}-${date.getMonth()}`;
    if (map[key]) {
      map[key].count += 1;
    }
  }

  res.status(200).json({
    success: true,
    data: {
      cards: {
        totalCategories,
        totalSubcategories,
        totalBusinesses,
        featuredBusinesses,
        verifiedBusinesses,
        activeListings,
      },
      monthlyBusinesses: labels,
      recentBusinesses,
    },
  });
});

module.exports = {
  getDashboardStats,
};
