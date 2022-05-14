console.log('JavaScript Working');

$(document).ready(() => {
  console.log('JQuery Working');
  // Establish Click Listeners
  setupClickListeners();
  // load existing koalas on page load
  getKoalas();
}); // end doc ready

function setupClickListeners() {
  $('#addButton').on('click', function() {
    console.log('addButton has been clicked');
    // get user input and put in an object
    // NOT WORKING YET :(
    // using a test object
    let koalaToSend = {
      name: $('#nameIn').val(),
      age: $('#ageIn').val(),
      gender: ($('#genderIn').val()).toUpperCase(),
      readyForTransfer: ($('#readyForTransferIn').val()).toUpperCase(),
      notes: $('#notesIn').val()
    };
    // call saveKoala with the new obejct
    checkKoala(koalaObject)
  });
} // end setupClickListeners

function checkKoala(newKoala) {
  for (const entry in newKoala) {
    if (newKoala[entry] === '') {
      alert('Forgot a value')
      break;
    }
  }
  if (newKoala.gender !== 'M' && newKoala.gender !== 'F') {
    alert("Only 'M' or 'F' are acceptable 'Gender' values for this exercise");
  } else if (newKoala.readyForTransfer !== 'Y' && newKoala.readyForTransfer !== 'N') {
    alert("Only 'Y' or 'N' are acceptable 'Ready For Transfer' values for this exercise");
  } else {
    saveKoala(newKoala);
  }
} // end checkKoala

function saveKoala(newKoala){
  console.log(`POST newKoala: Client --> to Server: ${newKoala}`);
  // ajax call to server to save koala
  $.ajax({
    method: 'POST',
    url: '/koalas',
    data: newKoala
  }).then(response => {
    console.log(`POST newKoala: Client <-- back from Server: ${response}`);
    getKoalas();
  }).catch(error => {
    alert(`Invalid POST newKoala: Client <-- back from Server: ${error}`);
  })
} // end saveKoala

function getKoalas(){
  console.log(`GET getKoalas: Client --> to Server`);
  // ajax call to server to get koalas
  $.ajax({
    method: 'GET',
    url: '/koalas'
  }).then(response => {
    console.log(`GET getKoalas: Client <-- back from Server: ${response}`);
    appendKoalas(response);
  }).catch(error => {
    alert(`Invalid GET getKoalas: Client <-- back from Server: ${error}`);
  })
} // end getKoalas

function appendKoalas(response) {
  let el = $('#viewKoalas');
  el.empty();
  for (i = 0; i < response.length; i++) {
    if (response[i].ready_to_transfer === 'Y') {
      el.append(`<tr><td class="koalaName">${response[i].name}</td>
              <td class="ageKoala">${response[i].age}</td>
              <td class="genderKoala">${response[i].gender}</td>
              <td class="readyToTransferKoala">Y</td>
              <td class="notesKoala">${response[i].notes}</td>
              <td class="markReadyKoala"></td>
              <td class="removeKoala"><button class="deleteKoala">Delete</button></td></tr>`);
    } else {
      el.append(`<tr><td class="koalaName">${response[i].name}</td>
              <td class="ageKoala">${response[i].age}</td>
              <td class="genderKoala">${response[i].gender}</td>
              <td class="readyToTransferKoala">N</td>
              <td class="notesKoala">${response[i].notes}</td>
              <td class="markReadyKoala"><button class="markReadybuttonKoala">Ready for Transfer</button></td>
              <td class="removeKoala"><button class="deleteKoala">Delete</button></td></tr>`);
    }
  }
} // end appendKoalas