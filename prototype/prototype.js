const SAMPLE_MARKDOWN = `# Create your first client

Connect your application to Luma with a typed client, secure credentials, and one small configuration file.

## Install the SDK

\`\`\`sh
pnpm add @luma/sdk
\`\`\`

## Configure the client

\`\`\`ts
import { createClient } from '@luma/sdk'

export const luma = createClient({
  projectId: 'project_orbit_42',
  region: 'auto',
})
\`\`\`

## Make a request

The client infers response types from your schema and returns structured errors.
`

const icons = {
  sparkles: `<svg class="island-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="m12 3 1.2 3.8L17 8l-3.8 1.2L12 13l-1.2-3.8L7 8l3.8-1.2L12 3Z"/><path d="m18 14 .8 2.2L21 17l-2.2.8L18 20l-.8-2.2L15 17l2.2-.8L18 14ZM5 13l.6 1.6L7 15l-1.4.4L5 17l-.6-1.6L3 15l1.4-.4L5 13Z"/></svg>`,
  chevron: `<svg class="chevron" viewBox="0 0 24 24" aria-hidden="true"><path d="m7 14 5-5 5 5"/></svg>`,
  copy: `<svg class="island-icon" viewBox="0 0 24 24" aria-hidden="true"><rect x="8" y="8" width="11" height="11" rx="2"/><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2"/></svg>`,
  file: `<svg class="island-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 3h8l4 4v14H6V3Z"/><path d="M14 3v5h5M9 13h6M9 17h4"/></svg>`,
  link: `<svg class="island-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="m9.5 14.5 5-5M7.5 17.5l-1 1a3.5 3.5 0 0 1-5-5l3-3a3.5 3.5 0 0 1 5 0M16.5 6.5l1-1a3.5 3.5 0 0 1 5 5l-3 3a3.5 3.5 0 0 1-5 0"/></svg>`,
  search: `<svg class="island-icon" viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="6.5"/><path d="m16 16 4 4"/></svg>`,
  arrow: `<svg class="island-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M14 7l5 5-5 5"/></svg>`,
  chatgpt: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3.2a4.1 4.1 0 0 1 7.1 2.7 4.1 4.1 0 0 1 1.7 6.8 4.1 4.1 0 0 1-3.7 6 4.1 4.1 0 0 1-6.9.5 4.1 4.1 0 0 1-6.5-3.5 4.1 4.1 0 0 1-1.1-7 4.1 4.1 0 0 1 5.5-5.1A4.1 4.1 0 0 1 12 3.2Z"/><path d="m8.2 7.1 7.6 4.4v5M15.8 16.9l-7.6-4.4v-5M5.7 12.7l7.6-4.4 4.3 2.5M18.3 11.3l-7.6 4.4-4.3-2.5"/></svg>`,
  claude: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3v18M4.2 7.5l15.6 9M4.2 16.5l15.6-9M3 12h18M7.5 4.2l9 15.6M16.5 4.2l-9 15.6"/></svg>`,
}

const actionRow = (action, label, description, icon) => `
  <button class="island-action" type="button" data-action="${action}">
    <span class="provider-mark">${icons[icon]}</span>
    <span class="action-copy"><strong>${label}</strong><small>${description}</small></span>
    <span class="action-arrow">↗</span>
  </button>`

