import Notification from "../models/notification.model.js";

// Récupérer toutes les notifications de l'utilisateur connecté
const getMyNotifications = (req, res) => {
  const userId = req.auth.userId;

  Notification.find({ user: userId })
    .populate("announcement", "title")
    .sort({ createdAt: -1 })
    .then((notifications) => {
      res.status(200).json({
        success: true,
        data: notifications,
      });
    })
    .catch((error) =>
      res.status(500).json({
        success: false,
        message: error.message,
      })
    );
};


const markNotificationAsRead = (req, res) => {
  const { notificationId } = req.params;
  const userId = req.auth.userId;

  Notification.findById(notificationId)
    .then((notification) => {
      if (!notification) {
        return res.status(404).json({
          success: false,
          message: "Notification introuvable",
        });
      }

      // Vérifier que la notification appartient bien à l'utilisateur
      if (notification.user.toString() !== userId.toString()) {
        return res.status(403).json({
          success: false,
          message: "Vous n'avez pas accès à cette notification",
        });
      }

      notification.isRead = true;
      notification
        .save()
        .then((updatedNotification) => {
          res.status(200).json({
            success: true,
            message: "Notification marquée comme lue",
            data: updatedNotification,
          });
        })
        .catch((error) =>
          res.status(500).json({
            success: false,
            message: error.message,
          })
        );
    })
    .catch((error) =>
      res.status(500).json({
        success: false,
        message: error.message,
      })
    );
};


const markAllNotificationsAsRead = (req, res) => {
  const userId = req.auth.userId;

  Notification.updateMany({ user: userId, isRead: false }, { isRead: true })
    .then((result) => {
      res.status(200).json({
        success: true,
        message: `${result.modifiedCount} notification(s) marquée(s) comme lue(s)`,
        data: {
          modifiedCount: result.modifiedCount,
        },
      });
    })
    .catch((error) =>
      res.status(500).json({
        success: false,
        message: error.message,
      })
    );
};

/**
 * SUPPRIMER UNE NOTIFICATION
 * Accessible à tous les utilisateurs authentifiés
 */
const deleteNotification = (req, res) => {
  const { notificationId } = req.params;
  const userId = req.auth.userId;

  Notification.findById(notificationId)
    .then((notification) => {
      if (!notification) {
        return res.status(404).json({
          success: false,
          message: "Notification introuvable",
        });
      }

      // Vérifier que la notification appartient bien à l'utilisateur
      if (notification.user.toString() !== userId.toString()) {
        return res.status(403).json({
          success: false,
          message: "Vous n'avez pas accès à cette notification",
        });
      }

      Notification.findByIdAndDelete(notificationId)
        .then(() => {
          res.status(200).json({
            success: true,
            message: "Notification supprimée avec succès",
          });
        })
        .catch((error) =>
          res.status(500).json({
            success: false,
            message: error.message,
          })
        );
    })
    .catch((error) =>
      res.status(500).json({
        success: false,
        message: error.message,
      })
    );
};

/**
 * COMPTER LES NOTIFICATIONS NON LUES
 * Accessible à tous les utilisateurs authentifiés
 */
const countUnreadNotifications = (req, res) => {
  const userId = req.auth.userId;

  Notification.countDocuments({ user: userId, isRead: false })
    .then((count) => {
      res.status(200).json({
        success: true,
        data: {
          unreadCount: count,
        },
      });
    })
    .catch((error) =>
      res.status(500).json({
        success: false,
        message: error.message,
      })
    );
};

export default {
  getMyNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
  countUnreadNotifications,
};
