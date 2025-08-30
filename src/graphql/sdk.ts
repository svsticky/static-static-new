import "dotenv/config";

import { GraphQLClient } from "graphql-request";
import { getSdk, type Exact } from "./rawSdk";

const client = new GraphQLClient(process.env["GRAPHQL_URL"]!);
const sdk = getSdk(client);

type VariablesOf<T> = T extends (variables: infer U, ...rest: infer _P) => infer _R ? U : never;

type WithOptionalVariables<T> = 
    T extends (variables: {}, ...rest: infer P) => infer R
        ? (variables?: {}, ...rest: P) => R
        : T;

type SdkFunction<Query extends keyof typeof sdk> = WithOptionalVariables<(
    variables: Exact<Omit<VariablesOf<typeof sdk[Query]>, "locale">>,
    requestHeaders?: HeadersInit,
    signal?: RequestInit["signal"]
) => ReturnType<typeof sdk[Query]>>;

export default function (locale: string) {
    const newSdk: Partial<{ [query in keyof typeof sdk]: SdkFunction<query> }> = {};
    for (const query in sdk) {
        // @ts-ignore
        newSdk[query] = function (variables = {}, requestHeaders, signal) {
            // @ts-ignore
            return sdk[query]({ locale, ...variables }, requestHeaders, signal);
        };
    }
    return newSdk as Required<typeof newSdk>;
}