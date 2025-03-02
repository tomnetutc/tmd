import firebaseConfig from "../firebaseConfig";
import { getAnalytics } from "firebase/analytics";
import { initializeApp } from "firebase/app";
import { getFirestore, doc, updateDoc, getDoc, increment, setDoc } from 'firebase/firestore';
import {
    Option,
    weekOption,
    TravelModeOption,
    DayofWeekOption,
    analysisType,
    GroupedOption,
    analysisLevel,
    GroupedOptions,
    TripPurposeOption,
    DayPatternOption,
    DataRow
} from "../Types";
import { DSVRowString } from "d3-dsv";
import { useEffect } from "react";
import { csv, csvParse } from "d3";

export const GenderOptions: Option[] = [
    {
        value: "Male",
        label: "Male",
        id: "female",
        val: "0.0",
        groupId: "Gender",
    },
    {
        value: "Female",
        label: "Female",
        id: "female",
        val: "1.0",
        groupId: "Gender",
    },

];

export const WeekOptions: weekOption[] = [
    {
        value: "All",
        label: "All",
        id: "weekday",
    },
    {
        value: "Weekday",
        label: "Weekday",
        id: "weekday",
        val: "1.0",
        groupId: "Weekday",
    },
    {
        value: "Weekend",
        label: "Weekend",
        id: "weekday",
        val: "0.0",
        groupId: "Weekend",
    },
];

export const AnalysisLevels: analysisLevel[]=[
    {
        label: "Person",
        value: "person",
    },
    {
        label: "Trip",
        value: "trip",
    }
]

export const AnalysisTypes: analysisType[]=[
    {
        label: "Between Year",
        value: "betweenyear",
    },
    {
        label: "Cross Segment",
        value: "crosssegment",
    }
]

export const DayPatternAnalysisTypes: analysisType[]=[
    {
        label: "Within Year",
        value: "withinyear",
    },
    {
        label: "Between Year",
        value: "betweenyear",
    },
    {
        label: "Cross Segment",
        value: "crosssegment",
    }
]


export const TravelModeOptions: TravelModeOption[] = [
    {
        label: "All",
        value: "All",
        numberTrip: "tr_all",
        durationTrips: "tr_all_dur",
    },
    {
        label: "SOV",
        value: "SOV",
        numberTrip: "mode_sov",
        durationTrips: "mode_sov",
    },
    {
        label: "HOV",
        value: "HOV",
        numberTrip: "mode_hov",
        durationTrips: "mode_hov",
    },
    {
        label: "Transit",
        value: "Transit",
        numberTrip: "mode_pt",
        durationTrips: "mode_pt_dur",
    },
    {
        label: "Walk",
        value: "Walk",
        numberTrip: "mode_walk",
        durationTrips: "mode_walk_dur",
    },
    {
        label: "Bike",
        value: "Bike",
        numberTrip: "mode_bike",
        durationTrips: "mode_bike_dur",
    },
    {
        label: "Other",
        value: "Other",
        numberTrip: "mode_other",
        durationTrips: "mode_other_dur",
    },
    {
        label: "Unknown",
        value: "Unknown",
        numberTrip: "mode_unknown",
        durationTrips: "mode_unknown_dur",
    },
];

