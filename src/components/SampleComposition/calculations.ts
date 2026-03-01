import { DataRow } from '../../Types';
import { ATTRIBUTE_CONFIG, AttributeKey } from './attributeConfig';

export interface YearComposition {
    year: string;
    percentages: number[];
}

export interface CategoryComposition {
    attribute: string;
    category: string;
    unweightedPercent: number;
    weightedPercent: number;
    count: number;
}

/**
 * Calculate composition percentages for chart (all years)
 * Returns unweighted percentages for each year
 */
export function calculateCompositionOverTime(
    data: DataRow[],
    attributeKey: AttributeKey
): YearComposition[] {
    const config = ATTRIBUTE_CONFIG[attributeKey];

    // Get unique years and sort them ascending
    const years = Array.from(new Set(data.map(row => row.year)))
        .sort((a, b) => parseInt(a, 10) - parseInt(b, 10));

    const result: YearComposition[] = years.map(year => {
        const yearData = data.filter(row => row.year === year);

        if (yearData.length === 0) {
            return {
                year,
                percentages: config.categories.map(() => 0)
            };
        }

        // For income, filter out rows with missing income data
        let filteredYearData = yearData;
        if (attributeKey === 'income') {
            const rowsWithIncome = yearData.filter(row =>
                config.categories.some(cat => row[cat.field] === cat.value)
            );
            if (rowsWithIncome.length < yearData.length) {
                filteredYearData = rowsWithIncome;
            }
        }

        const percentages = config.categories.map(category => {
            const count = filteredYearData.filter(
                row => row[category.field] === category.value
            ).length;

            return filteredYearData.length > 0
                ? parseFloat(((count / filteredYearData.length) * 100).toFixed(1))
                : 0;
        });

        return { year, percentages };
    });

    return result;
}

/**
 * Calculate detailed composition for table (single year)
 * Returns both unweighted and weighted percentages
 */
export function calculateYearComposition(
    data: DataRow[],
    year: string
): CategoryComposition[] {
    const yearData = data.filter(row => row.year === year);

    if (yearData.length === 0) return [];

    const totalWeight = yearData.reduce(
        (sum, row) => sum + parseFloat(row.weight || '0'),
        0
    );

    const result: CategoryComposition[] = [];

    Object.entries(ATTRIBUTE_CONFIG).forEach(([key, config]) => {
        let filteredYearData = yearData;
        let filteredTotalWeight = totalWeight;

        if (key === 'income') {
            const rowsWithIncome = yearData.filter(row =>
                config.categories.some(cat => row[cat.field] === cat.value)
            );
            if (rowsWithIncome.length < yearData.length) {
                filteredYearData = rowsWithIncome;
                filteredTotalWeight = rowsWithIncome.reduce(
                    (sum, row) => sum + parseFloat(row.weight || '0'),
                    0
                );
            }
        }

        config.categories.forEach(category => {
            const matchingRows = filteredYearData.filter(
                row => row[category.field] === category.value
            );

            const count = matchingRows.length;

            const unweightedPercent = filteredYearData.length > 0
                ? (count / filteredYearData.length) * 100
                : 0;

            const weightSum = matchingRows.reduce(
                (sum, row) => sum + parseFloat(row.weight || '0'),
                0
            );
            const weightedPercent = filteredTotalWeight > 0
                ? (weightSum / filteredTotalWeight) * 100
                : 0;

            result.push({
                attribute: config.name,
                category: category.label,
                unweightedPercent: parseFloat(unweightedPercent.toFixed(1)),
                weightedPercent: parseFloat(weightedPercent.toFixed(1)),
                count
            });
        });
    });

    return result;
}

/**
 * Get sample sizes for each year
 */
export function getSampleSizesByYear(data: DataRow[]): Record<string, number> {
    const sizes: Record<string, number> = {};
    const years = Array.from(new Set(data.map(row => row.year)));
    years.forEach(year => {
        sizes[year] = data.filter(row => row.year === year).length;
    });
    return sizes;
}

/**
 * Get available years from the data, sorted descending (newest first)
 */
export function getAvailableYears(data: DataRow[]): string[] {
    return Array.from(new Set(data.map(row => row.year)))
        .sort((a, b) => parseInt(b, 10) - parseInt(a, 10));
}
