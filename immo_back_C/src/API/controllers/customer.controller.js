import Customer from "../models/customer.model.js";
import Favorite from "../models/favorite.model.js";
import Notification from "../models/notification.model.js";
import User from "../models/user.model.js";

const updateProfile = (req, res) => {
  const { firstName, lastName, phoneNumber, whatsappNumber, address } =
    req.body;
  const userId = req.auth.userId;

  User.findById(userId)
    .then((user) => {
      if (!user) {
        return res.status(404).json({ message: "Utilisateur introuvable" });
      }

      // Mettre à jour les informations de l'utilisateur
      if (firstName) user.firstName = firstName;
      if (lastName) user.lastName = lastName;

      user
        .save()
        .then(() => {
          // Mettre à jour les informations du customer
          Customer.findOne({ userId })
            .then((customer) => {
              if (!customer) {
                return res
                  .status(404)
                  .json({ message: "Customer introuvable" });
              }

              if (phoneNumber) customer.contact.phoneNumber = phoneNumber;
              if (whatsappNumber)
                customer.contact.whatsappNumber = whatsappNumber;
              if (address !== undefined) customer.address = address;

              customer
                .save()
                .then(() =>
                  res
                    .status(200)
                    .json({ message: "Profil mis à jour avec succès" })
                )
                .catch((error) => res.status(500).json(error));
            })
            .catch((error) => res.status(500).json(error));
        })
        .catch((error) => res.status(500).json(error));
    })
    .catch((error) => res.status(500).json(error));
};

const addPreference = (req, res) => {
  const { preferenceKeyId } = req.body;
  const userId = req.auth.userId;

  Customer.findOne({ userId })
    .then((customer) => {
      if (!customer) {
        return res.status(404).json({ message: "Customer introuvable" });
      }

      // Vérifier si preferenceKey existe et est un tableau
      if (!customer.preferenceKey || !Array.isArray(customer.preferenceKey)) {
        customer.preferenceKey = [];
      }

      // Nettoyer d'abord les valeurs nulles ou undefined
      customer.preferenceKey = customer.preferenceKey.filter(
        (pref) => pref != null
      );

      if (customer.preferenceKey.includes(preferenceKeyId)) {
        return res.status(400).json({ message: "Préférence déjà ajoutée" });
      }

      customer.preferenceKey.push(preferenceKeyId);

      customer
        .save()
        .then(() => res.status(200).json({ message: "Préférence ajoutée" }))
        .catch((error) => {
          console.error("Erreur lors de la sauvegarde:", error);
          res.status(500).json({ message: error.message, error });
        });
    })
    .catch((error) => {
      console.error("Erreur lors de la recherche du customer:", error);
      res.status(500).json({ message: error.message, error });
    });
};

const removePreference = (req, res) => {
  const { preferenceKeyId } = req.params;
  const userId = req.auth.userId;

  Customer.findOne({ userId })
    .then((customer) => {
      if (!customer) {
        return res.status(404).json({ message: "Customer introuvable" });
      }

      // Vérifier si preferenceKey existe et est un tableau
      if (!customer.preferenceKey || !Array.isArray(customer.preferenceKey)) {
        customer.preferenceKey = [];
      }

      // Nettoyer d'abord les valeurs nulles ou undefined
      customer.preferenceKey = customer.preferenceKey.filter(
        (pref) => pref != null
      );

      // Filtrer les préférences
      const initialLength = customer.preferenceKey.length;
      customer.preferenceKey = customer.preferenceKey.filter(
        (pref) => pref.toString() !== preferenceKeyId
      );

      // Vérifier si une préférence a été supprimée
      if (customer.preferenceKey.length === initialLength) {
        return res.status(404).json({ message: "Préférence non trouvée" });
      }

      customer
        .save()
        .then(() => res.status(200).json({ message: "Préférence retirée" }))
        .catch((error) => {
          console.error("Erreur lors de la sauvegarde:", error);
          res.status(500).json({ message: error.message, error });
        });
    })
    .catch((error) => {
      console.error("Erreur lors de la recherche du customer:", error);
      res.status(500).json({ message: error.message, error });
    });
};

const getMyPreferences = (req, res) => {
  const userId = req.auth.userId;

  Customer.findOne({ userId })
    .populate("preferenceKey")
    .then((customer) => {
      if (!customer) {
        return res.status(404).json({ message: "Customer introuvable" });
      }

      // Filtrer les valeurs nulles ou undefined avant de retourner
      const validPreferences = customer.preferenceKey.filter(
        (pref) => pref != null
      );
      res.status(200).json(validPreferences);
    })
    .catch((error) => res.status(500).json(error));
};

const addFavorite = (req, res) => {
  const { announcementId } = req.body;
  const userId = req.auth.userId;

  Favorite.findOne({ user: userId, announcement: announcementId })
    .then((existingFavorite) => {
      if (existingFavorite) {
        return res.status(400).json({ message: "Déjà dans les favoris" });
      }

      const favorite = new Favorite({
        user: userId,
        announcement: announcementId,
      });

      favorite
        .save()
        .then((data) =>
          res.status(201).json({ message: "Ajouté aux favoris", data })
        )
        .catch((error) => res.status(500).json(error));
    })
    .catch((error) => res.status(500).json(error));
};

const removeFavorite = (req, res) => {
  const { announcementId } = req.params;
  const userId = req.auth.userId;

  Favorite.deleteOne({ user: userId, announcement: announcementId })
    .then(() => res.status(200).json({ message: "Retiré des favoris" }))
    .catch((error) => res.status(500).json(error));
};

const getMyFavorites = (req, res) => {
  const userId = req.auth.userId;

  Favorite.find({ user: userId })
    .populate("announcement")
    .then((favorites) => res.status(200).json(favorites))
    .catch((error) => res.status(500).json(error));
};

const getMyNotifications = (req, res) => {
  const userId = req.auth.userId;

  Notification.find({ user: userId })
    .sort({ createdAt: -1 })
    .populate("announcement")
    .then((notifications) => res.status(200).json(notifications))
    .catch((error) => res.status(500).json(error));
};

const markNotificationAsRead = (req, res) => {
  const { notificationId } = req.params;
  const userId = req.auth.userId;

  Notification.updateOne(
    { _id: notificationId, user: userId },
    { isRead: true }
  )
    .then((result) => {
      if (result.modifiedCount === 0) {
        return res.status(404).json({ message: "Notification introuvable" });
      }
      res.status(200).json({ message: "Notification marquée comme lue" });
    })
    .catch((error) => res.status(500).json(error));
};

export default {
  updateProfile,
  addPreference,
  removePreference,
  getMyPreferences,
  addFavorite,
  removeFavorite,
  getMyFavorites,
  getMyNotifications,
  markNotificationAsRead,
};
