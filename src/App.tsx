import { useEffect, useState } from 'react'
import './App.css'

// Use relative path for links.json
const LINKS_JSON_URL = '/links.json'

interface LinkItem {
  title: string
  url: string
}

function App() {
  const [links, setLinks] = useState<LinkItem[]>([])
  const [title, setTitle] = useState('')
  const [url, setUrl] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null)

  useEffect(() => {
    fetch(LINKS_JSON_URL)
      .then((res) => res.json())
      .then(setLinks)
      .catch(() => setLinks([]))
  }, [])

  const handleAddLink = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    if (!title.trim() || !url.trim()) {
      setError('Both fields are required.')
      return
    }
    if (!/^https?:\/\//.test(url)) {
      setError('URL must start with http:// or https://')
      return
    }
    const newLinks = [...links, { title, url }]
    setLinks(newLinks)
    setTitle('')
    setUrl('')
    setSuccess('Link added! Download the updated links.json below.')
    // Create a downloadable JSON blob
    const blob = new Blob([JSON.stringify(newLinks, null, 2)], { type: 'application/json' })
    setDownloadUrl(URL.createObjectURL(blob))
  }

  return (
    <div className="container">
      <h1>🔗 My Link Store</h1>
      <form className="add-link-form" onSubmit={handleAddLink}>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={e => setTitle(e.target.value)}
        />
        <input
          type="url"
          placeholder="https://example.com"
          value={url}
          onChange={e => setUrl(e.target.value)}
        />
        <button type="submit">Add Link</button>
      </form>
      {error && <div className="error">{error}</div>}
      {success && <div className="success">{success}</div>}
      {downloadUrl && (
        <a
          href={downloadUrl}
          download="links.json"
          className="download-btn"
        >
          Download updated links.json
        </a>
      )}
      <div className="links-list">
        <h2>Saved Links</h2>
        {links.length === 0 ? (
          <p>No links yet.</p>
        ) : (
          <ul>
            {links.map((link, idx) => (
              <li key={idx}>
                <a href={link.url} target="_blank" rel="noopener noreferrer">
                  {link.title}
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>
      <footer>
        <p style={{ fontSize: '0.9em', color: '#888' }}>
          To persist your links, download <b>links.json</b> and commit it to your GitHub repo.<br/>
          Update the app with your repo's raw URL for <code>links.json</code>.
        </p>
      </footer>
    </div>
  )
}

export default App
