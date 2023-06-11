const Alexa = require('ask-sdk-core');

const i18n = require('i18next');
const sprintf = require('i18next-sprintf-postprocessor');
const languageStrings = require('./localisation')     

module.exports={
// This request interceptor will log all incoming requests to this lambda
 LoggingRequestInterceptor : {
    process(handlerInput) {
        console.log(`Incoming request: ${JSON.stringify(handlerInput.requestEnvelope.request)}`);
    }
},

// This response interceptor will log all outgoing responses of this lambda
 LoggingResponseInterceptor : {
    process(handlerInput, response) {
      console.log(`Outgoing response: ${JSON.stringify(response)}`);
    }
},

//Interceptor request para sacar el locales
 LocalizationInterceptor : {
  process(handlerInput) {
    const localizationClient = i18n.use(sprintf).init({
      //detectar locale
      lng: handlerInput.requestEnvelope.request.locale,
      //lenguaje al que volver si hay cualquier problema
      fallbackLng: 'es',
      //esto hace el remplace de los % por las variables que se le pasen al string
      overloadTranslationOptionHandler: sprintf.overloadTranslationOptionHandler,
      //dónde están los string
      resources: languageStrings,
      returnObjects: true
    });
    const attributes = handlerInput.attributesManager.getRequestAttributes();
    attributes.t = function (...args) {
      return localizationClient.t(...args);
    }
}},


/* Al inicio de la skill cargaremos los datos peristentes en atributos de sesión 
*/
 LoadAttributesRequestInterceptor : {
    async process(handlerInput) {
        const {attributesManager, requestEnvelope} = handlerInput;
        // Solo en caso de que se trate de una nueva sesión accederemos a la BD
        if (Alexa.isNewSession(requestEnvelope)){
            const persistentAttributes = await attributesManager.getPersistentAttributes() || {};
            console.log('Loading from persistent storage: ' + JSON.stringify(persistentAttributes));
            //copy persistent attribute to session attributes
            attributesManager.setSessionAttributes(persistentAttributes);
        }
    }
},

// Al cerrar, guardaremos en la bd los atributos de sesión en la BD, para que sean persistentes
 SaveAttributesResponseInterceptor : {
    async process(handlerInput, response) {
        if (!response) return; // avoid intercepting calls that have no outgoing response due to errors
        const {attributesManager, requestEnvelope} = handlerInput;
        const sessionAttributes = attributesManager.getSessionAttributes();
        const shouldEndSession = (typeof response.shouldEndSession === "undefined" ? true : response.shouldEndSession); //is this a session end?
        if (shouldEndSession || Alexa.getRequestType(requestEnvelope) === 'SessionEndedRequest') { // skill was stopped or timed out
            // we increment a persistent session counter here
            sessionAttributes['sessionCounter'] = sessionAttributes['sessionCounter'] ? sessionAttributes['sessionCounter'] + 1 : 1;
            // we make ALL session attributes persistent
            console.log('Saving to persistent storage:' + JSON.stringify(sessionAttributes));
            attributesManager.setPersistentAttributes(sessionAttributes);
            await attributesManager.savePersistentAttributes();
        }
    }
}
    
}