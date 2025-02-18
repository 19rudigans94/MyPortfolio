import { Routes, Route, Outlet } from 'react-router-dom'
import { Suspense, lazy } from 'react'
import Layout from '@/components/Layout'
import ProtectedRoute from '@/components/ProtectedRoute'
import JsonLd from '@/components/SEO/JsonLd'
import LoadingSpinner from '@/components/LoadingSpinner'

// Динамические импорты для основных страниц
const Home = lazy(() => import('@/pages/Home'))
const Projects = lazy(() => import('@/pages/Projects'))
const About = lazy(() => import('@/pages/About'))
const Contact = lazy(() => import('@/pages/Contact'))
const Login = lazy(() => import('@/pages/Login'))

// Динамический импорт для административной части
const Admin = lazy(() => import('@/pages/Admin'))

function App() {
  return (
    <>
      <JsonLd />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={
            <Suspense fallback={<LoadingSpinner />}>
              <Home />
            </Suspense>
          } />
          <Route path="projects" element={
            <Suspense fallback={<LoadingSpinner />}>
              <Projects />
            </Suspense>
          } />
          <Route path="about" element={
            <Suspense fallback={<LoadingSpinner />}>
              <About />
            </Suspense>
          } />
          <Route path="contact" element={
            <Suspense fallback={<LoadingSpinner />}>
              <Contact />
            </Suspense>
          } />
        <Route path="login" element={
            <Suspense fallback={<LoadingSpinner />}>
              <Login />
            </Suspense>
          } />
        <Route
          path="admin/*"
          element={
            <ProtectedRoute>
              <Admin />
            </ProtectedRoute>
          }
        />
        </Route>
      </Routes>
    </>
  )
}

export default App