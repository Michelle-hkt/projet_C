import Announcement from "../models/announcement.model.js";

const searchAnnouncements = (req, res) => {
  const { district, status, price } = req.query;

  let filter = { isValid: true };

  if (district) filter.district = district;
  if (status) filter.status = status;
  if (price) filter.price = { $lte: Number(price) };

  Announcement.find(filter)
    .select("-virtualTour.photo360") // Exclure seulement la photo360
    .slice("gallery", 1) // Ne prendre que la première image de la galerie
    .sort({ createdAt: -1 })
    .then((announcements) => res.status(200).json(announcements))
    .catch((error) => res.status(500).json(error));
};

const getAllAnnouncements = (req, res) => {
  // Pagination
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 50;
  const skip = (page - 1) * limit;

  Announcement.find({ isValid: true })
    .select("-virtualTour.photo360") // Exclure seulement la photo360
    .slice("gallery", 1) // Ne prendre que la première image de la galerie
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 })
    .then(async (announcements) => {
      const total = await Announcement.countDocuments({ isValid: true });
      res.status(200).json({
        data: announcements,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      });
    })
    .catch((error) => res.status(500).json(error));
};

const getAnnouncementById = (req, res) => {
  const { id } = req.params;

  Announcement.findById(id)
    .then((announcement) => {
      if (!announcement) {
        return res.status(404).json({ message: "Annonce introuvable" });
      }
      res.status(200).json(announcement);
    })
    .catch((error) => res.status(500).json(error));
};

const getRecentAnnouncements = (req, res) => {
  const limit = parseInt(req.query.limit) || 10;

  Announcement.find({ isValid: true })
    .select("-virtualTour.photo360") // Exclure seulement la photo360
    .slice("gallery", 1) // Ne prendre que la première image de la galerie
    .sort({ createdAt: -1 })
    .limit(limit)
    .populate("user", "firstName lastName email")
    .populate("propertyType", "name")
    .then((announcements) => {
      res.status(200).json({
        success: true,
        count: announcements.length,
        data: announcements,
      });
    })
    .catch((error) => {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    });
};

export default {
  searchAnnouncements,
  getAllAnnouncements,
  getAnnouncementById,
  getRecentAnnouncements,
};
