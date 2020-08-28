import { createSelector } from "reselect";
import { makeGetTotalDays } from "../details/selectors";
import {
  makeGetSelectedSeasons,
  makeGetSelectedSeasonById
} from "../seasons/selectors";
import { makeGetSelectedSupplier } from "../suppliers/selectors";

const dataMatrix = state => state.matrix.data;

// filter matrix by supplier and owner
export const makeGetMatrix = () =>
  createSelector(
    [makeGetSelectedSupplier(), dataMatrix],
    (supplier, data) => (owner, foreignId) => {
      if (!supplier.id) {
        return data.filter(
          matrix =>
            matrix.owner === owner &&
            matrix.owner_id === foreignId &&
            !matrix.archived
        );
      }

      return data.filter(
        matrix =>
          matrix.supplier_id === supplier.id &&
          matrix.owner === owner &&
          matrix.owner_id === foreignId &&
          !matrix.archived
      );
    }
  );

// filter by selected seasons and calculate total counter
export const makeGetMatrixBySelectedSeasons = () =>
  createSelector(
    [
      makeGetTotalDays(),
      makeGetSelectedSeasons(),
      makeGetSelectedSeasonById(),
      makeGetMatrix()
    ],
    (totalDays, seasons, season, matrix) => (owner, foreignId, counter) => {
      const matchMatrix = matrix(owner, foreignId);

      return matchMatrix
        .filter(pricing => {
          // always return default season pricing if season doesn't exists
          return Boolean(season(pricing.season_id)) || !pricing.season_id;
        })
        .map(pricing => {
          // calculate total counter within each selected season
          let totalCounter = 0;

          if (seasons.length) {
            if (!pricing.season_id) {
              // if we got default season, calculate total counter with total days subtracted by total days in default seasons
              const totalDaysInSeasons = seasons
                .map(s => s.total_days)
                .reduce((a, b) => a + b);

              totalCounter = counter * (totalDays - totalDaysInSeasons);
            } else {
              // otherwise calculate total counter with total days in season
              totalCounter = counter * season(pricing.season_id).total_days;
            }
          } else {
            // if no seasons at all, calculate by total days
            totalCounter = counter * totalDays;
          }

          return {
            ...pricing,
            total_counter: totalCounter
          };
        });
    }
  );

// filter by total counter
export const makeGetMatrixByCounter = () =>
  createSelector(
    [makeGetMatrixBySelectedSeasons()],
    matrixBySeasons => (owner, foreignId, counter) => {
      const matchMatrix = matrixBySeasons(owner, foreignId, counter);

      return matchMatrix
        .filter(pricing => {
          // filter counter by total counter
          return pricing.total_counter >= pricing.counter;
        })
        .sort((a, b) => b.counter - a.counter) // sort counter DESC
        .reduce((unique, o) => {
          // and only take the maxium one by remove duplicates
          if (!unique.some(obj => obj.season_id === o.season_id)) {
            unique.push(o);
          }
          return unique;
        }, []);
    }
  );

// calculate total price
export const makeGetPricing = () =>
  createSelector(
    [makeGetMatrixByCounter()],
    matrixByCounter => (owner, foreignId, counter) => {
      const matrix = matrixByCounter(owner, foreignId, counter);

      return matrix.map(pricing => {
        return {
          ...pricing,
          total_price: pricing.price * pricing.total_counter
        };
      });
    }
  );
