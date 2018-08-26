import Controller from '@ember/controller';
import { inject } from '@ember/service';

export default Controller.extend({
    session: inject('session'),
    toastr: inject('toast'),

    actions:{
        logout(){
            this.get('toastr').success('Loged out');
            this.get('session').invalidate();
            this.transitionToRoute('login');
        }
    }
});
