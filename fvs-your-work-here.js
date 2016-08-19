'use strict';

/**
* You'll be installing fvs as a global executable on your machine!
* The steps are below - but go ahead and take some time to try figuring it out on your own!
*
*
* 1. Add the following to your package.json: "bin" : { "fvs" : "./fvs.js" }
* 2. At the top of fvs.js, add #!/usr/bin/env node (this is done for you)
* 3. From your project's root: npm install -g ./
*
*/

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
*   fs.mkdirSync
*
* https://nodejs.org/api/fs.html
*
* I've also written you a getSha1 function (since you've already written one yourselves)!
*
*/
const fs = require('fs');
const getSha1 = require('./util').getSha1;


// Let's write some helper functions!


/**
 * createFVSObject takes the contents of a file (a string) as a parameter,
 * creates a sha1 hash of those file contents,
 * writes the object (directory/file pair) to our .fvs/objects directory,
 * and then returns the hash!
 */
function createFVSObject (fileContents) {
  // a. Hash the contents of the file
  
  // b. Use the first two characters of the hash as the directory in .fvs/objects
  
  // c. Check if the directory already exists! Do you know how to check if a directory exists in node?
  //      Hint: you'll need to use a try/catch block
  //      Another hint: look up fs.statSync
  
  // d. Write a file whose name is the rest of the hash, and whose contents is the contents of the file
  
  // e. Return the hash!
}

/**
 * createBlobObject can use our createFVSObject above.
 * The only difference is that createBlobObject accepts a filePath as a parameter -
 * we need to read the contents of that file !
 */
function createBlobObject (filePath) {
  // this will use our createFVSObject function above!
}

/**
 * updateIndex will update the index file with the passed in filePath and blobHash.
 * For example, if our index looks like this:
 * 
 * 'test1.txt 2ba0f3bff73bd3f3ds212ba0f3bff73bd3f3ds21'
 * 
 * and we pass in a filePath of 'test2.txt' and 'f83b3bff73bd3f3ds212ba0f3bff73bd3f3ds21',
 * the new index we return should look something like:
 * 
 * 'test1.txt 2ba0f3bff73bd3f3ds212ba0f3bff73bd3f3ds21' + '\n' +
 * 'test2.txt f83b3bff73bd3f3ds212ba0f3bff73bd3f3ds21'
 *  
 * 
 * 
 * Watch out - If we pass in a duplicate filePath, we should replace the previous entry!
 * 
 * So if the index looks like this:
 * 
 * 'test1.txt 2ba0f3bff73bd3f3ds212ba0f3bff73bd3f3ds21'
 * 
 * and we pass in 'test1.txt' and 'f83b3bff73bd3f3ds212ba0f3bff73bd3f3ds21',
 * the new index will say:
 * 
 * 'test1.txt f83b3bff73bd3f3ds212ba0f3bff73bd3f3ds21'
 * 
 * 
 * 
 * NOTE: the index passed in here is a string representing the result of reading the index file
 * If the index file did not previously exist, assume that you created it and set its contents to an empty string
 * This means that you should account for getting a '' passed in as well!
 */
function updateIndex (index, filePath, blobHash) {
  // a. parse the index into an array (if the index is empty, it should be an empty array)
  
  // b. check if the file already has an index entry, and remove it if it does!
  
  // c. add the new line to the index
  
  // d. parse the new index back into a string and write it to .fvs/index
  
  // e. return string of the new index!
}

module.exports.init = function () {
  // step 1. if a .fvs file already exists, we should short circuit

  // step 2. do you remember the files/directories we need to make?
  
  /**
   *  .fvs/
   *    objects/
   *    refs/master
   *    HEAD
   */
};

/**
 * 
 * At this point, create a new directory and try typing 'fvs' into you command line -
 * if you `ls -a` you should see your fvs directory, and if you `cd .fvs`, you should
 * be able to explore it!
 * 
 */

module.exports.add = function () {

  // step 0a. make sure a filename is passed in as an argument

  // step 0b. create the index if none exists

  // step 1: create a 'blob' object in .fvs/objects (Hey, remember those functions we wrote earlier...?)

  // step 2: add the file to the index

  /**
   * You should make sure that the filename includes the path relative to the root directory.
   * For example: if your root directory has a directory 'data', which contains 'something.txt'
   * your index entry for this file should read data/something.txt 2ba0f3bff73bd3f3ds212ba0f3bff73bd3f3ds21.
  */

  // return the value of the added blob's hash!
};

/**
 * 
 * Awesome job getting this far! Try playing around by running `fvs` in a new directory,
 * `touch <anyFileName.js>`, and try to `fvs add <anyFileName.js>!` Can you find the fvs objects
 * that got created? What does the index look like? 
 * 
 */

module.exports.commit = function () {

  // step 0a. make sure we have a lovely commit message!

  // step 1. create a tree of the project based on the index

  /**
   * For now, I've done this for you! It's not easy!
   * If you get done early, try implementing this on your own!
   */
  let index = fs.readFileSync('./.fvs/index', 'utf8');
  let treeRootHash = require('./helpers')(index);

  // step 2. create a commit object
    // if it's not the first commit, remember to get current branch from HEAD, and get the parent tree from refs

  /**
   * A commit object should look like this:
   *
   * tree 2ba0f3bff73bd3f3ds212ba0f3bff73bd3f3ds21 (This is the treeRootHash defined above!)
   * author { your name - go ahead and hard code it ;) }
   * { your commit message! }
   *
   * If there is a parent, it should look like this:
   *
   * tree 2ba0f3bff73bd3f3ds212ba0f3bff73bd3f3ds21
   * author { your name - go ahead and hard code it ;) }
   * { your commit message! }
   * parent f83b3bff73bd3f3ds212ba0f3bff73bd3f3ds21
   *
   * It should still be saved in the objects folder the same way tree and blob objects are saved!
   */

  // step 3. point the current branch at the new commit object

  // return the value of the commit's hash!
};

/**
 * 
 * Awesome! You know what to do! Go ahead and start adding and commiting like a real project!
 * It will totally work!
 * 
 */

/**
*
* EXTRA CREDIT (no specs - you're on your own!)
* Don't forget to include these in fvs-cli-helper!
*
**/

module.exports.branch = function () {

  // step 1. get the hash of the current commit from the file pointed to in HEAD

  // step 2. create the branch file at refs/
    // NOTE: in the real Git, this is in refs/heads, but we've simplified it here to just be in refs/

  // return the current commit's hash!
};

// This isn't beyond you, but it's not a piece of cake either!
// You'll need to traverse the tree - feel free to work on this
// or implement the behavior from the ./helpers file.
module.exports.checkout = function () {
  // step 1. get the commit hash that the branch points to

  // step 2. write the contents of the file tree to the working copy

  // step 3. write the file entries to the index

  // step 4. point HEAD at the new branch
};


module.exports.handleDefault = function () {
  throw 'Not a recognized command!';
};

module.exports.createFVSObject = createFVSObject;
module.exports.createBlobObject = createBlobObject;
module.exports.updateIndex = updateIndex;
