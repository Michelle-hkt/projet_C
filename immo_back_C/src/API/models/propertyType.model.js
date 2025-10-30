import mongoose from "mongoose";

const propertyTypeModel = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const PropertyType = mongoose.model("PropertyType", propertyTypeModel);

export default PropertyType;
