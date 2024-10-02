require('dotenv').config();
const express = require('express');
const cors = require('cors')
const bodyParser = require('body-parser')
const { PORT } = require('./config');
const routes = require('./Route'); 
const { sequelize } = require('./models');
const app = express();
app.use(cors({origin: true, credentials: true}))
app.use(bodyParser.json());


sequelize.sync({ force: false })
    .then(() => {
        console.log("Database connected");
    })
    .catch((error) => {
        console.error("Database Error", error);
    });

app.use("/api/instastar", routes);


app.listen(PORT, () => {
    console.log(`Server is listening on http://localhost:${PORT}`);
});
