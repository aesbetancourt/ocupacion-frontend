import React, {useState} from 'react';
import  { 
    Form, 
    Divider, 
    Table, 
    Pagination,  
    Spin,
    ConfigProvider, 
    message, 
    Select,
    DatePicker,
    Button
} from 'antd';
import {
    FileExcelOutlined
} from '@ant-design/icons';
import esp from 'antd/es/locale/es_ES';
import axios from '../../../utils/request'
import RowFormatter from './RowFormatter'
import 'moment/locale/es';
import ReactExport from 'react-data-export';
const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const { Option } = Select;
const { RangePicker } = DatePicker
// Constants

// Exported Component
const TableReports = () =>{
    const styleTitle = {
        fill: {
            patternType: "solid", 
            fgColor: {rgb: "888888"}
        },
        font: {
            color: {rgb: "000000"},
            bold:true
        }
    }
    const [dataSource, setDataSource] = useState([]);
    const [printDataSet, setPrintDataSet] = useState([
        {
            columns: [
                {
                    title: "Sede", 
                    width: {wch: 20}, 
                    style: styleTitle
                },{
                    title: "Cliente", 
                    width: {wch: 20}, 
                    style: styleTitle
                },{
                    title: "Colaborador", 
                    width: {wch: 80}, 
                    style: styleTitle
                },{
                    title: "Actividad", 
                    width: {wch: 80}, 
                    style: styleTitle
                },{
                    title: "Sum(HH Clockify)", 
                    width: {wch: 20}, 
                    style: styleTitle
                },{
                    title: "% Ocupación ", 
                    width: {wch: 20}, 
                    style: styleTitle
                },{
                    title: "% Real", 
                    width: {wch: 20}, 
                    style: styleTitle
                },{
                    title: "Grupo Solucionador", 
                    width: {wch: 20}, 
                    style: styleTitle
                }
            ],
            data: []
        }
    ]);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(20);
    const [total, setTotal] = useState(0);
    const [reload, setReload] = useState(0);
    const [reload2, setReload2] = useState(0);
    const [loading, setLoading] = useState(false);
    const [loading2, setLoading2] = useState(false);
    //filters data
    const [clients, setClients] = useState([]);
    const [collaborators, setCollaborators] = useState([]);
    const [activities, setActivities] = useState([]);
    //filters selected
    const [filtersObj, setFiltersObj] = useState({});
    const [filtersQuery, setFiltersQuery] = useState('');
    const syncFilters = (async () => {
        let data = await axios.get(`/filters/clients?status=1`)
            .then( async clients =>{
                return await axios.get(`/filters/collaborators`)
                    .then( async collaborators =>{
                        return await axios.get(`/filters/activities`)
                            .then( activities_res =>{
                                return { 
                                    dataSource,
                                    total, 
                                    loading: false, 
                                        clients: clients.data, 
                                    collaborators: collaborators.data, 
                                    activities: activities_res.data 
                                }
                            })
                            .catch( err =>{
                                message.error('¡Error de conexión!');
                                return { dataSource: [], total: 0 }
                            });
                    })
                    .catch( err =>{
                        message.error('¡Error de conexión!');
                        return { dataSource: [], total: 0 }
                    });
            })
            .catch( err =>{
                message.error('¡Error de conexión!');
                return { dataSource: [], total: 0 }
            });
        return data
    })
    const syncTable = (async () => {
        const query = `page=${page-1}&limit=${limit}${filtersQuery}`;
        let data = await axios.get(`/reports/2?${query}`)
            .then( async data =>{
                let dataSource = data.data.rows.map( el => {
                    return{
                        key: reload+"-"+el.occ_id,
                        total: el.summary_time_card.length > 0 ? 
                            el.summary_time_card.map(el => el.sum_hh).reduce((a, b) => a + b, 0)
                            :
                            0,
                        ...el,
                    }
                })
                let total = data.data.count;
                return { 
                    dataSource,
                    total, 
                    loading: false
                }
            })
            .catch( err =>{
                message.error('¡Error de conexión!');
                return {}
            });
        return data
    })
    const onSelectFilter = (data, field) => {
        let copy = filtersObj;
        for (let index = 0; index < field.length; index++) {
            copy[field[index]] = data[index];
        }
        setFiltersObj(copy)
        let str = '';
        const keys = Object.keys(copy)
        for (let index = 0; index < keys.length; index++) {
            if(copy[keys[index]]){
                str += '&'+keys[index]+'='+copy[keys[index]]
            }
        }
        setFiltersQuery(str)
        setReload2(reload2+1)
    }
    const onClearFilter = (field) => {
        let copy = filtersObj;
        for (let index = 0; index < field.length; index++) {
            copy[field[index]] = undefined;
        }
        setFiltersObj(copy)
        let str = '';
        const keys = Object.keys(copy)
        for (let index = 0; index < keys.length; index++) {
            if(copy[keys[index]]){
                str += '&'+keys[index]+'='+copy[keys[index]]
            }
        }
        setFiltersQuery(str)
        setReload2(reload2+1)
    }
    const onSizeChange = (currPage, currSize) => {
        setPage(currPage)
        setLimit(currSize)
        setReload(reload+1)
      }
    const onPageChange = (currPage, currSize) => {
        setPage(currPage)
        setLimit(currSize)
        setReload(reload+1)
    }
    const checkOptions = (data1, data2) =>{
        return data1 !== undefined 
            && data1 !== null
            && data1 !== "null"
            && data1 !== "undefined" ?
                data1 : data2
    }
    const mapObj = (row, parent) => {
        return {
            parent,
            act_id: row.act_id,
            Sede: !parent ? (row.collaborators? 
                row.collaborators.col_campus
                :
                'No portafolio') : '-',
            Cliente:  parent ?  row.activities.clients.cli_name : '-',
            Colaborador:  !parent ?  row.collaborators.col_name + ' '+row.collaborators.col_last_name : '-',
            Actividad:  parent ?  row.activities.act_title : '-',
            sum_hh: row.summary_time_card.length > 0 ? 
                row.summary_time_card.map(el => el.sum_hh).reduce((a, b) => a + b, 0)
                :
                0,
            OcupacionPerc: !parent ? row.occ_percentage : '-',
            OcupacionReal:  !parent ? row.occ_real : '-',
            por_solver_group:  parent ?  (row.activities.portfolio_requests ? 
                row.activities.portfolio_requests.por_solver_group
                :
                'No portafolio') : '-',
            activities: row.activities
        }
    }
    React.useEffect(  () => {
        const runSync = async (fetchData) => {
            let data = await fetchData()
            setLoading(checkOptions(data.loading, loading))
            setClients(checkOptions(data.clients, clients))
            setCollaborators(checkOptions(data.collaborators, collaborators))
            setActivities(checkOptions(data.activities, activities))
        }
        setLoading(true)
        runSync(syncFilters)
    }, [reload])// eslint-disable-line react-hooks/exhaustive-deps
    React.useEffect(  () => {
        const runSync = async (fetchData) => {
            let data = await fetchData()
            let  copyPrintDataSet = printDataSet;
            const currDataSrc = checkOptions(data.dataSource, dataSource)
            let copy = [], dup = false;
            for (let index = 0; index < currDataSrc.length; index++) {
                if(index === 0){
                    copy.push({
                        ...mapObj(currDataSrc[index], true),
                        children: [mapObj(currDataSrc[index], false)]
                    })
                }else{
                    dup = false;
                    for (let index2 = 0; index2 < copy.length; index2++) {
                        if(currDataSrc[index].act_id === copy[index2].act_id){
                            copy[index2].children.push(mapObj(currDataSrc[index], false)) 
                            copy[index2].sum_hh = copy[index2].children.map(el => el.sum_hh).reduce((a, b) => a + b, 0);
                            dup = true;
                            break;
                        }
                    }
                    if(!dup){
                        copy.push({
                            ...mapObj(currDataSrc[index], true),
                            children: [mapObj(currDataSrc[index], false)]
                        })
                    }
                }
            }
            setDataSource(copy)
            setTotal(checkOptions(data.total, total))
            setLoading2(checkOptions(data.loading, loading))
            let data2Print = [];
            const styleSub = {
                fill: {
                    patternType: "solid", 
                    fgColor: {rgb: "AAAAAA"}
                },
                font: {
                    color: {rgb: "000000"},
                    bold:true
                }
            }
           //Sede / Cliente / Colaborador / Actividad / Sum(HH Clockify) / % Ocupación / % Real / Grupo Solucionador
            for (let index = 0; index < copy.length; index++) {
                data2Print.push([
                    {value: copy[index].Sede, style: styleSub},
                    {value: copy[index].Cliente, style: styleSub},
                    {value: copy[index].Colaborador, style: styleSub},
                    {value: copy[index].Actividad, style: styleSub},
                    {value: copy[index].sum_hh, style: styleSub},
                    {value: copy[index].OcupacionPerc, style: styleSub},
                    {value: copy[index].OcupacionReal, style: styleSub},
                    {value: copy[index].por_solver_group, style: styleSub}
                ])
                for (let index2 = 0; index2 < copy[index].children.length; index2++) {
                    data2Print.push([
                        {value: copy[index].children[index2].Sede},
                        {value: copy[index].children[index2].Cliente},
                        {value: copy[index].children[index2].Colaborador},
                        {value: copy[index].children[index2].Actividad},
                        {value: copy[index].children[index2].sum_hh},
                        {value: copy[index].children[index2].OcupacionPerc},
                        {value: copy[index].children[index2].OcupacionReal},
                        {value: copy[index].children[index2].por_solver_group}
                    ])
                }
            }
            copyPrintDataSet[0].data = data2Print
            setPrintDataSet(copyPrintDataSet)
        }
        setLoading2(true)
        runSync(syncTable)
    }, [reload2])// eslint-disable-line react-hooks/exhaustive-deps
    let columns = [
        {
            title: RowFormatter.ToolTitle('Sede', 'Nombre de la sede.'),
            key: 'cli_id',
            render: (data)=>{return(<RowFormatter.RenderText text={data.Sede}/>)}
        },
        {
            title: RowFormatter.ToolTitle('Cliente', 'Nombre del cliente.'),
            key: 'cli_id',
            render: (data)=>{return(<RowFormatter.RenderClient2 data={data.activities} parent={data.parent}/>)}
        },
        {
            title: RowFormatter.ToolTitle('Colaborador', 'Nombre del Colaborador'),
            key: 'cli_id',
            render: (data)=>{return(<RowFormatter.RenderSolverGroup text={data.Colaborador}/>)}
        },
        {
            title: RowFormatter.ToolTitle('Actividad', 'Titulo de la actividad.'),
            key: 'cli_id',
            render: (data)=>{return(<RowFormatter.RenderText text={data.Actividad}/>)}
        },
        {
            title: RowFormatter.ToolTitle('% Ocupación ', 'Ocupación estimada.'),
            key: 'cli_id',
            render: (data)=>{return(<RowFormatter.RenderText text={data.OcupacionPerc} align={'center'}/>)}
        },
        {
            title: RowFormatter.ToolTitle(' % Real', 'Ocupación real.'),
            key: 'cli_id',
            render: (data)=>{return(<RowFormatter.RenderText text={data.OcupacionReal} align={'center'}/>)}
        },
        {
            title: RowFormatter.ToolTitle('Sum(HH Clockify)', 'Suma horas Clockify'),
            key: 'cli_id',
            render: (data)=>{return(<RowFormatter.RenderText text={data.sum_hh} align={'center'}/>)}
        },
        {
            title: RowFormatter.ToolTitle('Grupo Solucionador', 'Nombre del Grupo Solucionador'),
            key: 'cli_id',
            render: (data)=>{return(<RowFormatter.RenderSolverGroup text={data.por_solver_group}/>)}
        }
        
      ]; 
    return (
        <div>
            
            {
                loading ? 
                <Spin style={{ marginLeft: '50%', marginTop: '50px' }}/> 
                :
                (<ConfigProvider locale={esp}>
                    <div>
            <Divider orientation="left">Filtros</Divider>
            <Form 
                l>
                <Form.Item name="client" label="Clientes">
                    <Select 
                        placeholder="Cliente..."
                        showSearch
                        allowClear
                        onClear={
                            data => {
                                onClearFilter(['client'])
                            }
                        }
                        optionFilterProp="children"
                        filterOption={(input, option) =>
                            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }
                        onChange={
                            (data, data2)=>{
                                if(data2){
                                    onSelectFilter([data2.value2], ['client'])
                                }
                            }
                        } 
                        style={{ width: 180}}
                        >
                            {clients.map(el => {
                                return <Option key={el.cli_name} value={el.cli_name} value2={el.cli_id}>{el.cli_name}</Option>
                            } )}
                            </Select>
                    </Form.Item>
                <Form.Item name="activitie" label="Actividades">
                    <Select 
                        placeholder="Actividades..."
                        showSearch
                        allowClear
                        onClear={
                            data => {
                                onClearFilter(['activitie'])
                            }
                        }
                        optionFilterProp="children"
                        filterOption={(input, option) =>
                            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }
                        onChange={
                            (data, data2)=>{
                                if(data2){
                                    onSelectFilter([data2.value2], ['activitie'])
                                }
                            }
                        } 
                        style={{ width: 180}}
                        >
                            {activities.map(el => {
                                return <Option key={el.act_title} value={el.act_title} value2={el.act_id}>{el.act_title}</Option>
                            } )}
                            </Select>
                    </Form.Item>
                <Form.Item name="collaborator" label="Colaborador">
                    <Select 
                        placeholder="Colaborador..."
                        showSearch
                        allowClear
                        onClear={
                            data => {
                                onClearFilter(['collaborator'])
                            }
                        }
                        optionFilterProp="children"
                        filterOption={(input, option) =>
                            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }
                        onChange={
                            (data, data2)=>{
                                if(data2){
                                    onSelectFilter([data2.value2], ['collaborator'])
                                }
                            }
                        } 
                        style={{ width: 180}}
                        >
                            {collaborators.map(el => {
                                return <Option 
                                    key={el.col_name + ' '+el.col_last_name} 
                                    value={el.col_name + ' '+el.col_last_name} 
                                    value2={el.col_id_file}
                                    >
                                        {el.col_name + ' '+el.col_last_name}
                                        </Option>
                            } )}
                            </Select>
                    </Form.Item>
                <Form.Item name="dates" label="Fecha">
                    <RangePicker 
                        placeholder={["Fecha inicio...", "Fecha fin..."]}
                        allowClear
                        onClear={
                            data => {
                                onClearFilter(['minDate', 'maxDate'])
                            }
                        }
                        onChange={
                            (data, data2)=>{
                                if(data2){
                                    onSelectFilter(data2, ['minDate', 'maxDate'])
                                }
                            }
                        }
                        />
                    </Form.Item>
                </Form>
            </div>
            
            <Divider orientation="center">Reporte</Divider>
                    <Table 
                        loading={loading2}
                        dataSource={dataSource} 
                        columns={columns} 
                        pagination={false}
                        expandable={{ defaultExpandAllRows : true }}
                        />
                    <Pagination
                        loading={loading2}
                        style={{ paddingTop:'1%', float: 'right', paddingBottom: '30px'}}
                        total={total}
                        pageSizeOptions={[5, 10, 25, 50, 100]}
                        onShowSizeChange={onSizeChange}
                        defaultPageSize={limit}
                        onChange={onPageChange}
                        defaultCurrent={page}
                        />
            <Divider orientation="right">Exportar</Divider>
            <ExcelFile element={ <Button 
                    type="primary" 
                    style={{ backgroundColor: 'green', float: 'right'}}
                    icon={<FileExcelOutlined />}
                    loading={loading2}
                    disabled={dataSource.length === 0}
                    >
                        Exportar a Excel
                    </Button>}>
                    <ExcelSheet dataSet={printDataSet} name="Reporte 1"/>
                </ExcelFile>
                    </ConfigProvider>
                    )
                
            }
            
        </div>
    )
}
export default TableReports
