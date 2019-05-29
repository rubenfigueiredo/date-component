import * as React from "react";
import { DateInput } from "../components/DateInput";

export default function App() {
  const [date, setDate]: any = React.useState();
  const [date2, setDate2]: any = React.useState();
  return (
    <div className="App">
      <DateInput value={date} onChange={setDate} />
      <DateInput value={date2} onChange={setDate2} />
      <button onClick={() => setDate(null)}>Reset</button>
    </div>
  );
}
