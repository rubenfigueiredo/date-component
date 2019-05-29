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
  getMinutes,
  isValid,
  parse
} from "date-fns";
import { handleFn, setDateSection, getNumberFromString } from "../utils/date";

//import { Omit } from "./utils";
type Omit<T, K> = Pick<T, Exclude<keyof T, K>>;

type TPosByName = { [name: string]: [number, number] };

interface DateInputProps
  extends Omit<React.HTMLProps<HTMLInputElement>, "onChange" | "value"> {
  pattern: string;
  onChange(date: Date | null): void;
  value: Date;
  placeholderChar: string;
}

interface DateInputState {
  pattern: string;
  posByName: TPosByName;
  nameByPos: string[];
  currentSection: string;
  currentSectionString?: string;
  lastSection: string;
  inputValue: string | undefined;
  value: Date;
}

const re = /(yyyy|MM|dd|HH|mm)/g;
const reP = /(y|M|d|H|m)/g;

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

export class DateInput extends React.Component<DateInputProps, DateInputState> {
  static defaultProps = {
    //pattern: "MM/dd/yyyy"
    pattern: "yyyy-MM-dd HH:mm",
    placeholderChar: "-"
  };

  static getDerivedStateFromProps(
    { pattern, value, placeholderChar }: Readonly<DateInputProps>,
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
      state =
        value == null
          ? { ...state, inputValue: pattern.replace(reP, placeholderChar) }
          : { ...state, inputValue: format(value, pattern) };
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
    newSubDateValue: string
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
      section,
      this.props.placeholderChar
    );
    return newInputValue;
  };

  getDateSection = (section: string, inputValue: string | undefined) => {
    const last = this.state.nameByPos.indexOf(section);
    const pos = this.state.posByName[this.state.nameByPos[last]];
    const dateSection = getNumberFromString(inputValue, pos[0], pos[1]);
    return dateSection != null ? dateSection : undefined;
  };

  stayInSection = (event: any, selectionStart: any, selectionEnd: any) => {
    event.persist();
    return requestAnimationFrame(() =>
      event.target.setSelectionRange(selectionStart, selectionEnd)
    );
  };

  focusNext = (el: Element) => {
    const all = document.body.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    if (all.length) {
      const i =
        Array.prototype.findIndex.call(all, (t: Element) => t === el) + 1;
      console.log("all[i < all.length ? i : 0]", all[i < all.length ? i : 0]);

      const element = all[i < all.length ? i : 0] as HTMLElement;
      element.focus();
    }
  };

  moveOutInput = (event: any) => {
    this.focusNext(event.target);
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
    const { selectionStart, selectionEnd } = target;

    if (selectionStart === null || selectionEnd === null) return;
    const { nameByPos } = this.state;

    if (e.keyCode !== 9) e.preventDefault();

    if (e.keyCode === 8) {
      this.props.onChange(null);
      target.blur();
    }

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
      //if its a number
    } else if (!isNaN(+e.key)) {
      let dateSubValue: string | undefined = this.getDateSection(
        section,
        this.state.inputValue
      );

      if (dateSubValue != null) {
        let newSubValue: string = e.key;
        //if the user enters the section
        if (this.state.currentSection !== section) {
          this.setState({ currentSection: section });
          if (section && upFn[section]) {
            const subDate = handleFn[section](newSubValue);
            if (subDate.moveToNextSection === true) {
              let subDateInt: number = parseInt(subDate.value);
              section === "MM" && --subDateInt;
              this.props.onChange(setFn[section](this.props.value, subDateInt));
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
          //if the user was already in the section
        } else {
          const subDate = handleFn[section](newSubValue, dateSubValue);
          if (subDate.moveToNextSection === true) {
            let subDateInt: number = parseInt(subDate.value);
            section === "MM" && --subDateInt;
            this.props.onChange(setFn[section](this.props.value, subDateInt));
            //skip out the input
            if (this.state.lastSection === section) {
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
      }
    }
  };

  handleOnBlur: React.ChangeEventHandler<HTMLInputElement> = e => {
    let value = this.props.value ? this.props.value : new Date();
    !isValid(parse(e.currentTarget.value, this.props.pattern, new Date())) &&
      this.setState({
        inputValue: format(value /*this.props.value*/, this.props.pattern),
        currentSection: ""
      });
  };

  handleChange: React.ChangeEventHandler<HTMLInputElement> = e => {
    console.log(e.currentTarget.value);
  };

  handleOnFocus: React.FocusEventHandler<HTMLInputElement> = e => {
    !this.props.value && this.props.onChange(new Date());
    const target = e.target;
    if (e.relatedTarget)
      requestAnimationFrame(() =>
        target.setSelectionRange(
          0,
          this.state.posByName[this.state.nameByPos[0]][1] - 1
        )
      );
  };

  render() {
    console.log("this.state.inputValue", this.state.inputValue);
    return (
      <input
        onSelect={this.handleSelect}
        onKeyDown={this.handleKeyDown}
        onChange={this.handleChange}
        onBlur={this.handleOnBlur}
        value={this.state.inputValue}
        onFocus={this.handleOnFocus}
      />
    );
  }
}