export const DayPatternOptions: DayPatternOption[] = [
    { label: "H-W-H", value: "Home > Work > Home", numberTrip: "dp_H_W_H" },
    { label: "H-Sh-H", value: "Home > Shopping > Home", numberTrip: "dp_H_Sh_H" },
    { label: "H-SR-H", value: "Home > Social/Recreation > Home", numberTrip: "dp_H_SR_H" },
    { label: "H-RV-H", value: "Home > Religious/Volunteer/Civic > Home", numberTrip: "dp_H_RV_H" },
    { label: "H-D-H", value: "Home > Dining > Home", numberTrip: "dp_H_D_H" },
    { label: "H-E-H", value: "Home > Errands > Home", numberTrip: "dp_H_E_H" },
    { label: "H-C-H", value: "Home > Care > Home", numberTrip: "dp_H_C_H" },
    { label: "H-Sh-Sh-H", value: "Home > Shopping > Shopping > Home", numberTrip: "dp_H_Sh_Sh_H" },
    { label: "H-W-Sh-H", value: "Home > Work > Shopping > Home", numberTrip: "dp_H_W_Sh_H" },
    { label: "H-SR-Sh-H", value: "Home > Social/Recreation > Shopping > Home", numberTrip: "dp_H_SR_Sh_H" },
    { label: "H-Sh-H-SR-H", value: "Home > Shopping > Home > Social/Recreation > Home", numberTrip: "dp_H_Sh_H_SR_H" },
    { label: "H-H", value: "Home > Home", numberTrip: "dp_H_H" },
    { label: "H-W-H-SR-H", value: "Home > Work > Home > Social/Recreation > Home", numberTrip: "dp_H_W_H_SR_H" },
    { label: "H-H-H", value: "Home > Home > Home", numberTrip: "dp_H_H_H" },
    { label: "H-E-Sh-H", value: "Home > Errands > Shopping > Home", numberTrip: "dp_H_E_Sh_H" },
    { label: "H-W-H-W-H", value: "Home > Work > Home > Work > Home", numberTrip: "dp_H_W_H_W_H" },
    { label: "H-Sh-H-Sh-H", value: "Home > Shopping > Home > Shopping > Home", numberTrip: "dp_H_Sh_H_Sh_H" },
    { label: "H-W-H-Sh-H", value: "Home > Work > Home > Shopping > Home", numberTrip: "dp_H_W_H_Sh_H" },
    { label: "H-W-D-W-H", value: "Home > Work > Dining > Work > Home", numberTrip: "dp_H_W_D_W_H" },
    { label: "H-W-W-H", value: "Home > Work > Work > Home", numberTrip: "dp_H_W_W_H" },
    { label: "H-S-H", value: "Home > Education > Home", numberTrip: "dp_H_S_H" },
    { label: "H-SR-H-SR-H", value: "Home > Social/Recreation > Home > Social/Recreation > Home", numberTrip: "dp_H_SR_H_SR_H" },
    { label: "H-SR-SR-H", value: "Home > Social/Recreation > Social/Recreation > Home", numberTrip: "dp_H_SR_SR_H" },
    { label: "H-RV-Sh-H", value: "Home > Religious/Volunteer/Civic > Shopping > Home", numberTrip: "dp_H_RV_Sh_H" },
    { label: "H-Sh-Sh-Sh-H", value: "Home > Shopping > Shopping > Shopping > Home", numberTrip: "dp_H_Sh_Sh_Sh_H" },
    { label: "H-C-H-C-H", value: "Home > Care > Home > Care > Home", numberTrip: "dp_H_C_H_C_H" },
    { label: "H-Sh-SR-H", value: "Home > Shopping > Social/Recreation > Home", numberTrip: "dp_H_Sh_SR_H" },
    { label: "H-D-Sh-H", value: "Home > Dining > Shopping > Home", numberTrip: "dp_H_D_Sh_H" },
    { label: "H-W-SR-H", value: "Home > Work > Social/Recreation > Home", numberTrip: "dp_H_W_SR_H" },
    { label: "H-RV-D-H", value: "Home > Religious/Volunteer/Civic > Dining > Home", numberTrip: "dp_H_RV_D_H" },
    { label: "0", value: "No Travel", numberTrip: "dp_0" }
];

export const DayPatternMap: Record<string, string> = Object.fromEntries(
    DayPatternOptions.map(option => [option.label, option.value])
);

export const TripPurposeOptions: TripPurposeOption[] = [
    {
        label: "All",
        value: "All",
        numberTrip: "tr_all",
        durationTrips: "tr_all_dur",
    },
    {
        label: "Work",
        value: "Work",
        numberTrip: "tr_work",
        durationTrips: "tr_work_dur",
    },
    {
        label: "Education",
        value: "Education",
        numberTrip: "tr_educ",
        durationTrips: "tr_educ_dur",
    },
    {
        label: "Shopping",
        value: "Shopping",
        numberTrip: "tr_shop",
        durationTrips: "tr_shop_dur",
    },
    {
        label: "Recreational",
        value: "Recreational",
        numberTrip: "tr_rec",
        durationTrips: "tr_rec_dur",
    },
    {
        label: "Social",
        value: "Social",
        numberTrip: "tr_soc",
        durationTrips: "tr_soc_dur",
    },
    {
        label: "Eating/Drinking",
        value: "Eating/Drinking",
        numberTrip: "tr_eat",
        durationTrips: "tr_eat_dur",
    },
    {
        label: "Religious",
        value: "Religious",
        numberTrip: "tr_religious",
        durationTrips: "tr_religious_dur",
    },
    {
        label: "Volunteering",
        value: "Volunteering",
        numberTrip: "tr_volunteer",
        durationTrips: "tr_volunteer",
    },
    {
        label: "Adult or Child care",
        value: "Adult or Child care",
        numberTrip: "tr_ccare",
        durationTrips: "tr_ccare_dur",
    },
    {
        label: "Other",
        value: "Other",
        numberTrip: "tr_other",
        durationTrips: "tr_other_dur",
    },
    {
        label: "Return to home",
        value: "Return to home",
        numberTrip: "tr_home",
        durationTrips: "tr_home_dur",
    },
];

