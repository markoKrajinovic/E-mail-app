import Controller from '@ember/controller';
import { inject } from '@ember/service';


export default Controller.extend({
    toastr: inject('toast'),
    ajax: inject(),


    actions: {
        registerUser: function () {
            var _this = this;
            var firstName = this.get('firstName');
            var lastName = this.get('lastName');
            var username = this.get('username');
            var password = this.get('password');

            var newUser = JSON.stringify(
                {
                    user: {
                        firstName: firstName,
                        lastName: lastName,
                        username: username,
                        password: password
                    }
                }
            );

            this.get('ajax').request('/api/users', {
                contentType: 'application/json',
                method: 'POST',
                data: newUser
            }).then(function () {
                _this.get('toastr').success('Registered!');
                _this.setProperties({
                    firstName: '',
                    lastName: '',
                    username: '',
                    password: ''
                });
                _this.transitionToRoute('/login');
            }, err => {
                //console.log(err);
                this.get('toastr').error(err.payload);
            });
        }
    }
});
