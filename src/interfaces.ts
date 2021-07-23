/**
 * Interface for the calendar template that is passed to the HTML for rendering
 */
import {
    LeapYearRules,
    NoteRepeat,
    GameWorldTimeIntegrations,
    SocketTypes,
    MoonIcons,
    MoonYearResetOptions, GameSystems, YearNamingRules, TimeKeeperStatus
} from "./constants";
import {Note} from "./classes/note";
import DateSelector from "./classes/date-selector";

/**
 * The general settings for the Simple calendar
 * NOTE: The Player note default visibility is not stored in these settings (Legacy support)
 */
export interface GeneralSettings {
    /** How Simple Calendar interacts with the game world time */
    gameWorldTimeIntegration: GameWorldTimeIntegrations;
    /** If to show the clock below the calendar */
    showClock: boolean;
    /** If the Pathfinder 2e world clock sync is turned on */
    pf2eSync: boolean;
    /** What roles/players are allows to do certain actions */
    permissions: {
        /** Who can view the calendar */
        viewCalendar: PermissionMatrix,
        /** Who can add notes */
        addNotes: PermissionMatrix,
        /** Who can reorder notes */
        reorderNotes: PermissionMatrix,
        /** Who can change the date and time */
        changeDateTime: PermissionMatrix
    };
    playersAddNotes?: boolean;
}

export interface PermissionMatrix {
    player: boolean;
    trustedPlayer: boolean;
    assistantGameMaster: boolean;
    users?: string[]
}

export interface CalendarConfiguration {
    name: string;
    generalSettings: GeneralSettings;
    year: YearConfig;
}

export interface CalendarTemplate {
    isGM: boolean;
    changeDateTime: boolean;
    isPrimary: boolean;
    addNotes: boolean;
    reorderNotes: boolean;
    currentYear: YearTemplate;
    showSelectedDay: boolean;
    showCurrentDay: boolean;
    showSetCurrentDate: boolean;
    notes: NoteTemplate[];
    clockClass: string;
    timeUnits: any;
    compactView: boolean;
    compactViewShowNotes: boolean;
}

/**
 * Interface for the year template that is passed to the HTML for rendering
 */
export interface YearTemplate {
    gameSystem: GameSystems;
    /** The display text of the year */
    display: string;
    /** The display text for the selected, or current, year */
    selectedDisplayYear: string;
    /** The display text for the selected, or current, month */
    selectedDisplayMonth: string;
    /** The display text for the selected, or current, day */
    selectedDisplayDay: string;
    selectedDayOfWeek: string;
    selectedDayMoons: any[];
    selectedDayNotes: { reminders: number; normal: number; };
    yearZero: number;
    /** The numeric representation of the year */
    numericRepresentation: number;
    /** The months that make up the year */
    visibleMonth: MonthTemplate | undefined;
    /** If to show the weekday headers on the calendar view */
    showWeekdayHeaders: boolean;
    /** The days of the week */
    weekdays: WeekdayTemplate[];

    firstWeekday: number;

    showClock: boolean;

    clockClass: string;

    showTimeControls: boolean;

    showDateControls: boolean;

    currentTime: TimeTemplate;

    currentSeasonName: string;

    currentSeasonColor: string;

    weeks: (boolean | DayTemplate)[][];

    yearNames: string[];
    yearNamesStart: number;
    yearNamingRule: YearNamingRules;
}

/**
 * Interface for the data saved to the game settings for a year class
 */
export interface YearConfig {
    numericRepresentation: number;
    prefix: string;
    postfix: string;
    showWeekdayHeadings: boolean;
    firstWeekday: number;
    yearZero: number;
    yearNames: string[];
    yearNamesStart: number;
    yearNamingRule: YearNamingRules
}

/**
 * Interface for the month template that is passed to the HTML for rendering
 */
export interface  MonthTemplate {
    display: string;
    name: string;
    numericRepresentation: number;
    numericRepresentationOffset: number;
    current: boolean;
    visible: boolean;
    selected: boolean;
    days: DayTemplate[];
    numberOfDays: number;
    numberOfLeapYearDays: number;
    intercalary: boolean;
    intercalaryInclude: boolean;
    showAdvanced: boolean;
    startingWeekday: number | null;
}

/**
 * Interface for the data saved to the game settings for a month class
 */
export interface MonthConfig {
    name: string;
    numericRepresentation: number;
    numericRepresentationOffset: number;
    numberOfDays: number;
    numberOfLeapYearDays: number;
    intercalary: boolean;
    intercalaryInclude: boolean;
    startingWeekday: number | null;
}

