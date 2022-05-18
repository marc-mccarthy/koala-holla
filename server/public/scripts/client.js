console.log('JavaScript Working');

$(document).ready(() => {
  console.log('JQuery Working');
  // Establish Click Listeners
  setupClickListeners();
  // load existing koalas on page load
  getKoalas();
}); // end doc ready

function setupClickListeners() {
  $('#viewKoalas').on('click', '.markReadybuttonKoala', toggleReadyForTransfer);
  $('#viewKoalas').on('click', '.deleteKoala', deleteKoalaAlert);
  $('#addButton').on('click', function() {
    console.log('addButton has been clicked');
    // get user input and put in an object
    // NOT WORKING YET :(
    // using a test object
    let koalaToSend = {
      name: (($('#nameIn').val()).charAt(0)).toUpperCase() + ($('#nameIn').val()).slice(1),
      age: $('#ageIn').val(),
      gender: ($('#genderIn').val()).toUpperCase(),
      readyForTransfer: ($('#readyForTransferIn').val()).toUpperCase(),
      notes: (($('#notesIn').val()).charAt(0)).toUpperCase() + ($('#notesIn').val()).slice(1)
    };
    emptyInputs();
    // call saveKoala with the new obejct
    checkKoala(koalaToSend);
    saveKoala(newKoala);
  });
} // end setupClickListeners

function checkKoala(newKoala) {
  for (const entry in newKoala) {
    if (newKoala[entry] === '') {
      alert('Forgot a value');
      break;
    }
  }
  if (newKoala.gender !== 'M' && newKoala.gender !== 'F') {
    alert("Only 'M' or 'F' are acceptable 'Gender' values for this exercise");
  } else if (newKoala.readyForTransfer !== 'Y' && newKoala.readyForTransfer !== 'N') {
    alert("Only 'Y' or 'N' are acceptable 'Ready For Transfer' values for this exercise");
  } else if (newKoala.age.includes('.')) {
    alert("Only Whole Numbers are acceptable 'Age' values for this exercise");
  } else {
    return true;
  }
} // end checkKoala

function saveKoala(newKoala) {
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
    let transfer = '';
    let ready = '';
    if (response[i].ready_to_transfer === 'Y') {
      transfer = 'True';
      ready = "I'm Not Ready Now";
    } else {
      transfer = 'False';
      ready = "I'm Ready Now";
    }
    el.append(`<tr class="rowKoala">
      <td class="koalaName">${response[i].name}</td>
      <td class="ageKoala">${response[i].age}</td>
      <td class="genderKoala">${response[i].gender}</td>
      <td class="readyForTransferKoala">${transfer}</td>
      <td class="notesKoala">${response[i].notes}</td>
      <td class="markReadyKoala"><button class="markReadybuttonKoala" data-id="${response[i].id}">${ready}</button></td>
      <td class="removeKoala"><button class="deleteKoala" data-id="${response[i].id}">Delete</button></td></tr>`);
  };
} // end appendKoalas

function toggleReadyForTransfer() {
  $.ajax({
    method: 'PUT',
    url: '/koalas',
    data: {id: $(this).data('id')}
  }).then(response => {
    console.log(`PUT changeTransfer: Client <-- back from Server: ${response}`);
    getKoalas();
  }).catch(error => {
    alert(`Invalid PUT changeTransfer: Client <-- back from Server: ${error}`);
  })
}

function deleteKoala(dataId) {
  $.ajax({
    method: 'DELETE',
    url: '/koalas',
    data: dataId
  }).then(response => {
    console.log(`DELETE deleteKoala: Client <-- back from Server: ${response}`);
    getKoalas();
  }).catch(error => {
    alert(`Invalid DELETE deleteKoala: Client <-- back from Server: ${error}`);
  })
}

function deleteKoalaAlert() {
  let dataId = {id: $(this).data('id')};
  Swal.fire({
    title: 'Are you sure?',
    showDenyButton: true,
    showCancelButton: true,
    confirmButtonText: 'Yes',
    denyButtonText: `No`
  }).then(result => {
    if (result.isConfirmed) {
      Swal.fire('Confirmed');
      deleteKoala(dataId);
      return true;
    } else if (result.isDenied) {
      return false;
    }
  })
}

function emptyInputs() {
  $('#nameIn').val('');
  $('#ageIn').val('');
  $('#genderIn').val('');
  $('#readyForTransferIn').val('');
  $('#notesIn').val('');
}