// Importing needed components
import React from 'react';
import  { Tabs } from 'antd';
import Table1 from './tabs/Table_1'
import Table2 from './tabs/Table_2'
const { TabPane } = Tabs;
// Constants

// Exported Component
const Reports = () =>{

    return (
        <div>
            <Tabs defaultActiveKey="1">
                <TabPane tab="Reporte 1" key="rep-tab-1">
                    <Table1 key="rep-tab-1-1"/>
                    </TabPane>
                <TabPane tab="Reporte 2" key="rep-tab-2">
                    <Table2 key="rep-tab-1"/>
                    </TabPane>
                </Tabs>
        </div>
    )
}
export default Reports