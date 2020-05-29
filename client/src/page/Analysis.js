import React, { Component } from 'react'
import { Row, Col, Divider } from 'antd';
import { Tabs, Input, DatePicker, Select, Button, Card, List, Typography, InputNumber } from 'antd';
import './analysis.css'
import { PieChart, Pie, Sector, Cell, ResponsiveContainer,
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ReferenceLine,
} from 'recharts';

//import rd3 from 'react-d3-library'
//const RD3Component = rd3.Component;


const data = [{ name: 'Group A', value: 400 }, { name: 'Group B', value: 300 },
{ name: 'Group C', value: 300 }, { name: 'Group D', value: 200 }];
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];
const RADIAN = Math.PI / 180;

const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
        <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
            {`${(percent * 100).toFixed(0)}%`}
        </text>
    );
};

class SimplePieChart extends Component {
    render() {
        let radius = 90
        //not responsive create svg
        return (
            <PieChart width={radius * 2} height={radius * 2} onMouseEnter={this.onPieEnter}>
                <Pie
                    data={data}
                    cx={radius}
                    cy={radius}
                    labelLine={false}
                    label={renderCustomizedLabel}
                    outerRadius={80}
                    fill="#8884d8"
                >
                    {
                        data.map((entry, index) => <Cell fill={COLORS[index % COLORS.length]} />)
                    }
                </Pie>
            </PieChart>

        );
    }
}

const data2 = [
    {
        name: 'Page A', uv: 4000, pv: 2400, amt: 2400,
    },
    {
        name: 'Page B', uv: -3000, pv: 1398, amt: 2210,
    },
    {
        name: 'Page C', uv: -2000, pv: -9800, amt: 2290,
    },
    {
        name: 'Page D', uv: 2780, pv: 3908, amt: 2000,
    },
    {
        name: 'Page E', uv: -1890, pv: 4800, amt: 2181,
    },
    {
        name: 'Page F', uv: 2390, pv: -3800, amt: 2500,
    },
    {
        name: 'Page G', uv: 3490, pv: 4300, amt: 2100,
    },
];


class Analysis extends Component {
    render() {

        return (
            <div style={{ marginTop: '2rem' }}>
                <div style={{ width: '95%', margin: '0 auto 2rem auto', backgroundColor:'rgb(234, 234, 225)', borderRadius:'.5rem' }}>
                <Divider style={{ backgroundColor: 'rgba(0,0,0,0)' }}></Divider>
                    <Row>
                        <Col xs={24} md={12}>
                            <Card title='一週時間比例'>
                                <SimplePieChart />
                            </Card>
                        </Col>
                        <Col xs={24} md={12}>
                            <Card title='expect time 差值排序'>
                                <BarChart
                                    width={500}
                                    height={300}
                                    data={data2}
                                    margin={{
                                        top: 5, right: 30, left: 20, bottom: 5,
                                    }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <ReferenceLine y={0} stroke="#000" />
                                    <Bar dataKey="pv" fill="#8884d8" />
                                    <Bar dataKey="uv" fill="#82ca9d" />
                                </BarChart>
                            </Card>
                        </Col>
                    </Row>
                    <Row justify='center'>
                        <Col className='sum-col'>
                        <h2>Summary</h2>
                        <p>0xfffff</p>
                        </Col>
                    </Row>
                </div>
            </div>
        )
    }
}

export default Analysis