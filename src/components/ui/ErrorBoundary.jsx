import { Component } from 'react'
import { RefreshCw } from 'lucide-react'

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { error: null }
  }

  static getDerivedStateFromError(error) {
    return { error }
  }

  componentDidCatch(error, info) {
    console.error('Tacto ErrorBoundary:', error, info)
  }

  render() {
    if (this.state.error) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-white px-8 text-center">
          <div className="w-16 h-16 rounded-2xl bg-charcoal flex items-center justify-center mb-6">
            <span className="text-2xl font-bold text-sage" style={{ letterSpacing: '-0.04em' }}>T</span>
          </div>
          <h1 className="text-2xl font-bold text-charcoal mb-2">Qualcosa è andato storto</h1>
          <p className="text-sm text-charcoal-400 mb-8 max-w-xs leading-relaxed">
            Si è verificato un errore inatteso. Riprova o contatta il supporto se il problema persiste.
          </p>
          <button
            onClick={() => { this.setState({ error: null }); window.location.href = '/' }}
            className="flex items-center gap-2 px-5 py-3 bg-charcoal text-white rounded-2xl text-sm font-medium"
          >
            <RefreshCw className="w-4 h-4" />
            Ricarica l'app
          </button>
          {import.meta.env.DEV && (
            <pre className="mt-8 text-left text-xs text-red-500 bg-red-50 p-4 rounded-xl overflow-auto max-w-full">
              {this.state.error.toString()}
            </pre>
          )}
        </div>
      )
    }
    return this.props.children
  }
}
