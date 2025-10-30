import PreferenceKey from "../models/preferenceKey.model.js";

const getAllPreferences = (req, res) => {
  PreferenceKey.find()
    .then((preferences) => res.status(200).json(preferences))
    .catch((error) => res.status(500).json(error));
};

const createPreference = (req, res) => {
  const { name } = req.body;

  const preference = new PreferenceKey({ name });

  preference
    .save()
    .then((data) => res.status(201).json({ message: "Préférence créée", data }))
    .catch((error) => res.status(500).json(error));
};

const updatePreference = (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  PreferenceKey.updateOne({ _id: id }, { name })
    .then(() =>
      res.status(200).json({ message: "Préférence modifiée avec succès" })
    )
    .catch((error) => res.status(500).json(error));
};

const deletePreference = (req, res) => {
  const { id } = req.params;
  PreferenceKey.deleteOne({ _id: id })
    .then(() =>
      res.status(200).json({ message: "Préférence supprimée avec succès" })
    )
    .catch((error) => res.status(500).json(error));
};

export default {
  getAllPreferences,
  createPreference,
  updatePreference,
  deletePreference,
};