/**
 * Interface for the day template that is passed to the HTML for rendering
 */
export interface DayTemplate {
    /** The display name of the day */
    name: string;
    /** The numeric representation of the day */
    numericRepresentation: number;
    /** If this day is the current day */
    current: boolean;
    /** If this day has been selected */
    selected: boolean;
}

/**
 * Interface for the data saved to the game settings for the current date
 */
export interface CurrentDateConfig {
    /** The current year */
    year: number;
    /** The current month */
    month: number;
    /** The current day */
    day: number
    /** The current time of day */
    seconds: number
}

/**
 * Interface for the note template that is passed to the HTML for rendering
 */
export interface NoteTemplate {
    title: string;
    content: string;
    playerVisible: boolean;
    author: string;
    authorDisplay: any | null;
    monthDisplay: string;
    id: string;
    displayDate: string;
    allDay: boolean;
    hour: number;
    minute: number;
    endDate: DateTimeParts;
    order: number;
    categories: NoteCategory[];
    reminder: boolean;
}

/**
 * Interface for the data saved to the game settings for a note
 */
export interface NoteConfig {
    year: number;
    month: number;
    day: number;
    title: string;
    content: string;
    author: string;
    monthDisplay: string;
    playerVisible: boolean;
    id: string;
    repeats: NoteRepeat;
    allDay: boolean;
    hour: number;
    minute: number;
    endDate: DateTimeParts;
    order: number;
    categories: string[];
    remindUsers: string[];
}

/**
 * Categories used for notes
 */
export interface NoteCategory {
    name: string;
    color: string;
    textColor: string;
}

/**
 * Interface for the weekday template that is passed to the HTML for rendering
 */
export interface WeekdayTemplate {
    name: string;
    firstCharacter: string;
    numericRepresentation: number;
}

/**
 * Interface for the data saved to the game settings for each weekday class
 */
export interface WeekdayConfig {
    name: string;
    numericRepresentation: number;
}

/**
 * Interface for the data save to the game settings for the leap year information
 */
export interface LeapYearConfig {
    rule: LeapYearRules;
    customMod: number;
}

/**
 * Interface for the data saved to the game settings for the time information
 */
export interface TimeConfig {
    hoursInDay: number;
    minutesInHour: number;
    secondsInMinute: number;
    gameTimeRatio: number;
    unifyGameAndClockPause: boolean;
    updateFrequency: number;
}

/**
 * Interface for displaying the time information
 */
export interface TimeTemplate {
    hour: string;
    minute: string;
    second: string;
}

/**
 * Interface for displaying the season information
 */
export interface SeasonTemplate {
    name: string;
    startingMonth: number;
    startingDay: number;
    color: string;
    dayList: DayTemplate[];
}

/**
 * Interface for saving season information
 */
export interface SeasonConfiguration {
    name: string;
    startingMonth: number;
    startingDay: number;
    color: string;
    customColor?: string;
}

/**
 * Interface for a moon phase
 */
export interface MoonPhase {
    name: string;
    length: number;
    singleDay: boolean;
    icon: MoonIcons;
}

/**
 * Interface for a moons first new moon date
 */
export interface FirstNewMoonDate {
    yearReset: MoonYearResetOptions;
    year: number;
    yearX: number;
    month: number;
    day: number;
}

/**
 * Interface for a moons configuration
 */
export interface MoonConfiguration {
    name: string;
    cycleLength: number;
    phases: MoonPhase[];
    firstNewMoon: FirstNewMoonDate;
    color: string;
    cycleDayAdjust: number;
}

/**
 * Interface for a moons template
 */
export interface MoonTemplate {
    name: string;
    cycleLength: number;
    firstNewMoon: FirstNewMoonDate;
    phases: MoonPhase[];
    color: string;
    cycleDayAdjust: number;
    dayList: DayTemplate[];
}

export interface DateTimeParts {
    year: number;
    month: number;
    day: number;
    hour: number;
    minute: number;
    seconds: number;
}

export interface NoteRepeats {
    0: string,
    1?: string,
    2?: string,
    3?: string
}

export interface DateTime{
    year?: number;
    month?: number;
    day?: number;
    hour?: number;
    minute?: number;
    second?: number;
}

/**
 * Namespace for our own socket information
 */
export namespace SimpleCalendarSocket{

    /**
     * Interface for the data that is sent with each socket
     */
    export interface Data {
        type: SocketTypes;
        data: SimpleCalendarSocketJournal|SimpleCalendarSocketTime|SimpleCalendarPrimary|SimpleCalendarSocketDateTime|SimpleCalendarSocketDate;
    }

