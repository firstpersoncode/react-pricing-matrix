import React, { useState, useEffect } from "react";
import {
  Box,
  Paper,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  FormControl,
  Select,
  Button,
  IconButton,
  TextField
} from "@material-ui/core";
import { Cancel } from "@material-ui/icons";

export default function PricingMatrix({
  selectedSupplierId,
  seasons,
  onChange,
  value
}) {
  const [headers, setHeaders] = useState(value.headers || [0]);
  const [pricing, setPricing] = useState(
    value.pricing || { 1: [{ season_id: 0, price: 0 }] }
  );

  const addSeason = id => {
    let currPricing = Object.assign({}, pricing);

    for (let counter in currPricing) {
      currPricing[counter].push({
        season_id: parseInt(id),
        price: 0
      });
    }

    setPricing(currPricing);
  };

  const removeSeason = id => {
    let currPricing = Object.assign({}, pricing);

    for (let counter in currPricing) {
      currPricing[counter] = currPricing[counter].filter(
        pricing => parseInt(pricing.season_id) !== parseInt(id)
      );
    }

    setPricing(currPricing);
  };

  const addHeader = id => {
    setHeaders(state => [...state, parseInt(id)]);
    addSeason(id);
  };

  const removeHeader = id => {
    // console.log(id);
    let currHeaders = [].concat(headers);
    currHeaders = currHeaders.filter(
      header => parseInt(header) !== parseInt(id)
    );
    setHeaders(currHeaders);
    removeSeason(id);
  };

  const addCounter = () => {
    let currPricing = Object.assign({}, pricing);
    let newCounterRow = [];
    for (let seasonId of headers) {
      newCounterRow = [
        ...newCounterRow,
        {
          season_id: parseInt(seasonId),
          price: 0
        }
      ];
    }

    setPricing(state => ({
      ...state,
      [parseInt(Object.keys(currPricing)[Object.keys(currPricing).length - 1]) +
      1]: newCounterRow
    }));
  };

  const removeCounter = index => {
    let currPricing = Object.assign({}, pricing);
    const counter = Object.keys(currPricing).find((counter, i) => i === index);
    delete currPricing[counter];

    setPricing(currPricing);
  };

  const updateCounter = index => e => {
    let currPricing = Object.assign({}, pricing);
    const counter = Object.keys(currPricing).find((counter, i) => i === index);
    const temp = [].concat(currPricing[counter]);
    delete currPricing[counter];

    setPricing({ ...currPricing, [parseInt(e.target.value || 1)]: temp });
  };

  const updatePrice = (counter, i) => e => {
    let currPricing = Object.assign({}, pricing);
    currPricing[counter][i].price = parseInt(e.target.value);
    setPricing(currPricing);
  };

  const filteredSeasons = seasons.filter(
    season => parseInt(season.supplier_id) === parseInt(selectedSupplierId)
  );

  const resetPricingOnSupplierChange = () => {
    const headersWithoutDefaultSeason = headers.filter(header =>
      Boolean(parseInt(header))
    );
    if (headersWithoutDefaultSeason.length) {
      const selectedSeasons = seasons.filter(season =>
        headersWithoutDefaultSeason.includes(parseInt(season.value))
      );

      const filteredSeasons = selectedSeasons.filter(
        season => parseInt(season.supplier_id) === parseInt(selectedSupplierId)
      );

      if (!filteredSeasons.length) {
        // setHeaders([0]);
        // setPricing({ 1: [{ season_id: 0, price: 0 }] });
        let currPricing = Object.assign({}, pricing);
        let currHeaders = [].concat(headers);
        for (let header of headersWithoutDefaultSeason) {
          for (let counter in currPricing) {
            currPricing[counter] = currPricing[counter].filter(
              pricing => parseInt(pricing.season_id) !== parseInt(header)
            );
          }

          currHeaders = currHeaders.filter(
            h => parseInt(h) !== parseInt(header)
          );
        }

        setHeaders(currHeaders);
        setPricing(currPricing);
      }
    }
  };

  useEffect(() => {
    if (selectedSupplierId) {
      resetPricingOnSupplierChange();
    }
  }, [selectedSupplierId]);

  useEffect(() => {
    onChange({ pricing, headers });
  }, [pricing, headers]);

  // console.log(headers);

  return (
    <>
      <Box
        display="flex"
        style={{
          opacity: !selectedSupplierId ? 0.2 : 1,
          pointerEvents: !selectedSupplierId ? "none" : "auto"
        }}
        my={2}
      >
        <Box mr={2}>
          <TableContainer component={Paper}>
            <Table size="small">
              <TableHead style={{ backgroundColor: "black" }}>
                <TableRow>
                  <TableCell style={{ color: "white" }}>Counter</TableCell>
                  {headers.map(header => (
                    <TableCell
                      style={{ position: "relative", color: "white" }}
                      align="right"
                    >
                      {filteredSeasons.find(
                        season => parseInt(season.value) === parseInt(header)
                      )
                        ? filteredSeasons.find(
                            season =>
                              parseInt(season.value) === parseInt(header)
                          ).text
                        : "Default season"}
                      {filteredSeasons.find(
                        season => parseInt(season.value) === parseInt(header)
                      ) ? (
                        <Box position="absolute" top={0} left={0}>
                          <IconButton
                            onClick={() => removeHeader(header)}
                            size="small"
                            color="secondary"
                          >
                            <Cancel fontSize="small" />
                          </IconButton>
                        </Box>
                      ) : null}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {Object.keys(pricing).map((counter, i) => (
                  <TableRow>
                    <TableCell style={{ width: 80, position: "relative" }}>
                      {i > 0 ? (
                        <Box position="absolute" top={0} left={0}>
                          <IconButton
                            onClick={() => removeCounter(i)}
                            size="small"
                            color="secondary"
                          >
                            <Cancel fontSize="small" />
                          </IconButton>
                        </Box>
                      ) : null}
                      <Box>
                        <TextField
                          type="number"
                          value={counter}
                          variant="outlined"
                          onChange={updateCounter(i)}
                        />
                      </Box>
                    </TableCell>
                    {pricing[counter].map((row, i) => (
                      <TableCell style={{ width: 100 }} align="right">
                        <TextField
                          type="number"
                          value={row.price}
                          variant="outlined"
                          onChange={updatePrice(counter, i)}
                        />
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Button color="primary" size="small" onClick={addCounter}>
            Add counter
          </Button>
        </Box>
        <FormControl>
          <Select native value="" onChange={e => addHeader(e.target.value)}>
            <option value="">Add season</option>
            {filteredSeasons
              .filter(season => !headers.includes(parseInt(season.value)))
              .map(season => (
                <option value={season.value}>{season.text}</option>
              ))}
          </Select>
        </FormControl>
      </Box>
    </>
  );
}