const variants = {
  A: {
    name: 'Quiet glass III',
    render: () => `<div class="variant-a open" data-island-panel>
      <div class="a-menu island-surface" role="menu" aria-label="AI page actions">
        <div class="a-simple-head">
          <span><strong>Ask about this page</strong><small>Create your first client</small></span>
        </div>
        ${actionRow('chatgpt', 'ChatGPT', 'Research and ask follow-ups', 'chatgpt')}
        ${actionRow('claude', 'Claude', 'Continue with this page', 'claude')}
        <div class="a-utilities" aria-label="Page utilities">
          <button type="button" data-action="copy-page">${icons.copy}<span>Copy page</span></button>
          <button type="button" data-action="markdown">${icons.file}<span>Markdown</span></button>
          <button type="button" data-action="mcp">${icons.link}<span>MCP</span></button>
        </div>
      </div>
      <button class="a-trigger island-surface" type="button" data-island-toggle aria-expanded="true">
        <span class="spark">${icons.sparkles}</span><span class="trigger-label"><strong>Ask AI</strong></span>${icons.chevron}
      </button>
    </div>`,
  },
  B: {
    name: 'Context split',
    render: () => `<div class="variant-b open" data-island-panel>
      <div class="b-panel island-surface" role="menu" aria-label="AI action deck">
        <div class="b-summary">
          <span class="b-eyebrow">PAGE CONTEXT</span>
          <span class="b-page-icon">${icons.file}</span>
          <h3>Create your first client</h3>
          <p>Quickstart · 4 min read</p>
          <span class="b-source"><i></i> Markdown synced</span>
          <button type="button" data-action="copy-page">${icons.copy} Copy page</button>
        </div>
        <div class="b-actions">
          <span class="b-eyebrow">CONTINUE IN</span>
          <button class="b-target" type="button" data-action="chatgpt"><span class="b-target-icon">${icons.chatgpt}</span><span><strong>ChatGPT</strong><small>Research this guide</small></span><i>↗</i></button>
          <button class="b-target" type="button" data-action="claude"><span class="b-target-icon">${icons.claude}</span><span><strong>Claude</strong><small>Start a grounded chat</small></span><i>↗</i></button>
          <div class="b-tools">
            <button type="button" data-action="markdown">${icons.file}<span>View Markdown</span></button>
            <button type="button" data-action="mcp">${icons.link}<span>Copy MCP</span></button>
          </div>
        </div>
      </div>
      <div class="b-rail island-surface">
        <button class="b-trigger" type="button" data-island-toggle aria-expanded="true"><span class="b-orb">${icons.sparkles}</span><span><strong>Use with AI</strong><small>Page context ready</small></span></button>
        <span class="b-separator"></span>
        <button class="b-quick" type="button" data-action="copy-page" aria-label="Copy page">${icons.copy}</button>
        <span class="island-kbd">⌘ I</span>
      </div>
    </div>`,
  },
  C: {
    name: 'Command line',
    render: () => `<div class="variant-c open" data-island-panel>
      <div class="c-palette island-surface" role="dialog" aria-label="AI command palette">
        <label class="c-search"><span class="c-search-mark">${icons.sparkles}</span><input type="search" placeholder="What would you like to do?" data-command-search /><span class="island-kbd">ESC</span></label>
        <div class="c-list" data-command-list>
          <div class="c-section"><span>Suggested</span><small>Create your first client</small></div>
          ${commandAction('chatgpt', 'Open in ChatGPT', 'Research this page and ask follow-up questions', 'chatgpt', '↗', true)}
          ${commandAction('claude', 'Open in Claude', 'Continue with the current guide as context', 'claude', '↗')}
          ${commandAction('copy-page', 'Copy page for AI', 'Copy clean Markdown to your clipboard', 'copy', 'C')}
          ${commandAction('markdown', 'View Markdown source', 'Open the machine-readable page', 'file', 'M')}
          ${commandAction('mcp', 'Copy MCP endpoint', 'Connect this documentation to an agent', 'link', 'P')}
        </div>
        <div class="c-footer"><span><kbd>↑↓</kbd> Navigate</span><span><kbd>↵</kbd> Select</span><span class="c-context"><i></i> Markdown available</span></div>
      </div>
      <button class="c-trigger island-surface" type="button" data-island-toggle aria-expanded="true"><span class="c-trigger-key">⌘</span><span><strong>AI commands</strong><small>5 available</small></span><span class="c-trigger-arrow">↑</span></button>
    </div>`,
  },
  D: {
    name: 'Editorial sheet',
    render: () => `<div class="variant-d open" data-island-panel>
      <div class="d-sheet island-surface" role="menu" aria-label="AI page handoff">
        <div class="d-head">
          <span class="d-kicker">USE THIS GUIDE</span>
          <h3>Continue with AI</h3>
          <p>Take the current page into the assistant you already use.</p>
        </div>
        <div class="d-targets">
          <button class="d-primary" type="button" data-action="chatgpt"><span>${icons.chatgpt}</span><strong>ChatGPT</strong><i>↗</i></button>
          <button class="d-secondary" type="button" data-action="claude"><span>${icons.claude}</span><strong>Claude</strong><i>↗</i></button>
        </div>
        <div class="d-links">
          <button type="button" data-action="copy-page">${icons.copy} Copy page</button>
          <button type="button" data-action="markdown">${icons.file} Markdown</button>
          <button type="button" data-action="mcp">${icons.link} MCP</button>
        </div>
      </div>
      <button class="d-trigger island-surface" type="button" data-island-toggle aria-expanded="true"><span class="d-trigger-mark">${icons.sparkles}</span><span><strong>Continue with AI</strong><small>Create your first client</small></span><span class="d-trigger-count">5</span></button>
    </div>`,
  },
}

