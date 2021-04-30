const api = "http://localhost:2000"
const data = process.env.REACT_APP_ENV === 'production' ? 
{
    backURL: "/v1",
    googleClientId: "625505941274-dc3vsk3pdviciob77sfjn44stlpi5600.apps.googleusercontent.com",
    apiURL: api
}:
{
    backURL: api+"/v1",
    googleClientId: "625505941274-dc3vsk3pdviciob77sfjn44stlpi5600.apps.googleusercontent.com",
    apiURL: api
};
module.exports = data
