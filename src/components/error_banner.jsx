import React from "react";
import errorImg from '../assets/errorVector.png';

function DisplayError(){
    return(
        <div className="text-center py-5">
            <img className="img-fluid rounded" src={errorImg} alt="Error" width={270} height={270}/>
            <p className="display-6">...Ocurrio un Error</p>
        </div>
    )
}

export default DisplayError;