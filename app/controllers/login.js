import Controller from '@ember/controller';
import { inject } from '@ember/service';

export default Controller.extend({
    session: inject('session'),
    toastr: inject('toast'),

    actions: {
        authenticate: function () {
            var _this = this;
            let credentials = this.getProperties('identification', 'password');
            
            this.get('session').authenticate('authenticator:token', credentials).then(function () {
                _this.get('toastr').success('Logged in!');
                _this.transitionToRoute('/');
            }, err => {
                if(err.status === 401 || err.status === 400){
                    this.get('toastr').error('Wrong username or password!');
                }
            });
        }
    }
});
