import React, { useState, useEffect, useRef } from 'react';
import { api } from "../api";
import { get } from "../utils";
import LineChart from "./LineChart";
import BarChart from "./BarChart";
import moment from 'moment';
import { Radio, Slider, Checkbox } from 'antd';
import './Trends.css';

export default function Trends() {
    const isMountedRef = useRef(false);
    
    const [series, setSeries] = useState(undefined);
    const [series2, setSeries2] = useState(undefined);
    const [monthlyData, setMonthlyData] = useState(undefined);
    const [categories, setCategories] = useState(undefined);
    const [categories2, setCategories2] = useState(undefined);
    const [args, setArgs] = useState({
        visible: true,
        type: 'daily',
        source: undefined,
        feature_version: undefined,
        jvm_impl: undefined
    });
    const [args2, setArgs2] = useState({
        visible: false,
        type: 'daily',
        source: undefined,
        feature_version: undefined,
        jvm_impl: undefined
    });
    const [days, setDays] = useState(30);
    const [monthlyArgs, setMonthlyArgs] = useState({
        type: 'monthly',
        source: undefined,
        feature_version: undefined,
        jvm_impl: undefined
    });
    const [versions, setVersions] = useState(undefined);

    const processData = (seriesID, data, type, visible) => {
        var typeData;
        switch(type) {
            case 'daily': typeData = data.map(({ daily }) => daily); break;
            case 'total': typeData = data.map(({ total }) => total); break;
        }

        const series = {
            name: "Series " + seriesID,
            data: typeData,
            visible: (data.length != 0) && visible
        };

        return series;
    };

    const generateParams = (currentArgs) => {
        let params = {}
        if(currentArgs.source) params.source = currentArgs.source
        if(currentArgs.feature_version) params.feature_version = currentArgs.feature_version
        if(currentArgs.jvm_impl) params.jvm_impl = currentArgs.jvm_impl
        params.days = days

        return params;
    };

    const parseMonth = (month) => {
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        return monthNames[month - 1];
    };

    const updateData = async (seriesID, currentArgs) => {
        const data = await api.tracking(generateParams(currentArgs));

        if (isMountedRef.current) {
            switch(seriesID) {   
                case 1: setSeries(processData(seriesID, data, currentArgs.type, currentArgs.visible)); break;
                case 2: setSeries2(processData(seriesID, data, currentArgs.type, currentArgs.visible)); break;
            }

            if (data.length > 0) {
                const newCategories = data.map(({ date }) => moment(date).format('DD-MM-YYYY'));

                switch(seriesID) {   
                    case 1: setCategories(newCategories); break;
                    case 2: setCategories2(newCategories); break;
                }
            }
        }
    };

    const updateMonthlyData = async (currentArgs) => {
        const data = await api.monthly(generateParams(currentArgs));

        var newMonthlyData = {}
        data.forEach(data => newMonthlyData[parseMonth(data.month)] = data[currentArgs.type])

        if (isMountedRef.current) {
            setMonthlyData(newMonthlyData);
        }
    };

    const generateVersions = () => {
        var currentVersions = versions;
        if (!currentVersions) return [];
        return currentVersions.filter(version => version >= 8).map(version => ({ label: version, value: version }));
    };

    const createSeries = (currentSeries, currentSeries2) => {
        if (!currentSeries || !currentSeries2) return [];

        let seriesArray = [];
        seriesArray.push(currentSeries);
        if (currentSeries2.visible) {
            let series2 = currentSeries2;

            if (currentSeries.data.length !== currentSeries2.data.length) {
                const diff = Math.abs(currentSeries.data.length - currentSeries2.data.length);
                series2 = padArray(currentSeries2, diff);
            }

            seriesArray.push(series2);
        }

        return seriesArray;
    };

    const padArray = (state, diff) => {
        for (let i = 0; i < diff; i++) {
            state.data.unshift(null)
        }

        return state
    };

    const max = (arr1, arr2) => {
        // Handle undefined/null arrays
        if (!arr1 && !arr2) return [];
        if (!arr1) return arr2;
        if (!arr2) return arr1;
        
        if (arr1.length > arr2.length) {
            return arr1
        } else {
            return arr2
        }
    };

    const renderFilters = (currentArgs, updateFunc, isArgs1) => {
        return <>
            <div className="column">
                <div>Tracking Type</div>
                <Radio.Group value={currentArgs.type} size="small" onChange={(e) => {
                    const newArgs = { ...currentArgs, type: e.target.value };
                    if (isArgs1) {
                        setArgs(newArgs);
                    } else {
                        setArgs2(newArgs);
                    }
                    updateFunc();
                }}>
                    <Radio.Button value="daily">Daily</Radio.Button>
                    <Radio.Button value="total">Total</Radio.Button>
                </Radio.Group>
            </div>
            <div className="column">
                <div>Source</div>
                <Radio.Group value={currentArgs.source} size="small" onChange={(e) => {
                    const newArgs = { ...currentArgs, source: e.target.value };
                    if (isArgs1) {
                        setArgs(newArgs);
                    } else {
                        setArgs2(newArgs);
                    }
                    updateFunc();
                }}>
                    <Radio.Button value={undefined}>All</Radio.Button>
                    <Radio.Button value="github">Github</Radio.Button>
                    <Radio.Button value="dockerhub">Dockerhub</Radio.Button>
                </Radio.Group>
            </div>
            <div className="column">
                <div>Version</div>
                <Radio.Group value={currentArgs.feature_version} size="small" onChange={(e) => {
                    const newArgs = { ...currentArgs, feature_version: e.target.value };
                    if (isArgs1) {
                        setArgs(newArgs);
                    } else {
                        setArgs2(newArgs);
                    }
                    updateFunc();
                }}>
                    <Radio.Button value={undefined}>All</Radio.Button>
                    {generateVersions().map(version => <Radio.Button key={version.value} value={version.value}>{version.label}</Radio.Button>)}
                </Radio.Group>
            </div>
            <div className="column">
                <div>JVM Implementation</div>
                <Radio.Group value={currentArgs.jvm_impl} size="small" onChange={(e) => {
                    const newArgs = { ...currentArgs, jvm_impl: e.target.value };
                    if (isArgs1) {
                        setArgs(newArgs);
                    } else {
                        setArgs2(newArgs);
                    }
                    updateFunc();
                }}>
                    <Radio.Button value={undefined}>All</Radio.Button>
                    <Radio.Button value="hotspot">Hotspot</Radio.Button>
                    <Radio.Button value="openj9">OpenJ9</Radio.Button>
                </Radio.Group>
            </div>
        </>
    };

    const renderTrackingFilters = (currentArgs, updateFunc, isArgs1) => {
        return <div className="filter-row">
            <div className="column">
                <div>Visible</div>
                <Checkbox checked={currentArgs.visible} onChange={(e) => {
                    const newArgs = { ...currentArgs, visible: e.target.checked };
                    if (isArgs1) {
                        setArgs(newArgs);
                    } else {
                        setArgs2(newArgs);
                    }
                    updateFunc();
                }} />
            </div>
            {renderFilters(currentArgs, updateFunc, isArgs1)}
        </div>
    };

    const renderMonthlyFilters = (currentArgs, updateFunc) => {
        return <div className="filter-row">
            {renderFilters(currentArgs, updateFunc, false)}
        </div>
    };

    useEffect(() => {
        isMountedRef.current = true;
        
        const initializeData = async () => {
            await updateData(1, args);
            await updateData(2, args2);
            await updateMonthlyData(monthlyArgs);
            if (isMountedRef.current) {
                const availableReleases = await get(`https://api.adoptopenjdk.net/v3/info/available_releases`);
                setVersions(availableReleases.available_releases);
            }
        };
        
        initializeData();
        
        return () => {
            isMountedRef.current = false;
        };
    }, []);

    if (!series || !series2 || !monthlyData) return null;

    return <>
        <LineChart series={createSeries(series, series2)} categories={max(categories, categories2)} name="Tracking Trends" />
        <div className="filters-box">
            {renderTrackingFilters(args, () => updateData(1, args), true)}
            {renderTrackingFilters(args2, () => updateData(2, args2), false)}
            <div className="column days">
                <div>Days</div>
                <Slider 
                    defaultValue={days}
                    max={180}
                    onAfterChange={value => {
                        setDays(value);
                        updateData(1, args);
                        updateData(2, args2);
                    }}
                />
            </div>
        </div>
        <BarChart data={monthlyData} name="Monthly Trends" />
        <div className="filters-box">
            {renderMonthlyFilters(monthlyArgs, () => updateMonthlyData(monthlyArgs))}
        </div>
    </>
}
