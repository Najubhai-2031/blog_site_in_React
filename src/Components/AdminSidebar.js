import React from "react";
import { FaUsers } from "react-icons/fa";
import { MdOutlineContentPaste } from "react-icons/md";
import { Link } from "react-router-dom";

const AdminSidebar = () => {
  return (
    <React.Fragment>
      <div id="mySidenav" class="sidenav">
        <Link to="users">
          <FaUsers /> &nbsp;
          <span>Users</span>
        </Link>
        <Link to="blogs">
          <MdOutlineContentPaste />
          &nbsp; Blogs
        </Link>
        <Link to="Comments">
          <MdOutlineContentPaste />
          &nbsp; Comments
        </Link>
      </div>
    </React.Fragment>
  );
};

export default AdminSidebar;
