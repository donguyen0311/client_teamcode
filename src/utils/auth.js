import axios from 'axios';

var auth = {
    login(email, password) {
        if (this.loggedIn()) {
            return {error: false, message: 'You have been logged in.'};
        }
        return axios
                .post('/api/login', {email, password})
                .then(response => {
                    if (response.data.success) {
                        localStorage.token = response.data.token;
                    }
                    return response.data;
                })
                .catch(error => {
                    console.log(error);
                });
    },
    logout() {
        localStorage.removeItem('token');
    },
    loggedIn() {
        return !!localStorage.token;
    },
    register(email, username, password, confirm_password) {
        return axios
            .post('/api/register', {email, username, password, confirm_password})
            .then(response => {
                if (response.data.success) {
                    return this.login(email, password);
                }
                return response.data;
            })
            .catch(error => {
                console.log(error);
            });
    }
};

export default auth;