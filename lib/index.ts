// AWS Amplify 
import { Auth } from 'aws-amplify';
import { getRandomString } from "./utils"

export const checkUserSession = async () => {
  try {
    const user = await Auth.currentAuthenticatedUser()
    return user
  } catch (error) {
    console.log(error);
  }
}

export const signIn = async (username: string) => {
  try {
    const user = await Auth.signIn(username);
    return user
  } catch (error) {
    throw new Error("Please check on username or password")
  }
}

export const signUp = async (username: string) => {
  let userAttributes = null
  let emailRegex = new RegExp(/[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+/)
  if (emailRegex.test(username)) {
    userAttributes = {
      email: username,
      phone_number: ""
    }
  } else {
    userAttributes = {
      email: "",
      phone_number: username
    }
  }

  try {
    const { user } = await Auth.signUp({
      username: username,
      password: getRandomString(30),
      attributes: userAttributes
    });
    return user
  } catch (error) {
    throw new Error("Something wrong occured when we were creating your account")
  }
}

export async function answerCustomChallenge(cognitoUser: string, code: string) {
  try {
    const answerResponse = await Auth.sendCustomChallengeAnswer(cognitoUser, code)
    console.log('authresponse', answerResponse)
    return answerResponse
  } catch (error) {
    console.log('Apparently the user did not enter the right code', error);
  }
}

export const signOut = async () => {
  try {
    await Auth.signOut();
  } catch (error) {
    console.log(error);
  }
}

export const globalSignOut = async () => {
  try {
    await Auth.signOut({ global: true });
  } catch (error) {
    console.log(error);
  }
}


