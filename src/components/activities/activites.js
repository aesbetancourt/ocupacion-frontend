// Importing needed components
import React from 'react';
import  { Tabs } from 'antd';
import NoPortafolio from './tabs/Table'
const { TabPane } = Tabs;
// Constants

// Exported Component
const Activities = () =>{

    return (
        <div>
            <Tabs defaultActiveKey="1">
                <TabPane tab="No portafolio" key="act-tab-1">
                    <NoPortafolio key="act-tab-1-1" portafolio={0}/>
                    </TabPane>
                <TabPane tab="Portafolio" key="act-tab-2">
                    <NoPortafolio key="act-tab-1" portafolio={1}/>
                    </TabPane>
                </Tabs>
        </div>
    )
}
export default Activities