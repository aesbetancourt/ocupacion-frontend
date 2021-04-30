import React, {useState} from 'react';
import  { 
    Form, 
    Divider, 
    Table, 
    Pagination,  
    Spin,
    ConfigProvider, 
    message, 
    Modal, 
    Select, 
} from 'antd';
import esp from 'antd/es/locale/es_ES';
import axios from '../../../utils/request'
import ModalClockify from './ModalClockify'
import FormActivitie from './FormActivitie'
import RowFormatter from './RowFormatter'
const { Option } = Select;
// Constants

// Exported Component
const TableActivities = ({portafolio, testing, fillData, onEdit}) =>{

    const [dataSource, setDataSource] = useState([]);
    const [status, setStatus] = useState(null);
    const [clockify, setClockify] = useState(null);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(20);
    const [total, setTotal] = useState(0);
    const [reload, setReload] = useState(0);
    const [loading, setLoading] = useState(true);
    //filters
    const [clientsSelect, setClientsSelect] = useState([]);
    //filters/Clockify
    const [clients, setClients] = useState([]);
    const [projects, setProjects] = useState([]);
    const [tasks, setTasks] = useState([]);
    const [modal1, setModal1] = useState({visible: false, loading: false});
    const [modal2, setModal2] = useState({visible: false, loading: false});
    const [modal3, setModal3] = useState({visible: false, loading: false});
    const [clockifyEdit, setClockifyEdit] = useState(
        {
            act_id: undefined, 
            task_id: undefined, 
            client_id: undefined, 
            project_id: undefined
        })
    const sync = fillData ? fillData : (async () => {
        const query = (
            status !== null 
                ? 
                `status=${status}&portafolio=${portafolio}&page=${page-1}&limit=${limit}&clockify=${clockify}`
                :
                `portafolio=${portafolio}&page=${page-1}&limit=${limit}&clockify=${clockify}`
                )
        let data = await axios.get(`/activities?${query}`)
            .then( async data =>{
                let dataSource = data.data.rows.map(
                    el => 
                    { 
                        return { key: reload+"-"+el.act_id, ...el } }
                    );
                let total = data.data.count;
                if(portafolio === 0){
                    return await axios.get(`/filters/clients?status=1`)
                        .then( clients =>{
                            return { dataSource, total, loading: false, clients: clients.data }
                        })
                        .catch( err =>{
                            message.error('¡Error de conexión!');
                            return { dataSource: [], total: 0 }
                        });
                }else{
                    setLoading(false)
                    return { dataSource, total, loading: false }
                }
            })
            .catch( err =>{
                message.error('¡Error de conexión!');
                return {}
            });
        return data
    })
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
    const onDelete = (act_id) => {
        axios.delete(`/activities`, { data: { act_id } })
        .then( data =>{
            message.success(data.data);
            setReload(reload+1)
        })
        .catch( err =>{
            Modal.error({
                title: '¡Error en la eliminación de la actividad!',
                content: 'Por favor, revise si la actividad no tiene ocupaciones asociadas antes de intentar eliminarla.',
              });
        });
    }
    const onSetClockify = (data) => {
        setClockifyEdit({...clockifyEdit, act_id: data.act_id, data})
        section1()
    }
    
    const section1 = () => {
        axios.get(`/filters/clockify/clients`)
            .then( data =>{
                setModal1({...modal1, visible: true});
                setClients(data.data)
            })
            .catch( err =>{
                message.error('¡Error de conexión!');
            });
    }
    const section2 = (client) => {
        setModal1({...modal1, loading: true});
        setModal2({ visible: false, loading: false});
        axios.get(`/filters/clockify/projects/${client}`)
            .then( data =>{
                if(data.data.length > 0){
                    setModal2({...modal2, visible: true});
                    setModal1({ visible: false, loading: false});
                    setProjects(data.data)
                }else{
                    setModal1({ visible: true, loading: false});
                    message.error('¡No hay proyectos disponibles en el cliente seleccionado!');
                }
            })
            .catch( err =>{
                message.error('¡Error de conexión!');
                setModal1({...modal1, loading: false});
            });
    }
    const section3 = (project) => {
        setModal2({...modal2, loading: true});
        setModal3({ visible: true, loading: false});
        axios.get(`/filters/clockify/tasks/${project}`)
            .then( data =>{
                if(data.data.length > 0){
                    setModal3({...modal3, visible: true});
                    setModal2({ visible: true, loading: false});
                    setTasks(data.data)
                }else{
                    setModal2({ visible: true, loading: false});
                    message.error('¡No hay tareas disponibles en el proyecto seleccionado!');
                }
                
            })
            .catch( err =>{
                message.error('¡Error de conexión!');
                setModal2({...modal2, loading: false});
            });
    }
    const updateClockify = () => {
        setModal3({...modal3, loading: true});
        axios.post(`/activities`, 
            {
                act_id: clockifyEdit.data.act_id, 
                act_status: clockifyEdit.data.act_status, 
                act_clockify_task: clockifyEdit.task_id
            })
            .then( data =>{
                setModal3({ visible: false, loading: false});
                setClockifyEdit(
                    {
                    act_id: undefined, 
                    task_id: undefined, 
                    client_id: undefined, 
                    project_id: undefined
                    }
                    )
                onCancel()
                message.success('¡Tarea cargada con exito!');
                setReload(reload+1)
            })
            .catch( err =>{
                message.error('¡Error de conexión!');
                setModal3({...modal3, loading: false});
            });
    }
    const updateActivitie = async (
        data) =>{
        await onEdit ? onEdit(data) : await axios.post(`/activities`, data)
            .then( data =>{
                message.success('¡Actividad editada con exito!');
                return 1
            })
            .catch( err =>{
                message.error('¡Error de conexión!');
                message.error('¡No pudimos actualizar la actividad!');
                return 1
            });
        setReload(reload+1)
    }
    React.useEffect(  () => {
        const checkOptions = (data1, data2) =>{
            return data1 !== undefined 
                && data1 !== null
                && data1 !== "null"
                && data1 !== "undefined" ?
                    data1 : data2
        }
        const runSync = async (fetchData) => {
            let data = await fetchData()
            data= testing ? data[0] : data
            setDataSource(checkOptions(data.dataSource, dataSource))
            setTotal(checkOptions(data.total, total))
            setLoading(checkOptions(data.loading, loading))
            setClientsSelect(checkOptions(data.clients, clients))
        }
        setLoading(true)
        runSync(sync)
    }, [reload])// eslint-disable-line react-hooks/exhaustive-deps
    
    let columns = [
        {
            title: RowFormatter.ToolTitle('Cliente', 'Nombre del cliente.'),
            key: 'cli_id',
            render: (data)=>{return(<RowFormatter.RenderClient data={data} updateActivitie={updateActivitie} portafolio={portafolio} clientsSelect={clientsSelect}/>)}
        },
        {
          title: RowFormatter.ToolTitle('Titulo', 'Nombre de la actividad.'),
            key: 'act_title',
          render: (data)=>{return(<RowFormatter.RenderTitle data={data} updateActivitie={updateActivitie} portafolio={portafolio}/>)}
        },
        {
            title: RowFormatter.ToolTitle('Descripción', 'Descripción de la actividad.'),
            key: 'act_description',
            render: (data)=>{return(<RowFormatter.RenderDescription data={data} updateActivitie={updateActivitie} portafolio={portafolio}/>)}
        },{
            title: RowFormatter.ToolTitle('Estado', 'Estado de la actividad: Indica si la actividad esta activa o no.'),
            key: 'act_status',
            render: (data)=>{return(<RowFormatter.RenderStatus data={data} updateActivitie={updateActivitie}/>)}
        },{
            title: RowFormatter.ToolTitle('Clockify', 'Indica si fue selecionada la tarea en clockify o debe cargarse'),
            key: 'act_clockify_task',
            render: (data)=>{return(<RowFormatter.RenderClockify data={data} onSetClockify={onSetClockify}/>)}
        },
        
      ];
    if(portafolio === 0){
        columns.push({
            title: RowFormatter.ToolTitle('Acción', 'Acciones disponibles para la actividad'),
            key: "name",
            render: (data)=>{return(RowFormatter.RenderDelete(data, onDelete))}
        })
    }
    const setTask = (data) =>{
        setClockifyEdit({...clockifyEdit, task_id: data});
    }
    const setProject = (data) =>{
        setClockifyEdit({...clockifyEdit, project_id: data});
        section3(data)
    }
    const setClient = (data) =>{
        setClockifyEdit({...clockifyEdit, client_id: data});
        section2(data)
    }
    const onCancel = () =>{
        Modal.destroyAll();
        setModal1(false)
        setModal2(false)
        setModal3(false)
        setClockifyEdit(
            {
                act_id: undefined, 
                task_id: undefined, 
                client_id: undefined, 
                project_id: undefined
            })
    }
    const onFinish = (data) => {
        axios.put(`/activities/no_portafolio`, data)
            .then( data =>{
                message.success('¡Actividad agregada con exito!');
                setReload(reload+1)
            })
            .catch( err =>{
                message.error('¡Error de conexión!');
                message.error('¡No pudimos agregar la actividad!');
                setReload(reload+1)
            });
    }  
    return (
        <div>
            <div>
            {portafolio === 0 
            ?
                (<>
                    <Divider orientation="left">Añadir actividad</Divider>
                    <FormActivitie key="filters" clients={clientsSelect} onFinish={onFinish}/>
                </>)
                :
                null
            }
            <Divider orientation="left">Filtros</Divider>
            <Form 
                layout="inline"
                initialValues={{
                    status: 2,
                    task: 2
                  }}>
                <Form.Item name="status" label="Estado">
                <Select 
                    placeholder="Estado de la actividad..."
                    onChange={
                        (data)=>{
                            setStatus(data === 2 ? null : data);
                            setPage(1);
                            setReload(reload+1);
                        }
                    } 
                    style={{ width: 180}}
                    >
                        <Option key={"fil-2-2"} value={2}>Todas</Option> 
                        <Option key={"fil-2-1"} value={1}>Activas</Option> 
                        <Option key={"fil-2-0"} value={0}>Finalizadas</Option> 
                        </Select>
                    </Form.Item>
                <Form.Item name="task" label="Tarea de clockify">
                <Select 
                    placeholder="Tarea de clockify..."
                    onChange={(data)=>{setClockify(data === 2 ? null : data);setPage(1);setReload(reload+1)}} 
                    style={{ width: 180}}
                    >
                    <Option key={"fil-3-2"} value={2}>Todas</Option> 
                    <Option key={"fil-3-1"} value={1}>Con tareas cargadas</Option> 
                    <Option key={"fil-3-0"} value={0}>Sin tareas cargadas</Option> 
                    </Select>    
                    </Form.Item>
                </Form>
            </div>
            
                <Divider/>
            {
                loading ? 
                <Spin style={{ marginLeft: '50%', marginTop: '50px' }}/> 
                :
                (<ConfigProvider locale={esp}>
                    
                    <Table dataSource={dataSource} columns={columns} pagination={false}/>
                    <Pagination
                        style={{ paddingTop:'1%', float: 'right'}}
                        total={total}
                        pageSizeOptions={[5, 10, 25, 50, 100]}
                        onShowSizeChange={onSizeChange}
                        defaultPageSize={limit}
                        onChange={onPageChange}
                        defaultCurrent={page}
                        />
                    {
                        modal1.visible || modal2.visible || modal3.visible ? 
                            <ModalClockify 
                                onCancel={onCancel} 
                                visible={modal1.visible || modal2.visible || modal3.visible} 
                                loading1={modal1.loading} 
                                setData1={setClient} 
                                dataSource1={clients} 
                                disabled1={!modal2.visible} 
                                placeholder1={"Seleccione un cliente..."} 
                                loading2={modal2.loading} 
                                setData2={setProject} 
                                dataSource2={projects} 
                                disabled2={!modal3.visible} 
                                placeholder2={"Seleccione un proyecto..."}
                                loading3={modal3.loading} 
                                setData3={setTask} 
                                dataSource3={tasks} 
                                disabled3={clockifyEdit.task_id ? false : true} 
                                next={updateClockify} 
                                placeholder3={"Seleccione una tarea..."}  
                                title="Seleccionar cliente " 
                                btnText="Registrar"/> 
                                : 
                                null
                        }
                    </ConfigProvider>)
                
            }
            
        </div>
    )
}
export default TableActivities