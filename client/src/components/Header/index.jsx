import React, { createRef, useState, useEffect } from 'react';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { getUserImgLink } from 'src/helpers/imageHelper';
import { Header as HeaderUI, Image, Grid, Icon, Button, Input } from 'semantic-ui-react';
import { setUserStatus } from '../../containers/Profile/actions';

import styles from './styles.module.scss';

const Header = ({ user, logout, ...props }) => {
    const [isUserStatusEditing, setIsUserStatusEditing] = useState(false);
    const [statusValue, setStatusValue] = useState(user.status);
    const statusRef = createRef();

    const sendUserStatus = () => {
        // const status = statusRef.current.value;
        // console.log('status: ', status);
        props.setUserStatus({ status: statusValue, id: user.id });
        setIsUserStatusEditing(false);
    };

    useEffect(() => {
        if (isUserStatusEditing) {
            statusRef.current.focus();
        }
    }, [isUserStatusEditing, statusValue]);
    return (
        <div className={styles.headerWrp}>
            <Grid centered container columns="2">
                <Grid.Column>
                    {user && (
                        <>
                            <NavLink exact to="/profile">
                                <HeaderUI>
                                    <Image circular src={getUserImgLink(user.image)} />
                                    {' '}
                                    {user.username}
                                </HeaderUI>
                            </NavLink>
                            <Input
                                ref={statusRef}
                                placeholder="Set your status here"
                                type="text"
                                disabled={!isUserStatusEditing}
                                value={statusValue || ''}
                                onChange={e => setStatusValue(e.target.value)}
                            />
                            <Icon link name="edit outline" onClick={!isUserStatusEditing ? () => setIsUserStatusEditing(true) : sendUserStatus} />
                        </>
                    )}
                </Grid.Column>
                <Grid.Column textAlign="right">
                    <NavLink exact activeClassName="active" to="/">
                        <Icon name="home" size="large" />
                    </NavLink>
                    <Button basic icon type="button" className={styles.logoutBtn} onClick={logout}>
                        <Icon name="log out" size="large" />
                    </Button>
                </Grid.Column>
            </Grid>
        </div>
    );
};

Header.propTypes = {
    logout: PropTypes.func.isRequired,
    setUserStatus: PropTypes.func.isRequired,
    user: PropTypes.objectOf(PropTypes.any).isRequired
};


const actions = {
    setUserStatus
};

const mapDispatchToProps = dispatch => bindActionCreators(actions, dispatch);

export default connect(
    null,
    mapDispatchToProps
)(Header);

// export default Header;
