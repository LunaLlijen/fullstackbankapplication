function Home(){
  const ctx = React.useContext(UserContext);
  let i = ctx.user.length - 1;
  const account = ctx.user[i];
  // if(ctx.user[i]) {
    console.log(ctx.user)
  // }
  const header  = `current user: ${account.email}`
  return (
    <Card
      txtcolor="light"
      bgcolor="secondary"
      header="Final Capstone Project"
      title="Welcome to the Good Bank!"
      text="For all your banking needs. It's all about you. Always!"
      body={(<img src="bank.png" className="img-fluid" alt="Responsive image"/>)}
    />
  );  
}
