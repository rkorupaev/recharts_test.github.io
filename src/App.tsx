// @ts-nocheck
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";

const data = [
    {
        name: "Page A",
        uv: 4000,
        pv: 2400,
        amt: 2400,
    },
    {
        name: "Page B",
        uv: 3000,
        pv: 1398,
        amt: 2210,
    },
    {
        name: "Page C",
        uv: 3000,
        pv: 19800,
        amt: 2290,
    },
    {
        name: "Page D",
        uv: 3780,
        pv: 908,
        amt: 2000,
    },
    {
        name: "Page E",
        uv: 2890,
        pv: 14800,
        amt: 2181,
    },
    {
        name: "Page F",
        uv: 2390,
        pv: 13800,
        amt: 2500,
    },
    {
        name: "Page G",
        uv: 3490,
        pv: 14300,
        amt: 2100,
    },
];

const uvValues = data.map((d) => d.uv);
const pvValues = data.map((d) => d.pv);

const calculateZscore = (array, key) => {
    const mean = array.reduce((sum: number, val: number) => sum + val, 0) / array.length;
    const stdDev = Math.sqrt(
        array.reduce((sum: number, val: number) => sum + (val - mean) ** 2, 0) / array.length
    );

    return data.map((d) => {
        const zScore = (d[key] - mean) / stdDev;
        return {
            ...d,
            zScore,
            color: zScore > 1 ? "green" : "red",
        };
    });
};

const uvData = calculateZscore(uvValues, "uv");
const pvData = calculateZscore(uvValues, "pv");

const CustomDot = (props) => {
    const { cx, cy, dataKey, index } = props;
    const point = dataKey === "pv" ? pvData[index] : uvData[index];

    return (
        <circle
            cx={cx}
            cy={cy}
            r={5}
            fill={point.color}
            stroke="white"
            strokeWidth={1.5}
        />
    );
};

const CustomActiveDot = (props) => {
    const { cx, cy, dataKey, index } = props;
    const point = dataKey === "pv" ? pvData[index] : uvData[index];

    return (
        <circle
            cx={cx}
            cy={cy}
            r={5}
            fill={point.color}
            stroke="black"
            strokeWidth={1.5}
        />
    );
};

export default function App() {
    return (
        <ResponsiveContainer width={"100%"} height={300}>
            <LineChart
                width={500}
                height={300}
                data={data}
                margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                }}
            >
                <defs>
                    <linearGradient id="colorUv" x1="0%" y1="0%" x2="0%" y2="100%">
                        {calculateZscore(uvValues, "uv").map((d, index) => {
                            const offset = (index / (data.length - 1)) * 100; // Convert to percentage
                            return (
                                <stop key={index} offset={`${offset}%`} stopColor={d.color} />
                            );
                        })}
                    </linearGradient>
                    <linearGradient id="colorPv" x1="0%" y1="0%" x2="0%" y2="100%">
                        {calculateZscore(pvValues, "pv").map((d, index) => {
                            const offset = (index / (data.length - 1)) * 100; // Convert to percentage
                            return (
                                <stop key={index} offset={`${offset}%`} stopColor={d.color} />
                            );
                        })}
                    </linearGradient>
                </defs>
                <Line
                    type="monotone"
                    dataKey="pv"
                    stroke="url(#colorPv)"
                    dot={<CustomDot />}
                    activeDot={<CustomActiveDot />}
                />
                <Line
                    type="monotone"
                    dataKey="uv"
                    stroke="url(#colorUv)"
                    dot={<CustomDot />}
                    activeDot={<CustomActiveDot />}
                />
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
            </LineChart>
        </ResponsiveContainer>
    );
}
