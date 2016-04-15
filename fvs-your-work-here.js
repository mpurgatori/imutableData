'use strict';

/**
* You'll need be installing fvs as a global executable on your machine!
* The steps are below - but go ahead and take some time to try figuring it out on your own!
*
*
* 1. Add the following to your package.json: "bin" : { "fvs" : "./fvs.js" }
* 2. At the top of fvs.js, add #!/usr/bin/env node (this is done for you)
* 3. From your project's root: npm install -g ./
*
**/

/**
* You'll be primarily using fs methods to complete your version control system!
* Please use the synchronous versions of each method - while this is usually
* bad news in the real world, I don't want you to get caught up in callbacks.
* Instead, you can focus on learning the intricacies of Git!
*
* Some useful methods...
*   fs.readFileSync
*   fs.writeFileSync
*   fs.readdirSync
*   fs.rmdirSync
*   fs.mkdirSync
*
* https://nodejs.org/api/fs.html
*
* I've also written you a getSha1 function (since you've already written one yourselves)!
*
**/
const fs = require('fs');
const getSha1 = require('./util').getSha1;

/**
  let's write some helper functions!
**/
function createFVSObject (fileContents) {
  // a. Hash the contents of the file
  // b. Use the first two characters of the hash as the directory in .fvs/objects
  // c. Check if the directory already exists! Do you know how to check if a directory exists in node?
  //      Hint: you'll need to use a try/catch block
  //      Another hint: look up fs.statSync
  // d. Write a file whose name is the rest of the hash, and whose contents is the contents of the file
  // e. Return the hash!
}

function createBlobObject (fileName) {
  // this will use our createFVSObject function above!
}

function updateIndex (index, fileName, blobRef) {
  // a. create the index if none exists
  // b. check if the file already has an index entry, and remove it if it does!
  // c. add the new line to the index
}

module.exports.init = function () {
  // step 1. if a .fvs file already exists, we should short circuit

  // step 2. do you remember the files/directories we need to make?
  /*
    .fvs/
      objects/
      refs/master
      HEAD
  */
}

module.exports.add = function () {

  // step 0a. make sure a filename is passed in as an argument

  // step 0b. create the index if none exists

  // step 1: create a 'blob' object in .fvs/objects
  /*
    Hey, remember those functions we wrote earlier...?
  */

  // step 2: add the file to the index
  /*
    You should make sure that the filename includes the path relative to the root directory.
    For example: if your root directory has a directory 'data', which contains 'something.txt'
    your index entry for this file should read data/something.txt 2ba0f3bff73bd3f3ds212ba0f3bff73bd3f3ds21.
  */

  // return the value of the added blob's hash!
}

module.exports.commit = function () {

  // step 0a. make sure we have a lovely commit message!

  // step 1. create a tree of the project based on the index
  /*
    For now, I've done this for you! It's not easy!
    If you get done early, check out the specs to implement this on your own!
  */
  let index = fs.readFileSync('./.fvs/index', 'utf8');
  let treeRoot = require('./helpers')(index);

  // step 2. create a commit object
  // if it's not the first commit, remember to
  // get current branch from HEAD, and get the parent tree from refs
  /*
    A commit object should look something like this:

    tree 2ba0f3bff73bd3f3ds212ba0f3bff73bd3f3ds21
    author {your name - go ahead and hard code it ;)}
    {your commit message!}

    If there is a parent, it should look like this:

    tree 2ba0f3bff73bd3f3ds212ba0f3bff73bd3f3ds21
    author {your name - go ahead and hard code it ;)}
    {your commit message!}
    parent f83b3bff73bd3f3ds212ba0f3bff73bd3f3ds21

    It should still be saved in the objects folder the same way tree and blob objects are saved!
  */

  // step 3. point the current branch at the new commit object

  // return the value of the commit's hash!
}

module.exports.handleDefault = function () {
  throw new Error('Not a recognized command!');
}

module.exports.createFVSObject = createFVSObject;
module.exports.createBlobObject = createBlobObject;
module.exports.updateIndex = updateIndex;
