import { createSelector } from "reselect";
import moment from "moment";

const fromDate = state => state.details.from_date;
const toDate = state => state.details.to_date;

export const makeGetTotalDays = () =>
  createSelector([fromDate, toDate], (from, to) => {
    if (!(from && to)) {
      return 0;
    }

    const departureDate = moment(from, "YYYY-MM-DD");
    const returnDate = moment(to, "YYYY-MM-DD");

    return returnDate.diff(departureDate, "days") + 1;
  });

export const makeGetTotalNights = () =>
  createSelector([makeGetTotalDays()], totalDays => {
    if (!totalDays) {
      return 0;
    }

    return totalDays - 1;
  });
