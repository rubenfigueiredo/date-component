
type SetInputDate = (
    keyboardValue: string,
    monthValue?: string
) => { value: string; moveToNextSection: boolean }
//handles value for month section and evaluates if it should skip o the next section
export const setInputMonth: SetInputDate = (
    keyboardValue: string,
    monthValue?: string
) => {
    let moveToNextSection: boolean = false;
    //if its an entry value
    if (monthValue == null) {
        if (parseInt(keyboardValue) > 1) {
            moveToNextSection = true;
            keyboardValue = editMonthForFormatting(keyboardValue);
        }
        return { value: keyboardValue, moveToNextSection };
        //if its not an entry value
    } else {
        //because the month in js starts with 0
        let newMonthValue: string;
        let tempIntSubValue: string = concatenateStrings(
            monthValue,
            keyboardValue
        );
        if (parseInt(tempIntSubValue) <= 12) {
            newMonthValue = tempIntSubValue;
        } else {
            newMonthValue = keyboardValue;
        }
        return { value: editMonthForFormatting(newMonthValue), moveToNextSection: true };
    }
};
//formatting is always a number less
export const editMonthForFormatting = (month: string) => {
    let monthInt: number = parseInt(month);
    monthInt--;
    return monthInt.toString();
}
//handles value for Day section and evaluates if it should skip o the next section
export const setInputDay: SetInputDate = (keyboardValue: string, monthValue?: string): { value: string; moveToNextSection: boolean } => {
    //if its an entry value in the section
    let moveToNextSection: boolean = false;
    if (monthValue == null) {
        if (parseInt(keyboardValue) > 3) {
            moveToNextSection = true;
        }
        return { value: keyboardValue, moveToNextSection };
    } else {
        //if its not an entry value in the section
        let newDayValue: string;
        let tempIntSubValue: string = concatenateStrings(
            monthValue,
            keyboardValue
        );
        if (parseInt(tempIntSubValue) <= 31) {
            newDayValue = tempIntSubValue;
        } else {
            newDayValue = keyboardValue
        }
        return { value: newDayValue, moveToNextSection: true };
    }
}
//handles value for Year section and evaluates if it should skip o the next section
export const setInputYear: SetInputDate = (keyboardValue: string, yearValue?: string): { value: string; moveToNextSection: boolean } => {
    let moveToNextSection: boolean = false;
    //if its an entry value in the section
    if (yearValue == null) {
        return { value: keyboardValue, moveToNextSection };
    } else {
        //if its not an entry value in the section
        if (yearValue.length === 3) {
            return { value: concatenateStrings(yearValue, keyboardValue), moveToNextSection: true };
        } else if (yearValue.length < 3) {
            return { value: concatenateStrings(yearValue, keyboardValue), moveToNextSection: false };
        }
        else {
            return { value: keyboardValue, moveToNextSection: true };
        }
    }
}
//handles value for Hour section and evaluates if it should skip o the next section
export const setInputHour: SetInputDate = (keyboardValue: string, hourValue?: string) => {
    let moveToNextSection = false;
    if (hourValue == null) {
        if (parseInt(keyboardValue) > 2) {
            moveToNextSection = true;
        }
        return { value: keyboardValue, moveToNextSection };
    } else {
        //if its not an entry value in the section
        let newHourValue: string;
        let tempIntSubValue: string = concatenateStrings(
            hourValue,
            keyboardValue
        );
        if (parseInt(tempIntSubValue) <= 23) {
            newHourValue = tempIntSubValue;
        } else {
            newHourValue = keyboardValue
        }
        return { value: newHourValue, moveToNextSection: true };
    }
}
//handles value for minutes section and evaluates if it should skip o the next section
export const setInputMinutes: SetInputDate = (keyboardValue: string, minuteValue?: string) => {
    let moveToNextSection = false;
    if (minuteValue == null) {
        if (parseInt(keyboardValue) > 5) {
            moveToNextSection = true;
        }
        return { value: keyboardValue, moveToNextSection };
    } else {
        let newMinuteValue: string;
        let tempIntSubValue: string = concatenateStrings(
            minuteValue,
            keyboardValue
        );
        if (parseInt(tempIntSubValue) <= 59) {
            newMinuteValue = tempIntSubValue;
        } else {
            newMinuteValue = keyboardValue
        }
        return { value: newMinuteValue, moveToNextSection: true };
    }
}
//adds a number from keyboard to the existing date
export const concatenateStrings = (
    dateSectionValue: string,
    keyboardValue: string
): string => {
    let newStringSubValue: string =
        dateSectionValue + keyboardValue;
    return newStringSubValue;
};

export const replaceNumberInDate = (string: string, number: string, firstPosition: number, lastPosition: number) =>
    string.substring(0, firstPosition) + number + string.substring(lastPosition - 1, string.length);

export const setDateSection = (date: string, newSubDateValue: string, startingPosition: number, endingPosition: number, section: string, char: string) => {
    //edit section
    let numberOfExtraFields = section.length - newSubDateValue.length;

    for (let index = 0; index < numberOfExtraFields; index++) {
        newSubDateValue = newSubDateValue + char;
    }
    let newInputValueSubString: string | null = null;
    if (date != null) {
        newInputValueSubString = replaceNumberInDate(date, newSubDateValue, startingPosition, endingPosition)//replaceNumberInSection(substring, newSubDateValue);
    }
    return newInputValueSubString != null
        ? newInputValueSubString
        : undefined;
}

export const focusNext = (el: Element) => {
    const all = document.body.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    if (all.length) {
        const i =
            Array.prototype.findIndex.call(all, (t: Element) => t === el) + 1;
        const element = all[i < all.length ? i : 0] as HTMLElement;
        element.focus();
    }
};

export const getNumberFromString = (string: string | undefined, startingPosition: number, endingPosition: number) => {
    if (string == null) {
        return undefined;
    }
    let substring = string.substring(startingPosition, endingPosition);
    let intFromSubString = substring.match(/\d+/g);
    return intFromSubString != null ? intFromSubString[0] : undefined;
}

export const setInputDate: Record<string, SetInputDate> = {
    "MM": setInputMonth,
    "dd": setInputDay,
    "yyyy": setInputYear,
    "HH": setInputHour,
    "mm": setInputMinutes
}