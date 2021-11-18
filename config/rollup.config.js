import dts from "rollup-plugin-dts";
import { terser } from "rollup-plugin-terser";

const devMode = process.env.NODE_ENV === "development";

const config = [
    {
        input: "./private/lib/compiled/index.d.ts",
        output: [{
            file: "private/lib/bundled/index.d.ts",
            format: "es",
        }],
        plugins: [dts()],
    },
    {
        input: "./private/lib/compiled/index.js",
        output: [{
            file: "lib/index.js",
            format: "cjs",
        }],
        plugins: [
            terser({
                ecma: 2020,
                mangle: { toplevel: true },
                compress: {
                    module: true,
                    toplevel: true,
                    unsafe_arrows: true,
                    drop_console: !devMode,
                    drop_debugger: !devMode,
                },
                output: { quote_style: 1 },
            }),
        ],
    },
];

export default config;
