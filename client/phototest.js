
var $log = null;

Session.setDefault('thumb-urls', []);
Session.setDefault('gallery-urls', []);
Session.setDefault('buffers', []);

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
    loadBuffers(files);
  },
  'click #btn-send': function() {
    Meteor.call('upload', Session.get('buffers'));
    Session.set('thumb-urls', []);
    Session.set('buffers', []);
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
      result.forEach(function(buffer) {
        console.info('ArrayBuffer has ' + buffer.byteLength + ' bytes.');
        var blob = new Blob([buffer], {type: 'image/jpeg'});
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
    console.info('good:', blob);
    $log.append('Reading blob with ' + blob.size + ' bytes\n');
    urls.push(URL.createObjectURL(blob));
  }
  var newval = Session.get('thumb-urls').concat(urls);
  Session.set('thumb-urls', newval);
  $('#img-add').val('');
};

var loadBuffers = function(blobs) {
  var buffers = [];
  var numImages = blobs.length;
  for (var index = 0; index < numImages; index++) {
    var bufferReader = new FileReader();
    bufferReader.onloadend = function(fileReaderEvt) {
      buffers.push(fileReaderEvt.target.result);
      if (buffers.length == numImages) {
        var newval = Session.get('buffers').concat(buffers);
        Session.set('buffers', newval);
      }        
    };
    bufferReader.readAsArrayBuffer(blobs[index]);
  }
};
