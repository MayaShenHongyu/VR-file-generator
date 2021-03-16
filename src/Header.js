import React from "react";
import "./layout.css";

export const Header = ({ title, description }) => {
    return (
        <div className="header">
            <h2>{title}</h2>
            {description && <p>{description}</p>}
        </div>
    );
};
