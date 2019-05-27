
type HandleFn = (
    keyboardValue: number,
    monthValue?: number
) => { value: number; moveToNextSection: boolean }

export const handleMonth: HandleFn = (
    keyboardValue: number,
    monthValue?: number
) => {
    let moveToNextSection: boolean = false;
    //if its an entry value
    if (monthValue == null) {
        if (keyboardValue !== 1) {
            moveToNextSection = true;
        }
        return { value: --keyboardValue, moveToNextSection };
        //if its not an entry value
    } else {
        //because the month in js starts with 0
        monthValue++;
        moveToNextSection = true;
        let newMonthValue: number;
        let tempIntSubValue: number = addDigitToDateSection(
            monthValue,
            keyboardValue
        );
        if (tempIntSubValue <= 12) {
            newMonthValue = tempIntSubValue;
        } else {
            newMonthValue = keyboardValue;
        }
        return { value: --newMonthValue, moveToNextSection };
    }
};

export const handleDay: HandleFn = (keyboardValue: number, monthValue?: number): { value: number; moveToNextSection: boolean } => {
    //if its an entry value in the section
    let moveToNextSection: boolean = false;
    if (monthValue == null) {
        if (keyboardValue > 3) {
            moveToNextSection = true;
        }
        return { value: keyboardValue, moveToNextSection };
    } else {
        //if its not an entry value in the section
        moveToNextSection = true;
        let newDayValue: number;
        let tempIntSubValue: number = addDigitToDateSection(
            monthValue,
            keyboardValue
        );
        if (tempIntSubValue <= 31) {
            newDayValue = tempIntSubValue;
        } else {
            newDayValue = keyboardValue
        }
        return { value: newDayValue, moveToNextSection };
    }
}

export const handleYear: HandleFn = (keyboardValue: number, yearValue?: number): { value: number; moveToNextSection: boolean } => {
    let moveToNextSection: boolean = false;
    //if its an entry value in the section
    if (yearValue == null) {
        return { value: keyboardValue, moveToNextSection };
    } else {
        //if its not an entry value in the section
        if (getNumberLength(yearValue) === 3) {
            moveToNextSection = true;
            let newYearValue: number = addDigitToDateSection(yearValue, keyboardValue);
            return { value: newYearValue, moveToNextSection };
        } else if (getNumberLength(yearValue) < 3) {
            moveToNextSection = false;
            let newYearValue: number = addDigitToDateSection(yearValue, keyboardValue);
            return { value: newYearValue, moveToNextSection };
        }
        else {
            moveToNextSection = true;
            return { value: keyboardValue, moveToNextSection };
        }
    }
}

export const handleHour: HandleFn = (keyboardValue: number, hourValue?: number) => {
    let moveToNextSection = false;
    if (hourValue == null) {
        if (keyboardValue > 2) {
            moveToNextSection = true;
        }
        return { value: keyboardValue, moveToNextSection };
    } else {
        //if its not an entry value in the section
        moveToNextSection = true;
        let newHourValue: number;
        let tempIntSubValue: number = addDigitToDateSection(
            hourValue,
            keyboardValue
        );
        if (tempIntSubValue <= 23) {
            newHourValue = tempIntSubValue;
        } else {
            newHourValue = keyboardValue
        }
        return { value: newHourValue, moveToNextSection };
    }
}

export const handleMinutes: HandleFn = (keyboardValue: number, minuteValue?: number) => {
    let moveToNextSection = false;
    if (minuteValue == null) {
        if (keyboardValue > 5) {
            moveToNextSection = true;
        }
        return { value: keyboardValue, moveToNextSection };
    } else {
        //if its not an entry value in the section
        moveToNextSection = true;
        let newMinuteValue: number;
        let tempIntSubValue: number = addDigitToDateSection(
            minuteValue,
            keyboardValue
        );
        return { value: tempIntSubValue, moveToNextSection };
    }
}

const addDigitToDateSection = (
    dateSectionValue: number,
    keyboardValue: number
): number => {
    let newStringSubValue: string =
        dateSectionValue.toString() + keyboardValue.toString();
    return parseInt(newStringSubValue);
};

const getNumberLength = (number: number) => number.toString().length;
export const setDateSection = (date: string, newSubDateValue: number, startingPosition: number, endingPosition: number, section: string) => {
    let firstSubStringPart = date.substring(0, startingPosition);
    let lastSubstringPart = date.substring(endingPosition, date.length);
    let substring = date.substring(startingPosition, endingPosition);
    let intFromSubString = substring.match(/\d+/g);
    let newSubDateValueString = newSubDateValue.toString();
    let numberOfExtraFields = section.length - getNumberLength(newSubDateValue);
    for (let index = 0; index < numberOfExtraFields; index++) {
        newSubDateValueString = newSubDateValueString + "-";
    }
    let newInputValueSubString =
        intFromSubString != null
            ? substring.replace(intFromSubString[0], newSubDateValueString)
            : undefined;
    let newInputValue =
        newInputValueSubString != null
            ? firstSubStringPart + newInputValueSubString + lastSubstringPart
            : undefined;
    return newInputValue;
}

export const getNumberFromString = (string: string | undefined, startingPosition: number, endingPosition: number) => {
    if (string == null) {
        return undefined;
    }
    let substring = string.substring(startingPosition, endingPosition);
    let intFromSubString = substring.match(/\d+/g);
    return intFromSubString != null ? intFromSubString[0] : undefined;
}

export const handleFn: Record<string, HandleFn> = {
    "MM": handleMonth,
    "dd": handleDay,
    "yyyy": handleYear,
    "HH": handleHour,
    "mm": handleMinutes
}