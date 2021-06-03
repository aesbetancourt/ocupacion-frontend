import React from 'react';
import  {  
    Tooltip,
    Popconfirm,
    Tag, 
    Switch 
} from 'antd';

const RenderClockify = ({data, onSetClockify}) => {//Columna de clockify
    if(data.act_clockify_task){
        return (
            <Tag color={"green"} key={data.act_id+"-"+data.act_clockify_task}>
                Tarea cargada
                </Tag>
            )
    }else{
        return (
            <Popconfirm title="¿Seleccionar una tarea de Clockify?" onConfirm={()=>{onSetClockify(data)}}>
              <a href="/#">Selecionar tarea</a>
                </Popconfirm>
            )
    }
}
const RenderDelete = (data, onDelete) => {//Columna de clockify
    return (
        <Popconfirm title="¿Eliminar actividad?" onConfirm={()=>{onDelete(data.act_id)}}>
          <a href="/#">Eliminar tarea</a>
            </Popconfirm>
        )
}
const ToolTitle = (text, description) =>{
    return (
        <Tooltip key={text} title={description}>
            {text}
            </Tooltip>
    )
}
const RenderStatus = ({data, updateActivitie}) => {
    return (
        <Switch 
        key={data.act_id+"--"+data.act_status}
        data-testid={data.act_id+"--act_status"}
        defaultChecked={data.act_status === 1} 
        onChange={(status)=>{
            if(updateActivitie){
                updateActivitie({ act_id: data.act_id, act_status: status ? 1 : 0 })
            }
        }} 
        />
    )
}
const RenderSolverGroup = ({text, data}) => {
    if(text){
        return (<b>{text !== 'No portafolio' ? text
            : 
            <Tag color={"red"}>
                No portafolio
                </Tag>
                }
            </b>)
    }else{
        return (<b>{data ? data.por_solver_group
            : 
            <Tag color={"red"}>
                No portafolio
                </Tag>
                }
            </b>)
    }
    
}
const RenderText = ({text, align}) => {
    return (
        <div 
            style={{
                textAlign: align ? align :'left'
            }}
            >
                {text}
                </div>)
    
}
const RenderClient = ({row}) => {
    const data = row.activities
    return (
        <img
            key={data.act_id+"--"+data.clients.cli_id}
            alt={data.clients.cli_name}
            src= {data.clients.cli_icon}
            style={{
                maxWidth: "120px",
                maxHeight: "120px"
            }}
    />)
}
const RenderClient2= ({data, parent}) => {
    if(!parent){
        return <b>-----</b>
    }
    return (
        <img
            key={data.act_id+"--"+data.clients.cli_id}
            alt={data.clients.cli_name}
            src= {data.clients.cli_icon}
            style={{
                maxWidth: "120px",
                maxHeight: "120px"
            }}
    />)
}
const RowFormatter = {
    RenderClient2,
    RenderClockify,
    RenderDelete,
    ToolTitle,
    RenderStatus,
    RenderText,
    RenderSolverGroup,
    RenderClient
}
export default RowFormatter