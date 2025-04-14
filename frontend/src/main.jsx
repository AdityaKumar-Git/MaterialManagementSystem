import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import Home from './pages/Home.jsx'
import SignUp from './pages/SignUp.jsx'
import { Provider } from 'react-redux'
import store from './store/store.js'
import Login from './pages/Login.jsx'
import AdminLogin from './pages/AdminLogin.jsx'
import AdminHome from './pages/AdminHome.jsx'
import AdminProtected from './components/AdminProtected.jsx'
import AddProduct from './pages/AddProduct.jsx'
import AllProducts from './pages/AllProducts.jsx'
import AllOrders from './pages/AllOrders.jsx'
import ContactUs from './pages/Contact.jsx'

let router = createBrowserRouter(
  createRoutesFromElements(
    <>
    <Route path="/" element={<App />}>
      <Route path='' element={<Home />} />
      <Route path='signup' element={<SignUp />} />
      <Route path='login' element={<Login />} />
      <Route path='adminLogin' element={<AdminLogin />} />
      
      <Route path='adminHome' element={
        <AdminProtected authentication>
            <AdminHome />
        </AdminProtected>
      }/>

      <Route path='addProduct' element={
        <AdminProtected authentication>
            <AddProduct />
        </AdminProtected>
      }/>

      <Route path='viewOrders' element={
        <AdminProtected authentication>
            <AllOrders />
        </AdminProtected>
      }/>

      <Route path='products' element={<AllProducts />}/>
      <Route path='contact' element={<ContactUs />}/>

    </Route>
    </>
  )
)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </StrictMode>,
)
