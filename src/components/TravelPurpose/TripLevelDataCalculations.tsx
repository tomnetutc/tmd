import {TripChartDataProps, DataRow, TripPurposeOption } from "../../Types"
import {TripLevelTravelModeOptions } from "../../utils/Helpers";
import { Colors } from "../../Colors";
import * as d3 from 'd3';

export const prepareVerticalChartData = (filteredData: DataRow[], analysisYear: string, optionValues: TripPurposeOption[], includeDecember: boolean | undefined, activeOption: string): {
    tripsDurationChartData: TripChartDataProps,
    tripStartTimeChartData: TripChartDataProps,
    tripModeDistributionChartData: TripChartDataProps,
    segmentSize: number,
} => {

    const AllTripDurations = Array.from(
        filteredData.map(item => Number(item.duration))
    ).sort((a, b) => a - b);


    // Define new bins and labels for histogram of trip duration
    const binEdges = [0, 5, 10, 15, 20, 30, 45, 60, 90, 120, 1440]; // Define bin ranges
    const binLabels = ['1-5', '6-10', '11-15', '16-20', '21-30', '31-45', '46-60', '61-90', '91-120', '120+']; // Corresponding labels

    const maxDuration = d3.max(AllTripDurations) ?? 0; // Default to 0 if d3.max returns undefined
    const bins = d3
        .bin()
        .domain([0, maxDuration]) // Use the safe value of maxDuration
        .thresholds(binEdges)(AllTripDurations);
    
    const labels = bins.map((bin, index) => binLabels[index]); // Assign labels based on bins

    const lablesStartTime = Array.from({ length: 24 }, (_, i) => i).map(hour => `${hour}`);

    const labelModeDistribution = TripLevelTravelModeOptions
    .filter(option => option.label !== "All") 
    .map(option => `${option.label}`);

    const mapModeToIndex = TripLevelTravelModeOptions
    .filter(option => option.label !== "All") 
    .reduce((labelModeDistribution, option, index) => {
        labelModeDistribution[option.numberTrip] = index;
        return labelModeDistribution;
    }, {} as Record<string, number>);

    console.log(mapModeToIndex);

    let TripDurationPerOption: any = {};
    let TripStartTimePerOption: any = {};
    let TripModeDistributionPerOption: any = {};
    let segmentSize= 0;
    let uniqueTUCASE = new Set();

    // Aggregate data for each option and year
    filteredData.forEach(dataRow => {
        const duration = parseInt(dataRow.duration, 10);
        const start_hour = parseInt(dataRow.start_hour, 10);
        const mode = dataRow.tr_mode;
        optionValues.forEach(option => {
            if (!includeDecember && parseInt(dataRow.month, 10) == 12) {
                return;
            }

            if (dataRow.trip_purpose === option.numberTrip || option.numberTrip === "tr_all") {
                uniqueTUCASE.add(dataRow.TUCASEID);
                if (!TripDurationPerOption[option.numberTrip]) {
                    TripDurationPerOption[option.numberTrip] = new Array(labels.length).fill(0);
                    TripStartTimePerOption[option.numberTrip] = new Array(lablesStartTime.length).fill(0);
                    TripModeDistributionPerOption[option.numberTrip] = new Array(labelModeDistribution.length).fill(0);
                }
                const binIndex = bins.findIndex(bin =>
                    bin.x0 !== undefined && bin.x1 !== undefined && duration >= bin.x0 && duration < bin.x1
                );
                if (binIndex !== -1) {
                    TripDurationPerOption[option.numberTrip][binIndex] += 1;
                }
                TripStartTimePerOption[option.numberTrip][start_hour] += 1;
                TripModeDistributionPerOption[option.numberTrip][mapModeToIndex[mode]] += 1;
            }
        });
    });

    segmentSize=uniqueTUCASE.size;

    const totalDurationRows: { [key: string]: number } = {};
    const totalStartTimeRows: { [key: string]: number } = {};
    const totalModeDistributionRows: { [key: string]: number } = {};

    Object.keys(TripDurationPerOption).forEach((key: string) => {
        totalDurationRows[key] = TripDurationPerOption[key].reduce((sum: number, value: number) => sum + value, 0);
        totalStartTimeRows[key] = TripStartTimePerOption[key].reduce((sum: number, value: number) => sum + value, 0);
        totalModeDistributionRows[key] = TripModeDistributionPerOption[key].reduce((sum: number, value: number) => sum + value, 0);
    });

    Object.keys(TripDurationPerOption).forEach((key: string) => {
        if (totalDurationRows[key] > 0) {
            TripDurationPerOption[key] = TripDurationPerOption[key].map((value: number) => (value / totalDurationRows[key]) * 100);
        }
        if (totalStartTimeRows[key] > 0) {
            TripStartTimePerOption[key] = TripStartTimePerOption[key].map((value: number) => (value / totalStartTimeRows[key]) * 100);
        }
        if (totalModeDistributionRows[key] > 0) {
            TripModeDistributionPerOption[key] = TripModeDistributionPerOption[key].map((value: number) => (value / totalModeDistributionRows[key]) * 100);
        }
    });

    type TripChartDataSet = TripChartDataProps['datasets'][number];
    let tripsDurationHistogramChartDataSets: TripChartDataSet[] = [];
    let tripStartTimeHistogramChartDataSets: TripChartDataSet[] = [];
    let tripModeDistributionChartDataSets: TripChartDataSet[] = [];

    optionValues.forEach((option, index) => {
        const colorIndex = index % Colors.length;
        const tripBackgroundColor = Colors[colorIndex];

        tripsDurationHistogramChartDataSets.push({
            label: option.label,
            data: TripDurationPerOption[option.numberTrip],
            totalNum: totalDurationRows[option.numberTrip],
            borderColor: tripBackgroundColor,
            backgroundColor: tripBackgroundColor,
            barThickness: 'flex',
        });

        tripStartTimeHistogramChartDataSets.push({
            label: option.label,
            data: TripStartTimePerOption[option.numberTrip],
            totalNum: totalStartTimeRows[option.numberTrip],
            borderColor: tripBackgroundColor,
            backgroundColor: tripBackgroundColor,
            barThickness: 'flex',
        });

        tripModeDistributionChartDataSets.push({
            label: option.label,
            data: TripModeDistributionPerOption[option.numberTrip],
            totalNum: totalModeDistributionRows[option.numberTrip],
            borderColor: tripBackgroundColor,
            backgroundColor: tripBackgroundColor,
            barThickness: 'flex',
        });

    });

    const tripsDurationChartData: TripChartDataProps = {
        labels,
        datasets: tripsDurationHistogramChartDataSets,
    };
    const tripStartTimeChartData: TripChartDataProps = {
        labels: lablesStartTime,
        datasets: tripStartTimeHistogramChartDataSets,
    };
    const tripModeDistributionChartData: TripChartDataProps = {
        labels: labelModeDistribution,
        datasets: tripModeDistributionChartDataSets,
    };
    console.log(tripStartTimeChartData);

    return {
        tripsDurationChartData,
        tripStartTimeChartData,
        tripModeDistributionChartData,
        segmentSize,
    };

};
