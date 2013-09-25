Meteor.userId = function() { return 'dummy'; };

Images = new CollectionFS('images');

URLGEN = (typeof URL != 'undefined') ? URL : webkitURL;

var $log = null;
var SessionBlobs = [];
var canvas = null;

Session.setDefault('thumb-urls', []);
Session.setDefault('gallery-urls', []);

Template.dbview.rendered = function() {
  $log = $('#log');
  canvas = document.getElementById('resizecanvas');
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
    var blobs = SessionBlobs;
    Images.storeFiles(blobs);
    Session.set('thumb-urls', []);
    SessionBlobs = [];
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
    Session.set('gallery-urls', []);
    Images.find().forEach(function(doc) {
      var id = doc._id;
      Images.retrieveBlob(id, function(fileItem) {
        var blob = fileItem.blob || fileItem.file;
        var urls = Session.get('gallery-urls');
        urls.push(URLGEN.createObjectURL(blob));
        Session.set('gallery-urls', urls);
      });
    });

  },
});

var showThumbs = function(blobs) {
  var urls = [];
  var numImages = blobs.length;
  for (var index = 0; index < numImages; index++) {
    var blob = blobs[index];
    $log.append('Reading blob with ' + blob.size + ' bytes\n');
    urls.push(URLGEN.createObjectURL(blob));
  }
  var newval = Session.get('thumb-urls').concat(urls);
  Session.set('thumb-urls', newval);
  $('#img-add').val('');
};

var render = function(blob, orientation, callback) {
  var fileReader = new FileReader();
  fileReader.onload = function() {
    var arrayBuffer = this.result;
    var img = new MegaPixImage(blob);
    img.onrender = callback;
    img.render(canvas, {
      maxWidth: 300,
      maxHeight: 300,
      orientation: orientation
    });
  };
  fileReader.readAsArrayBuffer(blob);
};

var renderOriented = function(blob, callback) {
  var fileReader = new FileReader();
  fileReader.onloadend = function() {
    var binaryString = this.result;
    var oFile = new BinaryFile(binaryString, 0, blob.size);
    var exif = EXIF.readFromBinaryFile(oFile);
    var orientation = 0;

    // Some images don't have EXIF data, which is fine.
    if (exif) {
      orientation = exif.Orientation;
      console.info('Orientation is', orientation);
    }

    render(blob, orientation, callback);
  };
  fileReader.readAsBinaryString(blob);
};

var loadBlobs = function(files) {
  var blobs = [];
  var numImages = files.length;
  for (var index = 0; index < numImages; index++) {
    var blob = files[index];
    renderOriented(blob, function() {
      canvas.toBlob(function(blob) {
        blobs.push(blob);
        if (blobs.length == numImages) {
          SessionBlobs = blobs;
        }
      }, 'image/jpeg');
    });
  }
};
