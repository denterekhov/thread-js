import tokenHelper from '../../helpers/token.helper.js';
import cryptoHelper from '../../helpers/crypto.helper.js';
import userRepository from '../../data/repositories/user.repository.js';

export const login = async ({ id }) => ({
    token: tokenHelper.createToken({ id }),
    user: await userRepository.getUserById(id)
});

export const register = async ({ password, ...userData }) => {
    const newUser = await userRepository.addUser({
        ...userData,
        password: await cryptoHelper.encrypt(password)
    });
    return login(newUser);
};
