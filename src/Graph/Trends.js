import React, { Component } from 'react';
import { api } from "../api";
import LineChart from "./LineChart.js";
import moment from 'moment';
import { Button, Radio, Checkbox } from 'antd';
import { Stats } from 'fs';
import './Trends.css';

export default class Trends extends Component {
    state = { 
        series: undefined,
        series2: undefined,
        categories: undefined,
        args: {
            source: undefined,
            feature_version: undefined,
            jvm_impl: undefined
        },
        args2: {
            source: undefined,
            feature_version: undefined,
            jvm_impl: undefined
        }
    };

    async componentDidMount() {
        this.updateData(1, this.state.args);
        this.updateData(2, this.state.args2);
    }

    async updateData(seriesID, args) {
        let params = {}
        if(args.source) params.source = args.source
        if(args.feature_version) params.feature_version = args.feature_version
        if(args.jvm_impl) params.jvm_impl = args.jvm_impl

        const data = await api.tracking(params)

        if (data) {
            const categories = data.map(({ date }) => moment(date).format('DD-MM-YYYY'));

            switch(seriesID) {   
                case 1: this.setState({categories, series: this.processData(seriesID, data, true)}); break;
                case 2: this.setState({categories, series2: this.processData(seriesID, data, true)}); break;
            }
        }
    }

    processData(seriesID, data, visibleTatal = false) {
        const daily = data.map(({ daily }) => daily);

        const series = [{
            name: "Series" + seriesID,
            data: daily,
            visible: visibleTatal
        }];
        return series;
    }

    renderFilters(seriesID, args) {
        return <div className="filters">
            <div className="column">
                <div>Source</div>
                <Radio.Group name={"source"}
                    defaultValue={args.source}
                    onChange={e => {args.source = e.target.value; this.updateData(seriesID, args)}}
                    options={[
                        { label: 'None', value: undefined },
                        { label: 'Github', value: 'github' },
                        { label: 'Docker', value: 'dockerhub' }
                    ]}
                />
            </div>
            <div className="column">
                <div>Feature Version</div>
                <Radio.Group name={"feature_version"}
                    defaultValue={args.feature_version}
                    onChange={e => {args.feature_version = e.target.value; this.updateData(seriesID, args)}}
                    options={[
                        { label: 'None', value: undefined },
                        { label: 'JDK 8', value: 8 },
                        { label: 'JDK 9', value: 9 },
                        { label: 'JDK 10', value: 10 },
                        { label: 'JDK 11', value: 11 },
                        { label: 'JDK 12', value: 12 },
                        { label: 'JDK 13', value: 13 },
                        { label: 'JDK 14', value: 14 },
                    ]}
                />
            </div>
            <div className="column">
                <div>JVM Impl</div>
                <Radio.Group name={"jvm_impl"}
                    defaultValue={args.jvm_impl}
                    onChange={e => {args.jvm_impl = e.target.value; this.updateData(seriesID, args)}}
                    options={[
                        { label: 'None', value: undefined },
                        { label: 'HotSpot', value: 'hotspot' },
                        { label: 'OpenJ9', value: 'openj9' }
                    ]}
                />
            </div>
        </div>
    }

    render() {
        let state = this.state;
    
        if (!state.series || !state.series2) return null;

        let fullSeries = []
        Array.prototype.push.apply(fullSeries, state.series)
        Array.prototype.push.apply(fullSeries, state.series2)

        return <>
            <LineChart series={fullSeries} categories={state.categories} name="Tracking Trends" />
        
            <div className="filters-box">
                {this.renderFilters(1, state.args)}
                {this.renderFilters(2, state.args2)}
            </div>
        </>
    }
}