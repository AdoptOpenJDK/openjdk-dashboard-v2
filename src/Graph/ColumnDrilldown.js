import React, { useState, useEffect, useRef } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import HighchartsDrilldown from "highcharts/modules/drilldown";
import './Graph.css';
import { api } from "../api";

HighchartsDrilldown(Highcharts);

export default function ColumnDrilldown({ data, name }) {
    const chartComponentRef = useRef(null);
    const allowChartUpdate = useRef(true);
    const [seriesData, setSeriesData] = useState(undefined);
    const [drilldownSeries, setDrilldownSeries] = useState(undefined);

    const categoryClicked = () => {
        allowChartUpdate.current = false;
    };

    const updateData = async () => {
        if (data) {
            const drilldownSeries = [];
            const secondLevelDrilldownSeries = [];
            const seriesData = await Promise.all(Object.keys(data).map(async key => {
                const apiData = await api.downloads(key);
                const drilldownSeriesData = await Promise.all(Object.keys(apiData).map(async apiDataKey => {
                    //second level drilldown
                    const secondLevelApiData = await api.downloads(`${key}/${apiDataKey}`);
                    const secondLevelDrilldownSeriesData = Object.keys(secondLevelApiData).map(secondLevelApiKey => {
                        return [secondLevelApiKey, secondLevelApiData[secondLevelApiKey]];
                    });
                    secondLevelDrilldownSeries.push({
                        name: apiDataKey,
                        id: apiDataKey,
                        data: secondLevelDrilldownSeriesData

                    });
                    return {
                        name: apiDataKey,
                        y: apiData[apiDataKey],
                        drilldown: apiDataKey
                    }
                }));

                drilldownSeries.push({
                    name: `JDK${key}`,
                    id: key,
                    data: drilldownSeriesData,
                });

                return {
                    name: `JDK${key}`,
                    y: data[key],
                    drilldown: key
                }
            }));
            drilldownSeries.push(...secondLevelDrilldownSeries);
            setSeriesData(seriesData);
            setDrilldownSeries(drilldownSeries);
        }
    };

    useEffect(() => {
        updateData();
    }, [data]);

    if (!seriesData || !drilldownSeries) return null;

    const options = {
        chart: {
            type: "column",
        },
        title: {
            text: name
        },
        subtitle: {
            text: 'Click the columns to view the version specific data. Data is from: <a href="https://api.adoptopenjdk.net/" target="_blank" rel="noopener noreferrer">api.adoptopenjdk.net</a>',
            useHTML: true,
        },
        xAxis: {
            type: 'category'
        },
        yAxis: {
            title: {
                text: 'Downloads'
            }
        },
        plotOptions: {
            column: {
                dataLabels: {
                    enabled: true,
                    format: '{point.y}'
                },
                pointPadding: 0.2,
                borderWidth: 0,
                minPointLength: 10,
                shadow: true
            },
        },
        series: [
            {
                events: {
                    click: e => {
                        categoryClicked(e);
                    }
                },
                name: "JDK Versions",
                data: seriesData
            }
        ],
        drilldown: {
            series: drilldownSeries
        }
    };

    return <div className="chart">
        <HighchartsReact
            allowChartUpdate={allowChartUpdate.current}
            ref={chartComponentRef}
            highcharts={Highcharts}
            options={options}
        />
    </div>;
}