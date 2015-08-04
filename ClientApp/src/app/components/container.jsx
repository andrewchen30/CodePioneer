//要顯示的元件或是HTML元素寫在render的return裡面
//==========================================
//react
let React = require('react');

//mui
let mui = require('material-ui');
let Colors = mui.Styles.Colors;
let ThemeManager = new mui.Styles.ThemeManager();

let TextField=mui.TextField;
let MenuItem = mui.MenuItem;
let AppBar = mui.AppBar;
let LeftNav = mui.LeftNav;
let IconButton = mui.IconButton;
let Paper = mui.Paper;
let Avatar = mui.Avatar;
let IconMenu = mui.IconMenu;
let List = mui.List;
let ListItem = mui.ListItem;
let ListDivider=mui.ListDivider;
let CircularProgress=mui.CircularProgress;

//debug
let debug = require('debug')('app:container');

//components
let ArticleList = require('./articleList/ListContainer.jsx');
let UserList = require('./UserList/UserContainer.jsx');
let UserEdit=require('./UserEdit/userEdit.jsx')

//flux - action
let actionsArticle = require('../actions/AppActions_article.jsx');
let actionsUsers = require('../actions/AppActions_User.jsx');

let container = React.createClass({

	childContextTypes: {
		muiTheme: React.PropTypes.object
	},

	getChildContext() {
		return {
			muiTheme: ThemeManager.getCurrentTheme()
		};
	},

	componentWillMount() {
		ThemeManager.setPalette({
			accent1Color: Colors.lime600
		});
	},

	render() {

        debug('[props]', this.props)

		let containerStyle = {
	    	textAlign: 'center',
	    	padding: '0px',
	    	margin: '0px',
            paddingTop:'70px'
	    };

        let icon = () => {
            return <Avatar src="images/panda.png"/>;
        }();

        //left nav components
        let setting = () => { return <div className="appear">Setting</div>; }();
        let logout = () => { return <div className="appear">Logout</div>; }();
        let search = () => { return <TextField hintText="Search" fullWidth={true}/>; }();

        var menuItems = [
            { route: 'user',
              text: icon,
              disabled: true
            },
            { route: 'ArticleList', text: 'News' },
            { route: 'Follow', text: 'Follow' },
            { route: 'Library', text: 'Library' },
            { route: 'Pioneer', text: 'Pioneer Library' },
            { route: 'setting', text: setting },
            { route: 'logout', text: logout },
            { text: '', disabled: true },
            { text: '', disabled: true },
            { text: '', disabled: true },
            { text: '', disabled: true },
            { text: '', disabled: true },
            { text: search } //type: MenuItem.Types.SUBHEADER,
        ];

        let fixed={
            top:0,
            right: 0,
            left: 0,
            width:'100%',
            height:'auto',
            position: 'fixed',

        };
//////////////////////////////////////
        let allTitle={
	    	margin: '0px',
            padding: '0px',
            fontSize:'35px',
            marginLeft:'10px',
            marginBottom:'8px',
            display:'flex',
            flexDirection:'row',
        };
//////////////////////////////////////
                            
        console.log('this.props.setting', this.props.setting)
        //<UserEdit />
//                <ArticleList user={this.props.user}
//                             list={this.props.list}
//                             filter={actionsArticle.filter} />
        
//        <p style={allTitle} className="title">News</p>
//                <p style={allTitle} className="title">Follow</p>
//                <p style={allTitle} className="title">Library</p>
	    return (
    		<div  style={containerStyle}>
                <AppBar title='CodePioneer'
                        style={fixed}
                        onLeftIconButtonTouchTap={this._leftmenu}
                        iconElementRight={
                                        <div className="comments">
                                            <IconMenu iconButtonElement={<IconButton
                                                                            iconClassName="material-icons" >
                                                                            person</IconButton>} >
                                                <List>
                                                    <ListItem
                                                      leftAvatar={<Avatar  className="material-icons">settings</Avatar>}
                                                      onTouchTap={ this._setting }
                                                      primaryText="Setting" />
                                                    <ListDivider inset={true} />
                                                    <ListItem
                                                      leftAvatar={<Avatar  className="material-icons">person_outline</Avatar>}
                                                      primaryText="Logout"/>
                                                    <ListDivider inset={true} />
                                                </List>
                                            </IconMenu>
                                        </div>} />

                <LeftNav docked={false}
                         menuItems={menuItems}
                         onChange={this._navClick}
                         ref='leftNav'/>
            
                <p style={allTitle} className="title">News</p>
                <p className="followTitle">Follow</p>
                <p style={allTitle} className="title">Library</p>
            
                { this.props.setting ? <UserEdit user={this.props.user} /> : null }

                { this.props.list ? <ArticleList user={this.props.user}
                                                 list={this.props.list}
                                                 filter={actionsArticle.filter} /> : <UserList user={this.props.user}
                                                                                               userList={this.props.userList} /> }
            </div>
	    );

	},

    _leftmenu(){
        this.refs.leftNav.toggle();
    },

    _navClick( e, selectedIndex, menuItem){
        //console.log('nav click',e, selectedIndex, menuItem);
        actionsUsers.changeDisplay(menuItem.route);
    },

    _setting(){
        actionsUsers.changeDisplay('Setting');
    }
});

module.exports = container;