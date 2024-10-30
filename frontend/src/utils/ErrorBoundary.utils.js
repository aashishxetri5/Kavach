import React, { Component } from "react";
import { Navigate } from "react-router-dom";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { errorType: null };
  }

  static getDerivedStateFromError(error) {
    const errorType = error.message.includes("404")
      ? "notFound"
      : "serverError";
    return { errorType };
  }

  componentDidCatch(error, errorInfo) {
    // logging the error to an error reporting service
    console.error("Error caught in Error Boundary:", error, errorInfo);
  }

  render() {
    const { errorType } = this.state;

    if (errorType === "notFound") {
      return <Navigate to="/404" />;
    } else if (errorType === "serverError") {
      return <Navigate to="/500" />;
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