export const TripLevelTripPurposeOptions: TripPurposeOption[] = [
    {
        label: "All",
        value: "All",
        numberTrip: "tr_all",
        durationTrips: "tr_all_dur",
    },
    {
        label: "Work",
        value: "Work",
        numberTrip: "tr_work",
        durationTrips: "tr_work_dur",
    },
    {
        label: "Education",
        value: "Education",
        numberTrip: "tr_education",
        durationTrips: "tr_education_dur",
    },
    {
        label: "Recreational",
        value: "Recreational",
        numberTrip: "tr_recreational",
        durationTrips: "tr_recreational_dur",
    },
    {
        label: "Shopping",
        value: "Shopping",
        numberTrip: "tr_shopping",
        durationTrips: "tr_shopping_dur",
    },
    {
        label: "Adult or Child care",
        value: "Adult or Child care",
        numberTrip: "tr_ccare",
        durationTrips: "tr_ccare_dur",
    },
    {
        label: "Social",
        value: "Social",
        numberTrip: "tr_social",
        durationTrips: "tr_social_dur",
    },
    {
        label: "Eating/Drinking",
        value: "Eating/Drinking",
        numberTrip: "tr_eat",
        durationTrips: "tr_eat_dur",
    },
    {
        label: "Religious",
        value: "Religious",
        numberTrip: "tr_religious",
        durationTrips: "tr_religious_dur",
    },
    {
        label: "Volunteering",
        value: "Volunteering",
        numberTrip: "tr_volunteer",
        durationTrips: "tr_volunteer",
    },
    {
        label: "Other",
        value: "Other",
        numberTrip: "tr_other",
        durationTrips: "tr_other_dur",
    },
    {
        label: "Return to home",
        value: "Return to home",
        numberTrip: "tr_return_home",
        durationTrips: "tr_return_home_dur",
    },
];

export const TripLevelTravelModeOptions: TravelModeOption[] = [
    {
        label: "All",
        value: "All",
        numberTrip: "tr_all",
        durationTrips: "tr_all_dur",
    },
    {
        label: "SOV",
        value: "SOV",
        numberTrip: "sov_mode",
        durationTrips: "sov_mode",
    },
    {
        label: "HOV",
        value: "HOV",
        numberTrip: "hov_mode",
        durationTrips: "hov_mode",
    },
    {
        label: "Transit",
        value: "Transit",
        numberTrip: "transit_mode",
        durationTrips: "transit_mode",
    },
    {
        label: "Walk",
        value: "Walk",
        numberTrip: "walk_mode",
        durationTrips: "walk_mode",
    },
    {
        label: "Bike",
        value: "Bike",
        numberTrip: "bike_mode",
        durationTrips: "bike_mode",
    },
    {
        label: "Other",
        value: "Other",
        numberTrip: "other_mode",
        durationTrips: "other_mode",
    },
    {
        label: "Unknown",
        value: "Unknown",
        numberTrip: "unknown_mode",
        durationTrips: "unknown_mode",
    },
];



export const DayofWeek: DayofWeekOption[] = [
    {
        label: "Monday",
        value: "Monday",
        id: "day",
        val: "2.0",
        groupId: "Weekday",
    },
    {
        label: "Tuesday",
        value: "Tuesday",
        id: "day",
        val: "3.0",
        groupId: "Weekday",
    },
    {
        label: "Wednesday",
        value: "Wednesday",
        id: "day",
        val: "4.0",
        groupId: "Weekday",
    },
    {
        label: "Thursday",
        value: "Thursday",
        id: "day",
        val: "5.0",
        groupId: "Weekday",
    },
    {
        label: "Friday",
        value: "Friday",
        id: "day",
        val: "6.0",
        groupId: "Weekday",
    },
    {
        label: "Saturday",
        value: "Saturday",
        id: "day",
        val: "7.0",
        groupId: "Weekend",
    },
    {
        label: "Sunday",
        value: "Sunday",
        id: "day",
        val: "1.0",
        groupId: "Weekend",
    },
];


export const useDocumentTitle = (pageTitle: string) => {
    useEffect(() => {
        const initialTitle = 'Mobility Dashboard';
        document.title = `${initialTitle} | ${pageTitle}`;
    }, [pageTitle]);
};

export const AgeOptions: Option[] = [
    {
        value: "15 to 19 years",
        label: "15 to 19 years",
        id: "age_15_19",
        val: "1.0",
        groupId: "Age",
    },
    {
        value: "20 to 29 years",
        label: "20 to 29 years",
        id: "age_20_29",
        val: "1.0",
        groupId: "Age",
    },
    {
        value: "30 to 49 years",
        label: "30 to 49 years",
        id: "age_30_49",
        val: "1.0",
        groupId: "Age",
    },
    {
        value: "50 to 64 years",
        label: "50 to 64 years",
        id: "age_50_64",
        val: "1.0",
        groupId: "Age",
    },
    {
        value: "65 years or older",
        label: "65 years or older",
        id: "age_65p",
        val: "1.0",
        groupId: "Age",
    },
];

