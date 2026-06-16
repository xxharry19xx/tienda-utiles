import { getUsuarioCache, logout } from './auth.js'

export async function initNav(paginaActiva) {
  const usuario = await getUsuarioCache()
  if (!usuario) return
  const rol = usuario.rol
  const tiendaNombre = usuario.tiendas?.nombre || 'Mi Tienda'
  const headerTitle = document.querySelector('.header-title')
  if (headerTitle) headerTitle.textContent = tiendaNombre
  const nav = document.querySelector('.bottom-nav')
  if (!nav) return
  const esVendedor  = rol === 'vendedor'
  const esSuperAdmin = rol === 'superadmin'
  nav.innerHTML = `
    ${!esVendedor ? `<a href="dashboard.html" class="nav-item ${paginaActiva==='inicio'?'active':''}"><i class="ti ti-home" aria-hidden="true"></i>Inicio</a>` : ''}
    <a href="ventas.html" class="nav-item ${paginaActiva==='ventas'?'active':''}"><i class="ti ti-shopping-cart" aria-hidden="true"></i>Venta</a>
    ${!esVendedor ? `<a href="inventario.html" class="nav-item ${paginaActiva==='inventario'?'active':''}"><i class="ti ti-package" aria-hidden="true"></i>Inventario</a>` : ''}
    <a href="cotizaciones.html" class="nav-item ${paginaActiva==='cotizaciones'?'active':''}"><i class="ti ti-file-text" aria-hidden="true"></i>Cotizar</a>
    ${!esVendedor ? `<a href="usuarios.html" class="nav-item ${paginaActiva==='usuarios'?'active':''}"><i class="ti ti-users" aria-hidden="true"></i>${esSuperAdmin?'Admin':'Equipo'}</a>` : ''}
  `
}

export async function initHeader() {
  const usuario = await getUsuarioCache()
  if (!usuario) return
  const tiendaNombre = usuario.tiendas?.nombre || 'Mi Tienda'
  const header = document.querySelector('.app-header')
  if (!header) return
  header.innerHTML = `
    <div>
      <div class="greeting" id="greetingFecha"></div>
      <div class="header-title">${tiendaNombre}</div>
    </div>
    <div style="display:flex;gap:4px;align-items:center;">
      <div style="font-size:11px;padding:3px 8px;border-radius:999px;background:rgba(255,255,255,0.12);color:rgba(255,255,255,0.7);font-weight:500;">${usuario.rol}</div>
      <button class="icon-btn" onclick="handleLogout()" aria-label="Cerrar sesión"><i class="ti ti-logout" aria-hidden="true"></i></button>
    </div>
  `
  window.handleLogout = async () => { if (confirm('¿Cerrar sesión?')) await logout() }
}