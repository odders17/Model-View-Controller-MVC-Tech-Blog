// Fetch all existing use data

async function getAndSetUserProfilePicture() {
  const profilePicture = document.getElementById('profile-picture');
  const response = await fetch('/api/users/:id', {
      method: 'get',
      headers: { 'Content-Type': 'application/json' }
  }).then(res => {
      return res.json();
  }).catch(e => {
      console.log(e)
  });

  if (!response.profile_picture) {
     profilePicture.src("/images/blank-profile-picture.png");

     return;
  }
  /*Grab the array buffer from response*/
  const imgData = response.profile_picture.data;
  /*Convert buffer to typed array */
  let typedArray = new Uint8Array(imgData);
  /*Convert array to Blob*/
  let blob = new Blob([typedArray], { type: 'image/jpeg' });
  /*create html img element*/
  const nImage = document.getElementById('profile-picture');
  /*set the img src to an object url*/
  nImage.src = URL.createObjectURL(blob);
}

getAndSetUserProfilePicture();

async function editProfileHandler(event) {
  event.preventDefault();

  const bio = document.querySelector('input[name="user-bio"]').value.trim();
  const location = document.querySelector('input[name="user-location"]').value.trim();
  const birthday = document.querySelector('input[name="user-birthday"]').value.trim();
  const response = await fetch('/api/users/profile/:id', {
      method: "PUT",
      body: JSON.stringify({
          bio,
          location,
          birthday,
      }),
      headers: {
          "Content-Type": "application/json",
      },
  });
  console.log(response, "RESPONSE");
  if (response.ok) {
      document.location.replace("/dashboard/");
  } else {
      alert(response.statusText);
  }
}

document
  .getElementById("save-profile")
  .addEventListener("click", editProfileHandler);

// Profile Picture Script
const upload_picture = document.getElementById('upload');
const profilePicture = document.getElementById('profile-picture');

async function imageUploadHandler(event) {
  event.preventDefault();
  const form = document.getElementById('test');
  const file = document.getElementById('input-files');
  const length = file.files.length;
  const fileData = file.files[0];
  /*check the file contents, dont send if field is empty*/
  if (length === 0) {
      alert('You must select a file!');
  } else {
      const fileType = file.files[0].name.split('.')[1];
      console.log('checking file contents');
      if (fileType === 'png' || fileType === 'jpg' || fileType === 'jpeg' || fileType === 'gif') {
          if (fileData.size > 2 * 1024 * 1024) {
              return alert('Images must be less than 2 MB')
          } else {
              console.log(`Uploading image`);
              const formData = new FormData();
              formData.append('file', fileData);
              console.log(formData);
              const imageUpload = await fetch('/api/users/profile-picture/:id', {
                  method: 'put',
                  body: formData,
              }).catch(e => {
                  console.log(e)
              });
              if (imageUpload.ok) {
                  alert('Image successfully uploaded!');
                  // document.getElementById('profilePicture').setAttribute('src', '');
                  form.setAttribute('style', 'visibility: hidden;')

                  const response = await fetch('/api/users/:id', {
                      method: 'get',
                      headers: { 'Content-Type': 'application/json' }
                  }).then(res => {
                      return res.json();
                  }).catch(e => {
                      console.log(e)
                  });
                  /*Grab the array buffer from response*/
                  console.log(response.profile_picture.data, "HERERERERERE");
                  const imgData = response.profile_picture.data;
                  /*Convert buffer to typed array */
                  let typedArray = new Uint8Array(imgData);
                  /*Convert array to Blob*/
                  let blob = new Blob([typedArray], { type: 'image/jpeg' });
                  /*create html img element*/
                  const nImage = document.getElementById('profile-picture');
                  /*set the img src to an object url*/
                  nImage.src = URL.createObjectURL(blob);
                  console.log(nImage);
              } else {
                  alert(imageUpload.statusText);
              }
          }
      } else {
          alert(`The ${fileType.toUpperCase()} file is not supported!`);
      }
  }
}

upload_picture.addEventListener('click', imageUploadHandler);