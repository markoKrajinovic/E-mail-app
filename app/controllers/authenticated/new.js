import Controller from '@ember/controller';
import { inject } from '@ember/service';

export default Controller.extend({
    toastr: inject('toast'),

    actions: {
        newMessage: function () {
            var userObject;
            var self = this;
            var { sendTo, content } = this.getProperties('sendTo', 'content');

            if(!sendTo)
                this.get('toastr').error('username doesn\'t exist');

            this.store.query('user', {
                orderBy: 'username',
                equalTo: sendTo
            }).then(data => {
                if(data.length)
                    console.log(data.get("firstObject").username);
                else
                this.get('toastr').error('username doesn\'t exist');

            }, err => {
                this.get('toastr').error('database error');
            });
        }
    }
});
