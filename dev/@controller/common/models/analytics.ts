export const AS_ANALYTICS_KEY = "analytics" as const;
export const AS_ANALYTICS_ID_KEY = "id" as const;
export const AS_ANALYTICS_ID_VALUE = "analytics" as const;

export type Analytics = {
  id: "analytics";
  lastInteraction: number;
};

export const INITIAL_ANALYTICS: Analytics = {
  id: "analytics",
  lastInteraction: new Date().getTime(),
};
