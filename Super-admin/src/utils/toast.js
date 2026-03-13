// Simple toast: append to #toast-root. Components call toast.success(msg) etc.
const container = () => {
  let el = document.getElementById('toast-root')
  if (!el) {
    el = document.createElement('div')
    el.id = 'toast-root'
    document.body.appendChild(el)
  }
  return el
}

const show = (message, type = 'success') => {
  const el = document.createElement('div')
  const colors = { success: 'bg-success/90', error: 'bg-danger/90', warning: 'bg-warning/90' }
  el.className = `rounded-lg px-4 py-2 text-sm font-medium text-white shadow-lg ${colors[type] || colors.success}`
  el.textContent = message
  container().appendChild(el)
  setTimeout(() => el.remove(), 3000)
}

export const toast = {
  success: (msg) => show(msg, 'success'),
  error: (msg) => show(msg, 'error'),
  warning: (msg) => show(msg, 'warning'),
}
