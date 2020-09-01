import { useState } from "react";
import { bindActionCreators } from "redux";
import { useSelector, useDispatch } from "react-redux";

import { setData as setActivityData } from "../store/reducers/activities/actions";
import { setData as setMatrixData } from "../store/reducers/matrix/actions";
import {
  makeGetActivities,
  makeGetActivityById
} from "../store/reducers/activities/selectors";
import { makeGetMatrix } from "../store/reducers/matrix/selectors";

export default function useDashboardActivityState() {
  const getActivities = makeGetActivities();
  const getActivityById = makeGetActivityById();
  const getMatrix = makeGetMatrix();

  const { activities, activityById, matrix } = useSelector(state => ({
    activities: getActivities(state),
    activityById: getActivityById(state),
    matrix: getMatrix(state)
  }));

  const dispatch = useDispatch();
  const { setActivity, setMatrix } = bindActionCreators(
    { setActivity: setActivityData, setMatrix: setMatrixData },
    dispatch
  );

  const [dialogAddActivity, setDialogAddActivity] = useState(false);

  const toggleDialogAddActivity = () => {
    setActivityFields({ name: "", supplier_id: 0, dive: 0, matrix: {} });
    setDialogAddActivity(!dialogAddActivity);
  };

  const [activityFields, setActivityFields] = useState({});
  const updateActivityFields = field => {
    return e => {
      if (field === "archived") {
        const { checked } = e.target;
        setActivityFields(state => ({ ...state, [field]: checked }));
        return;
      }

      if (field === "matrix") {
        setActivityFields(state => ({ ...state, [field]: e }));
        return;
      }

      const { value } = e.target;
      if (field === "supplier_id" || field === "dive") {
        setActivityFields(state => ({ ...state, [field]: Number(value) }));
        return;
      }

      setActivityFields(state => ({ ...state, [field]: value }));
    };
  };

  const submitActivityData = e => {
    e.preventDefault();
    let newActivityFields = {};
    for (let field in activityFields) {
      if (field !== "matrix") {
        newActivityFields = {
          ...newActivityFields,
          [field]: activityFields[field]
        };
      }
    }
    const newActivity = setActivity({ ...newActivityFields });
    let { matrix } = activityFields;

    // const counters = Object.keys(matrix.pricing);
    const counters = matrix.pricing;

    for (let counter of counters) {
      for (let row of counter.seasons) {
        setMatrix({
          supplier_id: parseInt(activityFields.supplier_id),
          season_id: parseInt(row.season_id),
          counter: parseInt(counter.value),
          price: parseInt(row.price),
          owner: "activity",
          owner_id: parseInt(newActivity.id)
        });
      }
    }

    setDialogAddActivity(false);
    setActivityFields({});
  };

  const [selectedActivityId, setSelectedActivityId] = useState(0);
  const [dialogEditActivity, setDialogEditActivity] = useState(false);

  const toggleDialogEditActivity = async id => {
    if (!isNaN(id)) {
      setSelectedActivityId(id);
      const activity = activityById(id);

      const fields = ["name", "supplier_id", "dive", "archived"];
      for (let field in activity) {
        if (fields.includes(field)) {
          await setActivityFields(state => ({
            ...state,
            [field]: activity[field]
          }));
        }
      }

      const matchPricing = matrix("activity", activity.id);

      let matrixObject = {};
      let matrixPricing = [];
      for (let pricing of matchPricing) {
        const matchPricingByCounter = matchPricing
          .filter(p => p.counter === pricing.counter)
          .map(p => ({
            id: p.id,
            season_id: p.season_id,
            price: p.price
          }));

        // matrixObject = {
        //   ...matrixObject,
        //   pricing: {
        //     ...matrixObject.pricing,
        //     [pricing.counter]: matchPricingByCounter
        //   }
        // };
        matrixPricing = [
          ...matrixPricing,
          { value: pricing.counter, seasons: matchPricingByCounter }
        ];
      }
      let headers = [];
      for (let pricing of matchPricing) {
        headers = [...headers, pricing.season_id];
      }
      matrixObject = {
        pricing: matrixPricing
          .map(e => e.value)
          .map((e, i, final) => final.indexOf(e) === i && i)
          .filter(e => matrixPricing[e])
          .map(e => matrixPricing[e]),
        headers: headers.filter((value, index, self) => {
          return self.indexOf(value) === index;
        })
      };

      setActivityFields(state => ({
        ...state,
        matrix: matrixObject
      }));
    }

    setDialogEditActivity(!dialogEditActivity);
  };

  const updateActivityData = e => {
    e.preventDefault();
    const activity = activityById(selectedActivityId);
    let updateActivityFields = {};
    for (let field in activityFields) {
      if (field !== "matrix") {
        updateActivityFields = {
          ...updateActivityFields,
          [field]: activityFields[field]
        };
      }
    }

    let matrixFields = activityFields.matrix;
    // const counters = Object.keys(matrixFields.pricing);
    const counters = matrixFields.pricing;
    const matchPricing = matrix("activity", activity.id);
    const currPricingIds = matchPricing.map(pricing => pricing.id);

    let availablePricingIds = [];
    for (let counter of counters) {
      for (let row of counter.seasons) {
        const pricing = setMatrix({
          ...(row.id ? { id: parseInt(row.id) } : {}),
          supplier_id: parseInt(updateActivityFields.supplier_id),
          season_id: parseInt(row.season_id),
          counter: parseInt(counter.value),
          price: parseInt(row.price),
          owner: "activity",
          owner_id: parseInt(activity.id)
          // archived
        });

        availablePricingIds = [...availablePricingIds, pricing.id];
      }
    }

    if (currPricingIds.length) {
      for (let pricingId of currPricingIds) {
        setMatrix({
          id: pricingId,
          archived:
            !availablePricingIds.length ||
            !availablePricingIds.includes(pricingId)
        });
        // if (!availablePricingIds.length) {
        //   setMatrix({
        //     id: pricingId,
        //     archived: true
        //   });
        // } else if (
        //   availablePricingIds.length &&
        //   !availablePricingIds.includes(pricingId)
        // ) {
        //   setMatrix({
        //     id: pricingId,
        //     archived: true
        //   });
        // }
      }
    }

    setActivity({
      ...activity,
      ...updateActivityFields
    });

    setDialogEditActivity(false);
    setActivityFields({});
  };

  const [dialogDeleteActivity, setDialogDeleteActivity] = useState(false);

  const toggleDialogDeleteActivity = id => {
    if (!isNaN(id)) {
      setSelectedActivityId(id);
    }
    setDialogDeleteActivity(!dialogDeleteActivity);
  };

  const deleteActivityData = () => {
    const activity = activityById(selectedActivityId);
    setActivity({
      ...activity,
      archived: true
    });
    setDialogDeleteActivity(false);
  };

  return {
    activities,
    toggleDialogAddActivity,
    toggleDialogEditActivity,
    toggleDialogDeleteActivity,
    dialogAddActivity,
    dialogEditActivity,
    dialogDeleteActivity,
    submitActivityData,
    updateActivityData,
    deleteActivityData,
    updateActivityFields,
    activityFields,
    selectedActivityId
  };
}
