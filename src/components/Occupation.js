// Importing needed components
import React, {useState, useRef, useEffect} from 'react';
import {Input, Divider, Row, Col, Select, DatePicker, InputNumber, Button} from 'antd';
import moment from 'moment'
import DynamicTable from './Occupation/DynamicTable'

const { Option } = Select;


// Constants
// Axios Defaults
const axiosInstance = require("../utils/request").default;
let activities = []
let collabs = []

axiosInstance.get('/no_portafolio/oactivities')
.then(async function (response) {
    for (let i = 0; i < response.data.length; i++) {
        activities.push(<Option value={response.data[i].act_id}>{response.data[i].act_title}</Option>);
    }
})
.catch(function (error) {
})
.then(function () {
});


axiosInstance.get('/no_portafolio/ocollabs')
.then(async function (response) {
    for (let i = 0; i < response.data.length; i++) {
        collabs.push(
            <Option value={response.data[i].col_id_file}>
                {response.data[i].col_name + " " + response.data[i].col_last_name}
            </Option>
        );
    }
})
.catch(function (error) {
})
.then(function () {
});


// Exported Component
const Occupation = () =>{


    const [activityID, setActivityID] = useState("");
    const [collaboratorID, setCollaboratorID] = useState("");
    const [percentage, setPercentage] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const childRef = useRef();



    // function  getData(){
   


    // }
    

    // useEffect(  () => {
    //     getData()
    //     console.log(activities)
    // }, [])

    // Create Occupation

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
            .then(async res => {
                // handle success
                console.log(res.statusText)

            })
            .catch(err => {
                // handle error
                console.log(err);
            })
            .then(function () {
                // always executed
                childRef.current.addOccupation()
            });
    }



    //


    return (
        <div>
            <Divider orientation="left">Ingreso de Ocupación</Divider>
            <Row>
                <Col span={6} order={4}>
                    <Button
                        disabled={(activityID.length === 0 || collaboratorID.length === 0 || percentage.length === 0 || startDate.length === 0 || endDate.length === 0)}
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
                        {activities}
                    </Select>
                </Col>
                <Col span={6} order={1}>
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
                    {collabs}
                    </Select>
                </Col>
            </Row>
            <Divider orientation="Center">Tabla General</Divider>
            <DynamicTable ref={childRef} />
        </div>
    )
}
export default Occupation


