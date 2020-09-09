import React, { useState } from "react";
import moment from "moment";
import { useSelector } from "react-redux";
import { Box, Card, CardContent, Divider, Button } from "@material-ui/core";
import { Check } from "@material-ui/icons";
import { makeGetTotalDays } from "../store/reducers/details/selectors";
import { makeGetMatrix } from "../store/reducers/matrix/selectors";
import { makeGetSeasonById } from "../store/reducers/seasons/selectors";

import Modal from "./Modal";

export default function BookActivityCard({ activity, children }) {
  const getTotalDays = makeGetTotalDays();
  const getSeasonById = makeGetSeasonById();
  const getMatrixByOwnerId = makeGetMatrix();
  const { totalDays, getSeason, getMatrix } = useSelector(state => ({
    totalDays: getTotalDays(state),
    getSeason: getSeasonById(state),
    getMatrix: getMatrixByOwnerId(state)
  }));
  const [dialog, setDialog] = useState(false);

  const toggleDialog = () => {
    setDialog(!dialog);
  };

  return (
    <>
      <Card>
        <Box p={3}>
          <h3>{activity.name}</h3>
          <CardContent>
            <p>
              {totalDays * activity.dive} dives ({activity.dive} dive /day)
            </p>
            <h3>US${activity.total_price} /pax</h3>
            <Button onClick={toggleDialog} size="small" color="primary">
              <strong>See pricing</strong>
            </Button>
          </CardContent>
          {children}
        </Box>
      </Card>

      <Modal maxWidth="sm" open={dialog} onClose={toggleDialog}>
        <h2>Price: US${activity.total_price}</h2>
        <ul style={{ listStyle: "none" }}>
          {getMatrix("activity", activity.id, activity.supplier_id).map(
            (price, i) => (
              <li
                key={i}
                style={{
                  position: "relative",
                  opacity: Boolean(
                    activity.pricing &&
                      activity.pricing.length &&
                      activity.pricing.find(p => p.id === price.id)
                  )
                    ? "1"
                    : "0.5"
                }}
              >
                {Boolean(
                  activity.pricing &&
                    activity.pricing.length &&
                    activity.pricing.find(p => p.id === price.id)
                ) ? (
                  <Box position="absolute" top={0} left={-30}>
                    <Check color="primary" />
                  </Box>
                ) : null}

                {!price.season_id ? (
                  <h4>Default pricing</h4>
                ) : (
                  <h4>
                    {getSeason(price.season_id).name}{" "}
                    <span style={{ fontWeight: "normal" }}>
                      (
                      {moment(
                        getSeason(price.season_id).from,
                        "YYYY-MM-DD"
                      ).format("D MMM YYYY")}{" "}
                      -{" "}
                      {moment(
                        getSeason(price.season_id).to,
                        "YYYY-MM-DD"
                      ).format("D MMM YYYY")}
                      )
                    </span>
                  </h4>
                )}

                <p>
                  Minimum {price.counter} {price.counter > 1 ? "dives" : "dive"}
                  : <strong>US${price.price} /dive</strong>
                </p>
                {Boolean(
                  activity.pricing &&
                    activity.pricing.length &&
                    activity.pricing.find(p => p.id === price.id)
                ) ? (
                  <>
                    <p>
                      Got{" "}
                      <strong>
                        {activity.pricing &&
                          activity.pricing.length &&
                          activity.pricing.find(p => p.id === price.id)
                            .total_counter}{" "}
                        dives
                      </strong>{" "}
                      within selected dates
                    </p>
                    <p>
                      Total price for{" "}
                      <strong>
                        {activity.pricing &&
                          activity.pricing.length &&
                          activity.pricing.find(p => p.id === price.id)
                            .total_counter}{" "}
                        dives
                      </strong>
                      :{" "}
                      <strong>
                        US$
                        {activity.pricing &&
                          activity.pricing.length &&
                          activity.pricing.find(p => p.id === price.id)
                            .total_price}
                      </strong>
                    </p>
                  </>
                ) : null}
                <Divider />
              </li>
            )
          )}
        </ul>
      </Modal>
    </>
  );
}
