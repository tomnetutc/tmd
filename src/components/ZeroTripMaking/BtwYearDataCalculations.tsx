import { ChartDataProps, CountObj, DataRow, SampleSizeTableProps, TravelModeOption, TripPurposeOption } from "../../Types"
import { Colors } from "../../Colors";

export const prepareVerticalChartData = (filteredData: DataRow[], startYear: string, endYear: string, includeDecember: boolean | undefined): {
    tripsChartData: ChartDataProps,
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

    let YearDataPerOption: any = {};

    // Aggregate data for each option and year
    filteredByYearData.forEach(dataRow => {
        const year = dataRow['year'];
        if (!includeDecember && parseInt(dataRow.month, 10) === 12) {
            return;
        }
        if (!YearDataPerOption[year]) {
            YearDataPerOption[year] = { totalZeroTrips: 0, count: 0 };
        }
        YearDataPerOption[year].totalZeroTrips += parseFloat(dataRow['zero_trip'] || '0');
        YearDataPerOption[year].count++;
    });

    // Generate labels from the years available in filtered data
    const labels = Object.keys(YearDataPerOption).sort();

    type ChartDataSet = ChartDataProps['datasets'][number];
    let tripsChartDataSets: ChartDataSet[] = [];

    const colorIndex = 0 % Colors.length;
    const tripBackgroundColor = Colors[colorIndex];

    const tripData = labels.map(year => {
        const data = YearDataPerOption[year];
        return parseFloat((data.totalZeroTrips *100 / (data.count > 0 ? data.count : 1)).toFixed(2));
    });

    // Add to datasets for trips and duration charts
    tripsChartDataSets.push({
        label: "All",
        data: tripData,
        borderColor: tripBackgroundColor,
        backgroundColor: tripBackgroundColor,
        barThickness: 'flex',
    });

    const tripsChartData: ChartDataProps = {
        labels,
        datasets: tripsChartDataSets,
    };

    const sampleSizeTableData: SampleSizeTableProps = {
        years: labels,
        counts: [countObj],
    };


    return {
        tripsChartData,
        minYear: uniqueYears[0],
        maxYear: uniqueYears[uniqueYears.length - 1],
        sampleSizeTableData
    };
};
