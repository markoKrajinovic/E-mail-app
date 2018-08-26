import Route from '@ember/routing/route';
import { inject } from '@ember/service'
import jwtDecode from 'ember-cli-jwt-decode';

export default Route.extend({
    session: inject('session'),

    model() {
        let token = this.get('session').data.authenticated.token;
        let userId = jwtDecode(token).id;

        return this.store.query('message', {
            orderBy: 'recieverId',
            equalTo: userId
        }).then(usersMessages => {
            let subjects = [];
            let subjectIds = [];
            let retval;

            usersMessages.forEach(item => {
                if (!subjectIds.includes(item.subjectId)) {
                    
                    retval = this.store.query('message', {
                        orderBy: 'subjectId',
                        equalTo: item.subjectId
                    }).then(subjectMessages => {
                        let lastMessage = subjectMessages.firstObject;
                        subjectMessages.forEach(item => {
                            if (item.createdAt > lastMessage.createdAt) {
                                lastMessage = item;
                            }
                        })
                        let subject = this.store.createRecord('subject-view', {
                            subjectId: item.subjectId,
                            title: item.subjectTitle,
                            sender: item.senderUsername,
                            reciever: item.recieverUsername,
                            lastMessage: lastMessage.content,
                            lastMessageDate: lastMessage.createdAt,
                            count: subjectMessages.length
                        })
                        return subject;
                    }).then(subject => {
                        subjects.push(subject);
                        subjects.sort(function(a, b) { 
                            return b.lastMessageDate - a.lastMessageDate;
                        })
                        return subjects;
                    });
                    subjectIds.push(item.subjectId);
                }
            });
            return retval;
     })
    }
});
