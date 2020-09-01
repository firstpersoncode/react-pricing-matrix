import { createSelector } from "reselect";
import { makeGetTotalDays } from "../details/selectors";
import { makeGetSelectedSupplier } from "../suppliers/selectors";
import { makeGetPricing } from "../matrix/selectors";

const dataActivities = state => state.activities.data;
const selectedActivities = state => state.activities.selected;

export const makeGetActivities = () =>
  createSelector(
    [
      makeGetTotalDays(),
      makeGetSelectedSupplier(),
      makeGetPricing(),
      dataActivities
    ],
    (totalDays, supplier, pricing, data) => {
      data = data.filter(activity => !activity.archived);

      if (supplier.id) {
        data = data.filter(activity => activity.supplier_id === supplier.id);
      }

      return data
        .map(activity => {
          const matchPricing = pricing("activity", activity.id, activity.dive);

          if (matchPricing.length) {
            const totalPrice = matchPricing
              .map(pricing => pricing.total_price)
              .reduce((a, b) => a + b);

            return {
              ...activity,
              total_dives: activity.dive * totalDays,
              pricing: matchPricing,
              total_price: totalPrice
            };
          }

          return {
            ...activity,
            total_dives: activity.dive * totalDays
          };
        })
        .sort((a, b) => (a.total_price > b.total_price ? 1 : -1));
    }
  );

export const makeGetActivityById = () =>
  createSelector([makeGetActivities()], data => activityId =>
    data.find(activity => activity.id === activityId)
  );

export const makeGetSelectedActivities = () =>
  createSelector(
    [makeGetActivityById(), selectedActivities],
    (activityById, selectedData) => {
      return selectedData
        .filter(selected => Boolean(activityById(selected.id)))
        .map(selected => {
          const selectedActivity = activityById(selected.id);
          return {
            ...selectedActivity,
            ...selected,
            total_price: selectedActivity
              ? selectedActivity.total_price * selected.qty
              : 0
          };
        });
    }
  );

export const makeGetSelectedActivityById = () =>
  createSelector([makeGetSelectedActivities()], selectedData => activityId =>
    selectedData.find(selected => selected.id === activityId)
  );
