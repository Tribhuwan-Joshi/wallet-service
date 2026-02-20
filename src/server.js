import app from "./app"
import config from "./config/baseconfig";
async function startServer(){
app.listen(config.port,()=>console.log(`Server running at PORT ${PORT}`));

}


startServer();


