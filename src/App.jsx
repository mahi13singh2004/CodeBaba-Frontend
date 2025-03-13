import { useState, useEffect } from 'react'
import "prismjs/themes/prism-tomorrow.css"
import Editor from "react-simple-code-editor"
import prism from "prismjs"
import Markdown from "react-markdown"
import rehypeHighlight from "rehype-highlight"
import "highlight.js/styles/github-dark.css"
import axios from 'axios'
import './App.css'

function App() {
  const [code, setCode] = useState(`function sum() {
  return 1 + 1
}`)
  const [review, setReview] = useState(`# Welcome to CodeBaba! 👋

Write or paste your code in the editor on the left side.
Then click the "Review Code" button to get an AI-powered code review.

## Features:
- Syntax highlighting for better code readability
- Instant AI feedback on your code
- Markdown-formatted review results

## Get Started:
1. Enter your code in the left panel
2. Click "Review Code" button
3. View the AI feedback in this panel`)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    prism.highlightAll()
  }, [])

  async function reviewCode() {
    try {
      setIsLoading(true)
      const response = await axios.post(`${import.meta.env.VITE_API_URL}ai/get-review`, { code })
      setReview(response.data)
    } catch (err) {
      console.error('Failed to get code review:', err)
      setReview("# Error\nFailed to get code review. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="animate-fade-in">
      <div className="left animate-slide-up">
        <div className="code">
          <Editor
            value={code}
            onValueChange={setCode}
            highlight={code => prism.highlight(code, prism.languages.javascript, "javascript")}
            padding={20}
            style={{
              fontFamily: '"Fira Code", monospace',
              fontSize: 14,
              lineHeight: 1.6,
              minHeight: '100%',
            }}
          />
        </div>
        <button 
          onClick={reviewCode}
          disabled={isLoading}
          className="review transition-transform hover:scale-105 active:scale-95"
        >
          {isLoading ? 'Reviewing...' : 'Review Code'}
        </button>
      </div>
      <div className="right animate-fade-in-right">
        <Markdown rehypePlugins={[rehypeHighlight]}>
          {review}
        </Markdown>
      </div>
    </main>
  )
}

export default App