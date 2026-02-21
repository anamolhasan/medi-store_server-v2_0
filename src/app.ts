import express, { Request, Response } from 'express'
import cors from 'cors'
import config from './config'
import { toNodeHandler } from "better-auth/node";
import { auth } from './lib/auth';
import { medicineRoutes } from './modules/medicine/medicine.route';
import globalErrorHandler from './middleware/globalErrorHandler';
import { categoryRoutes } from './modules/category/category.route';
import { userRoutes } from './modules/user/user.route';
import { orderRoutes } from './modules/order/order.routes';
import { reviewRoutes } from './modules/review/review.route';
import { requestLogger } from './middleware/requestLogger';

const app = express()

// middleware
app.use(cors({

     origin: [
        "http://localhost:5000", 
        "http://localhost:3000", 
        config.better_auth.app_url!
    ],
    credentials:true,
}))
app.use(express.json())
app.use(express.urlencoded({extended:true}))

// Logger
app.use(requestLogger)


// Routes
app.all("/api/auth/*split", toNodeHandler(auth));  // batter auth route

app.use('/api/v1/category', categoryRoutes)
app.use('/api/v1/medicine', medicineRoutes)
app.use('/api/v1/users', userRoutes)
app.use('/api/v1/order', orderRoutes)
app.use('/api/v1/review', reviewRoutes)


// ROOT DIRECTORY
app.get('/', (req, res) => {
    res.send("<h1>Medi Store server...</h1>")
})


// API Route not found
app.use((req:Request, res:Response) => {
    res.status(404).json({
        path:req.url,
        success:false,
        message:'Not Found!'
    })
})

// Error Handler
app.use(globalErrorHandler)


export default app