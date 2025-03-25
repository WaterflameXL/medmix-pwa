import React from 'react'

export default function LoadingScreen({ onFinish }) {
  return (
    <div style={{
      backgroundColor: '#000',
      width: '100%',
      height: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    }}>
      <video
        src="/animation.mp4"
        autoPlay
        muted
        onEnded={onFinish}
        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
      />
    </div>
  )
}