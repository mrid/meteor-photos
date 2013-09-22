Images = new CollectionFS('images');

Meteor.methods({
  clear: function() {
    Images.remove({});
  }
});
