import express from 'express';
const server = express();
const port = 3000;

// configurar o servidor para apresentar arquivos extras
server.use(express.static('public'))
server.use(express.urlencoded({ extended: true }))

// configuração do bd

const Pool = require('pg').Pool;
const db = new Pool({
    user: 'postgres',
    password: 'docker',
    host: '192.168.99.100',
    port: 5432,
    database: 'doe'
})

//configurar template engine
import nunjucks from 'nunjucks';
nunjucks.configure("./", {
    express: server,
    noCache: true,
})

    
server.get('/', (req, res) => {
    db.query('SELECT * FROM donors', (err, result) => {
        if(err) return res.send('erro no banco de dados')
        const donors = result.rows;
        return res.render('index.html', { donors })
    })
});

server.post('/', (req, res) => {
    const { name, email, blood } = req.body;

    if(name == '' || email == '' || blood == ''){
        return res.send('Todos os campos são obrigatórios');
    }

    const query = 'INSERT INTO donors ("name", "email", "blood") VALUES ($1, $2, $3)'
    db.query(query, [name, email, blood], (err) => {
        if(err) return res.send('erro no banco de dados')

        return res.redirect('/');
    })
    
})

server.listen(port, () => {
    console.log(`Server running on port ${port}`);
})


//import path from 'path';
//server.use(express.static(path.resolve(__dirname)))