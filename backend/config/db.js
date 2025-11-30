import mongoose  from "mongoose"
import colors from 'colors'

 const connectDatabase = async()=>{
    try {
        const connection_db= await mongoose.connect(`${process.env.MONGO_DB_URL_CONNECTION_STRING}`);
        if(connection_db){
            console.log("Database Connected Successfully".bgGreen);
        }else{
            console.log("Database Failed to Connect".bgYellow);
        }
        
    } catch (error) {
        console.log("Database Failed to Connect! Internal Server Error".bgRed, error);
        process.exit(1);
    }
}

export default connectDatabase;