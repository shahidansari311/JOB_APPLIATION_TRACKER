import Application from "../models/application.model.js";

/**
 * Get applications grouped by status for Kanban board view.
 */
export const getApplicationsByStatus = async (userId) => {
  const applications = await Application.find({ user: userId }).sort({
    updatedAt: -1,
  });

  // Group by status
  const grouped = {};
  applications.forEach((app) => {
    if (!grouped[app.status]) {
      grouped[app.status] = [];
    }
    grouped[app.status].push(app);
  });

  return grouped;
};

/**
 * Get application statistics for dashboard.
 */
export const getApplicationStats = async (userId) => {
  const stats = await Application.aggregate([
    { $match: { user: userId } },
    {
      $group: {
        _id: "$status",
        count: { $sum: 1 },
      },
    },
  ]);

  const total = stats.reduce((sum, s) => sum + s.count, 0);

  return {
    total,
    byStatus: stats.reduce((acc, s) => {
      acc[s._id] = s.count;
      return acc;
    }, {}),
  };
};