function commandAction(action, label, description, icon, key, selected = false) {
  return `<button class="c-action${selected ? ' selected' : ''}" type="button" data-action="${action}" data-command-label="${label.toLowerCase()} ${description.toLowerCase()}"><span class="c-action-icon">${icons[icon]}</span><span><strong>${label}</strong><small>${description}</small></span><span class="c-key">${key}</span></button>`
}

const root = document.querySelector('[data-island-root]')
const stateOutput = document.querySelector('[data-prototype-state]')
const configPreview = document.querySelector('[data-config-preview]')
const switcher = document.querySelector('[data-prototype-switcher]')
const variantLabel = document.querySelector('[data-variant-label]')
const markdownDialog = document.querySelector('[data-markdown-dialog]')
const toast = document.querySelector('[data-toast]')
const customizer = document.querySelector('[data-customizer]')

const state = {
  variant: getVariant(),
  accent: '#8b7cf6',
  surface: 'frosted',
  density: 'compact',
  placement: 'center',
  radius: 20,
  selectedProvider: 'ChatGPT',
}

let toastTimer

function getVariant() {
  const value = new URLSearchParams(location.search).get('variant')?.toUpperCase()
  return value && variants[value] ? value : 'A'
}

function render() {
  root.innerHTML = variants[state.variant].render()
  bindIsland()
  updateStateOutput()
}

function bindIsland() {
  root.querySelector('[data-island-toggle]')?.addEventListener('click', (event) => {
    const panel = root.querySelector('[data-island-panel]')
    const open = panel.classList.toggle('open')
    event.currentTarget.setAttribute('aria-expanded', String(open))
  })

  root.querySelectorAll('[data-action]').forEach((button) => {
    button.addEventListener('click', () => runAction(button.dataset.action))
  })

  const promptForm = root.querySelector('[data-prompt-form]')
  promptForm?.addEventListener('submit', (event) => {
    event.preventDefault()
    const prompt = new FormData(promptForm).get('prompt')?.toString().trim()
    showToast(prompt ? `Would open ${state.selectedProvider}: “${prompt}”` : `Add a question before opening ${state.selectedProvider}`)
  })

  root.querySelectorAll('[data-provider]').forEach((button) => {
    button.addEventListener('click', () => {
      state.selectedProvider = button.dataset.provider
      root.querySelectorAll('[data-provider]').forEach((item) => item.classList.toggle('active', item === button))
      updateStateOutput()
    })
  })

  const search = root.querySelector('[data-command-search]')
  search?.addEventListener('input', () => {
    const query = search.value.toLowerCase().trim()
    root.querySelectorAll('[data-command-label]').forEach((item) => {
      item.hidden = query && !item.dataset.commandLabel.includes(query)
    })
  })

  root.onkeydown = handleIslandKeys
}

