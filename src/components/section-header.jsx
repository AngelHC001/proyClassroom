import React from "react";

function SectionHeader({title, iconClass}){
    return(
        <div className="row border-bottom p-2">
            <h2 className="display-6">
                <i className={`bi bi-${iconClass}`}></i> {title}
            </h2>
        </div>
    )
}

export default SectionHeader;