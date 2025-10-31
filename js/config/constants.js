export default CONFIG = {
  START_HOUR: 8,
  END_HOUR: 22,
  TOAST_DURATION: 3000,
  SEARCH_DEBOUNCE: 300,
  MIN_NAME_LENGTH: 2,
  MIN_PEOPLE: 1,
  MAX_PEOPLE: 100,
  MIN_DURATION_MINUTES: 30,
  STORAGE_KEY: "reservex_reservations",
};

export const RESERVATION_TYPES = {
  STANDARD: "standard",
  VIP: "vip",
  BIRTHDAY: "birthday",
  GROUP: "group",
  BUSINESS: "business",
};

export const RESERVATION_LABELS = {
  standard: "Standard",
  vip: "VIP",
  birthday: "Anniversaire",
  group: "Groupe",
  business: "Affaires",
};