function handleIslandKeys(event) {
  if (event.key === 'Escape') {
    const panel = root.querySelector('[data-island-panel]')
    if (panel?.classList.contains('open')) {
      panel.classList.remove('open')
      root.querySelector('[data-island-toggle]')?.setAttribute('aria-expanded', 'false')
      root.querySelector('[data-island-toggle]')?.focus()
    }
    return
  }

  if (!['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) return
  if (event.target.matches('input, textarea, [contenteditable]')) return
  const actions = [...root.querySelectorAll('[data-action]:not([hidden])')]
  if (!actions.length) return
  const current = actions.indexOf(document.activeElement)
  let next = current
  if (event.key === 'ArrowDown') next = (current + 1) % actions.length
  if (event.key === 'ArrowUp') next = (current - 1 + actions.length) % actions.length
  if (event.key === 'Home') next = 0
  if (event.key === 'End') next = actions.length - 1
  actions[next]?.focus()
  event.preventDefault()
}

async function runAction(action) {
  if (action === 'chatgpt' || action === 'claude') {
    showToast(`Would open this page in ${action === 'chatgpt' ? 'ChatGPT' : 'Claude'}`)
    return
  }
  if (action === 'copy-page') {
    await copyText(SAMPLE_MARKDOWN)
    showToast('Page Markdown copied')
    return
  }
  if (action === 'mcp') {
    await copyText('https://docs.luma.dev/api/mcp')
    showToast('MCP endpoint copied')
    return
  }
  if (action === 'markdown') markdownDialog.showModal()
}

async function copyText(value) {
  try {
    await navigator.clipboard.writeText(value)
  } catch {
    showToast('Clipboard unavailable in this preview')
  }
}

function showToast(message) {
  clearTimeout(toastTimer)
  toast.textContent = message
  toast.hidden = false
  toastTimer = setTimeout(() => { toast.hidden = true }, 1800)
}

function setVariant(key) {
  state.variant = key
  const url = new URL(location.href)
  url.searchParams.set('variant', key)
  history.replaceState({}, '', url)
  render()
}

function cycleVariant(direction) {
  const keys = Object.keys(variants)
  const index = keys.indexOf(state.variant)
  setVariant(keys[(index + direction + keys.length) % keys.length])
}

function updateStateOutput() {
  const summary = `${state.variant} · ${variants[state.variant].name} · ${state.surface} · ${state.density} · ${state.placement} · ${state.radius}px`
  stateOutput.textContent = summary
  variantLabel.textContent = `${state.variant} — ${variants[state.variant].name}`
  configPreview.textContent = `{ surface: '${state.surface}', density: '${state.density}', placement: '${state.placement}', radius: ${state.radius}, accent: '${state.accent}' }`
}

function applyControl(name, value) {
  state[name] = value
  document.body.dataset[name] = value
  document.querySelectorAll(`[data-control="${name}"] button`).forEach((button) => button.classList.toggle('active', button.dataset.value === value))
  updateStateOutput()
}

document.querySelector('[data-customize-toggle]').addEventListener('click', (event) => {
  customizer.hidden = !customizer.hidden
  event.currentTarget.setAttribute('aria-expanded', String(!customizer.hidden))
})
document.querySelector('[data-customize-close]').addEventListener('click', () => {
  customizer.hidden = true
  document.querySelector('[data-customize-toggle]').setAttribute('aria-expanded', 'false')
})
document.querySelectorAll('[data-accent]').forEach((button) => {
  button.addEventListener('click', () => {
    state.accent = button.dataset.accent
    document.documentElement.style.setProperty('--island-accent', state.accent)
    document.querySelectorAll('[data-accent]').forEach((item) => item.classList.toggle('active', item === button))
    updateStateOutput()
  })
})
document.querySelectorAll('[data-control] button').forEach((button) => {
  button.addEventListener('click', () => applyControl(button.parentElement.dataset.control, button.dataset.value))
})
document.querySelector('[data-radius]').addEventListener('input', (event) => {
  state.radius = Number(event.target.value)
  document.documentElement.style.setProperty('--island-radius', `${state.radius}px`)
  document.querySelector('[data-radius-output]').value = `${state.radius}px`
  updateStateOutput()
})
document.querySelector('[data-host-theme]').addEventListener('change', (event) => {
  document.documentElement.dataset.theme = event.target.checked ? 'dark' : 'light'
})
document.querySelector('[data-theme-toggle]').addEventListener('click', () => {
  const dark = document.documentElement.dataset.theme === 'dark'
  document.documentElement.dataset.theme = dark ? 'light' : 'dark'
  document.querySelector('[data-host-theme]').checked = !dark
})
document.querySelector('[data-page-copy]').addEventListener('click', async () => {
  await copyText(SAMPLE_MARKDOWN)
  showToast('Page Markdown copied')
})

document.querySelector('[data-previous]').addEventListener('click', () => cycleVariant(-1))
document.querySelector('[data-next]').addEventListener('click', () => cycleVariant(1))
document.addEventListener('keydown', (event) => {
  if (!['ArrowLeft', 'ArrowRight'].includes(event.key)) return
  if (event.target.matches('input, textarea, [contenteditable]') || event.target.closest('[data-island-root]')) return
  cycleVariant(event.key === 'ArrowRight' ? 1 : -1)
})

document.querySelector('[data-dialog-close]').addEventListener('click', () => markdownDialog.close())
document.querySelector('[data-copy-markdown]').addEventListener('click', async () => {
  await copyText(SAMPLE_MARKDOWN)
  showToast('Page Markdown copied')
})
document.querySelector('[data-markdown-preview]').textContent = SAMPLE_MARKDOWN

const isDevelopment = ['localhost', '127.0.0.1', '::1'].includes(location.hostname)
if (isDevelopment) {
  document.body.classList.add('dev')
  switcher.hidden = false
}

render()
