var config = require('../config');
var SparkPost = require('sparkpost');
var client = new SparkPost(config.sparkPost);
var _ = require('lodash')

exports.send = send;
exports.getList = getList;
exports.addToList = addToList;

function send(address, content) {
  var from = content.from || config.email.from;
  
  if(!address) {
    throw Error('No address specified.')
  }

  if(!content.subject) {
    throw Error('No subject specified.')
  }

  if(!content.html) {
    throw Error('No html specified.')
  }

  return client.transmissions.send({
    content: {
      from: from,
      subject: content.subject,
      html: content.html
    },
    recipients: [
      { address: address }
    ]
  })
}

function getList(options) {
  if(!options.id) {
    throw Error('No list id specified');
  }

  return client.recipientLists.get(options.id, options);
}

function addToList(user) {
  return getList({ id: 'users', show_recipients: true })
    .then(function(response) {
      var list = response.results;
      list.recipients.push({
        address: {
          email: user.email,
          name: user.name,
          tags: [],
          metadata: {},
          substitution_data: {}
        }
      })

      list.recipients = _.map(list.recipients, function(recipient) {
        return _.omit(recipient, 'return_path');
      })

      return client.recipientLists.update(list.id, list)
    });
}