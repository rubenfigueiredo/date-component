import * as React from "react";
import { DateInput } from "../components/DateInput";

export default function App() {
  const [date, setDate]: any = React.useState();
  const [date2, setDate2]: any = React.useState();
  return (
    <div className="App">
      <div style={{ width: "100%", margin: "auto", height: "80px" }}>
        <DateInput value={date} onChange={setDate} />
      </div>
      <div style={{ width: "100%", margin: "auto", height: "80px" }}>
        <DateInput value={date2} onChange={setDate2} />
      </div>
      <button onClick={() => setDate(null)}>Reset</button>
    </div>
  );
}
