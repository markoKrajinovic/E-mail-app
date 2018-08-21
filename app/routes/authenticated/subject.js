import Route from '@ember/routing/route';

export default Route.extend({
    model(params){

        return Ember.RSVP.hash({
            messages: this.store.query('message', {
                orderBy: 'subjectId',
                equalTo: params.subject_id
            }),
            subject: this.store.findRecord('subject', params.subject_id)
          });
    }
});
