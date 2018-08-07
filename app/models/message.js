import DS from 'ember-data';

export default DS.Model.extend({
    content: DS.attr('string'),
    reciever: DS.belongsTo('user'),
    sender: DS.belongsTo('user'),
    subject: DS.belongsTo('subject')
});
