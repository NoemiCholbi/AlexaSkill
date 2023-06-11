const Alexa = require('ask-sdk-core');
const moment = require('moment-timezone');
const persistence = require('./persistence');
const interceptors = require('./interceptors');
const Util = require('./util');
const logic = require('./logic');
const constants = require('./constants')

var eleccionTren;


const LaunchRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'LaunchRequest';
    },
    async handle(handlerInput) {
        const{attributesManager, serviceClientFactory, requestEnvelope} = handlerInput;
        const requestAttributes = attributesManager.getRequestAttributes();
        const sessionAttributes = attributesManager.getSessionAttributes();
        
       let speakOutput;
       
          speakOutput =  requestAttributes.t('WELCOME_MESSAGE_2');
            
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

const CambiarNombreIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'CambiarNombreIntent';
    },
    handle(handlerInput) {
        const {attributesManager} = handlerInput;
        const requestAttributes = attributesManager.getRequestAttributes();
        const sessionAttributes = attributesManager.getSessionAttributes();
        const {intent} = handlerInput.requestEnvelope.request
        const nombre = intent.slots.nombre.value;
        
        
        sessionAttributes['nombre'] = nombre;
        
        let speakOutput = requestAttributes.t('NAME_CONFIRMATED_MESSAGGE',nombre);
        speakOutput+= requestAttributes.t('HELP_MESSAGE');
        
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

//Continuar añadiendo los episodios que vaya haciendo aquí, para continuar la historia desde ahí
const ContinuarIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'ContinuarIntent';
    },
    handle(handlerInput) {
        const {attributesManager} = handlerInput;
        const requestAttributes = attributesManager.getRequestAttributes();
        const sessionAttributes = attributesManager.getSessionAttributes();
        let episodio;
        let speakOutput;
        
         if(!sessionAttributes['episodio']){
             return ComenzarAventuraIntentHandler.handle(handlerInput);
         }else{
             episodio=sessionAttributes['episodio'];
             switch(episodio){
                 case 1:
                     return EscenaTrenIntentHandler.handle(handlerInput);
                 case 2:
                    return LlegadaHogwartsIntentHandler.handle(handlerInput);
                 case 3:
                     return SombreroSeleccionadorIntentHandler.handle(handlerInput);
                case 4:
                   return CalizIntentHandler.handle(handlerInput);
                default:
                    speakOutput = requestAttributes.t('ERROR_MSG');
                    break;
                }
         }
         return handlerInput.responseBuilder
                    .speak(speakOutput)
                    .reprompt(speakOutput)
                    .getResponse();
    }
};

const ComenzarAventuraIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'ComenzarAventuraIntent';
    },
    async handle(handlerInput) {
        const {attributesManager, serviceClientFactory} = handlerInput;
        const requestAttributes = attributesManager.getRequestAttributes();
        const sessionAttributes = attributesManager.getSessionAttributes();
        const nombre = sessionAttributes['nombre']
        const deviceId = handlerInput.requestEnvelope.context.System.device.deviceId;
        
        let timezone;
        
        //try{
        //    const upsServiceClient = serviceClientFactory.getUpsServiceClient();
        //    timezone = await upsServiceClient.getSystemTimeZone(deviceId);
        //}catch(error){
        //    return handlerInput.responseBuilder
        //        .speak(requestAttributes.t('NO_TIMEZONE_MSG'))
        //       .getResponse();
        //}
        
        timezone = timezone? timezone: 'Europe/Paris';
        
        // getting the current date with the time
        const currentDateTime = new Date(new Date().toLocaleString("en-US", timezone));

        const dia = currentDateTime.getDate();
        const mesNum = currentDateTime.getMonth();
        let mes= logic.getMesEscrito(mesNum, handlerInput.requestEnvelope.request.locale);
        
        let speakOutput = requestAttributes.t('START_MESSAGE',nombre,dia,mes);
        speakOutput += requestAttributes.t('SOUND_WINGS');
        speakOutput += requestAttributes.t('START_MESSAGE2');
        speakOutput += requestAttributes.t('SOUND_TRAIN_LEFT');
        speakOutput += requestAttributes.t('START_MESSAGE3', nombre);
     
        
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};


const EscenaTrenIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'EscenaTrenIntent';
    },  handle(handlerInput) {
        const {attributesManager} = handlerInput;
        const requestAttributes = attributesManager.getRequestAttributes();
        const sessionAttributes = attributesManager.getSessionAttributes();
        const nombre = sessionAttributes['nombre']
        sessionAttributes['episodio']=1;
        
        let speakOutput = requestAttributes.t('SOUND_TRAIN');
        speakOutput+=requestAttributes.t('TRAIN_MESSAGE');
        speakOutput+=requestAttributes.t('TRAIN_MESSAGE2');
        speakOutput+=requestAttributes.t('SOUND_SPELL_WAR');
        speakOutput+=requestAttributes.t('TRAIN_MESSAGE3');
        speakOutput+=requestAttributes.t('TRAIN_MESSAGE4',nombre);
        
        
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

const ComprarChuchesIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'ComprarChuchesIntent';
    },  handle(handlerInput) {
        const {attributesManager} = handlerInput;
        const requestAttributes = attributesManager.getRequestAttributes();
        const sessionAttributes = attributesManager.getSessionAttributes();
        const nombre = sessionAttributes['nombre'];
        eleccionTren = 3;
        sessionAttributes['eleccionTren'] = eleccionTren;
        
        
        let speakOutput = requestAttributes.t('CANDY_MESSAGE');
        speakOutput+= requestAttributes.t('SOUND_TRAIN_ARRIVE');
        speakOutput+= requestAttributes.t('END_TRAIN_MESSAGE');
        speakOutput+= requestAttributes.t('SOUND_HORSE');
        speakOutput+= requestAttributes.t('END_TRAIN_MESSAGE2',nombre);
        
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

const IntervenirPeleaIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'IntervenirPeleaIntent';
    },  async handle(handlerInput) {
        const {attributesManager} = handlerInput;
        const requestAttributes = attributesManager.getRequestAttributes();
        const sessionAttributes = attributesManager.getSessionAttributes();
        const nombre = sessionAttributes['nombre'];
        eleccionTren = 1;
        sessionAttributes['eleccionTren'] = eleccionTren;
        let hechizo = await logic.fetchHechizo(31)
        .then(function(response) {
            return  response.hechizo;
        }).catch(function(error) {
            return 'espeliermus'
        });
       
        let speakOutput = requestAttributes.t('SOUND_SPELL');
        speakOutput += requestAttributes.t('FIGHT_MESSAGE', nombre, hechizo);
        speakOutput+= requestAttributes.t('SOUND_TRAIN_ARRIVE');
        speakOutput+= requestAttributes.t('END_TRAIN_MESSAGE');
        speakOutput+= requestAttributes.t('SOUND_HORSE');
        speakOutput+= requestAttributes.t('END_TRAIN_MESSAGE2',nombre);
        
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

const PedirAyudaIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'PedirAyudaIntent';
    },  handle(handlerInput) {
        const {attributesManager} = handlerInput;
        const requestAttributes = attributesManager.getRequestAttributes();
        const sessionAttributes = attributesManager.getSessionAttributes();
        const nombre = sessionAttributes['nombre'];
        eleccionTren = 2;
        sessionAttributes['eleccionTren'] = eleccionTren;
       
        let speakOutput = requestAttributes.t('TRAIN_HELP_MESSAGE',nombre);
        speakOutput+= requestAttributes.t('SOUND_TRAIN_ARRIVE');
        speakOutput+= requestAttributes.t('END_TRAIN_MESSAGE');
        speakOutput+= requestAttributes.t('SOUND_HORSE');
        speakOutput+= requestAttributes.t('END_TRAIN_MESSAGE2',nombre);
      
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

const LlegadaHogwartsIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'LlegadaHogwartsIntent';
    },  handle(handlerInput) {
        const {attributesManager} = handlerInput;
        const requestAttributes = attributesManager.getRequestAttributes();
        const sessionAttributes = attributesManager.getSessionAttributes();
        const nombre = sessionAttributes['nombre'];
        sessionAttributes['episodio']=2;
        const intro = Util.getS3PreSignedUrl('Media/intro.mp3').replace(/&/g,'&amp;');

        let speakOutput = requestAttributes.t('SOUND_HORSE2');
        speakOutput += requestAttributes.t('ARRIVE_MESSAGE');
        speakOutput += `<audio src="${intro}"/>`;
        speakOutput += requestAttributes.t('ARRIVE_MESSAGE2');
        speakOutput += requestAttributes.t('ARRIVE_MESSAGE3',nombre);
        speakOutput += requestAttributes.t('SOUND_OPEN_DOOR');
        speakOutput += requestAttributes.t('ARRIVE_MESSAGE4');
        
      
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

const SombreroSeleccionadorIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'SombreroSeleccionadorIntent';
    },  handle(handlerInput) {
        const {attributesManager} = handlerInput;
        const requestAttributes = attributesManager.getRequestAttributes();
        const sessionAttributes = attributesManager.getSessionAttributes();
        //const nombre = sessionAttributes['nombre'];
        const eleccionTren =  sessionAttributes['eleccionTren'];
        sessionAttributes['episodio']=3;
       
       //Si la encuentro, añadir alguna música para el gran salón, quizá algún audio del sombrero seleccionador...
        let speakOutput = requestAttributes.t('CHOOSE_HOUSE_MESSAGE');
         speakOutput += requestAttributes.t('SOUND_COUGH');
         speakOutput += '<break time="0.5s"/>'
         speakOutput += requestAttributes.t('CHOOSE_HOUSE_MESSAGE2');
         switch(eleccionTren){
         case 1:
              speakOutput += requestAttributes.t('CHOOSE_HOUSE_OPT1');
              speakOutput += requestAttributes.t('SOUND_CLAPS');
              speakOutput += requestAttributes.t('END_OF_HOUSE_SELECTION');
              speakOutput += requestAttributes.t('SOUND_MORNING_BIRD');
              speakOutput += requestAttributes.t('SOUND_ROOSTER');
              speakOutput += requestAttributes.t('CLASS_MESSAGE');
               sessionAttributes['casa'] = 'G';
             break;
        case 2:
            speakOutput += requestAttributes.t('CHOOSE_HOUSE_OPT2');
            break;
        case 3:
            speakOutput += requestAttributes.t('CHOOSE_HOUSE_OPT3');
            speakOutput += requestAttributes.t('SOUND_CLAPS');
            speakOutput += requestAttributes.t('END_OF_HOUSE_SELECTION');
            speakOutput += requestAttributes.t('SOUND_MORNING_BIRD');
            speakOutput += requestAttributes.t('SOUND_ROOSTER');
            speakOutput += requestAttributes.t('CLASS_MESSAGE');
            sessionAttributes['casa'] = 'H';
            break;
         }
      
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};


const AdivinanzaIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AdivinanzaIntent';
    },
    handle(handlerInput) {
        const {attributesManager, requestEnvelope} = handlerInput;
        const requestAttributes = attributesManager.getRequestAttributes();
        const sessionAttributes = attributesManager.getSessionAttributes();
        const {intent} = requestEnvelope.request;
        const respuesta = Alexa.getSlotValue(requestEnvelope,'Respuesta');
        const nombre = sessionAttributes['nombre'];
        let validas=['fuego','llama','febrero','nombre','vela', 'fire', 'flame', 'february', 'candle', 'name'];
        let noResp=['idea','sé','se','paso','rindo', 'give','quit'];
        let speakOutput;
       if(validas.includes(respuesta)){
           speakOutput = '<say-as interpret-as="interjection">bingo</say-as>';
           speakOutput += '<break time="0.5s"/>';  //silencio de un segundo, para que no hable muy de seguido
           speakOutput += requestAttributes.t('RIDDLE_CONFIRMATED',nombre, respuesta);
           speakOutput += requestAttributes.t('SOUND_CLAPS');
           speakOutput += requestAttributes.t('END_OF_HOUSE_SELECTION');
            speakOutput += '<break time="0.5s"/>';     
            speakOutput += requestAttributes.t('SOUND_MORNING_BIRD');
            speakOutput += requestAttributes.t('SOUND_ROOSTER');
           speakOutput += requestAttributes.t('CLASS_MESSAGE');
           sessionAttributes['casa'] = 'R';
       }else if(noResp.includes(respuesta)){
            speakOutput = requestAttributes.t('RIDDLE_NOT_RESPOND');
           speakOutput += requestAttributes.t('SOUND_CLAPS');
           speakOutput += requestAttributes.t('END_OF_HOUSE_SELECTION');
            speakOutput += '<break time="0.5s"/>'; 
            speakOutput += requestAttributes.t('SOUND_MORNING_BIRD');
            speakOutput += requestAttributes.t('SOUND_ROOSTER');
           speakOutput += requestAttributes.t('CLASS_MESSAGE');
           sessionAttributes['casa'] = 'S';
       }else{
           speakOutput = requestAttributes.t('RIDDLE_FAILED',nombre);
           speakOutput += requestAttributes.t('SOUND_CLAPS');
           speakOutput += requestAttributes.t('END_OF_HOUSE_SELECTION');
            speakOutput += '<break time="0.5s"/>'; 
            speakOutput += requestAttributes.t('SOUND_MORNING_BIRD');
            speakOutput += requestAttributes.t('SOUND_ROOSTER');
           speakOutput += requestAttributes.t('CLASS_MESSAGE');
           sessionAttributes['casa'] = 'H';
       }
        
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

const PocionesIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'PocionesIntent';
    },  handle(handlerInput) {
        const {attributesManager} = handlerInput;
        const requestAttributes = attributesManager.getRequestAttributes();
        const sessionAttributes = attributesManager.getSessionAttributes();
        const nombre = sessionAttributes['nombre'];
        
        //Meter un clásico sonido de pociones con gorgoteo...
        let speakOutput = requestAttributes.t('POTION_MESSAGE',nombre);
        speakOutput+=requestAttributes.t('SOUND_WIND');
        speakOutput+=requestAttributes.t('TRANSITION_MESSAGE');
        speakOutput+=requestAttributes.t('TRANSITION_MESSAGE2');

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

const ArtesOscurasIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'ArtesOscurasIntent';
    },  handle(handlerInput) {
        const {attributesManager} = handlerInput;
        const requestAttributes = attributesManager.getRequestAttributes();
        const sessionAttributes = attributesManager.getSessionAttributes();
        const nombre = sessionAttributes['nombre'];
        
        let speakOutput = requestAttributes.t('DARK_ARTS_MESSAGE');
        speakOutput+=requestAttributes.t('SOUND_WIND');
        speakOutput+=requestAttributes.t('TRANSITION_MESSAGE');
        speakOutput+=requestAttributes.t('TRANSITION_MESSAGE2');
        
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

const EncantamientosIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'EncantamientosIntent';
    },  async  handle(handlerInput) {
        const {attributesManager, requestEnvelope} = handlerInput;
        const requestAttributes = attributesManager.getRequestAttributes();
        const sessionAttributes = attributesManager.getSessionAttributes();
        let pagina = Alexa.getSlotValue(requestEnvelope, 'Page');
        
        let respuesta = await logic.fetchHechizo(pagina)
        .then(function(response) {
           return response;
       }).catch(function(error) {
            return null;
        });

        
        let speakOutput;
        if(respuesta===null){
            speakOutput=requestAttributes.t('ENCHANTMENT_FAIL_MESSAGE');
        }else{
           speakOutput=requestAttributes.t('ENCHANTMENT_MESSAGE', pagina, respuesta.hechizo, respuesta.uso);
        }
        
        speakOutput+=requestAttributes.t('SOUND_WIND');
        speakOutput+=requestAttributes.t('TRANSITION_MESSAGE');
        speakOutput+=requestAttributes.t('TRANSITION_MESSAGE2');
    
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

const CalizIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'CalizIntent';
    },  handle(handlerInput) {
        const {attributesManager} = handlerInput;
        const requestAttributes = attributesManager.getRequestAttributes();
        const sessionAttributes = attributesManager.getSessionAttributes();
        const nombre = sessionAttributes['nombre'];
        sessionAttributes['episodio']=4;
        const casaInicial = sessionAttributes['casa'];
        let speakOutput;
        let casa;
        
        switch(casaInicial){
        case "G":
            casa = 'Grífindor'
            speakOutput = requestAttributes.t('CALIZ_G_MESSAGE',nombre,casa);
            speakOutput += requestAttributes.t('SOUND_FIRE');
            speakOutput += requestAttributes.t('CALIZ_G_MESSAGE2');
            speakOutput += requestAttributes.t('SOUND_CLAPS');
            speakOutput += requestAttributes.t('CALIZ_G_MESSAGE3');
            break;
       case "S":
            casa = 'Eslícerin'
            speakOutput = requestAttributes.t('CALIZ_S_MESSAGE');
            speakOutput += requestAttributes.t('SOUND_FIRE');
            speakOutput += requestAttributes.t('CALIZ_S_MESSAGE2',nombre);
            speakOutput += requestAttributes.t('SOUND_CLAPS');
            speakOutput += '<say-as interpret-as="interjection">¿cómorr?</say-as>'
            speakOutput += '<break time=\"1s\"/>';
            speakOutput += requestAttributes.t('CALIZ_S_MESSAGE3',casa);
            break;
        case "R":
            casa = 'Reivenclou'
            speakOutput = requestAttributes.t('CALIZ_R_MESSAGE');
            speakOutput += requestAttributes.t('SOUND_FIRE');
            speakOutput += requestAttributes.t('CALIZ_R_MESSAGE2',nombre);
            speakOutput += requestAttributes.t('SOUND_CLAPS');
            speakOutput += requestAttributes.t('CALIZ_R_MESSAGE3');
            break;
        case "H":
            casa = 'Jáfelpaf'
            speakOutput = requestAttributes.t('CALIZ_H_MESSAGE',nombre,casa);
            speakOutput += requestAttributes.t('SOUND_FIRE');
            speakOutput += requestAttributes.t('CALIZ_H_MESSAGE2');
            speakOutput += requestAttributes.t('SOUND_CLAPS');
            speakOutput+= requestAttributes.t('SOUND_CROWD');
            speakOutput += requestAttributes.t('CALIZ_H_MESSAGE3',casa);
           break;
        default:
        speakOutput=requestAttributes.t('SOUND_WIND');
        break;
        }

     
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};



