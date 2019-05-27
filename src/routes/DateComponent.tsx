import * as React from "react";
import {
  format,
  addDays,
  addMonths,
  addYears,
  addHours,
  addMinutes,
  setDate,
  setMonth,
  setYear,
  setHours,
  setMinutes,
  getDate,
  getMonth,
  getYear,
  getHours,
  getMinutes
} from "date-fns";
import { handleFn, setDateSection, getNumberFromString } from "../utils/date";
import { log } from "util";
//import { Omit } from "./utils";
type Omit<T, K> = Pick<T, Exclude<keyof T, K>>;

type TPosByName = { [name: string]: [number, number] };

interface DateInputProps
  extends Omit<React.HTMLProps<HTMLInputElement>, "onChange" | "value"> {
  pattern: string;
  onChange(date: Date): void;
  value: Date;
}

interface DateInputState {
  pattern: string;
  posByName: TPosByName;
  nameByPos: string[];
  currentSection: string;
  currentSectionString: string;
  lastSection: string;
  inputValue: string | undefined;
  value: Date;
}

const re = /(y+|M+|d+|H+|m+)/g;

const upFn: { [k: string]: (date: Date | number, amount: number) => Date } = {
  yyyy: addYears,
  MM: addMonths,
  dd: addDays,
  HH: addHours,
  mm: addMinutes
};

const setFn: { [k: string]: (date: Date | number, amount: number) => Date } = {
  yyyy: setYear,
  MM: setMonth,
  dd: setDate,
  HH: setHours,
  mm: setMinutes
};

const getFn: { [k: string]: (date: number | Date) => number } = {
  yyyy: getYear,
  MM: getMonth,
  dd: getDate,
  HH: getHours,
  mm: getMinutes
};

class DateInput extends React.Component<DateInputProps, DateInputState> {
  static defaultProps = {
    //pattern: "MM/dd/yyyy"
    pattern: "yyyy/MM/dd HH:mm"
  };

  static getDerivedStateFromProps(
    { pattern, value }: Readonly<DateInputProps>,
    prevState: DateInputState
  ): Partial<DateInputState> | null {
    let state = null;
    if (pattern !== prevState.pattern) {
      let currentSection = "";
      let currentSectionString = "";
      let match;
      const nameByPos = new Array(pattern.length + 1);
      let posByName: { [name: string]: [number, number] } = {};
      while ((match = re.exec(pattern))) {
        const start = match.index;
        const end = re.lastIndex + 1;
        const name = match[0];
        nameByPos.fill(name, start, end);
        posByName[name] = [start, end];
      }
      let lastSection = nameByPos[nameByPos.length - 1];
      state = {
        pattern,
        posByName,
        nameByPos,
        currentSection,
        lastSection,
        currentSectionString
      };
    }
    if (value !== prevState.value) {
      state = { ...state, value };
    }
    if (pattern !== prevState.pattern || value !== prevState.value) {
      state = { ...state, inputValue: format(value, pattern) };
    }
    return state;
  }

  state = {} as DateInputState;

  handleSelect: React.ReactEventHandler<HTMLInputElement> = e => {
    const { selectionStart, selectionEnd } = e.currentTarget;
    if (selectionStart != null && selectionStart === selectionEnd) {
      // Select section on click
      const pos = this.state.posByName[this.state.nameByPos[selectionStart]];
      e.currentTarget.setSelectionRange(pos[0], pos[1] - 1);
    }
  };

  moveNextSection = (event: any, section: string) => {
    event.persist();
    return requestAnimationFrame(() => {
      const last = this.state.nameByPos.lastIndexOf(section);
      if (last < event.target.value.length) {
        const pos = this.state.posByName[this.state.nameByPos[last + 1]];
        event.target.setSelectionRange(pos[0], pos[1] - 1);
      }
    });
  };

  setInputValue = (
    section: string,
    inputValue: string | undefined,
    newSubDateValue: number
  ) => {
    if (inputValue == null) {
      return undefined;
    }
    const last = this.state.nameByPos.indexOf(section);
    const pos = this.state.posByName[this.state.nameByPos[last]];
    const newInputValue = setDateSection(
      inputValue,
      newSubDateValue,
      pos[0],
      pos[1],
      section
    );
    return newInputValue;
  };

