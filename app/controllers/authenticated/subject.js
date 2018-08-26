import Controller from '@ember/controller';
import { inject } from '@ember/service';
import jwtDecode from 'ember-cli-jwt-decode';


export default Controller.extend({
    toastr: inject('toast'),
    session: inject('session'),

    actions: {
        reply: function (modalDialog) {
            var replyMessage = this.get('replyMessage');
            var recieverId;
            var recieverUsername;

            if (this.model.messages.firstObject.senderId !== this.model.loggedUser.id) {    //pretraga kome se treba poslati poruka na osnovu poruke jer se tu nalaze podaci ko ucestvuje u razgovoru
                recieverId = this.model.messages.firstObject.senderId
                recieverUsername = this.model.messages.firstObject.senderUsername
            } else {
                recieverId = this.model.messages.firstObject.recieverId
                recieverUsername = this.model.messages.firstObject.recieverUsername
            }

            var message = this.store.createRecord('message', {
                content: replyMessage,
                recieverId: recieverId,
                recieverUsername: recieverUsername,

                senderId: this.model.loggedUser.id,
                senderUsername: this.model.loggedUser.username,

                subjectId: this.model.subject.id,
                subjectTitle: this.model.subject.title,
            });

            message.save().then(() => {
                this.toastr.success('Message sent');
                this.set('replyMessage', '');
                modalDialog.close();
            }, () => {
                this.toastr.error('An error occured');
            })
        },

        triggerForwardModal: function () {
            let forwardContent = '------------ Forwarded Message ------------\n';

            this.store.query('message', {
                orderBy: 'subjectId',
                equalTo: this.model.subject.id
            }).then(messages => {
                messages.forEach(message => {
                    forwardContent += 'From: ' + message.senderUsername + '\n';
                    forwardContent += 'To: ' + message.recieverUsername + '\n';
                    forwardContent += 'Subject: ' + message.subjectTitle + '\n';
                    forwardContent += 'Date: ' + message.createdAt;
                    forwardContent += '\n\n' + message.content;
                    forwardContent += '\n---------------------------\n';
                })
                this.set('forwardMessage', forwardContent);
                this.set('forwardModal', true);

            });
        },

        forward: function (modalDialog) {
            var reciever;
            let content = this.get('forwardMessage');
            let sendTo = this.get('forwardTo');
            let subjectText = this.get('forwardSubject');

            if (!sendTo) {
                this.get('toastr').error('username doesn\'t exist');
                return;
            }
            if (!subjectText) {
                this.get('toastr').error('subject can\'t be empty');
                return;
            }

            this.store.query('user', {
                orderBy: 'username',
                equalTo: sendTo
            }).then(data => {
                if (data.length) {       //if username exists
                    reciever = data.get("firstObject");     //username is unique

                    let loggedUserId = jwtDecode(this.get('session').data.authenticated.token).id;
                    let loggedUserUsername = jwtDecode(this.get('session').data.authenticated.token).username;

                    let newSubject = this.store.createRecord('subject', {
                        title: subjectText
                    });
                    newSubject.save().then(() => {
                        let message = this.store.createRecord('message', {
                            content: content,
                            recieverId: reciever.id,
                            recieverUsername: reciever.username,
                            senderId: loggedUserId,
                            senderUsername: loggedUserUsername,
                            subjectId: newSubject.id,
                            subjectTitle: newSubject.title
                        });

                        message.save().then(() => {
                            this.get('toastr').success('message sent');
                            modalDialog.close();
                            this.setProperties({
                                forwardTo: '',
                                forwardMessage: '',
                                forwardSubject: ''
                            });
                        });
                    });

                } else
                    this.get('toastr').error('username doesn\'t exist');

            }, () => {
                this.get('toastr').error('database error');
            });
        }
    }
});
