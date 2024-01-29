
exports.getDate =  function(){

    const options = { weekday :'long' , month : 'long' , day : 'numeric' , year :'numeric'};
    const today = new Date();

    return today.toLocaleDateString("en-IN",options);

}



exports.getDay = function(){

    const options = { weekday :'long'};
    const today = new Date();

    return today.toLocaleDateString("en-IN",options);

     
}

