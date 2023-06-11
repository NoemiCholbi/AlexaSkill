const axios = require('axios');

module.exports={ 
    getMesEscrito(mesNumerico, locale){
    let mes;
    switch(mesNumerico){
        case 00:
            if(locale==="en"){
            mes='January';}else{
            mes='Enero'}
            break;
        case 01:
             if(locale==="en"){
            mes='February';}else{
            mes='Febrero'}
            break;
        case 02:
             if(locale==="en"){
            mes='March';}else{
            mes='Marzo'}
            break;
        case 03:
             if(locale==="en"){
            mes='April';}else{
            mes='Abril'}
            break;
        case 04:
            if(locale==="en"){
            mes='May';}else{
            mes='Mayo'}
            break;
        case 05:
             if(locale==="en"){
            mes='June';}else{
            mes='Junio'}
            break;
        case 06:
            if(locale==="en"){
            mes='July';}else{
            mes='Julio'}

            break;
        case 07:
           if(locale==="en"){
            mes='August';}else{
            mes='Agosto'}
            break;
        case 08:
            if(locale==="en"){
            mes='September';}else{
            mes='Septiembre'}
            break;
        case 09:
            if(locale==="en"){
            mes='October';}else{
            mes='Octubre'}
            break;
        case 10:
            if(locale==="en"){
            mes='November';}else{
            mes='Noviembre'}
            break;
        case 11:
            if(locale==="en"){
            mes='diciembre';}else{
            mes='December'}
            break;
        default:
        if(locale==="en"){
            mes='No determinado';}else{
            mes='Not found'}
            break;
    }
    return mes;
},
 fetchHechizo(numero_hechizo){
        const url = 'https://fedeperin-harry-potter-api.herokuapp.com/hechizos/'+ numero_hechizo;
       
        var config = {
            timeout: 2000,
        };

        async function getJsonResponse(url, config){
            const res = await axios.get(url, config);
            return res.data;
        }
        
        return getJsonResponse(url, config).then((result) => {
            return result;
        }).catch((error) => {
            return null;
        });
    },
    callDirectiveService(handlerInput, msg) {
        // Call Alexa Directive Service.
        const {requestEnvelope} = handlerInput;
        const directiveServiceClient = handlerInput.serviceClientFactory.getDirectiveServiceClient();
        const requestId = requestEnvelope.request.requestId;
        const {apiEndpoint, apiAccessToken} = requestEnvelope.context.System;
        // build the progressive response directive
        const directive = {
            header: {
                requestId
            },
            directive:{
                type: 'VoicePlayer.Speak',
                speech: msg
            }
        };
        // send directive
        return directiveServiceClient.enqueue(directive, apiEndpoint, apiAccessToken);
    }
}