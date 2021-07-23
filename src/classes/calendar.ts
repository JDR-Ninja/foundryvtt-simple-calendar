import Year from "./year";
import {Note} from "./note";
import {CalendarConfiguration, GeneralSettings, NoteCategory} from "../interfaces";
import {Logger} from "./logging";
import {GameSettings} from "./game-settings";
import {GameSystems, GameWorldTimeIntegrations} from "../constants";

export default class Calendar{

    name: string;

    /**
     * The currently running game system
     * @type {GameSystems}
     */
    gameSystem: GameSystems;

    generalSettings: GeneralSettings = {
        gameWorldTimeIntegration: GameWorldTimeIntegrations.Mixed,
        showClock: true,
        pf2eSync: true,
        permissions: {
            viewCalendar: {player: true, trustedPlayer: true, assistantGameMaster: true, users: undefined},
            addNotes: {player: false, trustedPlayer: false, assistantGameMaster: false, users: undefined},
            reorderNotes: {player: false, trustedPlayer: false, assistantGameMaster: false, users: undefined},
            changeDateTime: {player: false, trustedPlayer: false, assistantGameMaster: false, users: undefined}
        }
    };

    public year: Year;

    /**
     * List of all notes in the calendar
     * @type {Array.<Note>}
     */
    public notes: Note[] = [];

    public noteCategories: NoteCategory[] = [];

    constructor(config: CalendarConfiguration) {
        //Set Calendar Data
        this.name = config.name;
        switch ((<Game>game).system.id){
            case GameSystems.DnD5E:
                this.gameSystem = GameSystems.DnD5E;
                break;
            case GameSystems.PF1E:
                this.gameSystem = GameSystems.PF1E;
                break;
            case GameSystems.PF2E:
                this.gameSystem = GameSystems.PF2E;
                break;
            case GameSystems.WarhammerFantasy4E:
                this.gameSystem = GameSystems.WarhammerFantasy4E;
                break;
            default:
                this.gameSystem = GameSystems.Other;
                break;
        }

        // Set General Settings Data
        this.generalSettings.gameWorldTimeIntegration = config.generalSettings.gameWorldTimeIntegration;
        this.generalSettings.showClock = config.generalSettings.showClock;
        this.generalSettings.pf2eSync = config.generalSettings.pf2eSync;
        this.generalSettings.permissions.viewCalendar = config.generalSettings.permissions.viewCalendar;
        this.generalSettings.permissions.addNotes = config.generalSettings.permissions.addNotes;
        this.generalSettings.permissions.reorderNotes = config.generalSettings.permissions.reorderNotes;
        this.generalSettings.permissions.changeDateTime = config.generalSettings.permissions.changeDateTime;


        // Set Year Data
        this.year = new Year(config.year.numericRepresentation);
        this.year.prefix = config.year.prefix;
        this.year.postfix = config.year.postfix;
        this.year.yearZero = config.year.yearZero;
        this.year.showWeekdayHeadings = config.year.showWeekdayHeadings;
        this.year.firstWeekday = config.year.firstWeekday;
        this.year.yearNames = config.year.yearNames;
        this.year.yearNamingRule = config.year.yearNamingRule;
        this.year.yearNamesStart = config.year.yearNamesStart;
    }

    loadLegacyConfiguration(){
        const gsLoaded = this.loadLegacyGeneralSettings();
        const ycLoaded = this.loadLegacyYearConfiguration();
        //Only continue loading if the year configuration was loaded
        if(ycLoaded){

        }
    }

    /**
     * Loads the legacy way of saving general settings
     */
    loadLegacyGeneralSettings(){
        Logger.debug('Loading general settings from world settings');
        const gSettings = GameSettings.LoadGeneralSettings();
        if(gSettings && Object.keys(gSettings).length){
            if(this.year){
                this.year.generalSettings.gameWorldTimeIntegration = gSettings.gameWorldTimeIntegration;
                this.year.generalSettings.showClock = gSettings.showClock;
                if(gSettings.hasOwnProperty('pf2eSync')){
                    this.year.generalSettings.pf2eSync = gSettings.pf2eSync;
                }
                if(gSettings.hasOwnProperty('permissions')){
                    this.year.generalSettings.permissions = gSettings.permissions;
                    if(!gSettings.permissions.hasOwnProperty('reorderNotes')){
                        this.year.generalSettings.permissions.reorderNotes = {player: false, trustedPlayer: false, assistantGameMaster: false, users: undefined};
                    }
                } else if(gSettings.hasOwnProperty('playersAddNotes')){
                    this.year.generalSettings.permissions.addNotes.player = <boolean>gSettings['playersAddNotes'];
                    this.year.generalSettings.permissions.addNotes.trustedPlayer = <boolean>gSettings['playersAddNotes'];
                    this.year.generalSettings.permissions.addNotes.assistantGameMaster = <boolean>gSettings['playersAddNotes'];
                }
                return true;
            } else {
                Logger.error('No Current year configured, can not load general settings.');
            }
        }
        return false;
    }

    /**
     * Loads the legacy way of saving year configurations
     */
    loadLegacyYearConfiguration(){
        Logger.debug('Loading year configuration from settings.');
        const yearData = GameSettings.LoadYearData();
        if(yearData && Object.keys(yearData).length){
            Logger.debug('Setting the year from data.');
            if(!this.year){
                this.year = new Year(yearData.numericRepresentation);
            } else {
                this.year.numericRepresentation = yearData.numericRepresentation;
            }
            this.year.prefix = yearData.prefix;
            this.year.postfix = yearData.postfix;

            if(yearData.hasOwnProperty('showWeekdayHeadings')){
                this.year.showWeekdayHeadings = yearData.showWeekdayHeadings;
            }
            if(yearData.hasOwnProperty('firstWeekday')){
                this.year.firstWeekday = yearData.firstWeekday;
            }
            // Check to see if a year 0 has been set in the settings and use that
            if(yearData.hasOwnProperty('yearZero')){
                this.year.yearZero = yearData.yearZero;
            }

            if(yearData.hasOwnProperty('yearNames')){
                this.year.yearNames = yearData.yearNames;
            }
            if(yearData.hasOwnProperty('yearNamingRule')){
                this.year.yearNamingRule = yearData.yearNamingRule;
            }
            if(yearData.hasOwnProperty('yearNamesStart')){
                this.year.yearNamesStart = yearData.yearNamesStart;
            }
            return true;
        }
        return false;
    }
}
