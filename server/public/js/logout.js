const logoutBtn = document.getElementById('logout');

logoutBtn.onclick = async () => {
  const response = await fetch('/api/sessions/logout');
  if (response.ok) {
    window.location.href = '/login';
  }
};