export const EducationOptions: Option[] = [
    {
        value: "Less than high school",
        label: "Less than high school",
        id: "less_than_hs",
        val: "1.0",
        groupId: "Education",
    },
    {
        value: "High school",
        label: "High school",
        id: "hs_grad",
        val: "1.0",
        groupId: "Education",
    },
    {
        value: "Some college degree",
        label: "Some college degree",
        id: "some_col_assc_deg",
        val: "1.0",
        groupId: "Education",
    },
    {
        value: "Bachelor's degree",
        label: "Bachelor's degree",
        id: "bachelor",
        val: "1.0",
        groupId: "Education",
    },
    {
        value: "Graduate degree(s)",
        label: "Graduate degree(s)",
        id: "grad_sch",
        val: "1.0",
        groupId: "Education",
    },
];

export const RaceOptions: Option[] = [
    {
        value: "Asian",
        label: "Asian",
        id: "asian",
        val: "1.0",
        groupId: "Race",
    },
    {
        value: "Black",
        label: "Black",
        id: "black",
        val: "1.0",
        groupId: "Race",
    },
    {
        value: "White",
        label: "White",
        id: "white",
        val: "1.0",
        groupId: "Race",
    },
    {
        value: "Other",
        label: "Other",
        id: "race_other",
        val: "1.0",
        groupId: "Race",
    },
];

export const EmploymentStatusOptions: Option[] = [
    {
        value: "Full-time worker",
        label: "Full-time worker",
        id: "full_time",
        val: "1.0",
        groupId: "Employment",
    },
    {
        value: "Part-time worker",
        label: "Part-time worker",
        id: "part_time",
        val: "1.0",
        groupId: "Employment",
    },
    {
        value: "Non-worker",
        label: "Non-worker",
        id: "unemployed",
        val: "1.0",
        groupId: "Employment",
    },
];

export const IncomeOptions: Option[] = [
    {
        value: "<$35K",
        label: "<$35K",
        id: "inc_up35",
        val: "1.0",
        groupId: "Income",
    },
    {
        value: "$35K to $50K",
        label: "$35K to $50K",
        id: "inc_35_50",
        val: "1.0",
        groupId: "Income",
    },
    {
        value: "$50K to $75K",
        label: "$50K to $75K",
        id: "inc_50_75",
        val: "1.0",
        groupId: "Income",
    },
    {
        value: "$75K to $100K",
        label: "$75K to $100K",
        id: "inc_75_100",
        val: "1.0",
        groupId: "Income",
    },
    {
        value: ">$100K",
        label: ">$100K",
        id: "inc_100p",
        val: "1.0",
        groupId: "Income",
    },
];

export const HouseholdSize: Option[] = [
    {
        value: "One",
        label: "One",
        id: "hhsize_1",
        val: "1.0",
        groupId: "HouseholdSize",
    },
    {
        value: "Two",
        label: "Two",
        id: "hhsize_2",
        val: "1.0",
        groupId: "HouseholdSize",
    },
    {
        value: "Three or more",
        label: "Three or more",
        id: "hhsize_3p",
        val: "1.0",
        groupId: "HouseholdSize",
    },
];

const CensusDivisionOptions: Option[] = [
    {
        value: "New England",
        label: "New England",
        id: "division",
        val: '1.0',
        groupId: "CensusDivision",
    },
    {
        value: "Middle Atlantic",
        label: "Middle Atlantic",
        id: "division",
        val: '2.0',
        groupId: "CensusDivision",
    },
    {
        value: "East North Central",
        label: "East North Central",
        id: "division",
        val: '3.0',
        groupId: "CensusDivision",
    },
    {
        value: "West North Central",
        label: "West North Central",
        id: "division",
        val: '4.0',
        groupId: "CensusDivision",
    },
    {
        value: "South Atlantic",
        label: "South Atlantic",
        id: "division",
        val: '5.0',
        groupId: "CensusDivision",
    },
    {
        value: "East South Central",
        label: "East South Central",
        id: "division",
        val: '6.0',
        groupId: "CensusDivision",
    },
    {
        value: "West South Central",
        label: "West South Central",
        id: "division",
        val: '7.0',
        groupId: "CensusDivision",
    },
    {
        value: "Mountain",
        label: "Mountain",
        id: "division",
        val: '8.0',
        groupId: "CensusDivision",
    },
    {
        value: "Pacific",
        label: "Pacific",
        id: "division",
        val: '9.0',
        groupId: "CensusDivision",
    }
];

const LocationOptions: Option[] = [
    {
        value: "Urban",
        label: "Urban",
        id: "non_metropolitan",
        val: "0.0",
        groupId: "Location",
    },
    {
        value: "Not urban",
        label: "Not urban",
        id: "non_metropolitan",
        val: "1.0",
        groupId: "Location",
    },
];

