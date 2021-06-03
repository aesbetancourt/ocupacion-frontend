import React from 'react';
import  { 
    Input, 
    Tooltip,
    Popconfirm,
    Tag, 
    Select, 
    Switch 
} from 'antd';
const { Option } = Select;

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
        disabled={data.act_status === -1}
        onChange={(status)=>{
            if(updateActivitie){
                updateActivitie({ act_id: data.act_id, act_status: status ? 1 : 0 })
            }
        }} 
        />
    )
}
const RenderTitle = ({data, updateActivitie, portafolio}) => {
    if(portafolio === 1){
        return (<>{data.act_title}</>)
    }else{
        return (
            <Input 
                key={data.act_id+"--act_title"}
                placeholder="Nombre de la actividad..." 
                defaultValue={data.act_title} 
                data-testid={data.act_id+"--act_title"}
                onBlur={(val)=>{
                    if(updateActivitie){
                        updateActivitie({ act_id: data.act_id, act_title: val.target.value })
                    }
                }}
                onPressEnter={(val)=>{
                    if(updateActivitie){
                        updateActivitie({ act_id: data.act_id, act_title: val.target.value })
                    }
                }}
                />
        )
    }
    
}
const RenderDescription = ({data, updateActivitie, portafolio}) => {
    if(portafolio === 1){
        return (<>{data.act_description}</>)
    }else{
        return (
            <Input 
                key={data.act_id+"--act_description"}
                placeholder="Descripción de la actividad..." 
                data-testid={data.act_id+"--act_description"}
                defaultValue={data.act_description} 
                onBlur={(val)=>{
                    if(updateActivitie){
                        updateActivitie({ act_id: data.act_id, act_description: val.target.value })
                    }
                }}
                onPressEnter={(val)=>{
                    if(updateActivitie){
                        updateActivitie({ act_id: data.act_id, act_description: val.target.value })
                    }
                }}
                />
        )
    }
}
const RenderClient = ({data, updateActivitie, portafolio, clientsSelect}) => {
    if(portafolio === 1){
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
    }else{
        return (
            <Select 
                key={data.act_id+"--"+data.clients.cli_id}
                data-testid={data.act_id+"--cli_id"}
                placeholder="Cliente de la actividad..."
                onChange={(client)=>{
                    if(updateActivitie){
                        updateActivitie({ act_id: data.act_id, cli_id: client })
                    }
                }}
                style={{ width: 300}}
                defaultValue={data.clients.cli_id}
                showSearch
                optionFilterProp="children"
                filterOption={(input, option) =>
                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
                filterSort={(optionA, optionB) =>
                    optionA.children.toLowerCase().localeCompare(optionB.children.toLowerCase())
                }
                >
                    {clientsSelect.map(
                            el => 
                            <Option 
                                className={"clients"}
                                key={"fil-1-"+el.cli_id} 
                                value={el.cli_id}>
                                    {el.cli_name}
                                    </Option> 
                            )
                    }
                
                </Select>
        )
    }
}
const RowFormatter = {
    RenderClockify,
    RenderDelete,
    ToolTitle,
    RenderStatus,
    RenderTitle,
    RenderDescription,
    RenderClient
}
export default RowFormatter