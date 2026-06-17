document.addEventListener('DOMContentLoaded', () => {
  document.addEventListener('click', e => {
    const link = e.target.closest('a')
    if (!link) return
    const href = link.getAttribute('href')
    if (!href) return
    const esInterno = !href.startsWith('http') && !href.startsWith('#') && !href.startsWith('mailto')
    if (!esInterno) return
    e.preventDefault()
    document.body.classList.add('fade-out')
    setTimeout(() => { window.location.href = href }, 150)
  })
})