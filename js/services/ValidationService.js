import { CONFIG } from "../config/constants.js";

export class ValidationService {
  static validateReservation(data) {
    const errors = {};

    if (
      !data.clientName ||
      data.clientName.trim().length < CONFIG.MIN_NAME_LENGTH
    ) {
      errors.clientName = "Le nom doit contenir au moins 2 caractères";
    }

    if (data.day === "" || data.day === null || data.day === undefined) {
      errors.daySelect = "Veuillez sélectionner un jour";
    }

    if (!data.startTime) {
      errors.startTime = "Veuillez sélectionner une heure de début";
    }

    if (!data.endTime) {
      errors.endTime = "Veuillez sélectionner une heure de fin";
    }

    if (data.startTime && data.endTime && data.startTime >= data.endTime) {
      errors.endTime = "L'heure de fin doit être après l'heure de début";
    }

    const numPeople = parseInt(data.numberOfPeople);
    if (
      !numPeople ||
      numPeople < CONFIG.MIN_PEOPLE ||
      numPeople > CONFIG.MAX_PEOPLE
    ) {
      errors.numberOfPeople = `Entre ${CONFIG.MIN_PEOPLE} et ${CONFIG.MAX_PEOPLE} personnes`;
    }

    if (!data.type) {
      errors.reservationType = "Veuillez sélectionner un type";
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  }
}
