http = require('http'),
xmpp = require('./lib/xmpp'),
C2SStream = require('./lib/xmpp/c2s').C2SStream;
BOSHServerSession = require('./lib/xmpp/bosh_server').BOSHServerSession;

var BOSH_PORT = 45580;
var start_rid = 3652898548;

var sv = new xmpp.BOSHServer();
 http.createServer(function(req, res) {
      sv.handleHTTP(req, res);
  }).listen(BOSH_PORT);


var svcl = new BOSHServerSession(
  {
    bodyEl : {
      attrs : {
  content: 'text/xml; charset=utf-8',
  hold: 1,
  rid: start_rid,
  to: 'example.com',
  ver: '1.6',
  wait: 10,
  xmlns: 'http://jabber.org/protocol/httpbind',
  'xmlns:stream': 'http://etherx.jabber.org/streams',
  'xmlns:xmpp': 'urn:xmpp:xbosh'
}}});

sv.sessions[svcl.sid] = svcl;
var c2s = new C2SStream({ connection: svcl });
c2s.jid = 'test@example.com';
c2s.authenticated = true;
            
      // incoming stream restart
if (c2s.connection.startParser){
  c2s.connection.startParser();
}

var cl = new xmpp.Client({
  jid: 'test@example.com',
  rid: start_rid+1,
  sid: svcl.sid,
  boshURL: "http://localhost:" + BOSH_PORT
});

cl.on('online', function() {
  console.log('online mama')
});