export const WorkArrangementOptions: Option[] = [
    {
        value: "Workers with zero work",
        label: "Workers with zero work",
        id: "zero_work",
        val: "1.0",
        groupId: "Work Arrangement",
    },
    {
        value: "In-home only workers",
        label: "In-home only workers",
        id: "only_inhome_worker",
        val: "1.0",
        groupId: "Work Arrangement",
    },
    {
        value: "Multi-site workers",
        label: "Multi-site workers",
        id: "multisite_worker",
        val: "1.0",
        groupId: "Work Arrangement",
    },
    {
        value: "Commuters only",
        label: "Commuters only",
        id: "commuter_only",
        val: "1.0",
        groupId: "Work Arrangement",
    },
    {
        value: "Non-worker",
        label: "Non-worker",
        id: "unemployed",
        val: "1.0",
        groupId: "Work Arrangement",
    },
];

const TimePovertyOptions: Option[] = [
    {
        value: "Time poor",
        label: "Time poor",
        id: "time_poor",
        val: "1.0",
        groupId: "TimePoverty",
    },
    {
        value: "Not time poor",
        label: "Not time poor",
        id: "time_poor",
        val: "0.0",
        groupId: "TimePoverty",
    },
];

const TransportOptions: Option[] = [
    {
        value: "Auto",
        label: "Auto",
        id: "car_user",
        val: "1.0",
        groupId: "Transport",
    },
    {
        value: "Non-auto",
        label: "Non-auto",
        id: "car_user",
        val: "0.0",
        groupId: "Transport",
    },
];

const TripMakingOptions: Option[] = [
    {
        value: "One or more trips",
        label: "One or more trips",
        id: "zero_trip",
        val: "0.0",
        groupId: "ZeroTrip",
    },
    {
        value: "Zero trip",
        label: "Zero trip",
        id: "zero_trip",
        val: "1.0",
        groupId: "ZeroTrip",
    },
];

export const groupedOptions: GroupedOption[] = [
    {
        label: "Gender",
        options: GenderOptions.map((obj) => ({
            ...obj,
            groupName: "Gender",
        })),
    },
    {
        label: "Age",
        options: AgeOptions.map((obj) => ({
            ...obj,
            groupName: "Age",
        })),
    },
    {
        label: "Education",
        options: EducationOptions.map((obj) => ({
            ...obj,
            groupName: "Education",
        })),
    },
    {
        label: "Race",
        options: RaceOptions.map((obj) => ({
            ...obj,
            groupName: "Race",
        })),
    },
    {
        label: "Employment",
        options: EmploymentStatusOptions.map((obj) => ({
            ...obj,
            groupName: "Employment",
        })),
    },
    {
        label: "Household income",
        options: IncomeOptions.map((obj) => ({
            ...obj,
            groupName: "Household income",
        })),
    },
    {
        label: "Household size",
        options: HouseholdSize.map((obj) => ({
            ...obj,
            groupName: "Household size",
        })),
    },
    {
        label: "Census division",
        options: CensusDivisionOptions.map((obj) => ({
            ...obj,
            groupName: "Census division",
        })),
    },
    {
        label: "Location",
        options: LocationOptions.map((obj) => ({
            ...obj,
            groupName: "Location",
        })),
    },
    {
        label: "Work arrangement",
        options: WorkArrangementOptions.map((obj) => ({
            ...obj,
            groupName: "Work arrangement",
        })),
    },

    {
        label: "Time poverty status",
        options: TimePovertyOptions.map((obj) => ({
            ...obj,
            groupName: "Time poverty status",
        })),
    },
    {
        label: "Main mode of transportation",
        options: TransportOptions.map((obj) => ({
            ...obj,
            groupName: "Main mode of transportation",
        })),
    },
    {
        label: "Trip making status",
        options: TripMakingOptions.map((obj) => ({
            ...obj,
            groupName: "Trip making status",
        })),
    },
];

// Singleton class for data management

export class DataProvider {
    private static instance: DataProvider;
    private data: DSVRowString<string>[] | null = null;
    private loadingPromise: Promise<DSVRowString<string>[]> | null = null; // Async lock

    private constructor() { }

    public static getInstance(): DataProvider {
        if (!DataProvider.instance) {
            DataProvider.instance = new DataProvider();
        }
        return DataProvider.instance;
    }

    public async loadData(): Promise<DSVRowString<string>[]> {
        if (this.data !== null) {
            return this.data; // Return the data if it's already loaded
        }
        if (this.loadingPromise) {
            return this.loadingPromise; // Return the existing loading promise if it's already loading
        }
        this.loadingPromise = this.loadFromSource().finally(() => {
            this.loadingPromise = null; // Clear the loading promise after it's done
        });
        return this.loadingPromise;
    }

    private async loadFromSource(): Promise<DSVRowString<string>[]> {
        try {
            this.data = await csv('https://storage.googleapis.com/mobility-dashboard-434821.appspot.com/dataset/df_time_use.csv');
        } catch (error) {
            console.error('Error loading data:', error);
            throw error;
        }
        return this.data;
    }
}

