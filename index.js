const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended : true }));
app.use('/',express.static(__dirname));
app.use('/author',express.static(__dirname+'/author'));
app.use('/reader',express.static(__dirname+'/reader'));

const con = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: '',
    database: 'college'
});

con.connect(function(err){
    if(err) throw err;
    console.log('Connected');
})

// const sql = 'CREATE DATABASE COLLEGE'
// const sql = `CREATE TABLE books (id int(5), title varchar(30), author_id int(5), published_year int(5), quantity int(5), genre varchar(50), review varchar(50), rating INT(5), reader_id INT(5),PRIMARY KEY(id), FOREIGN KEY(author_id) REFERENCES authors(author_id))
//   `;
// const sql = `CREATE TABLE authors (author_id int(5), author_name varchar(30), author_bio varchar(30), PRIMARY KEY (author_id))`
// const sql = `drop table books`
// con.query(sql,(err, result)=> {
//     if(err) console.log(err);
//     else console.log(result);
// })

app.post('/login', (req,res)=> {
    console.log(req.body);
    const { username, password, type } = req.body;
    if(username === 'amogh' && password === 'dodawad'){
        res.redirect('/'+type);
    } else {
        res.redirect('/');
    }
    // res.end('Ok')
})

app.post('/insert',(req,res)=>{
    const { title, author_id, published_year, quantity, genre, review, rating, reader_id, id } = req.body;
    const sql = `SELECT * from authors where author_id=${author_id}`;
    console.log(req.body);
    con.query(sql,(err,result)=>{
        if(err) console.log(err);
        else console.log(result);
        if(result.length === 0){
            console.log('Here');
            const tempQuery = `INSERT INTO authors(author_id) VALUES(${author_id})`;
            con.query(tempQuery,(err, result)=>{
                if(err) throw err;
                console.log(result);
                const stat = `INSERT INTO books (id, title, author_id, published_year, quantity, genre, review, rating, reader_id)
                VALUES (${id},'${title}', ${author_id}, ${published_year}, ${quantity}, '${genre}', '${review}', ${rating}, ${reader_id});
                `
                con.query(stat,(err,result)=>{
                    if(err) throw err;
                    console.log(result);
                    const newStat = `SELECT * from books where reader_id=${reader_id}`;
                    con.query(newStat,(err,result)=>{
                        console.log(result);
                        let resp = '<body>'
                        resp += '<h1>Details for the reader ' + reader_id + ' are</h1>'
                        result.forEach(element => {
                            resp += '<div>'
                            resp += element.title + ' ' + element.review
                            resp += '</div>'
                        });
                        resp += '</body>';
                        res.end(resp)
                    })
                })
            })
        } else {
            console.log("Not here");
            const stat = `INSERT INTO books (id, title, author_id, published_year, quantity, genre, review, rating, reader_id)
                VALUES (${id},'${title}', ${author_id}, ${published_year}, ${quantity}, '${genre}', '${review}', ${rating}, ${reader_id});
                `
            console.log(stat);
                con.query(stat,(err,result)=>{
                    if(err) throw err;
                    console.log(result);
                    const newStat = `SELECT * from books where reader_id=${reader_id}`;
                    con.query(newStat,(err,result)=>{
                        console.log(result);
                        let resp = '<body>'
                        resp += '<h1>Details for the reader' + reader_id + ' are</h1>'
                        result.forEach(element => {
                            resp += '<div>'
                            resp += element.title + ' ' + element.review
                            resp += '</div>'
                        });
                        resp += '</body>';
                        res.end(resp)
                    })
                })
        }
        // res.end('Done')
    })
    // res.end('Done')
})

app.post('/fetchAuthor',(req,res)=>{
    const { author_id } = req.body;
    console.log(author_id);
    const sql = `SELECT
    books.title AS book_title,
    books.published_year,
    books.quantity,
    books.genre,
    books.review,
    books.rating,
    authors.author_id,
    authors.author_name,
    authors.author_bio
FROM
    books
JOIN
    authors ON books.author_id = authors.author_id
WHERE
    authors.author_id = ${author_id};
`
    con.query(sql,(err,result) => {
        console.log(result);
        // res.json(result);
        const ans = `<body>
            <h1>The books and ratings for the author ${author_id} are</h1>
            <div>Book | Review</div>
        ${result.map((val => '<div>' + val.book_title + ' | ' + val.review +  '</div>'))}</body>`;
        res.end(ans)
        
        // console.log(ans);
    })
    // res.end('Ok');
})

app.get('/welcome',(req,res)=>{
    res.end('You have been successfully logged in');
})

app.listen(8080,()=>{
    console.log('Listening on 8080');
})