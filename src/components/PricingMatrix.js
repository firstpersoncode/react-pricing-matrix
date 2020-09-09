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
  const [headers, setHeaders] = useState(
    value.headers && value.headers.length ? value.headers : [0]
  );

  const [pricing, setPricing] = useState(
    value.pricing && value.pricing.length
      ? value.pricing
      : [{ value: 1, seasons: [{ season_id: 0, price: 0 }] }]
  );

  // const updateDefaultPrice = e => {
  //   const { value } = e.target;
  //   setDefaultPrice(parseInt(value));
  //
  //   let currPricing = [].concat(pricing);
  //   const indexCounters = currPricing.findIndex(p => parseInt(p.value) === 1);
  //   const indexSeasons = currPricing[indexCounters].seasons.findIndex(
  //     s => parseInt(s.season_id) === 0
  //   );
  //   currPricing[indexCounters].seasons[indexSeasons].price = parseInt(value);
  //   setPricing(currPricing);
  // };

  const addSeason = id => {
    let currPricing = [].concat(pricing);
    let index = 0;
    for (let counter of currPricing) {
      currPricing[index].seasons = [
        ...currPricing[index].seasons,
        {
          season_id: parseInt(id),
          price: 0
        }
      ];
      index++;
    }

    setPricing(currPricing);
  };

  const removeSeason = id => {
    let currPricing = [].concat(pricing);
    let index = 0;
    for (let counter of currPricing) {
      currPricing[index].seasons = currPricing[index].seasons.filter(
        pricing => parseInt(pricing.season_id) !== parseInt(id)
      );
      index++;
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
    let currPricing = [].concat(pricing);

    let newCounterSeasons = [];
    for (let seasonId of headers) {
      newCounterSeasons = [
        ...newCounterSeasons,
        {
          season_id: parseInt(seasonId),
          price: 0
        }
      ];
    }

    currPricing = [
      ...currPricing,
      {
        value: currPricing[currPricing.length - 1].value + 1,
        seasons: newCounterSeasons
      }
    ];

    setPricing(currPricing);
  };

  const removeCounter = index => {
    let currPricing = [].concat(pricing);
    currPricing = currPricing.filter((_, i) => i !== index);

    setPricing(currPricing);
  };

  const updateCounter = index => e => {
    const value = parseInt(e.target.value || 1) || 1;
    let currPricing = [].concat(pricing);

    if (currPricing.map(c => c.value).includes(value)) {
      return;
    }

    currPricing[index] = {
      ...currPricing[index],
      value
    };

    setPricing(currPricing);
  };

  const updatePrice = (indexCounters, indexSeasons) => e => {
    let currPricing = [].concat(pricing);
    currPricing[indexCounters].seasons[indexSeasons].price = parseInt(
      e.target.value
    );
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
        let currPricing = [].concat(pricing);
        let currHeaders = [].concat(headers);
        for (let header of headersWithoutDefaultSeason) {
          let index = 0;
          for (let counter of currPricing) {
            currPricing[index].seasons = currPricing[index].seasons.filter(
              pricing => parseInt(pricing.season_id) !== parseInt(header)
            );
            index++;
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

  return (
    <>
      {/*<TextField
        label="Default price"
        type="number"
        value={0}
        variant="outlined"
        onChange={updateDefaultPrice}
      />*/}
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
                      style={{
                        color: "white"
                      }}
                    >
                      <Box display="flex" justifyContent="space-between">
                        {filteredSeasons.find(
                          season => parseInt(season.value) === parseInt(header)
                        ) ? (
                          <IconButton
                            onClick={() => removeHeader(header)}
                            size="small"
                            color="secondary"
                          >
                            <Cancel fontSize="small" />
                          </IconButton>
                        ) : null}

                        {filteredSeasons.find(
                          season => parseInt(season.value) === parseInt(header)
                        ) ? (
                          <Box flexGrow={1}>
                            {
                              filteredSeasons.find(
                                season =>
                                  parseInt(season.value) === parseInt(header)
                              ).text
                            }
                          </Box>
                        ) : (
                          <Box flexGrow={1}>Default</Box>
                        )}
                      </Box>
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {pricing.map((counter, index) => (
                  <TableRow>
                    <TableCell style={{ width: 75, position: "relative" }}>
                      {index > 0 ? (
                        <Box position="absolute" top={0} left={0}>
                          <IconButton
                            onClick={() => removeCounter(index)}
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
                          value={counter.value}
                          variant="outlined"
                          disabled={parseInt(counter.value) === 1}
                          onChange={updateCounter(index)}
                        />
                      </Box>
                    </TableCell>
                    {counter.seasons.map((row, i) => (
                      <TableCell style={{ width: 75 }}>
                        <TextField
                          type="number"
                          value={row.price}
                          variant="outlined"
                          // disabled={i < 1 && parseInt(counter.value) === 1}
                          onChange={updatePrice(index, i)}
                        />
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Box my={1}>
            <Button color="primary" onClick={addCounter}>
              Add counter
            </Button>
          </Box>
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
