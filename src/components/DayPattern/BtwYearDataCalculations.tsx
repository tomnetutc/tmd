import {
  ChartDataProps,
  CountObj,
  DataRow,
  SampleSizeTableProps,
  DayPatternOption,
} from "../../Types";
import { Colors } from "../../Colors";
import { colors } from "@mui/material";

export const prepareVerticalChartData = (
  filteredData: DataRow[],
  startYear: string,
  endYear: string,
  includeDecember: boolean | undefined,
  optionValues: DayPatternOption[],
  activeOption: string
): {
  tripsChartData: ChartDataProps;
  minYear: string;
  maxYear: string;
  sampleSizeTableData: SampleSizeTableProps;
} => {
  // Filter data by startYear and endYear
  const filteredByYearData = filteredData.filter((dataRow) => {
    const year = parseInt(dataRow["year"], 10);
    return year >= Number(startYear) && year <= Number(endYear);
  });

  const uniqueYears = Array.from(
    new Set(filteredByYearData.map((item) => parseInt(item.year, 10))) // Convert to integer first
  )
    .sort((a, b) => a - b) // Ensure numeric sorting
    .map((year) => year.toString()); // Convert back to string

  let countObj: CountObj = {
    data: filteredByYearData,
    count: [],
  };

  // Count the number of rows for each year for the sample size table
  uniqueYears.forEach((year) => {
    countObj.count.push([
      year.toString(),
      countObj.data.filter(
        (row) =>
          parseInt(row.year).toString() === year &&
          (includeDecember || parseInt(row.month, 10) !== 12)
      ).length,
    ]);
  });

  // Assume optionValue is now an array of options
  let YearDataPerOption: any = {};

  // Initialize data structure for each option
  optionValues.forEach((option) => {
    YearDataPerOption[option.label] = {};
  });

  // Aggregate data for each option and year
  filteredByYearData.forEach((dataRow) => {
    const year = parseInt(dataRow["year"]).toString();
    optionValues.forEach((option) => {
      if (!includeDecember && parseInt(dataRow.month, 10) == 12) {
        return;
      }
      if (!YearDataPerOption[option.label][year]) {
        YearDataPerOption[option.label][year] = { totalTrips: 0, count: 0 };
      }
      if (dataRow.day_pattern === option.label) {
        YearDataPerOption[option.label][year].totalTrips += parseFloat("1");
      }
      // YearDataPerOption[option.label][year].totalTrips += parseFloat(dataRow[option.numberTrip] || '0');
      YearDataPerOption[option.label][year].count++;
    });
  });

  // Generate labels from the years available in filtered data
  const labels = Object.keys(YearDataPerOption[optionValues[0].label]).sort();

  type ChartDataSet = ChartDataProps["datasets"][number];
  // Prepare chart data for each option
  let tripsChartDataSets: ChartDataSet[] = [];

  optionValues.forEach((option, index) => {
    const colorIndex = index % Colors.length;
    const tripBackgroundColor = Colors[colorIndex];

    const tripData = labels.map((year) => {
      const data = YearDataPerOption[option.label][year];
      return parseFloat(
        ((data.totalTrips / (data.count > 0 ? data.count : 1)) * 100).toFixed(2)
      );
    });

    // Add to datasets for trips and duration charts
    tripsChartDataSets.push({
      label: option.label,
      data: tripData,
      borderColor: tripBackgroundColor,
      backgroundColor: tripBackgroundColor,
      barThickness: "flex",
    });
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
    sampleSizeTableData,
  };
};
