import Route from '@ember/routing/route';
import { inject } from '@ember/service'
import jwtDecode from 'ember-cli-jwt-decode';


export default Route.extend({
    session: inject('session'),

    model() {
        let token = this.get('session').data.authenticated.token;
        let userId = jwtDecode(token).id;

        return this.store.query('message', {
            orderBy: 'senderId',
            equalTo: userId
        }).then(usersMessages => {
            let subjects = [];
            let subjectIds = [];
            usersMessages.forEach(item => {
                if (!subjectIds.includes(item.subjectId)) {
                    let subject = this.store.createRecord('subject-view', {
                        subjectId: item.subjectId,
                        title: item.subjectTitle,
                        sender: item.senderUsername,
                        reciever: item.recieverUsername,
                        lastMessage: item.content,
                        lastMessageDate: item.createdAt
                    })
                    subjects.push(subject);
                    subjectIds.push(item.subjectId);
                }
            })
            return subjects;
        })
    }
});
