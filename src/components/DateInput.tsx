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
import {
  handleFn,
  setDateSection,
  getNumberFromString,
  focusNext
} from "../utils/date";
import { log } from "util";

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
  private mouseDownEvent: boolean = false;

  setInputValue = (
    section: string,
    inputValue: string | undefined,
    newSubDateValue: string
  ): string | undefined => {
    if (inputValue == null) {
      return undefined;
    }
    const last: number = this.state.nameByPos.indexOf(section);
    const pos: [number, number] = this.state.posByName[
      this.state.nameByPos[last]
    ];

    const newInputValue: string | undefined = setDateSection(
      inputValue,
      newSubDateValue,
      pos[0],
      pos[1],
      section,
      this.props.placeholderChar
    );
    return newInputValue;
  };

  getDateSection = (
    section: string,
    inputValue: string | undefined
  ): string | undefined => {
    const last: number = this.state.nameByPos.indexOf(section);
    const pos: [number, number] = this.state.posByName[
      this.state.nameByPos[last]
    ];
    const dateSection: string | undefined = getNumberFromString(
      inputValue,
      pos[0],
      pos[1]
    );
    return dateSection != null ? dateSection : undefined;
  };

  handleSelect: React.ReactEventHandler<HTMLInputElement> = e => {
    const { selectionStart, selectionEnd } = e.currentTarget;
    if (selectionStart != null && selectionStart === selectionEnd) {
      // Select section on click
      const pos: [number, number] = this.state.posByName[
        this.state.nameByPos[selectionStart]
      ];
      e.currentTarget.setSelectionRange(pos[0], pos[1] - 1);
    }
  };

  moveOutInput = (target: EventTarget & HTMLInputElement) => {
    focusNext(target);
  };

  movePreviousSection = (
    target: EventTarget & HTMLInputElement,
    section: string
  ) => {
    const first: number = this.state.nameByPos.indexOf(section);
    if (first > 0) {
      const pos: [number, number] = this.state.posByName[
        this.state.nameByPos[first - 1]
      ];
      target.setSelectionRange(pos[0], pos[1] - 1);
    }
  };

  moveNextSection = (
    target: EventTarget & HTMLInputElement,
    section: string
  ) => {
    const { value } = target;
    return requestAnimationFrame(() => {
      const last = this.state.nameByPos.lastIndexOf(section);
      if (last < value.length) {
        const pos = this.state.posByName[this.state.nameByPos[last + 1]];
        target.setSelectionRange(pos[0], pos[1] - 1);
      }
    });
  };

  stayInSection = (
    target: EventTarget & HTMLInputElement,
    selectionStart: number,
    selectionEnd: number
  ) =>
    requestAnimationFrame(() =>
      target.setSelectionRange(selectionStart, selectionEnd)
    );

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

    const section: string = nameByPos[selectionStart];

    if (e.keyCode === 38 || e.keyCode === 40) {
      this.setState({ currentSection: "" });
      //increase or decrease section with up and down arrow
      if (section && upFn[section]) {
        this.props.onChange(
          upFn[section](this.props.value, e.keyCode === 38 ? 1 : -1)
        );
        this.stayInSection(target, selectionStart, selectionEnd);
      }
    } else if (e.keyCode === 39) {
      this.setState({ currentSection: "" });
      // move selection to next section
      this.moveNextSection(target, section);
    } else if (e.keyCode === 37) {
      this.setState({ currentSection: "" });
      // move selection to prev section
      this.movePreviousSection(target, section);
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
            //skip to next section
            if (subDate.moveToNextSection === true) {
              let subDateInt: number = parseInt(subDate.value);
              //change the state and format the date
              this.props.onChange(setFn[section](this.props.value, subDateInt));
              if (this.state.lastSection === section) {
                //skip out the input
                this.moveOutInput(target);
              } else {
                // move selection to next section
                this.moveNextSection(target, section);
              }
              //stay in the same place
            } else {
              this.setState(state => ({
                inputValue: this.setInputValue(
                  section,
                  state.inputValue,
                  subDate.value
                )
              }));
              this.stayInSection(target, selectionStart, selectionEnd);
            }
          }
          //if the user was already in the section
        } else {
          const subDate = handleFn[section](newSubValue, dateSubValue);
          if (subDate.moveToNextSection === true) {
            let subDateInt: number = parseInt(subDate.value);
            this.props.onChange(setFn[section](this.props.value, subDateInt));
            //skip out the input
            if (this.state.lastSection === section) {
              this.moveOutInput(target);
            } else {
              // move selection to next section
              this.moveNextSection(target, section);
            }
            //stay in the same place
          } else {
            this.setState(state => ({
              inputValue: this.setInputValue(
                section,
                state.inputValue,
                subDate.value
              )
            }));
            this.stayInSection(target, selectionStart, selectionEnd);
          }
        }
      }
    }
  };

  handleOnBlur: React.ChangeEventHandler<HTMLInputElement> = e => {
    this.mouseDownEvent = false;

    if (
      !isValid(parse(e.currentTarget.value, this.props.pattern, new Date()))
    ) {
      this.setState({
        inputValue: format(this.props.value || new Date(), this.props.pattern),
        currentSection: ""
      });
    }
  };

  handleOnFocus: React.FocusEventHandler<HTMLInputElement> = e => {
    if (!this.props.value) this.props.onChange(new Date());
    const target = e.target;
    if (e.relatedTarget && !this.mouseDownEvent)
      requestAnimationFrame(() =>
        target.setSelectionRange(
          0,
          this.state.posByName[this.state.nameByPos[0]][1] - 1
        )
      );
  };

  handleMouseDown: React.MouseEventHandler = () => (this.mouseDownEvent = true);

  render() {
    return (
      <input
        onSelect={this.handleSelect}
        onKeyDown={this.handleKeyDown}
        onChange={noop}
        onBlur={this.handleOnBlur}
        value={this.state.inputValue}
        onFocus={this.handleOnFocus}
        onMouseDown={this.handleMouseDown}
      />
    );
  }
}

function noop() {}
