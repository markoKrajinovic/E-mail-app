import Controller from '@ember/controller';


export default Controller.extend({
    actions: {
        registerUser: function () {
            var _this = this;
            var firstName = this.get('firstName');
            var lastName = this.get('lastName');
            var username = this.get('username');
            var password = this.get('password');

            /*
            this.store.findAll('user').then(function(users){
                users.forEach(user => console.log(user.username + ' ' + user.password + ' ' + user.firstName));
            });*/

            var newUser = this.store.createRecord('user', {
                firstName: firstName,
                lastName: lastName,
                username: username,
                password: password
            });


            newUser.save().then(function (data) {
                _this.transitionToRoute('/login');
            }, err => {
                console.log(err.errors[0].status);

            });
        }
    }
});