    export interface SimpleCalendarSocketDateTime{
        dataType: String;
        isNext: boolean;
        amount: number;
        unit: string;
    }

    export interface SimpleCalendarSocketDate{
        year: number;
        month: number;
        day: number;
    }

    /**
     * Interface for socket data that has to do with the time
     */
    export interface SimpleCalendarSocketTime{
        timeKeeperStatus: TimeKeeperStatus;
    }

    /**
     * Interface for socket data that has to do with journals
     */
    export interface SimpleCalendarSocketJournal{
        notes: Note[];
    }

    /**
     * Interface for a GM to take over being the primary source
     */
    export interface SimpleCalendarPrimary{
        primaryCheck?: boolean;
        amPrimary?: boolean;
    }
}

export namespace SCDateSelector {
    export interface SelectorList {
        [key: string]: DateSelector;
    }

    export interface Options {
        placeHolderText?: string;
        onDateSelect?: Function;
        rangeSelect?: boolean;
        showDate: boolean;
        showTime: boolean;
    }

    export interface Date{
        year: number;
        month: number;
        day: number;
        hour: number;
        minute: number;
        allDay: boolean;
    }

    export interface SelectedDate {
        visibleDate: SCDateSelector.Date;
        startDate: SCDateSelector.Date;
        endDate: SCDateSelector.Date;
    }
}

/**
 * Interfaces that have to do with the about time classes
 * These are not apart of our interface unit tests
 */
export namespace AboutTimeImport {
    /**
     * The about-time calendar object
     */
    export interface Calendar {
        "clock_start_year": number;
        "first_day": number;
        "hours_per_day": number;
        "seconds_per_minute": number;
        "minutes_per_hour": number;
        "has_year_0": boolean;
        "month_len": MonthList;
        "_month_len": {},
        "weekdays": string[],
        "leap_year_rule": string;
        "notes": {};
    }

    /**
     * Calendar month list
     */
    export interface MonthList{
        [key: string]: Month
    }

    /**
     * About time month object
     */
    export interface Month {
        "days": number[];
        "intercalary": boolean;
    }
}

/**
 * Interfaces that have to do with the calendar/weather classes
 * These are not apart of our interface unit tests
 */
export namespace CalendarWeatherImport{
    /**
     * Calendar/Weather month class
     */
    export interface Month {
        name: string;
        length: number | string;
        leapLength: number | string;
        isNumbered: boolean;
        abbrev: string;
    }

    /**
     * Calendar/Weather date class
     */
    export interface Date {
        year: string;
        month: string;
        day: number;
        combined: string;
        hours: number;
        minutes: number
        seconds: number;
    }

    /**
     * Calendar/Weather weather class
     */
    export interface Weather {
        humidity: number;
        temp: number;
        lastTemp: number;
        season: string;
        seasonColor: string;
        seasonTemp: number;
        seasonHumidity: number;
        seasonRolltable: string;
        climate: string;
        climateTemp: number;
        climateHumidity: number;
        precipitation: string;
        dawn: number;
        dusk: number;
        isVolcanic: boolean;
        outputToChat: boolean;
        weatherFx: [];
        isC: boolean;
        cTemp: string;
        tempRange: {
            max: number;
            min: number;
        }
    }

    /**
     * Calendar/Weather seasons class
     */
    export interface Seasons {
        name: string;
        rolltable: string;
        date: Date;
        temp: string;
        humidity: string;
        color: string;
        dawn: number;
        dusk: number;
    }

    /**
     * Calendar/Weather moon class
     */
    export interface Moons {
        name: string;
        cycleLength: number;
        cyclePercent: number;
        lunarEclipseChange: number;
        solarEclipseChange: number;
        referenceTime: number;
        referencePercent: number;
        isWaxing: boolean;
    }

    /**
     * Calendar/Weather event class
     */
    export interface Event {
        name: string;
        text: string;
        allDay: boolean;
        date: Date;
    }

    /**
     * Calendar/Weather calendar class
     */
    export interface Calendar {
        months: Month[];
        daysOfTheWeek: string[];
        year: number;
        day: number;
        numDayOfTheWeek: number;
        first_day: number;
        currentMonth: number;
        currentWeekday: string;
        dateWordy: string;
        era: string;
        dayLength: number;
        timeDisp: string;
        dateNum: string;
        weather: Weather;
        seasons: Seasons[];
        moons: Moons[];
        events: Event[];
        reEvents: Event[];
    }
}
