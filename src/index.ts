export const required = Symbol("required");

interface Env {
    NODE_ENV: "development" | "production" | "test",
    DEVELOPMENT: boolean,
    PRODUCTION: boolean,
    TESTING: boolean,
}

export type EnvVarGetter = (name: string) => string | undefined;

const defaultGetter: EnvVarGetter = () => undefined;

export const getEnv = function <T extends Record<string, any>>(env: T, getter = defaultGetter) {

    const processEnv = process.env;

    const NODE_ENV = processEnv.NODE_ENV as "development" | "production" | "test";

    const baseEnv: Env = {
        NODE_ENV,
        DEVELOPMENT: NODE_ENV === "development",
        PRODUCTION: NODE_ENV === "production",
        TESTING: NODE_ENV === "test",
    };

    const missing: Array<string> = [];

    const newEnv: Record<string, any> = {};

    for (const [name, defaultValue] of Object.entries(env)) {
        const value = processEnv[name] || getter(name) || defaultValue;
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
    } as Env & Record<keyof T, string>;
};
