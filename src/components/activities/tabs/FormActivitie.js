import React, { useState } from 'react';
import  { Form, Input, Select, Button } from 'antd';
import { FileAddOutlined } from '@ant-design/icons';
const { Option } = Select;
// Exported Component
const FormActivitie = ({ clients, onFinish }) =>{
    const [data, setData] = useState({cli_id: null, act_title: null, act_description: null })
    const onCatch = () =>{
        let send = data
        if(!data.cli_id){
            send.cli_id = clients[0].cli_id
        }
        onFinish(send)
    }
    if(clients.length >0){
        return (
            <Form
                layout="inline"
                data-testid="add_form"
                initialValues={{ cli_id: clients[0].cli_id}}
                >
                    <Form.Item 
                        name="cli_id" 
                        label="Cliente"
                        fieldKey={"f1"}
                        >
                        <Select 
                            data-testid="cli_id"
                            placeholder="Cliente de la actividad..."
                            style={{ width: 300}}
                            showSearch
                            onChange={(e)=>setData({...data, cli_id: e})}
                            optionFilterProp="children"
                            filterOption={(input, option) =>
                                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                            }
                            filterSort={(optionA, optionB) =>
                                optionA.children.toLowerCase().localeCompare(optionB.children.toLowerCase())
                            }
                            >
                        {clients.map(el => <Option data-testid={"f1-opt_"+el.cli_id} key={"f1-opt_"+el.cli_id} value={el.cli_id}>{el.cli_name}</Option> )}
                    
                    </Select>
                        </Form.Item>
                    <Form.Item 
                        name="act_title" 
                        label="Titulo"
                        fieldKey={"f2"}
                        rules={[{ required: true, message: '¡Ingrese el titulo de la actividad!' }]}
                        >
                        <Input onChange={(e)=>setData({...data, act_title: e.target.value})} data-testid="act_title" placeholder="Titulo de la actividad..." />
                        </Form.Item>
                    <Form.Item 
                        name="act_description" 
                        label="Descripción"
                        fieldKey={"f3"}
                        rules={[{ required: true, message: '¡Ingrese el descripción de la actividad!' }]}
                        >
                        <Input onChange={(e)=>setData({...data, act_description: e.target.value})} data-testid="act_description" placeholder="Descripción de la actividad..." />
                        </Form.Item>
                    <Form.Item>
                        <Button onClick={onCatch} type="primary" data-testid="submit" id="submit" htmlType="submit" icon={<FileAddOutlined />}>
                            Añadir actividad
                            </Button>
                        </Form.Item>
    
                </Form>
        )
    }else{
        return null
    }
}
export default FormActivitie
