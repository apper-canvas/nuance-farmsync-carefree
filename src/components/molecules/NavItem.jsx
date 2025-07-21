import React from "react";
import { NavLink } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import { motion } from "framer-motion";

const NavItem = ({ to, icon, children, className = "" }) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-200 ${
          isActive
            ? "bg-primary-100 text-primary-700 border-r-2 border-primary-600"
            : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
        } ${className}`
      }
    >
      {({ isActive }) => (
        <motion.div
          className="flex items-center w-full"
          whileHover={{ x: 4 }}
          transition={{ duration: 0.2 }}
        >
          <ApperIcon
            name={icon}
            className={`w-5 h-5 mr-3 ${
              isActive ? "text-primary-600" : "text-gray-500"
            }`}
          />
          {children}
        </motion.div>
      )}
    </NavLink>
  );
};

export default NavItem;