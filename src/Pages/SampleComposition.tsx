import React, { useState, useEffect, useCallback } from 'react';
import { TravelDataProvider, useDocumentTitle } from '../utils/Helpers';
import { ATTRIBUTE_CONFIG, AttributeKey } from '../components/SampleComposition/attributeConfig';
import {
    calculateCompositionOverTime,
    calculateYearComposition,
    getSampleSizesByYear,
    getAvailableYears
} from '../components/SampleComposition/calculations';
import { Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { Container, Form } from 'react-bootstrap';
import LoadingOverlay from '../components/LoadingOverlay';
import { DataRow } from '../Types';
import DownloadButton from '../components/DownloadButton';
import InfoBox from '../components/InfoBox/InfoBox';
import Footer from '../components/Footer';
import { Navbar } from '../Navbar';
import '../css/SampleComposition.scss';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ChartDataLabels
);

function downloadCSV(content: string, filename: string): void {
    const blob = new Blob([content], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    window.URL.revokeObjectURL(url);
}

export default function SampleComposition(): JSX.Element {
    useDocumentTitle('Survey Sample');

    const [data, setData] = useState<DataRow[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedAttribute, setSelectedAttribute] = useState<AttributeKey>('gender');
    const [selectedYear, setSelectedYear] = useState<string>('');
    const [chartData, setChartData] = useState<any>(null);
    const [tableData, setTableData] = useState<any[]>([]);
    const [sampleSizes, setSampleSizes] = useState<Record<string, number>>({});
    const [availableYears, setAvailableYears] = useState<string[]>([]);

    // Load data on mount
    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);
                const loadedData = await TravelDataProvider.getInstance().loadData();
                setData(loadedData as DataRow[]);

                const years = getAvailableYears(loadedData as DataRow[]);
                setAvailableYears(years);
                if (years.length > 0) {
                    setSelectedYear(years[0]);
                }

                const sizes = getSampleSizesByYear(loadedData as DataRow[]);
                setSampleSizes(sizes);

                setLoading(false);
            } catch (error) {
                console.error('Error loading data:', error);
                setLoading(false);
            }
        };

        loadData();
    }, []);

    // Calculate chart data when attribute or data changes
    useEffect(() => {
        if (data.length === 0) return;

        const composition = calculateCompositionOverTime(data, selectedAttribute);
        const config = ATTRIBUTE_CONFIG[selectedAttribute];

        const labels = composition.map(item => item.year);
        const datasets = config.categories.map((category, index) => ({
            label: category.label,
            data: composition.map(item => item.percentages[index]),
            backgroundColor: config.colors[index],
            borderWidth: 0
        }));

        setChartData({ labels, datasets });
    }, [data, selectedAttribute]);

    // Calculate table data when year changes
    useEffect(() => {
        if (data.length === 0 || !selectedYear) return;

        const composition = calculateYearComposition(data, selectedYear);
        setTableData(composition);
    }, [data, selectedYear]);

    const handleAttributeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedAttribute(e.target.value as AttributeKey);
    };

    const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedYear(e.target.value);
    };

    const handleDownloadChart = () => {
        if (!chartData) return;

        const firstYear = chartData.labels[0];
        const lastYear = chartData.labels[chartData.labels.length - 1];
        const title = `${ATTRIBUTE_CONFIG[selectedAttribute].name} Distribution (${firstYear}-${lastYear})`;

        const headers = ['Year', ...chartData.datasets.map((ds: any) => ds.label)];
        const rows = chartData.labels.map((year: string, i: number) => {
            const values = chartData.datasets.map((ds: any) => `${Number(ds.data[i]).toFixed(1)}%`);
            return [year, ...values].join(',');
        });

        downloadCSV([title, headers.join(','), ...rows].join('\n'), `sample_composition_${selectedAttribute}_chart.csv`);
    };

    const handleDownloadTable = () => {
        if (tableData.length === 0) return;

        const escapeField = (val: string) => {
            const cleaned = val.replace(/≥/g, '>=');
            return cleaned.includes(',') ? `"${cleaned}"` : cleaned;
        };

        const title = `Sample Characteristics for ${selectedYear}`;
        const headers = 'Attribute,Category,Unweighted %,Weighted %,Count';

        const rows: string[] = [];
        let lastAttribute = '';
        tableData.forEach((row: any) => {
            if (lastAttribute && row.attribute !== lastAttribute) {
                rows.push('');
            }
            rows.push([
                escapeField(row.attribute),
                escapeField(row.category),
                `${row.unweightedPercent.toFixed(1)}%`,
                `${row.weightedPercent.toFixed(1)}%`,
                row.count
            ].join(','));
            lastAttribute = row.attribute;
        });

        downloadCSV([title, headers, ...rows].join('\n'), `sample_composition_${selectedYear}.csv`);
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            datalabels: {
                color: '#FFFFFF',
                font: {
                    weight: 'bold' as const,
                    size: 10,
                },
                formatter: (value: number) => {
                    if (typeof value === 'number') {
                        if (value < 3) return null;
                        return `${value.toFixed(1)}%`;
                    }
                    const num = Number(value);
                    if (isNaN(num) || num < 3) return null;
                    return `${num.toFixed(1)}%`;
                },
                anchor: 'center' as const,
                align: 'center' as const,
                clamp: true,
            },
            legend: {
                display: true,
                position: 'top' as const,
                labels: {
                    usePointStyle: true,
                    pointStyle: 'rect' as const,
                    padding: 15,
                    boxWidth: 10,
                    boxHeight: 10,
                    font: { size: 13.5 }
                }
            },
            tooltip: {
                mode: 'index' as const,
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                padding: 12,
                titleFont: { size: 13.5, weight: 500 },
                bodyFont: { size: 13.5 },
                callbacks: {
                    label: function (context: any) {
                        return context.dataset.label + ': ' + context.parsed.y.toFixed(1) + '%';
                    },
                    footer: function (tooltipItems: any[]) {
                        const year = tooltipItems[0].label;
                        return 'Sample: ' + (sampleSizes[year] || 0).toLocaleString();
                    }
                }
            }
        },
        scales: {
            x: {
                stacked: true,
                grid: { display: false },
                ticks: { font: { size: 13.5 } }
            },
            y: {
                stacked: true,
                beginAtZero: true,
                max: 100,
                ticks: {
                    callback: function (value: any) { return value + '%'; },
                    font: { size: 13.5 }
                },
                grid: { color: '#f0f0f0' }
            }
        }
    };

    if (loading) {
        return (
            <>
                <Navbar />
                <LoadingOverlay />
            </>
        );
    }

    const config = ATTRIBUTE_CONFIG[selectedAttribute];

    return (
        <>
            <Navbar />
            <div className="sample-composition-page" style={{ backgroundColor: '#f5f5f5', padding: '20px 20px 20px' }}>
                <Container fluid className="sc-container">
                    <header className="sc-page-header">
                        <div>
                            <h4 className="fw-bold sc-page-title">Survey Sample Overview</h4>
                            <p className="sc-page-subtitle">
                                Explore how the socio-economic and demographic characteristics of the NHTS survey sample vary across and within survey years.
                            </p>
                        </div>
                    </header>

                    {/* Section 1: Between Years Analysis - Chart */}
                    <section className="sc-section">
                        <div className="sc-section-header">
                            <h2 className="sc-section-title">Sample Composition Between Years</h2>
                        </div>

                        <div className="sc-control-card">
                            <div className="sc-control-field">
                                <span className="sc-control-label">Select Attribute</span>
                                <Form.Select
                                    id="attributeSelect"
                                    value={selectedAttribute}
                                    onChange={handleAttributeChange}
                                    className="sc-select"
                                >
                                    {Object.entries(ATTRIBUTE_CONFIG).map(([key, cfg]) => (
                                        <option key={key} value={key}>
                                            {cfg.name}
                                        </option>
                                    ))}
                                </Form.Select>
                            </div>
                        </div>

                        <div className="sc-chart-card">
                            <InfoBox>
                                <p>This chart shows the distribution of the selected attribute across all NHTS survey samples. Each bar represents one year, with categories stacked to total 100%. Values shown are unweighted percentages based on the raw sample composition.</p>
                            </InfoBox>
                            <div className="sc-chart-title">
                                <span>
                                    {config.name} Distribution ({chartData?.labels[0] || '2003'}–{chartData?.labels[chartData?.labels.length - 1] || '2022'})
                                </span>
                                <DownloadButton onClick={handleDownloadChart} />
                            </div>
                            <div className="sc-chart-container">
                                {chartData && (
                                    <Bar data={chartData} options={chartOptions} />
                                )}
                            </div>
                        </div>
                    </section>

                    {/* Section 2: Within Year Analysis - Table */}
                    <section className="sc-section">
                        <div className="sc-section-header">
                            <h2 className="sc-section-title">Sample Composition Within Year</h2>
                        </div>

                        <div className="sc-control-card">
                            <div className="sc-control-field">
                                <span className="sc-control-label">Select Year</span>
                                <Form.Select
                                    id="yearSelect"
                                    value={selectedYear}
                                    onChange={handleYearChange}
                                    className="sc-select"
                                >
                                    {availableYears.map(year => (
                                        <option key={year} value={year}>
                                            {year}
                                        </option>
                                    ))}
                                </Form.Select>
                            </div>
                        </div>

                        <div className="sc-table-container">
                            <InfoBox>
                                <p>
                                    This table shows the demographic composition of NHTS survey respondents for the selected year.
                                    Unweighted %: raw percentage of respondents in each category.
                                    Weighted %: percentages adjusted using survey weights to represent the U.S. population.
                                    Count: number of survey respondents in each category (unweighted sample size).
                                </p>
                            </InfoBox>
                            <div className="sc-table-title">
                                <span>Sample Characteristics for {selectedYear}</span>
                                <DownloadButton onClick={handleDownloadTable} />
                            </div>
                            <table className="sc-data-table">
                                <thead>
                                    <tr>
                                        <th style={{ width: '20%' }}>Attribute</th>
                                        <th style={{ width: '25%' }}>Category</th>
                                        <th style={{ width: '18%' }}>Unweighted %</th>
                                        <th style={{ width: '18%' }}>Weighted %</th>
                                        <th style={{ width: '19%' }}>Count</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {tableData.map((row: any, index: number) => {
                                        const isFirstInGroup = index === 0 || tableData[index - 1].attribute !== row.attribute;
                                        const isLastInGroup = index === tableData.length - 1 || tableData[index + 1].attribute !== row.attribute;
                                        const attributeRowCount = tableData.filter((r: any) => r.attribute === row.attribute).length;

                                        const rowClasses: string[] = [];
                                        if (isFirstInGroup) rowClasses.push('sc-attribute-group-start');
                                        if (isLastInGroup) rowClasses.push('sc-attribute-group-end');

                                        return (
                                            <tr key={index} className={rowClasses.join(' ')}>
                                                {isFirstInGroup && (
                                                    <td rowSpan={attributeRowCount} className="sc-attribute-header">
                                                        {row.attribute}
                                                    </td>
                                                )}
                                                <td>{row.category}</td>
                                                <td>{row.unweightedPercent.toFixed(1)}%</td>
                                                <td>{row.weightedPercent.toFixed(1)}%</td>
                                                <td>{row.count.toLocaleString()}</td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </section>
                </Container>
                <Footer />
            </div>
        </>
    );
}
