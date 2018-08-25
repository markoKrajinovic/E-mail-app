import Route from '@ember/routing/route';
import jwtDecode from 'ember-cli-jwt-decode';
import { inject } from '@ember/service'

export default Route.extend({
    session: inject('session'),

    model(){
        var username = jwtDecode(this.get('session').data.authenticated.token).username;
        return username;
    }
});
