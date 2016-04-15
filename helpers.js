'use strict';

/**

  Hey! Don't look here if you want to implement creating a project tree on your own

**/

const fs = require('fs');
const crypto = require('crypto');
const getSha1 = require('./util').getSha1;

function toObject (index, project) {
  project = project || {};
  index
    .split('\n')
    .forEach((entry, idx) => {

      entry = entry.split(' ');
      let file = entry[0];
      let path = file.split('/');
      let hash = entry[1];

      if (path.length <= 1) project[path[0]] = hash;
      else {
        if (project[path[0]])
          project[path[0]] = toObject(path.slice(1).join('/') + ' ' + hash, project[path[0]]);
        else
          project[path[0]] = toObject(path.slice(1).join('/') + ' ' + hash);
      }
    });
  return project;
}

function treeSum (project) {
  let treeFileContent = [];
  for (let key in project) {
    if (typeof project[key] === 'string')
      treeFileContent.push(`blob ${project[key]}  ${key}`);
    else
      treeFileContent.push(`tree ${treeSum(project[key])}  ${key}`);
  }
  return createTreeObject(treeFileContent.join('\n'));
}

function createTreeObject (contents) {
  let hash = getSha1(contents);
  let dir = '.fvs/objects/' + hash.slice(0, 2);
  let name = hash.slice(2);
  try {
    fs.statSync(dir);
  } catch (err) {
    fs.mkdirSync(dir);
    fs.writeFileSync(dir + '/' + name, contents, 'utf8');
  }
  return hash;
}

module.exports = function createTreesFromIndex (index) {
  let project = toObject(index);
  return treeSum(project);
}
