import axios from 'axios';
// post co sao ko ?ko
var estimate = {
    getSuitableStaff(requirement) {
        return axios.post('/api/estimate/suitableStaff', requirement,  {
	        	headers: { 'x-access-token': localStorage.token }
    		})
            .then(response => {
                return response;
            })
            .catch(error => {
                console.log(error);
            });
    } 
}

export default estimate;