// Singleton class for data management
export class TripLevelDataProvider {
    private static instance: TripLevelDataProvider;
    private data: DSVRowString<string>[] | null = null;
    private loadingPromise: Promise<DSVRowString<string>[]> | null = null;

    private constructor() { }

    public static getInstance(): TripLevelDataProvider {
        if (!TripLevelDataProvider.instance) {
            TripLevelDataProvider.instance = new TripLevelDataProvider();
        }
        return TripLevelDataProvider.instance;
    }

    public async loadData(): Promise<DSVRowString<string>[]> {
        if (this.data !== null) {
            return this.data; // Return the data if it's already loaded
        }
        if (this.loadingPromise) {
            return this.loadingPromise; // Return the existing loading promise if it's already loading
        }

        // Load data and handle async lock
        this.loadingPromise = this.loadFromSource().finally(() => {
            this.loadingPromise = null; // Clear the loading promise after it's done
        });

        return this.loadingPromise;
    }

    private async loadFromSource(): Promise<DSVRowString<string>[]> {
        try {
            // Use d3.csv to fetch and parse the CSV file
            this.data = await csv('https://storage.googleapis.com/mobility-dashboard-434821.appspot.com/dataset/df_act.csv');
        } catch (error) {
            console.error('Error loading data:', error);
            throw error;
        }
        return this.data;
    }
}

// Singleton class for data management
export class DayPatternDataProvider {
    private static instance: DayPatternDataProvider;
    private data: DSVRowString<string>[] | null = null;
    private loadingPromise: Promise<DSVRowString<string>[]> | null = null;

    private constructor() { }

    public static getInstance(): DayPatternDataProvider {
        if (!DayPatternDataProvider.instance) {
            DayPatternDataProvider.instance = new DayPatternDataProvider();
        }
        return DayPatternDataProvider.instance;
    }
    public static async getLength(): Promise<number> {
        const instance = DayPatternDataProvider.getInstance();
        
        if (instance.data) {
            return instance.data.length;
        }
        
        try {
            const data = await instance.loadData();
            return data.length;
        } catch (error) {
            console.error("Error fetching data length:", error);
            return 0;
        }
    }


    public async loadData(): Promise<DSVRowString<string>[]> {
        if (this.data !== null) {
            return this.data; // Return the data if it's already loaded
        }
        if (this.loadingPromise) {
            return this.loadingPromise; // Return the existing loading promise if it's already loading
        }

        // Load data and handle async lock
        this.loadingPromise = this.loadFromSource().finally(() => {
            this.loadingPromise = null; // Clear the loading promise after it's done
        });

        return this.loadingPromise;
    }

    private async loadFromSource(): Promise<DSVRowString<string>[]> {
        try {
            // Use d3.csv to fetch and parse the CSV file
            this.data = await csv('https://storage.googleapis.com/mobility-dashboard-434821.appspot.com/dataset/day_pattern.csv');
        } catch (error) {
            console.error('Error loading data:', error);
            throw error;
        }
        return this.data;
    }
}

export const fetchAndFilterData = async (dataProvider: { loadData: () => Promise<any[]> }, selectedOptions: Option[], year: string, weekOption: weekOption, toggleState: boolean, filterUnemployed: boolean = false) => {
    try {
        const data = await dataProvider.loadData();
        const filteredData=data.filter(filterCriteria(selectedOptions, year, weekOption, filterUnemployed));
        return filteredData;
    } catch (error) {
        console.error('Error fetching and filtering data:', error);
        return [];
    }
    //Added a conditional argument filterunemployed to filter the data without the unemployed data for Telework dashboard. This is a conditional argument hence by default it is false and doesn't expect a value
};

export const getTotalRowsForYear = async (dataProvider: { loadData: () => Promise<any[]> }, year: string) => {
    try {
        const data = await dataProvider.loadData();
        return data.filter(row => parseInt(row.year).toString() === year).length;

    } catch (error) {
        console.error('Error fetching data:', error);
        return 0;
    }
};


export const fetchAndFilterDataForBtwYearAnalysis = async (dataProvider: { loadData: () => Promise<any[]> }, selectedOptions: Option[], weekOption: weekOption, toggleState: boolean, filterUnemployed: boolean = false) => {
    try {
        const data = await dataProvider.loadData();
        return data.filter(filterCriteria(selectedOptions, "", weekOption, filterUnemployed));
    } catch (error) {
        console.error('Error fetching and filtering data for between year analysis:', error);
        return [];
    }
}

