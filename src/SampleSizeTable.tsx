import { Table } from "react-bootstrap";
import exportFromJSON from "export-from-json";
import { SampleSizeTableProps } from "./Types";
import { DSVRowString } from "d3";
import "./css/sampleSizeTable.css"; // Ensure this path is correct

export default function SampleSizeTable({
    years,
    counts,
    crossSegment = false,
}: SampleSizeTableProps): JSX.Element {
    // Ensure counts include all years, and fill missing years with 0
    counts.forEach((count: any) => {
        const existingYears = count?.count?.map((ele: any) => ele[0]);
        years.forEach((year: any) => {
            if (!existingYears.includes(year)) {
                count.count.push([year, 0]);
            }
        });
        // Sort by year numerically (ensure the sort logic is correct)
        count.count.sort((a: any, b: any) => a[0] - b[0]);
    });

    // Download functionality (if needed)
    function downloadProfile(data: DSVRowString<string>[], index: number): void {
        const fileName = index === 0 ? "Full Sample" : `Segment-${index}`;
        exportFromJSON({ data, fileName, fields: [], exportType: "csv" });
    }

    return (
        <div className="sample-size-table-container">
            <h5 className="table-title">Sample Sizes</h5>
            <Table responsive className="sample-size-table">
                <thead>
                    <tr>
                        <th>Year</th>
                        {years.map((year, index) => (
                            <th key={index}>{year}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {counts.map((count, index) => (
                        <tr key={index}>
                            <td>
                                {index === 0 ? (
                                    <>
                                        {crossSegment ? (
                                            "All"
                                        ) : (
                                            <>
                                                Selected <br /> Segment
                                            </>
                                        )}
                                    </>
                                ) : (
                                    `Segment ${index}`
                                )}
                            </td>
                            {count.count.map((c, idx) => (
                                <td key={idx}>{c[1].toLocaleString("en-US")}</td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </Table>
        </div>
    );
}
