import React, { createRef, useState, useEffect } from 'react';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getUserImgLink } from 'src/helpers/imageHelper';
import {
    Grid,
    Image,
    Input,
    Icon
} from 'semantic-ui-react';
import { setUserStatus } from './actions';


const Profile = ({ user, ...props }) => {
    const [isUserStatusEditing, setIsUserStatusEditing] = useState(false);
    const [statusValue, setStatusValue] = useState(user.status || '');
    const statusRef = createRef();

    const sendUserStatus = () => {
        props.setUserStatus({ status: statusValue, id: user.id });
        setIsUserStatusEditing(false);
    };

    useEffect(() => {
        if (isUserStatusEditing) {
            statusRef.current.focus();
        }
    }, [isUserStatusEditing]);

    return (
        <Grid container textAlign="center" style={{ paddingTop: 30 }}>
            <Grid.Column>
                <Image centered src={getUserImgLink(user.image)} size="medium" circular />
                <br />
                <Input
                    icon="user"
                    iconPosition="left"
                    placeholder="Username"
                    type="text"
                    disabled
                    value={user.username}
                />
                <br />
                <br />
                <Input
                    icon="at"
                    iconPosition="left"
                    placeholder="Email"
                    type="email"
                    disabled
                    value={user.email}
                />
                <br />
                <br />
                <Input
                    ref={statusRef}
                    placeholder="Set your status here"
                    type="text"
                    disabled={!isUserStatusEditing}
                    value={statusValue}
                    onChange={e => setStatusValue(e.target.value)}
                />
                <Icon link name="edit outline" onClick={!isUserStatusEditing ? () => setIsUserStatusEditing(true) : sendUserStatus} />
            </Grid.Column>
        </Grid>
    );
};

Profile.propTypes = {
    user: PropTypes.objectOf(PropTypes.any),
    setUserStatus: PropTypes.func.isRequired
};

Profile.defaultProps = {
    user: {}
};

const mapStateToProps = rootState => ({
    user: rootState.profile.user
});

const actions = {
    setUserStatus
};

const mapDispatchToProps = dispatch => bindActionCreators(actions, dispatch);

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Profile);
