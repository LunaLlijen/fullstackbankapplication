function Login(){
  const [show, setShow]     = React.useState(true);
  const [status, setStatus] = React.useState(''); 
  const [user, setUser]     = React.useState('none'); 
  const [name, setName]     = React.useState('');
  const [cardColor, setCardColor] =React.useState('secondary');
  const ctx = React.useContext(UserContext);
  let i = ctx.user.length - 1;
  const account = ctx.user[i];


  return (<>
    <Card
      bgcolor={cardColor}
      header={user}
      status={status}
      body={show ? 
        <LoginForm  setName={setName} setCardColor={setCardColor} setShow={setShow} setStatus={setStatus} setUser={setUser}/> :
        <LoginMsg  name={name} setShow={setShow} setStatus={setStatus} user={user}/>}
        />
        </>
  ) 
}

function LoginMsg(props){
  return(<>
    <h5>Welcome back, {props.name}!</h5>
    <button type="submit" 
      className="btn btn-light" 
      onClick={() => props.setShow(true)}>
        Not you? Authenticate again
    </button>
  </>);
}

function LoginForm(props){
  const [email, setEmail]       = React.useState('');
  const [password, setPassword] = React.useState('');
  //const privileges = React.useContext(LoginContext); 
  const ctx = React.useContext(UserContext);

  function handle(){
    
    const url = `account/login/${email}/${password}`;
    (async ()=> {
      var res = await fetch(url); // catch the response with url data from the database(user)
      var data = await res.json(); //set that user equal to 'data'
      const user = data;
      console.log(data);
      props.setName(user.name);
      props.setUser(user.email);
      ctx.user.push({
        name    : user.name,
        email   : user.email,
        password: user.password,
        balance : user.balance,
      });
      console.log(ctx);
      props.setShow(false);
      console.log(email, password);
      
      if (!user) {
        console.log('User does not exist! Please create an account first')      
        props.setStatus('Fail!')
        props.setCardColor('secondary');   
        return;      
      }
      if (user.password == password) {
        props.setCardColor('primary');
        console.log('Login successful!') 
        props.setStatus('');
        props.setShow(false);
        return;      
      }
      console.log('Incorrect Password')          
      props.setStatus('User Not Found! Please Try Again');        
    })();
  }
  
  
  return (<>

    Email<br/>
    <input type="input" 
      className="form-control" 
      placeholder="Enter email" 
      value={email} 
      onChange={e => setEmail(e.currentTarget.value)}/><br/>

    Password<br/>
    <input type="password" 
      className="form-control" 
      placeholder="Enter password" 
      value={password} 
      onChange={e => setPassword(e.currentTarget.value)}/><br/>

    <button type="submit" className="btn btn-light" onClick={handle}>Login</button>
   
  </>);
}