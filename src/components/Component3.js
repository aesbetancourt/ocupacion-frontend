// Importing needed components
import React from 'react';
// import config from '../config/config'
// import axios from "axios"
import {  Divider } from 'antd';



// Constants
// Axios Defaults
// const axiosInstance = axios.create({
//     baseURL: config.backURL
// });


// Exported Component
class Component3 extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            state: ''

        };
    };


    // Functions

    render(){
        return (
            <div>
                <h1>Component 3</h1>
                <Divider/>

            </div>
        )
    }

}
export default Component3
