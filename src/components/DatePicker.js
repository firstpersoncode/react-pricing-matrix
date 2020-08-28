import moment from "moment";
import React from "react";
import DateFnsUtils from "@date-io/date-fns";
import {
  MuiPickersUtilsProvider,
  // KeyboardTimePicker,
  KeyboardDatePicker
} from "@material-ui/pickers";

export default function DatePicker({ name, label, value, onChange }) {
  const [selectedDate, setSelectedDate] = React.useState(
    value ? new Date(moment(value, "YYYY-MM-DD")) : null
  );

  const handleDateChange = date => {
    setSelectedDate(date);
    onChange(moment(date).format("YYYY-MM-DD"));
  };
  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <KeyboardDatePicker
        disableToolbar
        variant="inline"
        format="yyyy/MM/dd"
        id={name}
        label={label}
        value={selectedDate}
        onChange={handleDateChange}
        KeyboardButtonProps={{
          "aria-label": "change date"
        }}
      />
    </MuiPickersUtilsProvider>
  );
}
