// import fs from 'fs-extra'
// import path from 'path'

const toString = Object.prototype.toString

function classof(any) {
  return toString.call(any).slice(8, -1)
}

function isPlainObject(obj) {
  return classof(obj) === 'Object'
}

function upperInitial(str) {
  return str.replace(/[a-z]/, (s) => s.toUpperCase())
}

function camelify(str) {
  if (!str.match(/\s+/)) return str
  const arr = str.split(/\s+/)
  str = arr.shift() + arr.map(upperInitial).join('')
  return str
}

function relative(rel) {
  return (from, to) => rel(from, to).replace(/[\\\/]+/g, '/')
}

function importModule(id) {
  return import(id).then((m) => m.default || m)
}

const RANDOM_STRING_OPTIONS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9']

function randomBetween(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function createRandomString(len = 8) {
  const max = RANDOM_STRING_OPTIONS.length - 1
  let result = ''
  while (len--) {
    const rn = randomBetween(0, max)
    result += RANDOM_STRING_OPTIONS[rn]
  }
  return result
}

export {
  classof,
  upperInitial,
  camelify,
  relative,
  importModule,
  createRandomString,
  isPlainObject,
}