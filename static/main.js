'use strict'

class Profile {
    constructor({ username, name: { firstName, lastName }, password }) {
        this.username = username;
        this.name = { firstName, lastName };
        this.password = password;
    }

    createUser(callback) {
        return ApiConnector.createUser(
            { username: this.username, name: this.name, password: this.password },
            (err, data) => {
                console.log(`Creating user ${this.username}`);
                callback(err, data);
            }
        );
    }

    performLogin(callback) {
        return ApiConnector.performLogin(
            { username: this.username, name: this.name, password: this.password },
            (err, data) => {
                console.log(`Authorizing user ${this.username}`);
                callback(err, data);
            }
        );
    }

    addMoney({ currency, amount }, callback) {
        return ApiConnector.addMoney({ currency, amount }, (err, data) => {
            console.log(`Adding ${amount} of ${currency} to ${this.username}`);
            callback(err, data);
        });
    }

    convertMoney({ fromCurrency, targetCurrency, targetAmount }, callback) {
        return ApiConnector.convertMoney(
            { fromCurrency, targetCurrency, targetAmount },
            (err, data) => {
                console.log(
                    `Converting ${fromCurrency} to ${targetAmount} ${targetCurrency}`
                );
                callback(err, data);
            }
        );
    }

    transferMoney({ to, amount }, callback) {
        return ApiConnector.transferMoney({ to, amount }, (err, data) => {
            console.log(`Transfering ${amount} to ${to} from ${this.username}`);
            callback(err, data);
        });
    }
}

const getExchangeRate = callback => {
    return ApiConnector.getStocks((err, data) => {
        console.log('The exchange rate is requested from the server');
        callback(err, data);
    });
};

function main() {
    const Ivan = new Profile({
        username: 'ivan',
        name: { firstName: 'Ivan', lastName: 'Chernyshev' },
        password: 'ivanspass',
    });

    const Alex = new Profile({
        username: 'alex',
        name: { firstName: 'Alex', lastName: 'Javascriptov' },
        password: 'qwerty',
    });

    Ivan.createUser((err, data) => {
        if (err) {
            console.error('Error adding new user');
        } else {
            console.log(`${Ivan.username} is created!`);

            Ivan.performLogin((err, data) => {
                if (err) {
                    console.error('User authorization error');
                } else {
                    console.log(`${Ivan.username} is authorized!`);
                    const userMoney = { currency: 'RUB', amount: 100500 };
                    Ivan.addMoney(userMoney, (err, data) => {
                        if (err) {
                            console.error('Error during adding money to Ivan');
                        } else {
                            console.log(
                                `Added ${userMoney.amount} ${userMoney.currency} to ${Ivan.username}`
                            );
                            getExchangeRate((err, data) => {
                                if (err) {
                                    console.error('An error occurred while collecting data.');
                                } else {
                                    let resultOfGetExchangeRate = data[93].RUB_NETCOIN;
                                    const convertingMoney = {
                                        fromCurrency: userMoney.currency,
                                        targetCurrency: 'NETCOIN',
                                        targetAmount: 0,
                                    };
                                    convertingMoney.targetAmount =
                                        resultOfGetExchangeRate * userMoney.amount;

                                    Ivan.convertMoney(convertingMoney, (err, data) => {
                                        if (err) {
                                            console.error('Currency conversion error');
                                        } else {
                                            console.log(
                                                `Converted ${userMoney.amount} ${convertingMoney.fromCurrency} to ${convertingMoney.targetAmount} ${convertingMoney.targetCurrency}`
                                            );

                                            Alex.createUser((err, data) => {
                                                if (err) {
                                                    console.error('Error adding new user');
                                                } else {
                                                    console.log(
                                                        `${Alex.username} is created!`
                                                    );
                                                    const targetUser = {
                                                        to: 'alex',
                                                        amount: convertingMoney.targetAmount,
                                                    };

                                                    Ivan.transferMoney(targetUser, (err, data) => {
                                                        if (err) {
                                                            console.error(
                                                                `Error during transfering money to ${Alex.username}`
                                                            );
                                                        } else {
                                                            console.log(
                                                                `${targetUser.to} has got ${targetUser.amount}`
                                                            );
                                                        }
                                                    });
                                                }
                                            });
                                        }
                                    });
                                }
                            });
                        }
                    });
                }
            });
        }
    });
}
main();