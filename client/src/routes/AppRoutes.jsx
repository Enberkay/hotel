import React from "react"
import { createBrowserRouter, RouterProvider } from "react-router-dom"

import Layout from "../layouts/Layout"
import MeetingRoom from "../pages/MeetingRoom"
import Home from "../pages/Home"
import Restaurant from "../pages/Restaurant"
import Contact from "../pages/Contact"
import Login from "../pages/auth/Login"
import Register from "../pages/auth/Register"
import Chamberpage from "../pages/Chamberpage"
import NotFoundPage from "../routes/NotFoundPage"


//admin
import LayoutAdmin from "../layouts/LayoutAdmin"
import ProtectRouteAdmin from "./ProtectRouteAdmin"
import ManageUser from "../components/admin/ManageUser"
import FormEditRoom from "../components/admin/FormEditRoom"
import ManageEditUser from "../components/admin/ManageEditUser"
import FormRoom from "../components/admin/FormRoom"
import FormCustomerType from "../components/front/FormCustomerType"
import FormBookingStatus from "../components/admin/FormBookingStatus"
import FormPaymentMethod from "../components/front/FormPaymentMethod"
import FormCleaningRequestStatus from "../components/admin/FormCleaningRequestStatus"
import FormRoomStatus from "../components/admin/FormRoomStatus"
import FormPaymentStatus from "../components/admin/FormPaymentStatus"
import FormCleaningReportStatus from "../components/admin/FormCleaningReportStatus"
import FormCleaningStatus from "../components/admin/FormCleaningStatus"
import FormRepairRequestStatus from "../components/admin/FormRepairRequestStatus"
import FormRepairStatus from "../components/admin/FormRepairStatus"


//Customer
import LayoutCustomer from "../layouts/LayoutCustomer"
import ProtectRouteCustomer from "../routes/ProtectRouteCustomer"
import MyListBooking from "../components/customer/MyListBooking"
import CustomerProfile from "../components/customer/CustomerProfile"
import FormBooking from "../components/customer/FormBooking"
import PaymentForm from "../components/customer/PaymentForm"


//Front
import LayoutFront from "../layouts/LayoutFront"
import ProtectRouteFront from "../routes/ProtectRouteFront"
import RoomManageEdit from "../components/front/RoomManageEdit"
import ListBookingDetail from "../components/front/ListBookingDetail"
import FormCleaningRequest from "../components/front/FormCleaningRequest"
import FormAddon from "../components/front/FormAddon"
import ListBooking from "../components/front/ListBooking"
import RoomManage from "../components/front/RoomManage"
import FormRoomType from "../components/front/FormRoomType"
import FormCleaningListItem from "../components/front/FormCleaningListItem"
import ListAllCleaningReport from "../components/front/ListAllCleaningReport"
import ListAllCleaningReportDetail from "../components/front/ListAllCleaningReportDetail"
import FormRepairRequest from "../components/front/FormRepairRequest"


//Housekeepping
import LayoutHousekeeping from "../layouts/LayoutHousekeeping"
import ProtectRouteHousekeeping from "./ProtectRouteHousekeeping"
import ListCleaningRequest from "../components/housekeeping/ListCleaningRequest"
import ListCleaningRequestDetail from "../components/housekeeping/ListCleaningRequestDetail"
import ListCleaningReport from "../components/housekeeping/ListCleaningReport"
import FormCleaningReport from "../components/housekeeping/FormCleaningReport"
import ChecklistCleaningReport from "../components/housekeeping/ChecklistCleaningReport"
import ListCleaningReportDetail from "../components/housekeeping/ListCleaningReportDetail"


//Maintenance
import LayoutMaintenance from "../layouts/LayoutMaintenance"
import ProtectRouteMaintenance from "../routes/ProtectRouteMaintenance"
import ListRepairRequest from "../components/maintenance/ListRepairRequest"
import ListRepairRequestDetail from "../components/maintenance/ListRepairRequestDetail"
import FormRepairReport from "../components/maintenance/FormRepairReport"