export function filterCriteria(selectedOptions: Option[], year: string, weekOption: weekOption, filterUnemployed: boolean = false) {
    return function (row: DSVRowString<string>) {
        if (year && row['year'] !== year) return false;

        if (weekOption.value !== "All") {
            if (row[weekOption.id] !== weekOption.val) return false;
        }

        //Filter the data without the unemployed data for Telework dashboard. This is a conditional argument hence by default it is false and doesn't expect a value
        if (filterUnemployed && row['unemployed'] === "1.0") return false;

        const groupedOptions = selectedOptions.reduce((acc: GroupedOptions, option) => {
            const groupId = option.groupId;
            acc[groupId] = acc[groupId] || [];
            acc[groupId].push(option);
            return acc;
        }, {});

        return Object.values(groupedOptions).every((group: Option[]) => {
            return group.some(option => {
                const column = option.id;
                const value = option.val;
                return row[column] === value;
            });
        });
    };
}

export class TravelDataProvider {
    private static instance: TravelDataProvider;
    private data: DSVRowString<string>[] | null = null;
    private loadingPromise: Promise<DSVRowString<string>[]> | null = null; // Async lock

    private constructor() { }

    public static getInstance(): TravelDataProvider {
        if (!TravelDataProvider.instance) {
            TravelDataProvider.instance = new TravelDataProvider();
        }
        return TravelDataProvider.instance;
    }

    public async loadData(): Promise<DSVRowString<string>[]> {
        if (this.data !== null) {
            return this.data; // Return the data if it's already loaded
        }
        if (this.loadingPromise) {
            return this.loadingPromise; // Return the existing loading promise if it's already loading
        }
        this.loadingPromise = this.loadFromSource().finally(() => {
            this.loadingPromise = null; // Clear the loading promise after it's done
        });
        return this.loadingPromise;
    }

    private async loadFromSource(): Promise<DSVRowString<string>[]> {
        try {
            this.data = await csv('https://storage.googleapis.com/mobility-dashboard-434821.appspot.com/dataset/df_travel.csv');
        } catch (error) {
            console.error('Error loading data:', error);
            throw error;
        }
        return this.data;
    }
}

export const CrossSegmentDataFilter = async (dataProvider: { loadData: () => Promise<any[]> }, startYear: string, endYear: string, weekOption: weekOption, toggleState: boolean, filterUnemployed: boolean = false) => {

    try {
        const data = await dataProvider.loadData();
        const startYearNum = parseInt(startYear, 10);
        const endYearNum = parseInt(endYear, 10);

        const filteredData = data.filter(row => {
            const year = row.year;
            const yearNum = parseInt(year, 10);
            const month = row['month'];

            if (!(startYear && yearNum >= startYearNum && endYear && yearNum <= endYearNum)) return false;

            if (filterUnemployed && row['unemployed'] === "1.0") return false;

            if (weekOption.value !== "All") {
                if (row[weekOption.id] !== weekOption.val) return false;
            }

            return true;
        });

        // Return the filtered dataset
        return filteredData;
    } catch (error) {
        console.error('Error fetching and filtering data:', error);
        return [];
    }

};

export const TripLevelDataFilter = async (
    dataProvider: { loadData: () => Promise<DSVRowString<string>[]> },
    selectedOptions: Option[],
    analysisYear: string,
    weekOption: weekOption,
    filterUnemployed: boolean = false
): Promise<DSVRowString<string>[]> => {


    try {
        // Load data from the provider
        const data = await dataProvider.loadData();
        const analysisYearFilter = parseInt(analysisYear, 10);
    
        // Add the row to the filtered results
        const filteredData = data.filter((row) => {
            // Filter by year
            const year = row['year'];
    
            // Check if year exists and is valid
            if (!year || isNaN(parseInt(year, 10))) {
                return false; // Exclude invalid rows
            }
    
            const yearNum = parseInt(year, 10);
    
            // Filter by analysisYear
            if (yearNum !== analysisYearFilter) {
                return false; // Exclude rows not matching the analysis year
            }
    
            // Validate week option and filter by it
            if (weekOption.value !== "All") {
                const weekColumnValue = row[weekOption.id];
                if (!weekColumnValue) {
                    return false; // Exclude rows with missing week option column
                }
                if (weekColumnValue !== weekOption.val) {
                    return false; // Exclude rows that don't match week option
                }
            }
    
            // Filter unemployed rows if the flag is set
            if (filterUnemployed) {
                const unemployedValue = row['unemployed'];
                if (!unemployedValue) {
                    return false; // Exclude rows with missing unemployed column
                }
                if (unemployedValue === "1.0") {
                    return false; // Exclude unemployed rows
                }
            }
    
            // Group and apply filters based on selected options
            const groupedOptions = selectedOptions.reduce((acc: GroupedOptions, option) => {
                const groupId = option.groupId;
                acc[groupId] = acc[groupId] || [];
                acc[groupId].push(option);
                return acc;
            }, {});
    
            // Ensure all groups have at least one matching option
            const groupCheck = Object.values(groupedOptions).every((group: Option[]) => {
                return group.some((option) => {
                    const column = option.id;
                    const value = option.val;
    
                    // Validate column existence
                    const columnValue = row[column];
                    if (!columnValue) {
                        return false; // Exclude rows with missing grouped option column
                    }
    
                    // Check if the column value matches the expected value
                    return columnValue === value;
                });
            });
    
            if (!groupCheck) {
                return false; // Exclude rows that fail grouped option checks
            }
    
            // If all conditions pass, include the row
            return true;
        });        
        return filteredData;
    } catch (error) {
        console.error('Error fetching and filtering data for trip level analysis:', error);
        return [];
    }
};


