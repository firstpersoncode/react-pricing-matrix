import { useState } from "react";
import { bindActionCreators } from "redux";
import { useSelector, useDispatch } from "react-redux";

import { setData as setSupplierData } from "../store/reducers/suppliers/actions";
import {
  makeGetSuppliers,
  makeGetSupplierById
} from "../store/reducers/suppliers/selectors";

export default function useDashboardSupplierState() {
  const getSuppliers = makeGetSuppliers();
  const getSupplierById = makeGetSupplierById();

  const { suppliers, supplierById } = useSelector(state => ({
    suppliers: getSuppliers(state),
    supplierById: getSupplierById(state)
  }));

  const dispatch = useDispatch();
  const { setSupplier } = bindActionCreators(
    { setSupplier: setSupplierData },
    dispatch
  );

  const [dialogAddSupplier, setDialogAddSupplier] = useState(false);

  const toggleDialogAddSupplier = () => {
    setSupplierFields({ name: "" });
    setDialogAddSupplier(!dialogAddSupplier);
  };

  const [supplierFields, setSupplierFields] = useState({});
  const updateSupplierFields = field => {
    return e => {
      if (field === "archived") {
        const { checked } = e.target;
        setSupplierFields(state => ({ ...state, [field]: checked }));
        return;
      }

      const { value } = e.target;
      setSupplierFields(state => ({ ...state, [field]: value }));
    };
  };

  const submitSupplierData = e => {
    e.preventDefault();
    setSupplier({ ...supplierFields });
    setDialogAddSupplier(false);
    setSupplierFields({});
  };

  const [selectedSupplierId, setSelectedSupplierId] = useState(0);
  const [dialogEditSupplier, setDialogEditSupplier] = useState(false);

  const toggleDialogEditSupplier = async id => {
    if (!isNaN(id)) {
      setSelectedSupplierId(id);
      const supplier = supplierById(id);
      const fields = ["name", "archived"];
      for (let field in supplier) {
        if (fields.includes(field)) {
          await setSupplierFields(state => ({
            ...state,
            [field]: supplier[field]
          }));
        }
      }
    }

    setDialogEditSupplier(!dialogEditSupplier);
  };

  const updateSupplierData = e => {
    e.preventDefault();
    const supplier = supplierById(selectedSupplierId);
    setSupplier({
      ...supplier,
      ...supplierFields
    });
    setDialogEditSupplier(false);
    setSupplierFields({});
  };

  const [dialogDeleteSupplier, setDialogDeleteSupplier] = useState(false);

  const toggleDialogDeleteSupplier = id => {
    if (!isNaN(id)) {
      setSelectedSupplierId(id);
    }
    setDialogDeleteSupplier(!dialogDeleteSupplier);
  };

  const deleteSupplierData = () => {
    const supplier = supplierById(selectedSupplierId);
    setSupplier({
      ...supplier,
      archived: true
    });
    setDialogDeleteSupplier(false);
  };

  return {
    suppliers,
    toggleDialogAddSupplier,
    toggleDialogEditSupplier,
    toggleDialogDeleteSupplier,
    dialogAddSupplier,
    dialogEditSupplier,
    dialogDeleteSupplier,
    submitSupplierData,
    updateSupplierData,
    deleteSupplierData,
    updateSupplierFields,
    supplierFields,
    selectedSupplierId
  };
}
