import React, { Component } from 'react'
import Home from '../pages/Home'
import { Grid, Segment, Icon } from 'semantic-ui-react'

import 'semantic-ui-css/semantic.min.css';
import '../../index.css';


class App extends Component {

  render() {
    return (

    <div className='searchArea'>
      <Grid
        textAlign='center'
        style={{ height: '100%' }}
        verticalAlign='middle'
      >
        <Grid.Column style={{maxWidth: 585}}>
          {/* <img src={logo} alt="Arising Logo" style={{maxWidth:"75%"}} /> */}
            <Segment raised={true} className="signup_model">
              <Home />
            </Segment>
          <div>
            <br />
            <a href="https://github.com/Arisenio/arisen" className="footerLink" target="_blank" rel="noopener noreferrer"><Icon name="github" />GitHub</a>
            {/* &nbsp; | &nbsp; */}
            {/* <a href="https://medium.com/@arisenio/arising-io-create-an-arisen-account-easily-in-under-60-seconds-a6f753fe211c" className="footerLink" target="_blank" rel="noopener noreferrer"><Icon name="medium" />Medium</a>
            &nbsp; | &nbsp;
            <a href="https://www.reddit.com/r/arisen/comments/8zwcti/cant_think_of_an_arisen_account_name_try_my_arisen_name/" className="footerLink" target="_blank" rel="noopener noreferrer"><Icon name="reddit alien" />Reddit</a> */}
          </div>
        </Grid.Column>
      </Grid>
{/* youtube video */}
      {/* <div className='fixedFooter'>Need help? Watch the <a href="https://www.youtube.com/watch?v=dgKB6qwLTfk" target="_blank" rel="noopener noreferrer">2 minute video</a>.</div> */}
    </div>
    );
  }
}

export default App;
