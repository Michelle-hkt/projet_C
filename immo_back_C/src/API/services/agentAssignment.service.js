import Agent from "../models/agent.model.js";

/**
 * Régions et localités du Bénin regroupées par proximité
 */
const REGIONS_BENIN = {
  sud: ["cotonou", "abomey-calavi", "ouidah", "porto-novo", "seme-kpodji"],
  centre: ["bohicon", "abomey", "djougou", "savalou", "dassa-zoume"],
  nord: ["parakou", "natitingou", "kandi", "malanville", "djougou"],
};

/**
 * Détermine la région d'une localité
 * @param {string} district - Nom du district
 * @returns {string} - Région (sud, centre, nord)
 */
function getRegion(district) {
  if (!district) return "sud"; // Par défaut

  const normalizedDistrict = district.toLowerCase().trim();

  for (const [region, localities] of Object.entries(REGIONS_BENIN)) {
    if (
      localities.some((locality) =>
        normalizedDistrict.includes(locality.toLowerCase())
      )
    ) {
      return region;
    }
  }

  // Par défaut, retourner "sud" si aucune correspondance
  return "sud";
}

/**
 * Vérifie si deux localités sont dans des régions compatibles
 * @param {string} district1 - Premier district
 * @param {string} district2 - Deuxième district
 * @returns {boolean} - true si compatibles, false sinon
 */
function areRegionsCompatible(district1, district2) {
  const region1 = getRegion(district1);
  const region2 = getRegion(district2);

  // Même région = compatible
  if (region1 === region2) return true;

  // Centre est compatible avec sud et nord
  if (region1 === "centre" || region2 === "centre") return true;

  // Sud et Nord ne sont pas compatibles
  return false;
}

/**
 * Assigne automatiquement 3 agents à une annonce en utilisant un système de rotation
 * Les agents sont assignés selon :
 * - Leur localisation (proximité avec le bien)
 * - Un ordre de rotation (lastAssignedAt)
 * - Les agents déjà assignés sont temporairement exclus
 *
 * @param {string} announcementDistrict - Localité de l'annonce
 * @returns {Promise<Array>} - Tableau des IDs des agents assignés
 */
export const assignAgentsToAnnouncement = async (announcementDistrict) => {
  try {
    // Récupérer tous les agents validés, triés par date d'assignation (les moins récents en premier)
    const allAgents = await Agent.find({ isValide: true })
      .sort({ lastAssignedAt: 1, createdAt: 1 })
      .populate("userId", "firstName lastName");

    if (allAgents.length === 0) {
      return [];
    }

    // Filtrer les agents selon la compatibilité géographique
    const compatibleAgents = allAgents.filter((agent) =>
      areRegionsCompatible(announcementDistrict, agent.address)
    );

    // Si moins de 3 agents compatibles, utiliser tous les agents disponibles
    const agentsToAssignFrom =
      compatibleAgents.length >= 3 ? compatibleAgents : allAgents;

    // Prendre les 3 premiers agents (ou moins si pas assez d'agents)
    const numberOfAgentsToAssign = Math.min(3, agentsToAssignFrom.length);
    const selectedAgents = agentsToAssignFrom.slice(0, numberOfAgentsToAssign);

    // Mettre à jour la date de dernière assignation pour ces agents
    const currentDate = new Date();
    const updatePromises = selectedAgents.map((agent) => {
      agent.lastAssignedAt = currentDate;
      return agent.save();
    });

    await Promise.all(updatePromises);

    // Retourner les IDs des agents assignés
    return selectedAgents.map((agent) => agent._id);
  } catch (error) {
    console.error("Erreur lors de l'assignation des agents:", error);
    throw new Error(
      "Impossible d'assigner les agents à cette annonce: " + error.message
    );
  }
};

/**
 * Calcule la commission de la plateforme selon le type de bien
 * @param {string} status - Type de bien ("a_vendre" ou "a_louer")
 * @param {number} price - Prix du bien
 * @returns {number} - Montant de la commission
 */
export const calculateCommission = (status, price) => {
  const COMMISSION_RATE_VENTE = 0.05; // 5% pour les ventes
  const COMMISSION_RATE_LOCATION = 0.02; // 2% pour les locations

  if (status === "a_vendre") {
    return Math.round(price * COMMISSION_RATE_VENTE);
  } else if (status === "a_louer") {
    return Math.round(price * COMMISSION_RATE_LOCATION);
  }

  return 0;
};
