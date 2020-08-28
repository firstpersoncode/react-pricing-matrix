import { createSelector } from "reselect";
import Moment from "moment";
import { extendMoment } from "moment-range";
import { makeGetSelectedSupplier } from "../suppliers/selectors";

const moment = extendMoment(Moment);

const fromDate = state => state.details.from_date;
const toDate = state => state.details.to_date;
const dataSeasons = state => state.seasons.data;

// filter seasons by supplier, or return all seasons
export const makeGetSeasons = () =>
  createSelector([makeGetSelectedSupplier(), dataSeasons], (supplier, data) => {
    if (!supplier.id) {
      return data.filter(season => !season.archived);
    }

    return data.filter(
      season => season.supplier_id === supplier.id && !season.archived
    );
  });

export const makeGetSeasonById = () =>
  createSelector([makeGetSeasons()], seasons => id =>
    seasons.find(season => season.id === id)
  );

// filter seasons by departure date and return date
export const makeGetSeasonsBySelectedDates = () =>
  createSelector([makeGetSeasons(), fromDate, toDate], (seasons, from, to) => {
    const departureDate = moment(from, "YYYY-MM-DD");
    const returnDate = moment(to, "YYYY-MM-DD");

    const dateRange = moment.range(departureDate, returnDate);

    return seasons.filter(season => {
      const startSeason = moment(season.from, "YYYY-MM-DD");
      const endSeason = moment(season.to, "YYYY-MM-DD");
      const seasonRange = moment.range(startSeason, endSeason);

      return (
        startSeason.within(dateRange) ||
        endSeason.within(dateRange) ||
        departureDate.within(seasonRange) ||
        returnDate.within(seasonRange)
      );
    });
  });

// get seasons with calculated total days
export const makeGetSelectedSeasons = () =>
  createSelector(
    [makeGetSeasonsBySelectedDates(), fromDate, toDate],
    (seasonsBySelectedDates, from, to) => {
      return seasonsBySelectedDates.map(season => {
        const departureDate = moment(from, "YYYY-MM-DD");
        const returnDate = moment(to, "YYYY-MM-DD");
        const startSeason = moment(season.from, "YYYY-MM-DD");
        const endSeason = moment(season.to, "YYYY-MM-DD");
        const seasonRange = moment.range(startSeason, endSeason);
        let totalDays = 0;

        if (
          departureDate.within(seasonRange) &&
          returnDate.within(seasonRange)
        ) {
          // calculate total days by return date and departure date if not overlap within season range
          totalDays = returnDate.diff(departureDate, "days") + 1;
        } else if (
          departureDate.within(seasonRange) &&
          !returnDate.within(seasonRange)
        ) {
          // calculate total days by end season date and departure date if return date overlap within season range
          totalDays = endSeason.diff(departureDate, "days") + 1;
        } else if (
          !departureDate.within(seasonRange) &&
          returnDate.within(seasonRange)
        ) {
          // calculate total days by start season date and return date if departure date overlap within season range
          totalDays = returnDate.diff(startSeason, "days") + 1;
        } else {
          // calculate total days by start season date and end season date by default
          totalDays = endSeason.diff(startSeason, "days") + 1;
        }

        return {
          ...season,
          total_days: totalDays
        };
      });
    }
  );

export const makeGetSelectedSeasonById = () =>
  createSelector([makeGetSelectedSeasons()], seasons => id =>
    seasons.find(season => season.id === id)
  );
