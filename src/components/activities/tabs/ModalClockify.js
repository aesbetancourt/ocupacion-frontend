import React from 'react';
import  { Form, Button, Modal, Select } from 'antd';

const { Option } = Select;

// Exported Component
const ModalClockify = (
    {
        setData1,
        setData2,
        setData3, 
        dataSource1,
        dataSource2,
        dataSource3, 
        visible, 
        next, 
        title, 
        disabled1,
        disabled2,
        disabled3, 
        placeholder1, 
        placeholder2,
        placeholder3,
        onCancel, 
        loading1,
        loading2,
        loading3, 
        btnText
    }) =>{
        const layout = {
            labelCol: { span: 8 },
            wrapperCol: { span: 16 },
        };
    return (
        <Modal
            visible={visible}
            centered
            bodyStyle={{ margin: "auto",  width: "50%"}}
            title={title}
            onCancel={onCancel}
            footer={[
                <Button data-testid="clocki-cancel" key="back" type="danger" onClick={onCancel}>
                    Cerrar
                    </Button>,
                <Button  
                    key="submit" 
                    onClick={()=>next()} 
                    type="primary" 
                    data-testid="clocki-next"
                    loading={loading3}
                    disabled={disabled3}
                    >
                        {btnText}
                        </Button>]}
            >
            <Form
                {...layout}
                name="basic"
                >
                <Form.Item
                    label="Cliente"
                    name="Cliente"
                    >
                    <Select 
                        placeholder={placeholder1}
                        showSearch
                        optionFilterProp="children"
                        data-testid="clocki-1"
                        filterOption={(input, option) =>
                            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }
                        filterSort={(optionA, optionB) =>
                            optionA.children.toLowerCase().localeCompare(optionB.children.toLowerCase())
                        }
                        onChange={
                            (data)=>
                                {
                                setData1(data); 
                                }
                        }  
                        style={{ width: "-webkit-fill-available" }}
                        >
                        {
                            dataSource1.map(
                                el => 
                                <Option 
                                    key={title+"-"+el.id} 
                                    value={el.id}>
                                        {el.name}
                                        </Option> )
                        }            
                        </Select>
                    </Form.Item>
                <Form.Item
                    label="Proyecto"
                    name="Proyecto"
                    >
                    <Select 
                        placeholder={placeholder2}
                        showSearch
                        optionFilterProp="children"
                        data-testid="clocki-2"
                        loading={loading1}
                        disabled={disabled1}
                        filterOption={(input, option) =>
                            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }
                        filterSort={(optionA, optionB) =>
                            optionA.children.toLowerCase().localeCompare(optionB.children.toLowerCase())
                        }
                        onChange={
                            (data)=>
                                {
                                setData2(data); 
                                }
                        } 
                        style={{ width: "-webkit-fill-available" }}
                        >
                        {
                            dataSource2.map(
                                el => 
                                <Option 
                                    key={title+"-"+el.id} 
                                    value={el.id}>
                                        {el.name}
                                        </Option> )
                        }   
                        </Select>
                    </Form.Item>
                <Form.Item
                    label="Tarea"
                    name="Tarea"
                    >
                    <Select 
                        placeholder={placeholder3}
                        showSearch
                        optionFilterProp="children"
                        data-testid="clocki-3"
                        loading={loading2}
                        disabled={disabled2}
                        filterOption={(input, option) =>
                            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }
                        filterSort={(optionA, optionB) =>
                            optionA.children.toLowerCase().localeCompare(optionB.children.toLowerCase())
                        }
                        onChange={
                            (data)=>
                                {
                                setData3(data); 
                                }
                        } 
                        style={{ width: "-webkit-fill-available" }}
                        >
                        {
                            dataSource3.map(
                                el => 
                                <Option 
                                    key={title+"-"+el.id} 
                                    value={el.id}>
                                        {el.name}
                                        </Option> )
                        }       
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>
    )
}
export default ModalClockify