import { get } from "./utils";

//address = "https://api.adoptopenjdk.net/"
//address = "https://localhost:8080/"

// temporary
export const api = {
    downloads: (jdkVersion = "") => get(`http://localhost:8080/v3/stats/downloads/total/${jdkVersion}`),
    tracking: ({ source, feature_version, jvm_impl, docker_repo, ...rest }) => get(`http://localhost:8080/v3/stats/downloads/tracking/`, { source, feature_version, jvm_impl, docker_repo, ...rest }),
    monthly: () => get(`http://localhost:8080/v3/stats/downloads/monthly/`)
};