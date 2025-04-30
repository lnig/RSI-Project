package org.example.flightreservationsystem.handler;

import org.springframework.ws.WebServiceMessage;
import org.springframework.ws.context.MessageContext;
import java.io.ByteArrayOutputStream;

public class LoggingHandler extends AbstractSoapHandler {

    @Override
    public boolean handleRequest(MessageContext messageContext, Object endpoint) throws Exception {
        if (logger.isDebugEnabled()) {
            logMessage("Incoming SOAP Request", messageContext.getRequest());
        }
        return true;
    }

    @Override
    public boolean handleResponse(MessageContext messageContext, Object endpoint) throws Exception {
        if (logger.isDebugEnabled()) {
            logMessage("Outgoing SOAP Response", messageContext.getResponse());
        }
        return true;
    }

    private void logMessage(String description, WebServiceMessage message) {
        try {
            ByteArrayOutputStream out = new ByteArrayOutputStream();
            message.writeTo(out);
            String messageContent = out.toString("UTF-8");

            logger.debug("{}: {}", description, messageContent);
        } catch (Exception e) {
            logger.warn("Could not log SOAP message", e);
        }
    }
}