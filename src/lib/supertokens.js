import SuperTokens from 'supertokens-web-js'
import Session from 'supertokens-web-js/recipe/session'
import EmailPassword from 'supertokens-web-js/recipe/emailpassword'

export default SuperTokens.init({
    appInfo: {
        apiDomain: 'http://localhost:3000',
        apiBasePath: '/api/v1/auth',
        appName: 'Planta'
    },
    recipeList: [
        Session.init(),
        EmailPassword.init()
    ]
})