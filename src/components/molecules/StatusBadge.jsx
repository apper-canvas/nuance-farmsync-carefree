import React from "react";
import Badge from "@/components/atoms/Badge";

const StatusBadge = ({ status, type = "crop" }) => {
  const getVariant = () => {
    if (type === "crop") {
      switch (status?.toLowerCase()) {
        case "planted":
          return "info";
        case "growing":
        case "flowering":
          return "warning";
        case "ready":
        case "harvested":
          return "success";
        default:
          return "default";
      }
    }
    
    if (type === "priority") {
      switch (status?.toLowerCase()) {
        case "high":
          return "error";
        case "medium":
          return "warning";
        case "low":
          return "success";
        default:
          return "default";
      }
    }
    
    if (type === "task") {
      return status ? "success" : "warning";
    }
    
    return "default";
  };

  return (
    <Badge variant={getVariant()}>
      {status}
    </Badge>
  );
};

export default StatusBadge;