/////////////////////////////////////////////////////////////////////////////////////////////////////////////

const HelpIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.HelpIntent';
    },
    handle(handlerInput) {
        const{attributesManager} = handlerInput;
        const requestAttributes= attributesManager.getRequestAttributes();
        const sessionAttributes = attributesManager.getSessionAttributes();
        let episodio;
        let speakOutput;
        
         if(!sessionAttributes['episodio']){
             speakOutput= requestAttributes.t('HELP_MESSAGE');
         }else{
             episodio=sessionAttributes['episodio'];
             switch(episodio){
                 case 1:
                     speakOutput= requestAttributes.t('HELP_MESSAGE1');
                     break;
                 case 2:
                     speakOutput= requestAttributes.t('HELP_MESSAGE2');
                     break;
                 case 3:
                     speakOutput= requestAttributes.t('HELP_MESSAGE3');
                      break;
                case 4:
                    speakOutput= requestAttributes.t('HELP_MESSAGE4');
                    break;
                default:
                    speakOutput = requestAttributes.t('HELP_MESSAGE');
                    break;
                }
         }
        

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

const CancelAndStopIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && (Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.CancelIntent'
                || Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.StopIntent');
    },
    handle(handlerInput) {
         const{attributesManager} = handlerInput;
        const requestAttributes= attributesManager.getRequestAttributes();
        const speakOutput = requestAttributes.t('GOODBYE_MESSAGE');

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .getResponse();
    }
};
/* *
 * FallbackIntent triggers when a customer says something that doesn’t map to any intents in your skill
 * It must also be defined in the language model (if the locale supports it)
 * This handler can be safely added but will be ingnored in locales that do not support it yet 
 * */
const FallbackIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.FallbackIntent';
    },
    handle(handlerInput) {
        const{attributesManager} = handlerInput;
        const requestAttributes= attributesManager.getRequestAttributes();
        const speakOutput = requestAttributes.t('FALLBACK_MESSAGE');

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};
/* *
 * SessionEndedRequest notifies that a session was ended. This handler will be triggered when a currently open 
 * session is closed for one of the following reasons: 1) The user says "exit" or "quit". 2) The user does not 
 * respond or says something that does not match an intent defined in your voice model. 3) An error occurs 
 * */
const SessionEndedRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'SessionEndedRequest';
    },
    handle(handlerInput) {
        console.log(`~~~~ Session ended: ${JSON.stringify(handlerInput.requestEnvelope)}`);
        // Any cleanup logic goes here.
        return handlerInput.responseBuilder.getResponse(); // notice we send an empty response
    }
};
/* *
 * The intent reflector is used for interaction model testing and debugging.
 * It will simply repeat the intent the user said. You can create custom handlers for your intents 
 * by defining them above, then also adding them to the request handler chain below 
 * */
const IntentReflectorHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest';
    },
    handle(handlerInput) {
        const intentName = Alexa.getIntentName(handlerInput.requestEnvelope);
        const speakOutput = handlerInput.t('REFLECTOR_MSG', {intent: intentName});

        return handlerInput.responseBuilder
            .speak(speakOutput)
            //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
            .getResponse();
    }
};
/**
 * Generic error handling to capture any syntax or routing errors. If you receive an error
 * stating the request handler chain is not found, you have not implemented a handler for
 * the intent being invoked or included it in the skill builder below 
 * */
