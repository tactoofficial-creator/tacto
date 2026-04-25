import { useState, useEffect } from 'react'

export function useGeolocation() {
  const [state, setState] = useState({
    lat: null,
    lng: null,
    accuracy: null,
    error: null,
    loading: true,
    permissionState: 'prompt',
  })

  useEffect(() => {
    if (!navigator.geolocation) {
      setState(s => ({ ...s, error: 'Geolocation not supported', loading: false }))
      return
    }

    const success = ({ coords }) => {
      setState({
        lat: coords.latitude,
        lng: coords.longitude,
        accuracy: coords.accuracy,
        error: null,
        loading: false,
        permissionState: 'granted',
      })
    }

    const fail = (err) => {
      setState(s => ({
        ...s,
        error: err.message,
        loading: false,
        permissionState: err.code === 1 ? 'denied' : 'prompt',
        // Fallback to Milan center
        lat: s.lat ?? 45.4642,
        lng: s.lng ?? 9.1900,
      }))
    }

    navigator.geolocation.getCurrentPosition(success, fail, {
      enableHighAccuracy: false,
      timeout: 8000,
      maximumAge: 5 * 60 * 1000,
    })
  }, [])

  return state
}
