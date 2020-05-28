import { get } from "./utils";

//var address = "https://api.adoptopenjdk.net/"
var address = "http://localhost:8080/"

export const api = {
    downloads: (jdkVersion = "") => get(`${address}v3/stats/downloads/total/${jdkVersion}`),
    tracking: ({ source, feature_version, jvm_impl, days, ...rest }) => get(`${address}v3/stats/downloads/tracking/`, { source, feature_version, jvm_impl, days, ...rest }),
    monthly: ({ source, feature_version, jvm_impl, ...rest }) => get(`${address}v3/stats/downloads/monthly/`, { source, feature_version, jvm_impl, ...rest })
};