import axios from 'axios';

var user = {
    getUserInfo() {
        return axios.get('/api/users/', {headers: { 'x-access-token': localStorage.token } })
            .then(response => {
                return response.data;
            })
            .catch(error => {
                console.log(error);
            });
    } 
}

export default user;