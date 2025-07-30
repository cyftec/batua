import { phase } from "@mufw/maya/utils";
import {
  Analytics,
  AS_ANALYTICS_ID_KEY,
  AS_ANALYTICS_KEY,
  INITIAL_ANALYTICS,
} from "../../../models";
import { parseObjectJsonString } from "../../utils";

export const updateAnalytics = (analytics: Analytics) => {
  localStorage.setItem(AS_ANALYTICS_KEY, JSON.stringify(analytics));
};

export const fetchAnalytics = (): Analytics => {
  if (!phase.currentIs("run")) {
    return INITIAL_ANALYTICS;
  }

  const getAnalyticsFromStore = () => {
    const analyticsString = localStorage.getItem(AS_ANALYTICS_KEY);
    if (!analyticsString) return;
    const analyticsObject = parseObjectJsonString<Analytics>(
      analyticsString,
      AS_ANALYTICS_ID_KEY
    );
    return analyticsObject;
  };

  const analyticsObject = getAnalyticsFromStore();
  if (!analyticsObject) {
    updateAnalytics(INITIAL_ANALYTICS);
  }
  const analytics = getAnalyticsFromStore();
  if (!analytics) throw `Error fetching analytics`;

  return analytics;
};
