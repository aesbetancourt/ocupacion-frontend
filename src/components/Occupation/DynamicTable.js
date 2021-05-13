// Importing needed components
import React, {useState, useEffect, forwardRef, useImperativeHandle} from 'react';
import {Input, Space, Empty, Col, Row} from 'antd';
import moment from 'moment'
import EditableTable from 'antd-editabletable';


// Constants
// Axios Defaults
const axiosInstance = require("../../utils/request").default;
let originData = []

let noData = {
    emptyText: (<Empty description = {
        <span>
          Sin Ocupación
        </span>
    }
    />),
};


// Exported Component
const DynamicTable = forwardRef((props, ref) => {

    // const [activities, setActivities] = useState([]);
    // const [collaborators, setCollaborators] = useState([]);


    const [dataSource, setDataSource] = useState([]);
    const [spinningStatus, setSpinningStatus] = useState(true);

    // const [dataSource, setDataSource] = React.useState([getNewRecord('1'),getNewRecord('2'),getNewRecord('3')]);
    // const [selectedRowKeys, setSelectedRowKeys] = React.useState([]);

    function getData(){
        originData = [];
        setDataSource([])
        axiosInstance.get('/no_portafolio/occupation')
            .then(async function (response) {
                // console.log(response.data[0].collaborators.col_name)
                for (let i = 0; i < response.data.length ; i++) {
                    originData.push({
                        key: response.data[i].occ_id,
                        activity: response.data[i].activities.act_title ,
                        name: response.data[i].collaborators.col_name + " " + response.data[i].collaborators.col_last_name,
                        pert: response.data[i].occ_percentage,
                        start: moment(response.data[i].occ_start_date),
                        end: moment(response.data[i].occ_end_date),
                    });
                }
                await setDataSource(originData)
                await setSpinningStatus(false)
            })
            .catch(function (err) {
                console.log(err)
            })
            .then(function () {
            });
    }
function saveData(key, value, record, newDataSource){
        // console.log(record)
        let id = record.key;
        let pert = record.pert;
        let start = moment(record.start).format("YYYY-MM-DD");
        let end = moment(record.end).format("YYYY-MM-DD");
        
        // console.log(id, pert, start, end)

        axiosInstance.put('/no_portafolio/occupation', {
            "id": id,
            "percentage": pert,
            "start": start,
            "end": end
        })
        .then(async function (response) {
            // console.log(response)
        })
        .catch(function (err) {
            console.log(err)
        })
        .then(function () {
            // console.log("Ok")
        });

    }
    useImperativeHandle(ref, () => ({
        addOccupation(){
            setSpinningStatus(true)
            getData()
        }
    }));

    //Get all Occupation

    useEffect(  () => {
        getData()
    }, [])


    //Editable Table Config
    const getConfig = (formItemType) => {
        const map = {
            INPUT: {
                readonly: true
            },
            SELECT: {
                options: [
                    { name: 'a', value: '1' },
                    { name: 'b', value: 'b' },
                ],
                validateRules: [{ required: true, message: 'Debe seleccionar una opción' }],
            },
            INPUT_NUMBER:{
                value: `${parseInt(Math.random() * 100, 10)}`,
                validateRules: [{ required: true, message: 'Debe seleccionar un porcentaje' }],
            },
            DATE_PICKER: {
                format: "DD-MM-YYYY",
                validateRules: [{ required: true, message: 'Debe seleccionar una fecha' }],
            },


        }
        return {
            formItemType,
            ...map[formItemType],
        }
    }
    const getColumns = () => {
        return [
            {
                title: 'Actividad',
                dataIndex: 'activity',
                ...getConfig("INPUT"),
                key: 'activity',
                width: "30%"
            },
            {
                title: 'Colaborador',
                dataIndex: 'name',
                key: 'name',
                 ...getConfig("INPUT"),
                width: "25%"
            },
            {
                title: '%',
                dataIndex: 'pert',
                ...getConfig("INPUT_NUMBER"),
                key: 'pert',
                width: "7%"
            },
            {
                title: 'Inicio',
                dataIndex: 'start',
                ...getConfig("DATE_PICKER"),
                key: 'start',
                width: "15%"
            },
            {
                title: 'Fin',
                dataIndex: 'end',
                ...getConfig("DATE_PICKER"),
                key: 'end',
                width: "15%"
            },
            {
                title: 'Acción',
                key: 'action',
                render: (text, record) => (
                    <Space size="middle">
                        <a onClick={() => {deleteOccupation(record.key)}}>Eliminar</a>
                    </Space>
                ),
            },
        ]
    };


    // Delete Occupation
    function deleteOccupation(id) {
        axiosInstance.delete("no_portafolio/occupation/"+id)
            .then(function (res) {
                setSpinningStatus(true)
                getData()
                console.log(res)
            })
            .catch(function (err) {
            })
            .then(function () {
            });
    }

    return (
        <div>
            {/*<AutoComplete*/}
            {/*    placeholder="Buscar Nombre"*/}
            {/*    dataSource={dataSource.map(person => person.name)}*/}
            {/*>*/}
            {/*    <Input.Search*/}
            {/*        onSearch={nameSearch => setDataSource(originData.filter(person => person.name.includes(nameSearch)))}*/}
            {/*    />*/}
            {/*</AutoComplete> */}
            <Row  style={{  marginBottom: "20px"}}>
                <Col>
                    <Input.Search
                        placeholder="Buscar por Actividad"
                        onSearch={activitySearch => setDataSource(originData.filter(person => person.activity.includes(activitySearch)))}
                    />
                </Col>
                <Col>
                    <Input.Search
                        placeholder="Buscar por Colaborador"
                        onSearch={nameSearch => setDataSource(originData.filter(person => person.name.includes(nameSearch)))}
                        style={{  marginLeft: "20px"}}
                    />
                </Col>
            </Row>



            <EditableTable
                // pagination={false}
                loading={spinningStatus}
                locale={noData}
                rowKey={record => record.key}
                columns={getColumns()}
                dataSource={dataSource}
                size="small"
                onChange={(key, value, record, newDataSource) => {saveData(key, value, record, newDataSource)}}
                // onChange={(key, value, record) => {console.log(key, value, record)}}
                // onBlur={() => {console.log("Ok")}}
                // rowSelection={{
                //     selectedRowKeys,
                //     onChange: newSelectedRowKeys => {
                //         setSelectedRowKeys(newSelectedRowKeys);
                //     },

                // }}

            />

        </div>
    )
})
export default DynamicTable


