import React from 'react'
import { NativeRouter, Route, Routes } from 'react-router-native'
import MainPage from './components/MainPage'
import Search from './components/Search'

export default function App() {
  return (
    <NativeRouter>
      <Routes>
        <Route exact path="/" element={<MainPage />} />
        <Route path="/search" element={<Search />} />
      </Routes>
    </NativeRouter>
  )
}
