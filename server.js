var express=require('express')
var app =express()
var passport=require('passport')
var GithubStrategy=require('passport-github').Strategy

passport.use(new GithubStrategy({
clientID:'71919c1ada607bf98ca2',
clientSecret:'4ffc4ab86d9699b650bc21d868947def389bf898',
callbackURL:'http://localhost:55555/auth/github/callback'
},
function(accessToken,refreshToken,profile,done){
return done(null,profile)
}))

var session=require('express-session')
app.use(session({secret:'enter custom session secret here'}))
app.use(passport.initialize())
app.use(passport.session())

passport.serializeUser (function(user,done){
done(null,user)
})
passport.deserializeUser (function(user,done){
done(null,user)
})

app.get('/auth/github',passport.authenticate('github'))
app.get('/auth/github/callback',passport.authenticate('github',{failureRedirect: '/' }),
function(req,res){
res.redirect('/')
})

app.get('/',function(req,res){
var html="<ul>\
<li> <a href='/auth/github'>GitHub</a></li>\
<li> <a href='/logout'>logout</a></li>\
</ul>"

if(req.isAuthenticated()){
html += '<p> authenticated as user : </p>'
html += '<pre>' + JSON.stringify(req.user,null,4) + '</pre>';
}
res.send(html)
})

app.get('/logout',function(req,res){
console.log('logging out')
req.logout()
res.redirect('/')
})

function ensureAuthenticated(req,res,next){
if (req.isAuthenticated())
{ return next()}
res.redirect('/')
}

app.get('/protected',ensureAuthenticated,function(req,res){
res.send('acess granted')
})

var server =app.listen(55555,function()
{
console.log('Example app listening at http://%s:%s',server.address().address,server.address().port)
})
