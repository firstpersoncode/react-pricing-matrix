import { useState } from "react";
import { bindActionCreators } from "redux";
import { useSelector, useDispatch } from "react-redux";

import { setData as setSeasonData } from "../store/reducers/seasons/actions";
import {
  makeGetSeasons,
  makeGetSeasonById
} from "../store/reducers/seasons/selectors";

export default function useSeasonState() {
  const getSeasons = makeGetSeasons();
  const getSeasonById = makeGetSeasonById();

  const { seasons, seasonById } = useSelector(state => ({
    seasons: getSeasons(state),
    seasonById: getSeasonById(state)
  }));

  const dispatch = useDispatch();
  const { setSeason } = bindActionCreators(
    { setSeason: setSeasonData },
    dispatch
  );

  const [dialogAddSeason, setDialogAddSeason] = useState(false);

  const toggleDialogAddSeason = () => {
    setSeasonFields({ name: "", supplier_id: 0, from: "", to: "" });
    setDialogAddSeason(!dialogAddSeason);
  };

  const [seasonFields, setSeasonFields] = useState({});
  const updateSeasonFields = field => {
    return e => {
      if (field === "archived") {
        const { checked } = e.target;
        setSeasonFields(state => ({ ...state, [field]: checked }));
        return;
      }

      if (field === "from" || field === "to") {
        setSeasonFields(state => ({ ...state, [field]: e }));
        return;
      }

      const { value } = e.target;
      if (field === "supplier_id") {
        setSeasonFields(state => ({ ...state, [field]: Number(value) }));
        return;
      }

      setSeasonFields(state => ({ ...state, [field]: value }));
    };
  };

  const submitSeasonData = e => {
    e.preventDefault();
    setSeason({ ...seasonFields });
    setDialogAddSeason(false);
    setSeasonFields({});
  };

  const [selectedSeasonId, setSelectedSeasonId] = useState(0);
  const [dialogEditSeason, setDialogEditSeason] = useState(false);

  const toggleDialogEditSeason = async id => {
    if (!isNaN(id)) {
      setSelectedSeasonId(id);
      const season = seasonById(id);
      const fields = ["name", "supplier_id", "from", "to", "archived"];
      for (let field in season) {
        if (fields.includes(field)) {
          await setSeasonFields(state => ({
            ...state,
            [field]: season[field]
          }));
        }
      }
    }

    setDialogEditSeason(!dialogEditSeason);
  };

  const updateSeasonData = e => {
    e.preventDefault();
    const season = seasonById(selectedSeasonId);
    setSeason({
      ...season,
      ...seasonFields
    });
    setDialogEditSeason(false);
    setSeasonFields({});
  };

  const [dialogDeleteSeason, setDialogDeleteSeason] = useState(false);

  const toggleDialogDeleteSeason = id => {
    if (!isNaN(id)) {
      setSelectedSeasonId(id);
    }
    setDialogDeleteSeason(!dialogDeleteSeason);
  };

  const deleteSeasonData = () => {
    const season = seasonById(selectedSeasonId);
    setSeason({
      ...season,
      archived: true
    });
    setDialogDeleteSeason(false);
  };

  return {
    seasons,
    toggleDialogAddSeason,
    toggleDialogEditSeason,
    toggleDialogDeleteSeason,
    dialogAddSeason,
    dialogEditSeason,
    dialogDeleteSeason,
    submitSeasonData,
    updateSeasonData,
    deleteSeasonData,
    updateSeasonFields,
    seasonFields,
    selectedSeasonId
  };
}
