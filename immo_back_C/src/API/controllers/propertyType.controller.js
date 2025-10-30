import PropertyType from "../models/propertyType.model.js";

const createPropertyType = (req, res) => {
  PropertyType.findOne({ name: req.body.name })
    .then((existingPropertyType) => {
      if (existingPropertyType) {
        return res.status(400).json({
          message: "Ce type de bien existe déjà",
        });
      }

      const propertyType = new PropertyType({
        ...req.body,
      });

      propertyType
        .save()
        .then((data) => res.status(201).json(data))
        .catch((error) => res.status(400).json(error));
    })
    .catch((error) => res.status(500).json(error));
};

const getAllPropertyTypes = (req, res) => {
  PropertyType.find()
    .then((propertyTypes) => res.status(200).json(propertyTypes))
    .catch((error) => res.status(500).json(error));
};

const getPropertyTypeById = (req, res) => {
  PropertyType.findOne({ _id: req.params.id })
    .then((propertyType) => res.status(200).json(propertyType))
    .catch((error) => res.status(500).json(error));
};

const updatePropertyType = (req, res) => {
  PropertyType.updateOne(
    {
      _id: req.params.id,
    },
    {
      _id: req.params.id,
      ...req.body,
    }
  )
    .then(() =>
      res.status(200).json({ message: "Type de bien modifié avec succès" })
    )
    .catch((error) => res.status(500).json(error));
};

const deletePropertyType = (req, res) => {
  PropertyType.deleteOne({
    _id: req.params.id,
  })
    .then(() => res.status(200).json({ message: "Type de propriété supprimé" }))
    .catch((error) => res.status(500).json(error));
};

export default {
  createPropertyType,
  getAllPropertyTypes,
  getPropertyTypeById,
  updatePropertyType,
  deletePropertyType,
};
