console.log('JavaScript Working');

$(document).ready(() => {
   console.log('JQuery Working');
    // Establish Click Listeners
   setupClickListeners();
    // load existing koalas on page load
   getKoalas();
}); // end doc ready

function setupClickListeners() {
   $('#viewKoalas').on('click', '.koalaReadyButton', koalaReadyForTransfer);
   $('#viewKoalas').on('click', '.koalaDeleteButton', koalaDeleteAlert);
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
      saveKoala(newKoala);
   }
} // end checkKoala

function saveKoala(newKoala) {
   console.log(`POST newKoala: Client --> Server: ${newKoala}`);
   // ajax call to server to save koala
   $.ajax({
      method: 'POST',
      url: '/koalas',
      data: newKoala
   }).then(response => {
      console.log(`POST newKoala: Client <-- Server: ${response}`);
      getKoalas();
   }).catch(error => {
      alert(`Invalid POST newKoala: Client <-- Server: ${error}`);
   })
} // end saveKoala

function getKoalas(){
   console.log(`GET getKoalas: Client --> Server`);
   // ajax call to server to get koalas
   $.ajax({
      method: 'GET',
      url: '/koalas'
   }).then(response => {
      console.log(`GET getKoalas: Client <-- Server: ${response}`);
      appendKoalas(response);
   }).catch(error => {
      alert(`Invalid GET getKoalas: Client <-- Server: ${error}`);
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
      el.append(`<tr class="koalaRow">
      <td class="koalaName">${response[i].name}</td>
      <td class="koalaAge">${response[i].age}</td>
      <td class="koalaGender">${response[i].gender}</td>
      <td class="koalaReadyForTransfer">${transfer}</td>
      <td class="koalaNotes">${response[i].notes}</td>
      <td class="koalaReady"><button class="koalaReadyButton" data-id="${response[i].id}">${ready}</button></td>
      <td class="koalaDelete"><button class="koalaDeleteButton" data-id="${response[i].id}">Delete</button></td></tr>`);
   };
} // end appendKoalas

function koalaReadyForTransfer() {
   $.ajax({
      method: 'PUT',
      url: '/koalas',
      data: {id: $(this).data('id')}
   }).then(response => {
      console.log(`PUT changeTransfer: Client <-- Server: ${response}`);
      getKoalas();
   }).catch(error => {
      alert(`Invalid PUT changeTransfer: Client <-- Server: ${error}`);
   })
}

function koalaDeleteAlert() {
   let dataId = $(this).data('id');
   Swal.fire({
      title: 'Are you sure?',
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: 'Yes',
      denyButtonText: `No`
   }).then(result => {
      if (result.isConfirmed) {
         deleteKoala(dataId);
         return true;
      } else if (result.isDenied) {
         return false;
      }
   })
}

function deleteKoala(dataId) {
   $.ajax({
      method: 'DELETE',
      url: `/koalas?id=${dataId}`
   }).then(response => {
      console.log(`DELETE deleteKoala: Client <-- Server: ${response}`);
      getKoalas();
   }).catch(error => {
      alert(`Invalid DELETE deleteKoala: Client <-- Server: ${error}`);
   })
}

function emptyInputs() {
   $('#nameIn').val('');
   $('#ageIn').val('');
   $('#genderIn').val('');
   $('#readyForTransferIn').val('');
   $('#notesIn').val('');
}