import React from "react";
import { Layout } from "antd";
import "./layout.css";

export const ScrollPanel = ({ children }) => {
    return (
        <Layout className="layout-outer">
            <div className="layout-inner">{children}</div>
        </Layout>
    );
};
