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
import AdminUserList from "../components/user/AdminUserList";
import AdminRoomEditForm from "../components/room/AdminRoomEditForm";
import AdminUserEdit from "../components/user/AdminUserEdit";
import AdminRoomForm from "../components/room/AdminRoomForm";
import CustomerTypeForm from "../components/user/CustomerTypeForm";
// Customer
import LayoutCustomer from "../layouts/LayoutCustomer";
import ProtectRouteCustomer from "../routes/ProtectRouteCustomer";
import CustomerProfile from "../components/user/CustomerProfile";
import BookingForm from "../components/booking/BookingForm";
// Front
import LayoutFront from "../layouts/LayoutFront";
import ProtectRouteFront from "../routes/ProtectRouteFront";
import RoomManageEdit from "../components/room/RoomManageEdit";
import BookingDetail from "../components/booking/BookingDetail";
import CleaningRequestForm from "../components/cleaning/CleaningRequestForm";
import AddonForm from "../components/addon/AddonForm";
import BookingList from "../components/booking/BookingList";
import RoomManage from "../components/room/RoomManage";
import CleaningListItemForm from "../components/cleaning/CleaningListItemForm";
import CleaningReportList from "../components/cleaning/CleaningReportList";
import CleaningReportDetailList from "../components/cleaning/CleaningReportDetailList";
import RepairRequestForm from "../components/repair/RepairRequestForm";
// Housekeeping
import LayoutHousekeeping from "../layouts/LayoutHousekeeping";
import ProtectRouteHousekeeping from "./ProtectRouteHousekeeping";
import CleaningRequestList from "../components/cleaning/CleaningRequestList";
import CleaningRequestDetailList from "../components/cleaning/CleaningRequestDetailList";
import CleaningReportListHousekeeping from "../components/cleaning/CleaningReportListHousekeeping";
import CleaningReportForm from "../components/cleaning/CleaningReportForm";
import CleaningChecklist from "../components/cleaning/CleaningChecklist";
import CleaningReportDetailListHousekeeping from "../components/cleaning/CleaningReportDetailListHousekeeping";
// Maintenance
import LayoutMaintenance from "../layouts/LayoutMaintenance";
import ProtectRouteMaintenance from "../routes/ProtectRouteMaintenance";
import RepairRequestList from "../components/repair/RepairRequestList";
import RepairRequestDetailList from "../components/repair/RepairRequestDetailList";
import RepairReportForm from "../components/repair/RepairReportForm";

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
          <Route path="book-room" element={<BookingForm />} />
          <Route path="contact" element={<Contact />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
        </Route>

        {/* Admin */}
        <Route path="admin" element={<ProtectRouteAdmin element={<LayoutAdmin />} />}>
          <Route index element={<AdminUserList />} />
          <Route path="rooms" element={<AdminRoomForm />} />
          <Route path="rooms/:id" element={<AdminRoomEditForm />} />
          <Route path="users/:id" element={<AdminUserEdit />} />
        </Route>

        {/* Customer */}
        <Route path="customer" element={<ProtectRouteCustomer element={<LayoutCustomer />} />}>
          <Route path="customer-profile" element={<CustomerProfile />} />
        </Route>

        {/* Front */}
        <Route path="front" element={<ProtectRouteFront element={<LayoutFront />} />}>
          <Route index element={<BookingList />} />
          <Route path="room-manage" element={<RoomManage />} />
          <Route path="room-manage/:id" element={<RoomManageEdit />} />
          <Route path="booking/:id" element={<BookingDetail />} />
          <Route path="cleaning-request" element={<CleaningRequestForm />} />
          <Route path="add-on" element={<AddonForm />} />
          <Route path="customer-type" element={<CustomerTypeForm />} />
          <Route path="cleaning-list-item" element={<CleaningListItemForm />} />
          <Route path="list-cleaning-report" element={<CleaningReportList />} />
          <Route path="list-cleaning-report/:id" element={<CleaningReportDetailList />} />
          <Route path="repair-request" element={<RepairRequestForm />} />
        </Route>

        {/* Housekeeping */}
        <Route path="housekeeping" element={<ProtectRouteHousekeeping element={<LayoutHousekeeping />} />}>
          <Route index element={<CleaningRequestList />} />
          <Route path="cleaning-request/:id" element={<CleaningRequestDetailList />} />
          <Route path="cleaning-report" element={<CleaningReportForm />} />
          <Route path="checklist-cleaning-report" element={<CleaningChecklist />} />
          <Route path="list-cleaning-report" element={<CleaningReportListHousekeeping />} />
          <Route path="list-cleaning-report/:id" element={<CleaningReportDetailListHousekeeping />} />
        </Route>

        {/* Maintenance */}
        <Route path="maintenance" element={<ProtectRouteMaintenance element={<LayoutMaintenance />} />}>
          <Route index element={<RepairRequestList />} />
          <Route path="list-repair-request/:id" element={<RepairRequestDetailList />} />
          <Route path="repair-report" element={<RepairReportForm />} />
        </Route>

        {/* Not found */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;