const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const analytics = getAnalytics(app);

export function tracking(docRefID: string, page: string, expiry: string) {
    const websiteDocRef = doc(db, "TMD", docRefID);

    // Debug logging
    console.log("Tracking initiated for:", { docRefID, page, expiry });

    // Function to safely get DOM elements with retry mechanism
    const getCounterElements = () => {
        const unique_counter = document.getElementById("visit-count");
        const total_counter = document.getElementById("total-count");
        
        if (!unique_counter || !total_counter) {
            console.warn("Counter elements not found in DOM, will retry in 500ms");
            setTimeout(() => {
                const retryUnique = document.getElementById("visit-count");
                const retryTotal = document.getElementById("total-count");
                
                if (retryUnique && retryTotal) {
                    console.log("Counter elements found on retry");
                    updateCounters(retryUnique, retryTotal);
                } else {
                    console.error("Counter elements still not found after retry");
                }
            }, 500);
            return null;
        }
        
        return { unique_counter, total_counter };
    };
    
    // Function to update the counters with the data
    const updateCounters = (uniqueEl: HTMLElement, totalEl: HTMLElement) => {
        // First check if document exists and create it if it doesn't
        getDoc(websiteDocRef).then((docSnap) => {
            if (!docSnap.exists()) {
                console.log("Document doesn't exist, creating it...");
                return setDoc(websiteDocRef, {
                    uniqueCount: 0,
                    totalCount: 0
                });
            }
            return Promise.resolve();
        }).then(() => {
            // Now handle the visit counters
            handleVisitCounting(uniqueEl, totalEl);
        }).catch(err => {
            console.error("Error initializing document:", err);
        });
    };
    
    // Function to handle the visit counting logic
    const handleVisitCounting = (uniqueEl: HTMLElement, totalEl: HTMLElement) => {
        const setValue = (element: HTMLElement, label: string, num: number) => {
            element.innerText = `${label}: ${num}`;
            console.log(`Updated ${label} to ${num}`);
        };
        
        const getUniqueCount = async () => {
            const docSnap = await getDoc(websiteDocRef);
            if (docSnap.exists()) {
                const data = docSnap.data();
                if (data) {
                    setValue(uniqueEl, "Unique visitors", data.uniqueCount || 0);
                }
            }
        };

        const getTotalCount = async () => {
            const docSnap = await getDoc(websiteDocRef);
            if (docSnap.exists()) {
                const data = docSnap.data();
                if (data) {
                    setValue(totalEl, "Total visits", data.totalCount || 0);
                }
            }
        };

        const incrementCountUnique = async () => {
            try {
                await updateDoc(websiteDocRef, {
                    uniqueCount: increment(1)
                });
                await getUniqueCount();
            } catch (err) {
                console.error("Error incrementing unique count:", err);
            }
        };

        const incrementCountTotal = async () => {
            try {
                await updateDoc(websiteDocRef, {
                    totalCount: increment(1)
                });
                await getTotalCount();
            } catch (err) {
                console.error("Error incrementing total count:", err);
            }
        };
        
        // Check for unique visits
        if (localStorage.getItem(page) === null) {
            console.log("New unique visitor detected");
            incrementCountUnique()
                .then(() => {
                    localStorage.setItem(page, "true");
                })
                .catch((err) => console.error("Error with unique visitor:", err));
        } else {
            console.log("Returning visitor detected");
            getUniqueCount().catch((err) => console.error("Error getting unique count:", err));
        }

        // Check for total visits
        if (localStorage.getItem(expiry) === null) {
            console.log("New session detected");
            incrementCountTotal().then(() => {
                localStorage.setItem(expiry, (Date.now() + 60000 * 120).toString());
            });
        } else if (new Date().getTime() > Number(localStorage.getItem(expiry))) {
            console.log("Session expired, counting new visit");
            incrementCountTotal().then(() => {
                localStorage.setItem(expiry, (Date.now() + 60000 * 120).toString());
            });
        } else {
            console.log("Active session detected");
            getTotalCount().catch((err) => console.error("Error getting total count:", err));
        }
    };
    
    // Start the counter process
    const elements = getCounterElements();
    if (elements) {
        updateCounters(elements.unique_counter, elements.total_counter);
    }
}