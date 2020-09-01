import "date-fns";
import React, { useState } from "react";
import {
  FormControl,
  Select,
  FormControlLabel,
  InputLabel,
  Checkbox,
  TextField,
  Box
} from "@material-ui/core";

import PricingMatrix from "./PricingMatrix";
import DatePicker from "./DatePicker";

export default function Form({ seasons, fields, onSubmit, onChange }) {
  return (
    <form onSubmit={onSubmit}>
      {fields.map((field, i) => {
        if (field.type === "matrix") {
          return (
            <Box key={field.name + "-" + i} my={2}>
              {field.label ? (
                <InputLabel htmlFor={field.name}>{field.label}</InputLabel>
              ) : null}
              <Box my={2}>
                <PricingMatrix
                  value={field.value}
                  onChange={onChange(field.name)}
                  selectedSupplierId={
                    fields.find(field => field.name === "supplier_id")
                      ? fields.find(field => field.name === "supplier_id").value
                      : 0
                  }
                  seasons={field.options}
                />
              </Box>
            </Box>
          );
        }

        if (field.type === "number") {
          return (
            <Box key={field.name + "-" + i} my={2}>
              <TextField
                type="number"
                id={field.name}
                name={field.name}
                label={field.label}
                value={field.value}
                onChange={onChange(field.name)}
                variant="outlined"
              />
            </Box>
          );
        }

        if (field.type === "select") {
          return (
            <Box key={field.name + "-" + i} my={2}>
              <FormControl>
                {field.label ? (
                  <InputLabel htmlFor={field.name}>{field.label}</InputLabel>
                ) : null}
                <Select
                  native
                  value={field.value}
                  onChange={onChange(field.name)}
                  inputProps={{
                    name: field.name,
                    id: field.name
                  }}
                >
                  <option value=""></option>
                  {field.options.map(option => (
                    <option value={option.value}>{option.text}</option>
                  ))}
                </Select>
              </FormControl>
            </Box>
          );
        }

        if (field.type === "date") {
          return (
            <Box key={field.name + "-" + i} my={2}>
              <DatePicker
                name={field.name}
                label={field.label}
                value={field.value}
                onChange={onChange(field.name)}
              />
            </Box>
          );
        }

        if (field.type === "checkbox") {
          return (
            <Box key={field.name + "-" + i} my={2}>
              <FormControlLabel
                control={
                  <Checkbox
                    color="primary"
                    checked={field.value}
                    onChange={onChange(field.name)}
                    name={field.name}
                  />
                }
                label={field.name}
              />
            </Box>
          );
        }

        return (
          <Box key={field.name + "-" + i} my={2}>
            <TextField
              fullWidth
              type={field.type}
              id={field.name}
              label={field.label}
              value={field.value}
              onChange={onChange(field.name)}
            />
          </Box>
        );
      })}
    </form>
  );
}
