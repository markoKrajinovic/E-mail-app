import Route from '@ember/routing/route';
import { hash } from 'rsvp';
import jwtDecode from 'ember-cli-jwt-decode';
import { inject } from '@ember/service';


export default Route.extend({
    session: inject('session'),

    model(params) {
        var loggedUserId = jwtDecode(this.get('session').data.authenticated.token).id;
        return hash({
            messages: this.store.query('message', {
                orderBy: 'subjectId',
                equalTo: params.subject_id
            }),
            subject: this.store.findRecord('subject', params.subject_id),
            loggedUser: this.store.findRecord('user', loggedUserId)
        });
    }
});
