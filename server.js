const express = require('express');
const hbs = require('hbs');
const yargs = require('yargs');
const fs = require('fs');

const port = process.env.PORT || 3000;

const argv = yargs
    .options({
        n: {
            demand: true,
            string: true,
            default: 'Stephane NKUINJEU',
            alias: 'name',
            describe: 'Name of user who launches app'
        }
    })
    .help()
    .argv;

let app = express();

hbs.registerPartials(__dirname + '/views/partials');
app.set('view engine', 'hbs');

app.use((request, response, next) => {
    let now = new Date().toString();
    let log = `${now}: ${request.method} ${request.url}`;
    fs.appendFile('server.log', log + '\n', (err) => {
        if (err) {
            console.log(err);
        }
    });
    next();
});

/*app.use((request, response, next) => {
    response.render('maintenance.hbs');
});*/

app.use(express.static(__dirname + '/public'));

hbs.registerHelper('getCurrentYear', () => {
    return new Date().getFullYear();
});

hbs.registerHelper('screamIt', (text) => {
    return text.toUpperCase();
});

app.get('/', (request, response) => {
    response.render('home.hbs', {
        pageTitle: 'About Page',
        welcome: argv.name
    });
});

app.get('/about', (request, response) => {
    response.render('about.hbs', {
        pageTitle: 'About Page'
    });
});

app.get('/bad', (request, response) => {
    response.send({
        errorMessage: 'Unable to load the page'
    });
});

app.listen(port, () => {
    console.log(`Server is up o port ${port}`);
});