const ErrorHandler = {
    canHandle() {
        return true;
    },
    handle(handlerInput, error) {
        const{attributesManager} = handlerInput;
        const requestAttributes= attributesManager.getRequestAttributes();
        const speakOutput = requestAttributes.t('ERROR_MESSAGE');
        console.log(`~~~~ Error handled: ${JSON.stringify(error)}`);

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};


/**
 * This handler acts as the entry point for your skill, routing all request and response
 * payloads to the handlers above. Make sure any new handlers or interceptors you've
 * defined are included below. The order matters - they're processed top to bottom 
 * */
exports.handler = Alexa.SkillBuilders.custom()
    .addRequestHandlers(
        LaunchRequestHandler,
        CambiarNombreIntentHandler,
        ContinuarIntentHandler,
        ComenzarAventuraIntentHandler,
        EscenaTrenIntentHandler,
        IntervenirPeleaIntentHandler,
        PedirAyudaIntentHandler,
        ComprarChuchesIntentHandler,
        LlegadaHogwartsIntentHandler,
        SombreroSeleccionadorIntentHandler,
        AdivinanzaIntentHandler,
        PocionesIntentHandler,
        ArtesOscurasIntentHandler,
        EncantamientosIntentHandler,
        CalizIntentHandler,
        HelpIntentHandler,
        CancelAndStopIntentHandler,
        FallbackIntentHandler,
        SessionEndedRequestHandler,
        IntentReflectorHandler)
    .addErrorHandlers(
        ErrorHandler)
    .addRequestInterceptors(
        interceptors.LocalizationInterceptor,
        interceptors.LoggingRequestInterceptor,
        interceptors.LoadAttributesRequestInterceptor)
    .addResponseInterceptors(
        interceptors.LoggingResponseInterceptor,
        interceptors.SaveAttributesResponseInterceptor)
    .withCustomUserAgent('sample/hello-world/v1.2')
    .withPersistenceAdapter(persistence.getPersistenceAdapter())
    .lambda();