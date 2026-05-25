import React from "react";

function SectionHeader({title, iconClass, children}){
    return(
        <div className="row border-bottom p-2">
            <h2 className="col display-6">
                <i className={`bi bi-${iconClass}`}></i> {title}
            </h2>
            
            <div className="col text-end">
                 {children}
            </div>
        </div>
    )
}

export default SectionHeader;