import React from "react";
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";

import Layout from "../layouts/Layout";
import MeetingRoom from "../pages/MeetingRoom";
import Home from "../pages/Home";
import Restaurant from "../pages/Restaurant";
import Contact from "../pages/Contact";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import Chamberpage from "../pages/Chamberpage";
import NotFoundPage from "../routes/NotFoundPage";

// admin
import LayoutAdmin from "../layouts/LayoutAdmin";
import ProtectRouteAdmin from "./ProtectRouteAdmin";
import ManageUser from "../components/admin/ManageUser";
import FormEditRoom from "../components/admin/FormEditRoom";
import ManageEditUser from "../components/admin/ManageEditUser";
import FormRoom from "../components/admin/FormRoom";
import FormCustomerType from "../components/front/FormCustomerType";
import FormBookingStatus from "../components/admin/FormBookingStatus";
import FormPaymentMethod from "../components/front/FormPaymentMethod";
import FormCleaningRequestStatus from "../components/admin/FormCleaningRequestStatus";
import FormRoomStatus from "../components/admin/FormRoomStatus";
import FormPaymentStatus from "../components/admin/FormPaymentStatus";
import FormCleaningReportStatus from "../components/admin/FormCleaningReportStatus";
import FormCleaningStatus from "../components/admin/FormCleaningStatus";
import FormRepairRequestStatus from "../components/admin/FormRepairRequestStatus";
import FormRepairStatus from "../components/admin/FormRepairStatus";

// Customer
import LayoutCustomer from "../layouts/LayoutCustomer";
import ProtectRouteCustomer from "../routes/ProtectRouteCustomer";
import MyListBooking from "../components/customer/MyListBooking";
import CustomerProfile from "../components/customer/CustomerProfile";
import FormBooking from "../components/customer/FormBooking";
import PaymentForm from "../components/customer/PaymentForm";

// Front
import LayoutFront from "../layouts/LayoutFront";
import ProtectRouteFront from "../routes/ProtectRouteFront";
import RoomManageEdit from "../components/front/RoomManageEdit";
import ListBookingDetail from "../components/front/ListBookingDetail";
import FormCleaningRequest from "../components/front/FormCleaningRequest";
import FormAddon from "../components/front/FormAddon";
import ListBooking from "../components/front/ListBooking";
import RoomManage from "../components/front/RoomManage";
import FormRoomType from "../components/front/FormRoomType";
import FormCleaningListItem from "../components/front/FormCleaningListItem";
import ListAllCleaningReport from "../components/front/ListAllCleaningReport";
import ListAllCleaningReportDetail from "../components/front/ListAllCleaningReportDetail";
import FormRepairRequest from "../components/front/FormRepairRequest";

// Housekeeping
import LayoutHousekeeping from "../layouts/LayoutHousekeeping";
import ProtectRouteHousekeeping from "./ProtectRouteHousekeeping";
import ListCleaningRequest from "../components/housekeeping/ListCleaningRequest";
import ListCleaningRequestDetail from "../components/housekeeping/ListCleaningRequestDetail";
import ListCleaningReport from "../components/housekeeping/ListCleaningReport";
import FormCleaningReport from "../components/housekeeping/FormCleaningReport";
import ChecklistCleaningReport from "../components/housekeeping/ChecklistCleaningReport";
import ListCleaningReportDetail from "../components/housekeeping/ListCleaningReportDetail";

// Maintenance
import LayoutMaintenance from "../layouts/LayoutMaintenance";
import ProtectRouteMaintenance from "../routes/ProtectRouteMaintenance";
import ListRepairRequest from "../components/maintenance/ListRepairRequest";
import ListRepairRequestDetail from "../components/maintenance/ListRepairRequestDetail";
import FormRepairReport from "../components/maintenance/FormRepairReport";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="chamber" element={<Chamberpage />} />
          <Route path="restaurant" element={<Restaurant />} />
          <Route path="meeting-room" element={<MeetingRoom />} />
          <Route path="book-room" element={<FormBooking />} />
          <Route path="contact" element={<Contact />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
        </Route>

        {/* Admin */}
        <Route path="admin" element={<ProtectRouteAdmin element={<LayoutAdmin />} />}>
          <Route index element={<ManageUser />} />
          <Route path="rooms" element={<FormRoom />} />
          <Route path="rooms/:id" element={<FormEditRoom />} />
          <Route path="users/:id" element={<ManageEditUser />} />
          <Route path="room-status" element={<FormRoomStatus />} />
          <Route path="booking-status" element={<FormBookingStatus />} />
          <Route path="payment-status" element={<FormPaymentStatus />} />
          <Route path="cleaning-request-status" element={<FormCleaningRequestStatus />} />
          <Route path="cleaning-report-status" element={<FormCleaningReportStatus />} />
          <Route path="cleaning-status" element={<FormCleaningStatus />} />
          <Route path="repair-request-status" element={<FormRepairRequestStatus />} />
          <Route path="repair-status" element={<FormRepairStatus />} />
        </Route>

        {/* Customer */}
        <Route path="customer" element={<ProtectRouteCustomer element={<LayoutCustomer />} />}>
          <Route index element={<FormBooking />} />
          <Route path="book-room" element={<FormBooking />} />
          <Route path="my-bookings" element={<MyListBooking />} />
          <Route path="customer-profile" element={<CustomerProfile />} />
          <Route path="payment" element={<PaymentForm />} />
        </Route>

        {/* Front */}
        <Route path="front" element={<ProtectRouteFront element={<LayoutFront />} />}>
          <Route index element={<ListBooking />} />
          <Route path="room-manage" element={<RoomManage />} />
          <Route path="room-manage/:id" element={<RoomManageEdit />} />
          <Route path="booking/:id" element={<ListBookingDetail />} />
          <Route path="cleaning-request" element={<FormCleaningRequest />} />
          <Route path="add-on" element={<FormAddon />} />
          <Route path="customer-type" element={<FormCustomerType />} />
          <Route path="payment-method" element={<FormPaymentMethod />} />
          <Route path="room-type" element={<FormRoomType />} />
          <Route path="cleaning-list-item" element={<FormCleaningListItem />} />
          <Route path="list-cleaning-report" element={<ListAllCleaningReport />} />
          <Route path="list-cleaning-report/:id" element={<ListAllCleaningReportDetail />} />
          <Route path="repair-request" element={<FormRepairRequest />} />
        </Route>

        {/* Housekeeping */}
        <Route path="housekeeping" element={<ProtectRouteHousekeeping element={<LayoutHousekeeping />} />}>
          <Route index element={<ListCleaningRequest />} />
          <Route path="cleaning-request/:id" element={<ListCleaningRequestDetail />} />
          <Route path="cleaning-report" element={<FormCleaningReport />} />
          <Route path="checklist-cleaning-report" element={<ChecklistCleaningReport />} />
          <Route path="list-cleaning-report" element={<ListCleaningReport />} />
          <Route path="list-cleaning-report/:id" element={<ListCleaningReportDetail />} />
        </Route>

        {/* Maintenance */}
        <Route path="maintenance" element={<ProtectRouteMaintenance element={<LayoutMaintenance />} />}>
          <Route index element={<ListRepairRequest />} />
          <Route path="list-repair-request/:id" element={<ListRepairRequestDetail />} />
          <Route path="repair-report" element={<FormRepairReport />} />
        </Route>

        {/* Not found */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;