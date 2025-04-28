package org.example.flightreservationsystem.handler;

import org.springframework.ws.context.MessageContext;
import org.springframework.ws.server.EndpointInterceptor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public abstract class AbstractSoapHandler implements EndpointInterceptor {
    protected final Logger logger = LoggerFactory.getLogger(getClass());

    @Override
    public boolean handleRequest(MessageContext messageContext, Object endpoint) throws Exception {
        return true;
    }

    @Override
    public boolean handleResponse(MessageContext messageContext, Object endpoint) throws Exception {
        return true;
    }

    @Override
    public boolean handleFault(MessageContext messageContext, Object endpoint) throws Exception {
        return true;
    }

    @Override
    public void afterCompletion(MessageContext messageContext, Object endpoint, Exception ex) throws Exception {
    }
}