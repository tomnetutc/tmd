import { ChartDataProps, CountObj, DataRow, SampleSizeTableProps, TravelModeOption } from "../../Types"
import { Colors } from "../../Colors";

export const prepareVerticalChartData = (filteredData: DataRow[], startYear: string, endYear: string,includeDecember: boolean | undefined, optionValues: TravelModeOption[], activeOption: string): {
    tripsChartData: ChartDataProps,
    durationChartData: ChartDataProps,
    minYear: string,
    maxYear: string,
    sampleSizeTableData: SampleSizeTableProps
} => {

    // Filter data by startYear and endYear
    const filteredByYearData = filteredData.filter(dataRow => {
        const year = dataRow['year'];
        return year >= startYear && year <= endYear;
    });

    const uniqueYears = Array.from(new Set(filteredByYearData.map(item => item.year)))
        .sort((a, b) => parseInt(a, 10) - parseInt(b, 10));

    let countObj: CountObj = {
        data: filteredByYearData,
        count: []
    };

    // Count the number of rows for each year for the sample size table
    uniqueYears.forEach(year => {
        countObj.count.push([
            year.toString(),
            countObj.data.filter(row =>
                row.year === year && (includeDecember || parseInt(row.month, 10) !== 12)
            ).length
        ]);
            });

    // Assume optionValue is now an array of options
    let YearDataPerOption: any = {};

    // Initialize data structure for each option
    optionValues.forEach(option => {
        YearDataPerOption[option.label] = {};
    });

    // Aggregate data for each option and year
    filteredByYearData.forEach(dataRow => {
        const year = dataRow['year'];
        optionValues.forEach(option => {
            if (!includeDecember && parseInt(dataRow.month, 10) == 12) {
                return;
            }
            if (!YearDataPerOption[option.label][year]) {
                YearDataPerOption[option.label][year] = { totalTrips: 0, totalDuration: 0, count: 0 };
            }
            YearDataPerOption[option.label][year].totalTrips += parseFloat(dataRow[option.numberTrip] || '0');
            YearDataPerOption[option.label][year].totalDuration += parseFloat(dataRow[option.durationTrips] || '0');
            YearDataPerOption[option.label][year].count++;
        });
    });

    // Generate labels from the years available in filtered data
    const labels = Object.keys(YearDataPerOption[optionValues[0].label]).sort();

    type ChartDataSet = ChartDataProps['datasets'][number];
    // Prepare chart data for each option
    let tripsChartDataSets: ChartDataSet[] = [];
    let durationChartDataSets: ChartDataSet[] = [];

    optionValues.forEach((option, index) => {

        const colorIndex = index % Colors.length;
        const tripBackgroundColor = Colors[colorIndex];

        const tripData = labels.map(year => {
            const data = YearDataPerOption[option.label][year];
            return parseFloat((data.totalTrips / (data.count > 0 ? data.count : 1)).toFixed(2));
        });

        const durationData = labels.map(year => {
            const data = YearDataPerOption[option.label][year];
            return parseFloat((data.totalDuration / (data.count > 0 ? data.count : 1)).toFixed(1));
        });

        // Add to datasets for trips and duration charts
        tripsChartDataSets.push({
            label: option.label,
            data: tripData,
            borderColor: tripBackgroundColor,
            backgroundColor: tripBackgroundColor,
            barThickness: 'flex',
        });

        durationChartDataSets.push({
            label: option.label,
            data: durationData,
            borderColor: tripBackgroundColor,
            backgroundColor: tripBackgroundColor,
            barThickness: 'flex',
        });
    });

    const tripsChartData: ChartDataProps = {
        labels,
        datasets: tripsChartDataSets,
    };

    const durationChartData: ChartDataProps = {
        labels,
        datasets: durationChartDataSets,
    };

    const sampleSizeTableData: SampleSizeTableProps = {
        years: labels,
        counts: [countObj],
    };

    return {
        tripsChartData,
        durationChartData,
        minYear: uniqueYears[0],
        maxYear: uniqueYears[uniqueYears.length - 1],
        sampleSizeTableData
    };

};
