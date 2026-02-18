import { NextFunction, Request, Response } from "express";
import { log } from "../utils/logger";


export function requestLogger(req:Request, res:Response, next:NextFunction){
    const start = Date.now();

    res.on('finish', ()=> {
        const duration = Date.now() - start;

        log('info', 'HTTP request', {
            method: req.method,
            path: req.originalUrl,
            statusCode: req.statusCode,
            durationMs: duration,
        })
    })
    next()
}