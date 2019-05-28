const express = require('express');
var proxy = require('express-http-proxy');
const app = express();
const path = require('path');
const router = express.Router();

router.get('/',function(req,res){
    res.sendFile(path.join(__dirname+'./../dist/index.html'));
    //__dirname : It will resolve to your project folder.
});

router.get('/applicant-confirm',function(req,res){
    res.sendFile(path.join(__dirname+'./../dist/visitors.html'));
});

const serverUrl = 'http://10.10.1.35:3010/T4000_EntitlementREST/';
app.use('/T4000_EntitlementREST/', proxy('http://10.10.1.35', {
    port: 3010,
    proxyReqPathResolver: function (req) {
        const res = '/T4000_EntitlementREST' + req.url;
        console.log(res);
        return res;
    }
}));
app.use('/', router);
app.use(express.static('dist'));

app.listen(process.env.port || 3000);

console.log('Running at Port 3000');