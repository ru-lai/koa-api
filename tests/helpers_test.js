require('babel-register')
require('babel-polyfill')
const bcrypt = require('bcrypt')

import { findTimeInSeconds, convertToHashPromise,  checkHashPassPromise } from '../helpers.js'
import test from 'ava'

test('findTimeInSeconds returns a number', t => {
  let start = new Date()
  let time = findTimeInSeconds(start)

  t.is(typeof time, 'number')
})

test('convertToHash converts a plaintextPass to a bcrypt accurate hash', async t => {
  const saltRounds = 10
  const pass = "cookies"
  let actualHash = await convertToHashPromise(pass, saltRounds)
  bcrypt.compare(pass, actualHash, (err, res) => {
    if (err) {
      t.fail(err)
    }
    if (res === false) {
      t.fail("the convertToHash function doesn't convert a password to accurate hash")
    }
  })
})

test('checkHashPassPromise returns true when the password is real', async t => {
  const saltRounds = 10
  const pass = "cookies"
  var hash = bcrypt.hashSync(pass, saltRounds)
  try {
    var isPasswordSame = await checkHashPassPromise(pass, hash)
  } catch (e) {
    t.fail(e)
  }
  if (isPasswordSame === false) {
    t.fail('the checkHashPassPromise did not return true when the pass was the same')
  }
})

test('checkHashPassPromise returns false when the password is different', async t => {
  const saltRounds = 10
  const pass = "cookies"
  var hash = bcrypt.hashSync(pass, saltRounds)
  try {
    var isPassSame = await checkHashPassPromise('milk', hash)
  } catch (e) {
    t.fail(e)
  }
  if (isPassSame !== false) {
    t.fail('the checkHashPassPromise did not return false when the pass was not the same')
  }
})
