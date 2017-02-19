/*
 * client/transport.js
 *
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 *
 * Created by Alex Tan Hong Pin 19/2/2017
 * Copyright (c) 2017 alextanhongpin. All rights reserved.
**/

import Router from 'koa-router'
import Endpoint from './endpoint.js'

const endpoint = Endpoint()
const route = new Router()

route.get('/', endpoint.home)
route.get('/profile', endpoint.profile)

// The routes that the client will integrate

route.get('/external/authorize', Endpoint.clientAuthorize)
route.get('/external/authorize/callback', Endpoint.clientAuthorizeCallback)
export default route
