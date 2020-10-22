import React from "react";
import { Layout } from "antd";
import "./layout.css";

// Layout component for the scrollable pages in this app
export const ScrollPanel = ({ children }) => {
    return (
        <Layout className="layout-outer">
            <div className="layout-inner">{children}</div>
        </Layout>
    );
};
