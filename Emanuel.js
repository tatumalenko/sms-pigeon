
  const input = "take me to 12190 avenue henri beau from Concordia by metro"; //req.body.Body.str.toLowerCase();

  const from = input.indexOf("from ");
  const to = input.indexOf("to ");
  const by = input.indexOf("by ");

<<<<<<< HEAD
app.post('/sms', (req, res) => {

  const twiml = new MessagingResponse();

  const input = req.body.Body.toLowerCase();

  function from(compFrom){
    
  }
  
  const from = input.indexOf(" from ");
  const to = input.indexOf(" to ");
  const by = input.indexOf(" by ");

  const location = input.substring(from + 6, to);
  const destination = input.substring(to + 4, by);
  const method = input.substring(by + 4, input.length);
=======
  const location = input.substring(from + 5, Math.min((to < from) ? input.length : to, (by < from) ? input.length : by));
  const destination = input.substring(to + 3, Math.min((from < to) ? input.length : from, (by < to) ? input.length : by));
  const method = input.substring(by + 3, Math.min((from < by) ? input.length : from, (to < by) ? input.length : to));
>>>>>>> 04658837274d733b9894b3f1560c9ee02aca1cee

  console.log("location : " + location);
  console.log("destination : " + destination);
  console.log("method : " + method);