  getDateSection = (section: string, inputValue: string | undefined) => {
    const last = this.state.nameByPos.indexOf(section);
    const pos = this.state.posByName[this.state.nameByPos[last]];
    const dateSection = getNumberFromString(inputValue, pos[0], pos[1]);
    return dateSection != null ? parseInt(dateSection) : undefined;
  };

  stayInSection = (event: any, selectionStart: any, selectionEnd: any) => {
    event.persist();
    return requestAnimationFrame(() =>
      event.target.setSelectionRange(selectionStart, selectionEnd)
    );
  };

  moveOutInput = (event: any) => {
    event.persist();
    this.setState({ currentSection: "" });
    event.target.blur();
  };

  movePreviousSection = (event: any, section: string) => {
    const first = this.state.nameByPos.indexOf(section);
    if (first > 0) {
      const pos = this.state.posByName[this.state.nameByPos[first - 1]];
      event.target.setSelectionRange(pos[0], pos[1] - 1);
    }
  };

  handleKeyDown: React.KeyboardEventHandler<HTMLInputElement> = e => {
    const target = e.currentTarget;
    const { selectionStart, selectionEnd, value } = target;
    if (selectionStart === null || selectionEnd === null) return;
    const { nameByPos, posByName } = this.state;

    if (e.keyCode !== 9) e.preventDefault();

    const section = nameByPos[selectionStart];

    if (e.keyCode === 38 || e.keyCode === 40) {
      this.setState({ currentSection: "" });
      //increase or decrease section with up and down arrow
      if (section && upFn[section]) {
        this.props.onChange(
          upFn[section](this.props.value, e.keyCode === 38 ? 1 : -1)
        );
        this.stayInSection(e, selectionStart, selectionEnd);
      }
    } else if (e.keyCode === 39) {
      this.setState({ currentSection: "" });
      // move selection to next section
      this.moveNextSection(e, section);
    } else if (e.keyCode === 37) {
      this.setState({ currentSection: "" });
      // move selection to prev section
      this.movePreviousSection(e, section);
    } else if (!isNaN(+e.key)) {
      let dateSubValue: number = getFn[section](this.props.value);
      console.log(
        "this.getDateSection(section,this.state.inputValue)",
        this.getDateSection(section, this.state.inputValue)
      );

      let newSubValue: number = parseInt(e.key);
      if (this.state.currentSection !== section) {
        this.setState({ currentSection: section });
        if (section && upFn[section]) {
          const subDate = handleFn[section](newSubValue);
          if (subDate.moveToNextSection === true) {
            this.props.onChange(
              setFn[section](this.props.value, subDate.value)
            );
            if (this.state.lastSection === section) {
              //skip out the input
              this.moveOutInput(e);
            } else {
              // move selection to next section
              this.moveNextSection(e, section);
            }
            //stay in the same place
          } else {
            this.setState(() => {
              return {
                inputValue: this.setInputValue(
                  section,
                  this.state.inputValue,
                  subDate.value
                )
              };
            });
            this.stayInSection(e, selectionStart, selectionEnd);
          }
        }
      } else {
        const subDate = handleFn[section](newSubValue, dateSubValue);
        if (subDate.moveToNextSection === true) {
          this.props.onChange(setFn[section](this.props.value, subDate.value));
          //skip out the input
          if (this.state.lastSection === section) {
            this.moveOutInput(e);
          } else {
            // move selection to next section
            this.moveNextSection(e, section);
          }
          //stay in the same place
        } else {
          this.stayInSection(e, selectionStart, selectionEnd);
        }
      }
    }
  };

  handleChange: React.ChangeEventHandler<HTMLInputElement> = e => {
    console.log(e.currentTarget.value);
  };

  render() {
    const { pattern, value } = this.props;
    console.log("this.state", this.state);
    return (
      <input
        onSelect={this.handleSelect}
        onKeyDown={this.handleKeyDown}
        onChange={this.handleChange}
        //onBlur
        value={this.state.inputValue}
      />
    );
  }
}

export default function App() {
  const [date, setDate] = React.useState(new Date());
  return (
    <div className="App">
      <DateInput value={date} onChange={setDate} />
    </div>
  );
}
