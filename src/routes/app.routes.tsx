import { Route, Routes } from 'react-router-dom'

import { Home } from '../pages/Home'
import { EditDish } from '../pages/EditDish'
import { DishDetails } from '../pages/DishDetails'
import { Favorites } from '../pages/Favorites'
import { OrderRecords } from '../pages/OrderRecords'
import { NewDish } from '../pages/NewDish'
import { OrderConfirmation } from '../pages/OrderConfirmation'
import { MenuOptions } from '../pages/MenuOptions'
import { PaymentPage } from '../pages/PaymentPage'
import { OrderRecord } from '../pages/OrderRecord'

export function AppRoutes() {
    return (
        <Routes>
            <Route path="/" element={<Home/>}  />
            <Route path="/menuoptions" element={<MenuOptions/>}  />
            <Route path="/editdish/:id" element={<EditDish/>}  />
            <Route path="/dishdetails/:id" element={<DishDetails/>}  />
            <Route path="/favorites" element={<Favorites/>}  />
            <Route path="/orderrecords" element={<OrderRecords/>}  />   
            <Route path="/orderrecord/:id" element={<OrderRecord/>}  />          
            <Route path="/newdish" element={<NewDish/>}  />
            <Route path="/orderconfirmation" element={<OrderConfirmation/>}  />
            <Route path="/paymentpage/:id" element={<PaymentPage/>}  />


        </Routes>
    )
}