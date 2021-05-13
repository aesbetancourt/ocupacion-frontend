import React, {useState, useEffect} from 'react';
import Session from '../../utils/session';
import Login from '../Login/Login'
import Navigation from '../Navigation'
import '../assets/css/Load.css'
const { force } = Session
const Index = () =>{
    const [role, setRole] = useState(undefined);
    const [isLoged, setIsLoged] = useState(undefined);
    const [name, setName] = useState("")
    const sync = async () =>{
        const axios = require('../../utils/request').default;
        const token = localStorage.getItem('token');
        if(token){
            axios.post('/users/refresh', { token }).then( response =>{
                if(!response.data) return force();
                if(!(response.data.user && response.data.token)) return force();
                localStorage.setItem('token', response.data.token)
                const user = response.data.user;
                setRole(user.usr_rol)
                setName(
                    user.collaborators.col_name + 
                    " " +
                    user.collaborators.col_last_name 
                    )
                setIsLoged(true)
            }).catch( err =>{
                return force();
            });
        }else{
            setIsLoged(false)
        }
    }
    useEffect(  () => {
        setIsLoged(undefined);
        setRole(undefined);
        sync()
    }, [])
    const Render = () =>{
        if(isLoged == undefined){
            return (<div class="loading"><div class="loader"></div></div>)
        }else{
            if(isLoged) return <Navigation name={name} role={role}/>;
            return <Login/>
        }
    }
    return (<Render/>);
}
export default Index