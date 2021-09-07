async function logout() {
  const response = await fetch('/api/users/logout', {
      method: 'post',
      headers: { 'Content-Type' : 'application/json' }
  });

  if(response.ok) {
      window.location.replace("/");
  } else {
      const t = await(response.json());
      console.log(t, " logout script ");
      alert(response.statusText);
  }
}

document.querySelector('#logout').addEventListener('click', logout);
  