import Route from '@ember/routing/route';
import { inject } from '@ember/service';

export default Route.extend({
    session: inject('session'),

    beforeModel() {
        if(!this.get('session').isAuthenticated)
            this.replaceWith('login');
        else
            this.replaceWith('authenticated');
    }
});