//Routing
const router = createBrowserRouter([
    {
        path: "/",
        element: <Layout />,
        errorElement: <NotFoundPage />,
        children: [
            { index: true, element: <Home /> },
            { path: "chamber", element: <Chamberpage /> },
            { path: "restaurant", element: <Restaurant /> },
            { path: "meeting-room", element: <MeetingRoom /> },
            { path: "book-room", element: <FormBooking /> },
            { path: "contact", element: <Contact /> },
            { path: "login", element: <Login /> },
            { path: "register", element: <Register /> }
        ]
    },
    {
        path: "/admin",
        element: <ProtectRouteAdmin element={<LayoutAdmin />} />,
        children: [
            { index: true, element: <ManageUser /> },
            { path: "rooms", element: <FormRoom /> },
            { path: "rooms/:id", element: <FormEditRoom /> },
            { path: "users/:id", element: <ManageEditUser /> },
            { path: "room-status", element: <FormRoomStatus /> },
            { path: "booking-status", element: <FormBookingStatus /> },
            { path: "payment-status", element: <FormPaymentStatus /> },
            { path: "cleaning-request-status", element: <FormCleaningRequestStatus /> },
            { path: "cleaning-report-status", element: <FormCleaningReportStatus /> },
            { path: "cleaning-status", element: <FormCleaningStatus /> },
            { path: "repair-request-status", element: <FormRepairRequestStatus /> },
            { path: "repair-status", element: <FormRepairStatus /> }
        ]
    },
    {
        path: "/customer",
        element: <ProtectRouteCustomer element={<LayoutCustomer />} />,

        children: [
            { index: true, element: <FormBooking /> },
            { path: "book-room", element: <FormBooking /> },
            { path: "my-bookings", element: <MyListBooking /> },
            { path: "customer-profile", element: <CustomerProfile /> },
            { path: "payment", element: <PaymentForm /> }

        ]
    },
    {
        path: "/front",
        element: <ProtectRouteFront element={<LayoutFront />} />,
        children: [
            { index: true, element: <ListBooking /> },
            { path: "room-manage", element: <RoomManage /> },
            { path: "room-manage/:id", element: <RoomManageEdit /> },
            { path: "booking/:id", element: <ListBookingDetail /> },
            { path: "cleaning-request", element: <FormCleaningRequest /> },
            { path: "add-on", element: <FormAddon /> },
            { path: "customer-type", element: <FormCustomerType /> },
            { path: "payment-method", element: <FormPaymentMethod /> },
            { path: "room-type", element: <FormRoomType /> },
            { path: "cleaning-list-item", element: <FormCleaningListItem /> },
            { path: "list-cleaning-report", element: <ListAllCleaningReport /> },
            { path: "list-cleaning-report/:id", element: <ListAllCleaningReportDetail /> },
            { path: "repair-request", element: <FormRepairRequest /> }
        ]
    },
    {
        path: "/housekeeping",
        element: <ProtectRouteHousekeeping element={<LayoutHousekeeping />} />,
        children: [
            { index: true, element: <ListCleaningRequest /> },
            { path: "cleaning-request/:id", element: <ListCleaningRequestDetail /> },
            { path: "cleaning-report", element: <FormCleaningReport /> },
            { path: "checklist-cleaning-report", element: <ChecklistCleaningReport /> },
            { path: "list-cleaning-report", element: <ListCleaningReport /> },
            { path: "list-cleaning-report/:id", element: <ListCleaningReportDetail /> }
        ]
    },
    {
        path: "/maintenance",
        element: <ProtectRouteMaintenance element={<LayoutMaintenance />} />,
        children: [
            { index: true, element: <ListRepairRequest /> },
            { path: "list-repair-request/:id", element: <ListRepairRequestDetail /> },
            { path: "repair-report", element: <FormRepairReport /> },

        ]
    }


])

const AppRoutes = () => {
    return (
        <>
            <RouterProvider router={router} />
        </>
    )
}

export default AppRoutes