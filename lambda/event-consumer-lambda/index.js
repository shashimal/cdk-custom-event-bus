exports.handler =  (event) => {
    console.log(event);
    const detail = event.detail;

    console.log("Event Details");
    console.log(detail);

    return detail;
};