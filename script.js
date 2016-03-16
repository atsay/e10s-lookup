// Firefox etc.
var nope = [
  "{ec8030f7-c20a-464f-9b0e-13a3a9e97384}",
  "{3550f703-e582-4d05-9a08-453d09bdfdc6}",
  "{aa3c5121-dab2-40e2-81ca-7ea25febc110}",
  "{a23983c0-fd0e-11dc-95ff-0800200c9a66}",
  "{92650c4d-4b8e-4d2a-b7eb-24ecf4f6b63a}"
];

// From MDN.
function sha256(str) {
  // We transform the string into an arraybuffer.
  var buffer = new TextEncoder("utf-8").encode(str);
  return crypto.subtle.digest("SHA-256", buffer).then(function (hash) {
    return hex(hash);
  });
}

function hex(buffer) {
  var hexCodes = [];
  var view = new DataView(buffer);
  for (let i = 0; i < view.byteLength; i += 4) {
    // Using getUint32 reduces the number of iterations needed (we process 4 bytes each time)
    var value = view.getUint32(i);
    // toString(16) will give the hex representation of the number without padding
    var stringValue = value.toString(16);
    // We use concatenation and slice for padding
    var padding = '00000000';
    var paddedValue = (padding + stringValue).slice(-padding.length);
    hexCodes.push(paddedValue);
  }

  // Join all the hex strings into one
  return hexCodes.join("");
}

var form = document.getElementsByTagName("form")[0];
form.addEventListener("submit", function(e) {
  hideAll();
  e.preventDefault();

  var value = document.getElementById("guid").value;

  if (nope.indexOf(value) !== -1) {
    show(document.getElementById("nope"));
    return;
  }

  sha256(value).then(function(digest) {
    console.log('add-on sha is: ', digest);
    for (let x in addons) {
      let hit = addons[x].indexOf(digest);
      if (hit !== -1) {
        console.log('found hit in: ', x);
        show(document.getElementById(x));
        return;
      }
    }
    console.log('not found, boo.');
    show(document.getElementById("notfound"));
  });
});


function hide(element) {
  element.style.display = 'none';
}

function hideAll() {
  for (let element of document.getElementsByClassName('answer')) {
    hide(element);
  }
}

function show(element) {
  element.style.display = '';
}
