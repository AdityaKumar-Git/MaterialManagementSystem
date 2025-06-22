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
import UserProtected from './components/UserProtected.jsx'
import AddProduct from './pages/AddProduct.jsx'
import AllProducts from './pages/AllProducts.jsx'
import AllOrders from './pages/AllOrders.jsx'
import ContactUs from './pages/Contact.jsx'
import Product from './pages/Product.jsx'
import Cart from './pages/Cart.jsx'
import Checkout from './pages/CheckOut.jsx'
import CreateTender from './pages/CreateTender.jsx'
import TenderList from './pages/TenderList.jsx'
import UserTenders from "./pages/UserTenders";
import StoreItems from './pages/StoreItems.jsx';

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


      <Route path='viewStore' element={
        <AdminProtected authentication>
            <StoreItems />
        </AdminProtected>
      }/>

      <Route path='tenders' element={
        <AdminProtected authentication>
            <TenderList />
        </AdminProtected>
      }/>

      <Route path='tenders/create' element={
        <AdminProtected authentication>
            <CreateTender />
        </AdminProtected>
      }/>
      
      <Route path='products' element={<AllProducts />}/>
      <Route path="products/:productId" element={<Product />}/>
      <Route path='contact' element={<ContactUs />}/>
      
      <Route path='cart' element={
        <UserProtected authentication>
            <Cart />
        </UserProtected>
      }/>

      <Route path='checkout' element={
        <UserProtected authentication>
            <Checkout />
        </UserProtected>
      }/>

      <Route path="tenders/user" element={<UserTenders />} />

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
