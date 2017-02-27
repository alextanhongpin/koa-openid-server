/*
 * common/feature-toggle.js
 *
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 *
 * Created by Alex Tan Hong Pin 27/2/2017
 * Copyright (c) 2017 alextanhongpin. All rights reserved.
**/

export default (app) => {
  return {
    register: ({ service, name, enabled }) => {
      if (enabled) {
        app
        .use(service.routes())
        .use(service.allowedMethods())
      }
      console.log(`the feature ${name} is ${enabled ? 'enable' : 'disabled'}`)
    }
  }
}
