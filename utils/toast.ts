const showToast = (message: string, type: 'success' | 'error') => {
  const toastContainer = document.createElement('div');
  toastContainer.className = `fixed top-5 right-5 p-4 rounded-md text-white shadow-lg transition-transform transform ${type === 'success' ? 'bg-green-500' : 'bg-red-500'} z-50`;

  toastContainer.innerHTML = message;

  // Append the toast to the body
  document.body.appendChild(toastContainer);

  // Remove the toast after 3 seconds
  setTimeout(() => {
    toastContainer.classList.add('opacity-0');
    setTimeout(() => toastContainer.remove(), 500); // Remove after fade out
  }, 3000);
};

export default showToast;
