import { createSelector } from "reselect";

const supplierId = state => state.details.supplier_id;
const dataSuppliers = state => state.suppliers.data;

export const makeGetSuppliers = () =>
  createSelector([dataSuppliers], data => {
    return data.filter(supplier => !supplier.archived);
  });

export const makeGetSelectedSupplier = () =>
  createSelector([supplierId, makeGetSuppliers()], (id, data) => {
    if (!id) {
      return {};
    }

    return data.find(supplier => supplier.id === id);
  });

export const makeGetSupplierById = () =>
  createSelector([makeGetSuppliers()], data => id => {
    if (!id) {
      return {};
    }

    return data.find(supplier => supplier.id === id);
  });
