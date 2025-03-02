import { DayPatternChartDataProps,PieChartDataProps, DataRow, TripPurposeOption } from "../../Types"
import { Colors, DayPattern_PieChart } from "../../Colors";

export const prepareVerticalChartData = (filteredData: DataRow[], analysisYear: string, optionValues: TripPurposeOption[], includeDecember: boolean | undefined, activeOption: string): {
    DayPatternDataSet: DayPatternChartDataProps,
    TripChainsDistribution: PieChartDataProps,
    ChainStopsDistribution: PieChartDataProps,
    segmentSize: number,
    avgTripChains: number,
    avgStopPerChain: number,
    totalChainCount: number
} => {

    let histogramDataMap: Record<string, number> = {};
    let uniqueTUCASE = new Set<string>();
    let segmentSize = 0;
    let totalChainCount=0;
    let chainCount_forAvgStops=0;
    let totalStopCount=0;
    //chainStops: 0 stop, 1 stop, 2 stop, 3+ stop
    let chainStops=[0,0,0,0];

    //chainStops: 0 stop, 1 stop, 2 stop, 3+ stop
    let chainCounts=[0,0,0,0];



    // Step 1: Aggregate total duration per `dayPattern`
    filteredData.forEach(dataRow => {
        if (!includeDecember && parseInt(dataRow.month, 10) == 12) {
            return;
        }

        const dayPattern = dataRow.day_pattern;
        uniqueTUCASE.add(dataRow.TUCASEID);
        let chain_count= parseInt(dataRow.chain_count, 10);
        totalChainCount+=chain_count;
        if(chain_count==0){
            chainCounts[0]+=1;
        }
        else if(chain_count==1){
            chainCounts[1]+=1;
        }
        else if(chain_count==2){
            chainCounts[2]+=1;
        }
        else if(chain_count>=3){
            chainCounts[3]+=1;
        }
        histogramDataMap[dayPattern] = (histogramDataMap[dayPattern] || 0) + 1;

        if(parseInt(dataRow['zero_trip']) == 0){
            console.log(dataRow['zero_trip']);
            const stopCount= parseInt(dataRow.stop_count, 10);
            totalStopCount += stopCount;    
            chainCount_forAvgStops += chain_count;
            chainStops[0]+=parseInt(dataRow['0stop_chains'], 10);
            chainStops[1]+=parseInt(dataRow['1stop_chains'], 10);
            chainStops[2]+=parseInt(dataRow['2stop_chains'], 10);
            chainStops[3]+=parseInt(dataRow['3stop_chains'], 10);
        }
    });
    
    // Step 2: Sort by value (duration) in descending order and keep only the top 15
    histogramDataMap = Object.fromEntries(
        Object.entries(histogramDataMap)
            .sort(([, a], [, b]) => b - a) // Sort by value (duration) in descending order
            .slice(0, 15) // Keep only the top 15
    );    


    segmentSize = uniqueTUCASE.size;

    // Prepare datasets for the histogram chart
    type DayPatternDataSet = DayPatternChartDataProps['datasets'][number];
    let DayPatternHistogramChartDataSets: DayPatternDataSet[] = [];

    const colorIndex = 0 % Colors.length;
    const tripBackgroundColor = Colors[colorIndex];

    DayPatternHistogramChartDataSets.push({
        label: Object.keys(histogramDataMap),
        data: Object.values(histogramDataMap).map(value => parseFloat(((value / segmentSize) * 100).toFixed(2))), // Normalize by segmentSize with 4 decimals
        totalNum: segmentSize,
        borderColor: tripBackgroundColor,
        backgroundColor: tripBackgroundColor,
        barThickness: 'flex',
    });

    type TripChainsDistribution = PieChartDataProps['datasets'][number];
    let TripChainsPieChartDataSets: TripChainsDistribution[] = [];
    chainCounts.forEach((value, index) => {
        const colorIndex = index % DayPattern_PieChart.length;
        const tripBackgroundColor = DayPattern_PieChart[colorIndex];

        TripChainsPieChartDataSets.push({
            label: index === 0 ? "0 chain" 
            : index === 1 ? "1 chain" 
            : index === 2 ? "2 chains"
            : index === 3 ? "3+ chains"
            : index + "+ chains",
            data: parseFloat(((value/segmentSize)*100).toFixed(2)),
            totalNum: segmentSize,
            borderColor: tripBackgroundColor,
            backgroundColor: tripBackgroundColor,
            barThickness: 'flex',
        });
    });

    type ChainStopsDistribution = PieChartDataProps['datasets'][number];
    let ChainStopsPieChartDataSets: ChainStopsDistribution[] = [];
    chainStops.forEach((value, index) => {
        const colorIndex = index % DayPattern_PieChart.length;
        const tripBackgroundColor = DayPattern_PieChart[colorIndex];

        ChainStopsPieChartDataSets.push({
            label: index === 0 ? "0 stop" 
            : index === 1 ? "1 stop" 
            : index === 2 ? "2 stops"
            : index === 3 ? "3+ stops"
            : index + "+ stops",
            data: parseFloat(((value / chainCount_forAvgStops) * 100).toFixed(2)),
            totalNum: totalChainCount,
            borderColor: tripBackgroundColor,
            backgroundColor: tripBackgroundColor,
            barThickness: 'flex',
        });
    });

    const avgTripChains=  totalChainCount/segmentSize;
    const avgStopPerChain=  totalStopCount/chainCount_forAvgStops;

    return {
        DayPatternDataSet: {
            labels: Object.keys(histogramDataMap), // Bin labels as x-axis categories
            datasets: DayPatternHistogramChartDataSets,
        },
        TripChainsDistribution: {
            datasets: TripChainsPieChartDataSets,
        },
        ChainStopsDistribution: {
            datasets: ChainStopsPieChartDataSets,
        },
        segmentSize,
        avgTripChains,
        avgStopPerChain,
        totalChainCount
    };
};