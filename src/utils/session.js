
import  { 
    message, 
} from 'antd';
const force = () => {
    message.error('¡Error datos sesión invalidos!');
    setInterval(() => {
        logout()
      }, 2000);
}
const logout = () =>{
    localStorage.removeItem("token");
    window.location.reload()
}

const Session = { logout, force }
export default Session