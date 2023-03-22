import  express from 'express';
import  Connection from  './database/db.js';
import  router from './routes/route.js';
import  dotenv from 'dotenv';
import cors from 'cors';
import bodyParser from 'body-parser';


const app = express()
const PORT = process.env.PORT  || 8000;

dotenv.config();

// app.get('/', function (req, res) {
//   res.send('Hello World')
// })


app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));
app.use(express.json());




app.use(cors());

// app.use(bodyParser.json({ extended:true }))

// app.use(bodyParser.urlencoded({ extended:true}))

app.use('/',router);

app.listen(PORT, ()=> console.log(`Server is Ruuning on PORT ${PORT}`));

const username = process.env.DB_USERNAME;
const password = process.env.BD_PASSWORD;



Connection(username,password);