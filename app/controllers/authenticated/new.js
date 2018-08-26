import Controller from '@ember/controller';
import { inject } from '@ember/service';
import jwtDecode from 'ember-cli-jwt-decode';


export default Controller.extend({
    toastr: inject('toast'),
    session: inject('session'),

    actions: {
        newMessage: function () {
            var reciever;
            var { sendTo, content, subjectText } = this.getProperties('sendTo', 'content', 'subjectText');
            if (!sendTo){
                this.get('toastr').error('username doesn\'t exist');
                return;
            }
            if (!subjectText){
                this.get('toastr').error('subject can\'t be empty');
                return;
            }

            this.store.query('user', {
                orderBy: 'username',
                equalTo: sendTo
            }).then(data => {
                if (data.length){       //if username exists
                    reciever = data.get("firstObject");     //username is unique

                    var loggedUserId = jwtDecode(this.get('session').data.authenticated.token).id;
                    this.store.findRecord('user', loggedUserId).then(loggedUser => {                        

                        let newSubject = this.store.createRecord('subject', {
                            title: subjectText
                        });
                        newSubject.save().then(() => {
                            let message = this.store.createRecord('message', {
                                content: content,
                                recieverId: reciever.id,
                                recieverUsername: reciever.username,
                                senderId: loggedUser.id,
                                senderUsername: loggedUser.username,
                                subjectId: newSubject.id,
                                subjectTitle: newSubject.title
                            });
                            
                            message.save().then(() => {
                                this.get('toastr').success('message sent');
                                this.setProperties({
                                    sendTo: '', 
                                    content: '', 
                                    subjectText: ''
                                });
                            });
                        });    
                    });

                }else
                    this.get('toastr').error('username doesn\'t exist');

            }, () => {
                this.get('toastr').error('database error');
            });
        }
    }
});
