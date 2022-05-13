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
      name: $('#nameIn'),
      age: $('#ageIn'),
      gender: $('#genderIn'),
      readyForTransfer: $('#readyForTransferIn'),
      notes: $('#notesIn')
    };
    // call saveKoala with the new obejct
    saveKoala(koalaToSend);
  }); 
}

function getKoalas(){
  console.log(`GET getKoalas: Client --> to Server`);
  // ajax call to server to get koalas
  $.ajax({
    method: 'GET',
    url: '/koalas'
  }).then(response => {
    console.log(`GET getKoalas: Client <-- back from Server: ${response}`);
    appendKoalas(response);
  }).catch(response => {
    alert(`Invalid GET getKoalas: Client <-- back from Server: ${response}`);
  })
} // end getKoalas

function saveKoala(newKoala){
  console.log(`POST newKoala: Client --> to Server: ${newKoala}`);
  // ajax call to server to save koala
  $.ajax({
    method: 'POST',
    url: '/koalas',
    data: newKoala
  }).then(response => {
    console.log(`POST newKoala: Client <-- back from Server: ${response}`);
  }).catch(response => {
    alert(`Invalid POST newKoala: Client <-- back from Server: ${response}`);
  })
}

function appendKoalas(response) {
  let el = $('#viewKoalas');
  el.empty();
  for (i = 0; i < response.length; i++) {
    if (response[i].ready_to_transfer === 'Y') {
      el.append(`<tr><td class="koalaName">${response[i].name}</td>
              <td class="ageKoala">${response[i].age}</td>
              <td class="genderKoala">${response[i].gender}</td>
              <td class="readyToTransferKoala">${transformLetter(response[i].ready_to_transfer)}</td>
              <td class="notesKoala">${response[i].notes}</td>
              <td class="markReadyKoala"></td>
              <td class="removeKoala"><button class="deleteKoala">Delete</button></td></tr>`);
    } else {
      el.append(`<tr><td class="koalaName">${response[i].name}</td>
              <td class="ageKoala">${response[i].age}</td>
              <td class="genderKoala">${response[i].gender}</td>
              <td class="readyToTransferKoala">${transformLetter(response[i].ready_to_transfer)}</td>
              <td class="notesKoala">${response[i].notes}</td>
              <td class="markReadyKoala"><button class="markReadybuttonKoala">Ready for Transfer</button></td>
              <td class="removeKoala"><button class="deleteKoala">Delete</button></td></tr>`);
    }
  }
}

function transformLetter(letter) {
  if (letter === 'Y') {
    return true;
  } else {
    return false;
  }
}