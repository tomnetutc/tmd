import { ChartData } from 'chart.js';
import { DSVRowString } from 'd3-dsv';

export interface Option {
    value: string;
    label: string;
    id: string;
    val: string;
    groupId: string;
    groupName?: string;
    progressValue?: number;
};

export interface weekOption {
    value: string;
    label: string;
    id: string;
    val?: string;
    groupId?: string;
    groupName?: string;
    progressValue?: number;
};

export interface analysisType {
    label: string;
    value: string;
};

export interface analysisLevel {
    label: string;
    value: string;
};

export interface YearOption {
    label: string;
    value: string;
};


export interface YearMenuProps {
    onSelectionChange: (selections: { week: weekOption, year: string, employment?: Option }) => void;
    callingComponent?: string;
};


export type TravelModeOption = {
    label: string;
    value: string;
    numberTrip: string;
    durationTrips: string;
};

export type DayPatternOption = {
    label: string;
    value: string;
    numberTrip: string;
};

export type TravelPurpose = {
    label: string;
    value: string;
    numberTrip: string;
    durationTrips: string;
};

export type DayofWeekOption = {
    label: string;
    value: string;
    id: string;
    val: string;
    groupId: string;
};

export type DataRow = {
    [key: string]: string;
};

export interface GroupedOption {
    label: string;
    options: Option[];
};

export type GroupedOptions = {
    [key: string]: Option[];
};

export interface YearlyActivityData {
    inHome: number;
    outHome: number;
    count: number;
};

export interface NavbarProps {
    onMenuOptionChange: (options: Option[] | Option[][]) => void;
    isTeleworkPage?: boolean;
};

export interface ChartDataProps {
    labels: (string | string[])[];
    datasets: {
        label: string;
        data: number[];
        backgroundColor: string;
        borderColor: string;
        borderWidth?: number;
        barThickness: number | 'flex';
    }[];
};

export interface TripChartDataProps {
    labels: (string | string[])[];
    datasets: {
        label: string;
        data: number[];
        totalNum: number;
        backgroundColor: string;
        borderColor: string;
        borderWidth?: number;
        barThickness: number | 'flex';
    }[];
};

export interface DayPatternChartDataProps {
    labels: (string | string[])[];
    datasets: {
        label: string[];
        data: number[];
        totalNum: number;
        backgroundColor: string;
        borderColor: string;
        borderWidth?: number;
        barThickness: number | 'flex';
    }[];
};

export interface PieChartDataProps {
    datasets: {
        label: string;
        data: number;
        totalNum: number;
        backgroundColor: string;
        borderColor: string;
        borderWidth?: number;
        barThickness: number | 'flex';
    }[];
};


export interface CountObj {
    data: DSVRowString<string>[]
    count: [string | undefined, number][];
};

export interface SampleSizeTableProps {
    years: (string | undefined)[];
    counts: CountObj[];
    crossSegment?: boolean;
};

export type TripPurposeOption = {
    label: string;
    value: string;
    numberTrip: string;
    durationTrips: string;
};

export type AnalysisTypeOption = {
    label: string;
    value: string;
};

export interface ProfileObj {
    [key: string]: Option[];
};

export interface IAddProfile {
    (newProfile: { [key: string]: Option[] }): Promise<void>;
};

export interface IRemoveProfile {
    (profileIndex: number): void;
}

export interface ProfileCardProps {
    profileList: ProfileObj[];
    removeProfile: IRemoveProfile;
    title: string;
};

export interface SegmentProps {
    title: string;
    counter: string;
    icon: React.ElementType;

};

