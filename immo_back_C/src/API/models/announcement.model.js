import mongoose from "mongoose";

const announcementModel = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    title: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      enum: ["a_vendre", "a_louer"],
    },
    publicationDate: {
      type: Date,
    },
    isValid: {
      type: Boolean,
      default: false,
    },

    landArea: {
      type: Number,
      default: 0,
    },
    numberOfLivingRooms: {
      type: Number,
      default: 0,
      required: true,
    },
    numberOfBedrooms: {
      type: Number,
      default: 0,
      required: true,
    },

    numberOfBathrooms: {
      type: Number,
      default: 0,
      required: true,
    },

    numberOfFloor: {
      type: Number,
      default: 0,
    },

    numberOfKitchen: {
      type: Number,
      default: 0,
      required: true,
    },

    generalCondition: {
      type: String,
      required: true,
    },

    address: {
      type: String,
      required: true,
    },

    district: {
      type: String,
      required: true,
    },

    garage: {
      type: Boolean,
      default: false,
    },

    internalToilet: {
      type: Boolean,
      default: false,
      required: true,
    },

    externalToilet: {
      type: Boolean,
      default: false,
      required: true,
    },

    price: {
      type: Number,
      required: true,
    },

    deposit: {
      type: Number,
      required: true,
    },

    advance: {
      type: Number,
      required: true,
    },

    landTitle: {
      type: String,
      trim: true,
    },

    virtualTour: {
      visitUrl: {
        type: String,
        default: "N/A",
      },
      photo360: {
        type: String,
        default: null,
      },
    },

    gallery: [
      {
        imageUrl: {
          type: String,
          trim: true,
        },
      },
    ],

    propertyType: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PropertyType",
      required: true,
    },

    // Commission de la plateforme (calculée selon le type de bien)
    commission: {
      type: Number,
      required: true,
    },

    // Liste des agents assignés à cette annonce (max 3)
    assignedAgents: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Agent",
      },
    ],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Champ virtuel pour transformer gallery en images (compatibilité frontend)
announcementModel.virtual("images").get(function () {
  if (!this.gallery || this.gallery.length === 0) {
    return [];
  }
  return this.gallery.map((item) => item.imageUrl);
});

// Champ virtuel pour le thumbnail (première image seulement)
announcementModel.virtual("thumbnail").get(function () {
  if (!this.gallery || this.gallery.length === 0) {
    return null;
  }
  return this.gallery[0].imageUrl;
});

const Announcement = mongoose.model("Announcement", announcementModel);

export default Announcement;
