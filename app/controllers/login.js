import Controller from '@ember/controller';
import { inject } from '@ember/service';


export default Controller.extend({
    session: inject('session'),

    actions: {
        authenticate: function () {
            var _this = this;
            let credentials = this.getProperties('identification', 'password');
            
            this.get('session').authenticate('authenticator:token', credentials).then(function () {
                _this.transitionToRoute('/');
            }, err => {
                if(err.status === 401 || err.status === 400){
                    console.log('wrong username-password');
                }
            });
        }
    }
});
