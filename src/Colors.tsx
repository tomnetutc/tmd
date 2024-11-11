// Common Color Variables
const common_white = 'white';

// Time Use Page Color Variables
const timeUse_donut_timePoor = '#8E9B97';
const timeUse_donut_nonTimePoor = '#EAD97C';
const timeUse_activityType_necessary = '#8E9B97';
const timeUse_activityType_discretionary = '#F9A875';
const timeUse_activityType_committed = '#657383';
const timeUse_dailyTime_inHome = '#9D83A7';
const timeUse_dailyTime_outOfHome = '#6DAFA0';
const timeUse_change_inHomeDualValueSegment = '#BDABE6';
const timeUse_change_outOfHomeDualValueSegment = '#8FD1BF';

export const timeUse_crossSegmentColors = ['#9D83A7', '#6DAfA0', '#f9a875', '#ebc823', '#657383'];

// Travel Page Color Variables
const travel_tripMaking_tripMaker = '#EAD97C';
const travel_tripMaking_zeroTripMaker = '#8E9B97';
const travel_modeShare_car = '#507DBC';
const travel_modeShare_transit = '#67CBA0';
const travel_modeShare_walk = '#F9A875';
const travel_modeShare_bike = '#FBCB9D';
const travel_modeShare_other = '#8E9B97';
const travel_duration_chartDuration = '#6DAFA0';
const travel_trips_chartTrips = '#9D83A7';

export const tripsColorsForBtwYears = ['#9D83A7', '#6DAFA0', '#f9a875', '#ebc823', '#657383'];
export const travel_crossSegmentColors = ['#9D83A7', '#6DAfA0', '#f9a875', '#ebc823', '#657383'];

// Teleworker Page Color Variables
const teleworker_workers_zero = '#C4C4C4';
const teleworker_workers_inHome = '#F9A875';
const teleworker_workers_multiSite = '#F9D423';
const teleworker_workers_commutersOnly = '#657383';

export const telework_crossSegmentColors = ['#9D83A7', '#6DAfA0', '#f9a875', '#ebc823', '#657383'];

const Colors = {
    // Time Use Page

    // Time poverty - Within Year - Donut
    timePoorDonut: timeUse_donut_timePoor,
    nonTimePoorDonut: timeUse_donut_nonTimePoor,
    borderTimePoorDonut: timeUse_donut_timePoor,
    borderNonTimePoorDonut: timeUse_donut_nonTimePoor,

    // Time allocation by activity type - Within Year - Donut
    necessaryBackgroundColor: timeUse_activityType_necessary,
    discretionaryBackgroundColor: timeUse_activityType_discretionary,
    committedBackgroundColor: timeUse_activityType_committed,
    necessaryBorderColor: timeUse_activityType_necessary,
    discretionaryBorderColor: timeUse_activityType_discretionary,
    commitedBorderColor: timeUse_activityType_committed,

    // Average time spent per person per day (min) - Within Year- Chart Data
    inHomeWithinBackground: timeUse_dailyTime_inHome,
    inHomeWithinBorder: timeUse_dailyTime_inHome,
    outOfHomeWithinBackground: timeUse_dailyTime_outOfHome,
    outOfHomeWithinBorder: timeUse_dailyTime_outOfHome,

    // Average time spent per person per day (min) - Between Year- Chart Data
    inHomeBetweenBackground: timeUse_dailyTime_inHome,
    inHomeBetweenBorder: timeUse_dailyTime_inHome,
    outOfHomeBetweenBackground: timeUse_dailyTime_outOfHome,
    outOfHomeBetweenBorder: timeUse_dailyTime_outOfHome,

    // Change from 2003 to 2022 - Between Year - DualValueSegment
    inHomeDualValueSegmentBackground: timeUse_change_inHomeDualValueSegment,
    inHomeDualValueSegmentText: common_white,
    outOfHomeDualValueSegmentBackground: timeUse_change_outOfHomeDualValueSegment,
    outOfHomeDualValueSegmentText: common_white,

    // Average over the years (min) - Between Year - Bubble
    inHomeBubbleColor: timeUse_change_inHomeDualValueSegment,
    outofHomeBubbleColor: timeUse_change_outOfHomeDualValueSegment,

    // Travel Page

    // Trip-making - Within Year - Donut
    tripMakerDonoutBackground: travel_tripMaking_tripMaker,
    tripMakerDonutBorder: travel_tripMaking_tripMaker,
    zeroTripMakerDonutBackground: travel_tripMaking_zeroTripMaker,
    zeroTripMakerDonutBorder: travel_tripMaking_zeroTripMaker,

    // Mode share (%) - Within Year - Donut
    carModeShareBackground: travel_modeShare_car,
    transitModeShareBackground: travel_modeShare_transit,
    walkModeShareBackground: travel_modeShare_walk,
    bikeModeShareBackground: travel_modeShare_bike,
    otherModeShareBackground: travel_modeShare_other,
    carModeShareBorder: travel_modeShare_car,
    transitModeShareBorder: travel_modeShare_transit,
    walkModeShareBorder: travel_modeShare_walk,
    bikeModeShareBorder: travel_modeShare_bike,
    otherModeShareBorder: travel_modeShare_other,

    // Number of trips per person per day by travel mode & Daily travel duration by person by travel mode (min) - Within Year - Chart
    chartDurationColor: travel_duration_chartDuration,
    chartTripsColor: travel_trips_chartTrips,

    // Number of trips per person per day by travel mode & Daily travel duration by person by travel mode (min) - Between Year - Chart
    durationBorder: travel_duration_chartDuration,
    durationBackground: travel_duration_chartDuration,
    tripsBorder: travel_trips_chartTrips,
    tripsBackground: travel_trips_chartTrips,

    // Teleworker Page

    // Workers by work arrangement (%)
    zeroWorkers: teleworker_workers_zero,
    inHomeWorkers: teleworker_workers_inHome,
    multiSiteWorkers: teleworker_workers_multiSite,
    commutersOnly: teleworker_workers_commutersOnly
};

export default Colors;
