import React, { Fragment } from 'react';
import {Route} from 'react-router-dom';
import Menu from './components/Menu'
import SideMenu from './components/SideMenu'
import MainPageTemplate from './pages/MainPageTemplate';
import LoginPageTemplate from './pages/LoginPageTemplate';
import JoinPageTemplate from './pages/JoinPageTemplate';
import MusicAddTemplate from './pages/MusicAddTemplate';
import MusicUpdateTemplate from './pages/MusicUpdateTemplate';

class App extends React.Component {
  render() {
    return (
      <Fragment>
        {/* headerMenu */}
        <Route path="/" component={Menu} />

        {/* slideMenu */}
        <Route path="/" component={SideMenu} />

        {/* MainPage */}
        <Route exact path="/" component={MainPageTemplate} />

        {/* userLoginPage */}
        <Route path="/user/login" component={LoginPageTemplate} />

        {/* userJoinPage */}
        <Route path="/user/join" component={JoinPageTemplate} />

        {/* musicAddPage */}
        <Route path="/music/add" component={MusicAddTemplate} />

        {/* musicUpdatePage  */}
        <Route path="/music/update/:id" component={MusicUpdateTemplate} />
      </Fragment>
    );
  }
}




export default App;
