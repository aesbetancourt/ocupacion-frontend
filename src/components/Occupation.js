// Importing needed components
import React, {useState, useEffect} from 'react';
import  { Input, Divider, Row, Col, Select, DatePicker, InputNumber, Button } from 'antd';
import moment from 'moment'
import EditableTable from 'antd-editabletable';
const { Option } = Select;

// Constants
// Axios Defaults
const axiosInstance = require("../utils/request").default;
 let originData = []


// Exported Component
const Occupation = () =>{

    // const [activities, setActivities] = useState([]);
    // const [collaborators, setCollaborators] = useState([]);


    const [activityID, setActivityID] = useState("");
    const [collaboratorID, setCollaboratorID] = useState("");
    const [percentage, setPercentage] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [dataSource, setDataSource] = React.useState([]);





    function getData(){
        axiosInstance.get('/no_portafolio/occupation')
            .then(async function (response) {
                // console.log(response.data[0].activities.act_title)
                for (let i = 0; i < response.data.length ; i++) {
                  originData.push({
                        key: i,
                        activity: response.data[i].activities.act_title ,
                        name: response.data[i].collaborators.col_name + " " + response.data[i].collaborators.col_last_name,
                        pert: response.data[i].occ_percentage,
                        start: moment(response.data[i].occ_start_date),
                        end: moment(response.data[i].occ_end_date),
                    });
                }
                await setDataSource(originData)
            })
            .catch(function (error) {
            })
            .then(function () {
                console.log("ok")
            });
    }

    useEffect(  () => {
        getData()

    }, [])



    // for (let i = 0; i < 100; i++) {
    //     originData.push({
    //         key: i.toString(),
    //         name: `Edrward ${i}`,
    //         // age: 32,
    //         // address: `London Park no. ${i}`,
    //     });
    // }





    function activityChange(e){
        // console.log(e)
        setActivityID(e)
    }
    function collaboratorChange(e){
        // console.log(e)
        setCollaboratorID(e)
    }
    function percentageChange(e){
        // console.log(e)
        setPercentage(e)
    }
    function dateChange(e){
        if (e !== null){
            // Start date
            let  startDateObj = new Date(e[0]._d);
            let  startMomentObj = moment(startDateObj);

            // End Date
            let  endDateObj = new Date(e[1]._d);
            let  endMomentObj = moment(endDateObj);

            setStartDate(startMomentObj.format("YYYY-MM-DD"))
            setEndDate(endMomentObj.format("YYYY-MM-DD"))
        }
    }
    function createOcc(){
        // console.log("Activity ID:", activityID)
        // console.log("Colab ID:", collaboratorID)
        // console.log("Percentage:", percentage)
        // console.log("Start date:", startDate)
        // console.log("End Date:", endDate)

        axiosInstance.post('/no_portafolio/occupation', {
            "col_id": collaboratorID,
            "act_id": activityID,
            "percentage": percentage,
            "start": startDate,
            "end": endDate
        })
            .then(res => {
                // handle success
                console.log(res.statusText)
            })
            .catch(err => {
                // handle error
                console.log(err);
            })
            .then(function () {
                // always executed
            });
    }

    //


    const getConfig = (formItemType) => {
        const map = {
            SELECT: {
                options: [
                    { name: 'a', value: 'a' },
                    { name: 'b', value: 'b' },
                ],
                validateRules: [{ required: true, message: '请选择' }],
            },
            INPUT_NUMBER:{
                value: `${parseInt(Math.random() * 100, 10)}`,
                validateRules: [{ required: true, message: '请输入' }],
            },
            DATE_PICKER: {
                validateRules: [{ required: true, message: '请选择' }],
            },

        }
        return {
            formItemType,
            ...map[formItemType],
        }
    }
    // const getNewRecord = key => {
    //     console.log(key)
    //     return {
    //         key,
    //         SELECT: undefined,
    //         INPUT_NUMBER: undefined,
    //         DATE_PICKER: undefined,
    //
    //     };
    // };
    const getColumns = () => {
        return [
            {
                title: 'Actividad',
                dataIndex: 'activity',
                ...getConfig("SELECT")
            },
            {
                title: 'Colaborador',
                dataIndex: 'name',
                ...getConfig("SELECT")
            },
            {
                title: '%',
                dataIndex: 'pert',
                ...getConfig("INPUT_NUMBER")
            },
            {
                title: 'Inicio',
                dataIndex: 'start',
                ...getConfig("DATE_PICKER")
            },
            {
                title: 'Fin',
                dataIndex: 'end',
                ...getConfig("DATE_PICKER")
            }
        ]
    };

    return (
        <div>
            <Divider orientation="left">Ingreso de Ocupación</Divider>
            <Row>
                <Col span={6} order={4}>
                    <Button
                        type="primary"
                        onClick={createOcc}
                        style={{  marginTop: "19px", marginLeft: "80px", width: "200px" }}
                    >Insertar ocupación</Button>
                </Col>
                <Col span={6} order={3}>
                    <h6>Ocupación</h6>
                    <Input.Group compact>
                        <InputNumber
                            defaultValue={0}
                            min={0}
                            max={100}
                            formatter={value => `${value}%`}
                            parser={value => value.replace('%', '')}
                            // style={{  marginTop: "19px" }}
                            onChange={percentageChange}
                        />
                        <DatePicker.RangePicker
                            style={{ width: '70%'}}
                            onChange={dateChange}
                            format="DD-MM-YYYY"
                            placeholder={['Fecha de inicio', 'Fecha de fin']}
                        />
                    </Input.Group>
                </Col>
                <Col span={6} order={2}>
                    <h6>Colaborador</h6>
                    <Select
                        onChange={collaboratorChange}
                        showSearch
                        style={{ width: 300 }}
                        placeholder="Seleccionar Colaborador"
                        optionFilterProp="children"
                        filterOption={(input, option) =>
                            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }
                        filterSort={(optionA, optionB) =>
                            optionA.children.toLowerCase().localeCompare(optionB.children.toLowerCase())
                        }
                    >
                        <Option value="1">Not Identified</Option>
                        <Option value="2">Closed</Option>
                        <Option value="3">Communicated</Option>
                        <Option value="4">Identified</Option>
                        <Option value="5">Resolved</Option>
                        <Option value="6">Cancelled</Option>
                    </Select>
                </Col>
                <Col span={6} order={1}>
                    <h6>Actividad</h6>
                    <Select
                        onChange={activityChange}
                        showSearch
                        style={{ width: 300 }}
                        placeholder="Seleccionar Actividad"
                        optionFilterProp="children"
                        filterOption={(input, option) =>
                            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }
                        filterSort={(optionA, optionB) =>
                            optionA.children.toLowerCase().localeCompare(optionB.children.toLowerCase())
                        }
                    >
                        <Option value="1">Not Identified</Option>
                        <Option value="2">Closed</Option>
                        <Option value="3">Communicated</Option>
                        <Option value="4">Identified</Option>
                        <Option value="5">Resolved</Option>
                        <Option value="6">Cancelled</Option>
                    </Select>
                </Col>
            </Row>
            <Divider orientation="Center">Tabla General</Divider>
            <EditableTable
                // pagination={false}
                // size="middle"
                // showAdd
                rowKey={record => record.key}
                // onAdd={() => {
                //     setDataSource([...dataSource, getNewRecord(`${dataSource.length+1}`)]);
                // }}
                // addText="添加"
                columns={getColumns()}
                dataSource={dataSource}
                // onChange={(key, value, record, newDataSource) => {
                //     setDataSource(newDataSource);
                // }}
                onChange={(key, value, record, newDataSource) => {console.log(key, value, record, newDataSource)}}
                // scroll={{y:window.innerHeight - 300}}
            />
        </div>
    )
}
export default Occupation


