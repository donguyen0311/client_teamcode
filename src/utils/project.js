import axios from 'axios';

var project = {
    newProject(projectInfo) {
        return axios.post('/api/projects/',projectInfo,
                 {headers: { 'x-access-token': localStorage.token }
            })
            .then(response => {
                return response.data;
            })
            .catch(error => {
                console.log(error);
            });
    },
}

export default project;