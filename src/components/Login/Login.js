import React, { Component } from "react";
import GoogleLogin from 'react-google-login';
import { message } from 'antd';
import "../assets/css/login.css"
import config from "../../config/config";
const axios = require('../../utils/request').default;
const Login = () => {
  const OnClick2 = () => {
    message.error('Este formulario se encuentra desactivado');
  }
  const responseGoogle = async (response) => {
    if(response){
      if(response.profileObj){
        try {
          const user = await axios.post('/users/authenticate', {email: response.profileObj.email})
          if(!user.data.message && user.data.token){
            localStorage.setItem('token', user.data.token)
            window.location.reload();
          }else{
            if(user.data.message === 'Correo no registrado'){
              message.error('Usuario no registrado');
            }else{
              message.error('¡Error de conexión!');
            }
            
          }
        } catch (error) {
          if( error.response ){
            if(
              error.response.data.message
                === 
                'Correo no registrado'){
              message.error('Usuario no registrado');
            }else{
              message.error('¡Error de conexión!');
            }
          }else{
            message.error('¡Error de conexión!');
          }
        }
      }
    }
  }
  return (
    <div className="register-photo">
        <div className="form-container">
            <div className="image-holder"></div>
                <form method="post">
                    <div className="logo-login"></div>
                    <p className="text-center"><strong>Inicio de sesión</strong></p>
                    <div className="form-group"><input disabled className="form-control" type="email" name="email" placeholder="Correo" disabled></input></div>
                    <div className="form-group"><input disabled className="form-control" type="password" name="password" disabled placeholder="Contraseña"></input></div>
                    <div className="form-group">
                        <button className="btn btn-primary btn-block" type="button" onClick={OnClick2}><strong>Iniciar Sesión</strong></button>
                    </div>
                    <hr></hr>
                    <GoogleLogin 
                        className="btn btn-google btn-block"
                        clientId={config.googleClientId}
                        buttonText="Iniciar Sesión con Google"
                        onSuccess={responseGoogle}
                        onFailure={responseGoogle}
                    />
                    <hr></hr>
                </form>

        </div>
    </div>
  );
}
export default Login;
