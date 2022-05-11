import { env as processEnv } from "process";

export const required = Symbol("required");

export type EnvVarGetter = (name: string) => string | undefined;

const defaultGetter: EnvVarGetter = () => undefined;

/**
 * @example
 * const env = getEnv({
 *      VAR_1: "defaultValue",
 *      VAR_2: required, // required value
 * });
 * @param env Env Source Object
 * @param getter Env variable getter
 */
export const getEnv = function <T extends Record<string, any>>(env: T, getter = defaultGetter) {

    const NODE_ENV = processEnv.NODE_ENV as "development" | "production" | "test";

    const baseEnv = {
        NODE_ENV,
        DEVELOPMENT: NODE_ENV === "development",
        PRODUCTION: NODE_ENV === "production",
        TESTING: NODE_ENV === "test",
    };

    const missing: Array<string> = [];

    const newEnv: Record<string, any> = {};

    for (const [name, defaultValue] of Object.entries(env)) {
        const value = processEnv[name] ?? getter(name) ?? defaultValue;
        if (value === required) {
            missing.push(name);
        } else {
            newEnv[name] = value;
        };
    };

    if (missing.length) throw new Error(`Missing environment variables: ${missing.join(", ")}`);

    return {
        ...newEnv,
        ...baseEnv,
    } as typeof baseEnv & Record<keyof T, string>;
};
