
var $log = null;

Session.setDefault('thumb-urls', []);
Session.setDefault('gallery-urls', []);
Session.setDefault('blobs', []);

Template.dbview.rendered = function() {
  $log = $('#log');
};

Template.uploader.thumbs = function() {
  var retval = [];
  Session.get('thumb-urls').forEach(function(url) {
    retval.push({url: url});
  });
  return retval;
};

Template.uploader.events({
  'change #select-image': function(inputEvt) {
    var files = inputEvt.srcElement.files;
    showThumbs(files);
    loadBlobs(files);
  },
  'click #btn-send': function() {
    var blobs = Session.get('blobs');

    // mona begin
    var id = Meteor.uuid();
    var url = document.location.origin + '/upload/' + id;
    console.info(url, blobs);
    $.post(url, blobs[0]);
    // mona end

    Session.set('thumb-urls', []);
    Session.set('blobs', []);
  }
});

Template.dbview.images = function() {
  var retval = [];
  Session.get('gallery-urls').forEach(function(url) {
    retval.push({url: url});
  });
  return retval;
};

Template.dbview.events({
  'click #btn-clear': function() {
    Meteor.call('clear', function(err, result) {
      if (err) {
        console.error(err);
        return;
      }
      Session.set('gallery-urls', []);
    });
  },
  'click #btn-refresh': function() {
    Meteor.call('download', function(err, result) {
      if (err) {
        console.error(err);
        return;
      }
      var urls = [];
      result.forEach(function(blob) {
        console.info('Blob has ' + blob.size + ' bytes.');
        urls.push(URL.createObjectURL(blob));
      });
      Session.set('gallery-urls', urls);
    });
  },
});

var showThumbs = function(blobs) {
  var urls = [];
  var numImages = blobs.length;
  for (var index = 0; index < numImages; index++) {
    var blob = blobs[index];
    $log.append('Reading blob with ' + blob.size + ' bytes\n');
    urls.push(URL.createObjectURL(blob));
  }
  var newval = Session.get('thumb-urls').concat(urls);
  Session.set('thumb-urls', newval);
  $('#img-add').val('');
};

var loadBlobs = function(files) {
  var blobs = [];
  var numImages = files.length;
  for (var index = 0; index < numImages; index++) {
    blobs.push(files[index]);
  }
  Session.set('blobs', blobs);
};
