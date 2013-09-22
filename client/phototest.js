Meteor.userId = function() { return 'dummy'; };

Images = new CollectionFS('images');

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
        urls.push(URL.createObjectURL(blob));
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
    var blob = files[index];
    blobs.push(blob);

    if (index == 0) {

      var fileReader = new FileReader();
      fileReader.onload = function() {
        var arrayBuffer = this.result;
        var img = new MegaPixImage(blob);

        var byteBuffer = new Uint8Array(arrayBuffer);
        var exif = EXIF.readFromBinaryFile(byteBuffer);
        console.info(exif);
        // TODO extract orientation

        img.render(canvas, { maxWidth: 300, maxHeight: 300, orientation: 6 });
      };
      fileReader.readAsArrayBuffer(blob);
    }
  }
  SessionBlobs = blobs;
};
