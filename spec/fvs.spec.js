'use strict';

// Make sure to fill this in!!!!
const YOUR_NAME = 'Tom Kelly';

const expect = require('chai').expect;
const cp = require('child_process');
const fs = require('fs');
const crypto = require('crypto');
const rmdir = require('rimraf').sync;

const fvs = require('../fvs-your-funcs');
const getSha1 = require('../util').getSha1;

describe('FVS', function () {

  beforeEach(function () { rmdir('./.fvs') });
  afterEach(function () { rmdir('./.fvs') });

  it('is available as global module', function (done) {

    let process = cp.spawn('fvs', ['notacommand']);

    process.stdout.on('data', (d) => {
      expect(d.toString()).to.be.equal('Not a recognized command!\n');
      done();
    });
  });

  describe('helper functions', function () {

    describe('createFVSObject', function () {

      let hash;

      beforeEach(function () {
        fs.mkdirSync('.fvs');
        fs.mkdirSync('.fvs/objects');
        hash = getSha1('test content');
      });

      it('returns a hash of the filecontents', function () {
        let result = fvs.createFVSObject('test content');
        expect(result).to.be.equal(hash);
      });

      it('creates a directory with the first two characters as the directory name', function () {
        fvs.createFVSObject('test content');
        expect(fs.statSync('./.fvs/objects/' + hash.slice(0, 2))).to.exist;
      });

      it('creates a file with the remaining characters of the hash', function () {
        fvs.createFVSObject('test content');
        expect(fs.readFileSync('./.fvs/objects/' + hash.slice(0, 2) + '/' + hash.slice(2))).to.not.throw;
      });

      it('does not create a new object when one exists', function () {
        fvs.createFVSObject('test content');
        expect(fvs.createFVSObject('test content')).to.not.throw;
      });
    });

    describe('createBlobObject', function () {

      let hash;

      beforeEach(function () {
        fs.mkdirSync('.fvs');
        fs.mkdirSync('.fvs/objects');
        fs.writeFileSync('./test1.txt', 'test1 content', 'utf8');
        hash = getSha1('test1 content');
      });

      afterEach(function () { rmdir('test1.txt') });

      it('returns a hash of the filecontents of the given file', function () {
        let result = fvs.createBlobObject('test1.txt');
        expect(result).to.be.equal(hash);
      });

      it('does not create a new object when one exists', function () {
        fvs.createBlobObject('test1.txt');
        expect(fvs.createBlobObject('test1.txt')).to.not.throw;
      });
    });

    describe('updateIndex', function () {

      let hash,
          fileName,
          index;

      beforeEach(function () {
        fs.mkdirSync('.fvs');
        fs.mkdirSync('.fvs/objects');
        fs.writeFileSync('./test1.txt', 'test1 content', 'utf8');
        fs.writeFileSync('./.fvs/index', '', 'utf8');

        fileName = 'test1.txt';
        hash = getSha1('test1 content');
        index = ['test1.txt' + ' ' + hash];
      });

      afterEach(function () { rmdir('test1.txt') });

      it('creates a new entry in the index', function () {
        fvs.updateIndex(index, fileName, hash);
        expect(fs.readFileSync('./.fvs/index', 'utf8')).to.be.equal(index[0]);
      });

      it('updates an existing entry in the index', function () {
        fvs.updateIndex(index, fileName, hash);

        hash = getSha1('test1 edited content');
        index = ['test1.txt' + ' ' + hash];
        fvs.updateIndex(index, fileName, hash);

        expect(fs.readFileSync('./.fvs/index', 'utf8')).to.be.equal(index[0]);
      });
    });
  });

  describe('commands', function () {

    describe('accepts "init" as a command', function () {

      let rootDir,
          fvsDir,
          refs;

      it('creates the appropriate directories and files', function () {
        fvs.init();
        rootDir = fs.readdirSync('./');
        fvsDir = fs.readdirSync('./.fvs');
        refs = fs.readdirSync('./.fvs/refs');

        expect(rootDir.indexOf('.fvs') !== -1).to.be.true;
        expect(fvsDir.indexOf('objects') !== -1).to.be.true;
        expect(fvsDir.indexOf('HEAD') !== -1).to.be.true;
        expect(fvsDir.indexOf('refs') !== -1).to.be.true;
        expect(refs.indexOf('master') !== -1).to.be.true;
      });

      it('throws an error if an fvs directory already exists', function () {
        fs.mkdirSync('.fvs');
        expect(fvs.init).to.throw('.fvs already exists');
      });
    });

    describe ('accepts "add" as a command', function () {

      let blobRef,
          blobDir,
          blobFile;

      beforeEach(function () {
        fs.mkdirSync('.fvs');
        fs.mkdirSync('.fvs/objects');
        fs.writeFileSync('./test1.txt', 'test1 content', 'utf8');

        blobRef = getSha1('test1 content');
        blobDir = blobRef.slice(0, 2);
        blobFile = blobRef.slice(2);
      });

      afterEach(function () { rmdir('test1.txt') });

      it('throws an error if a filename is not specified', function () {
        process.argv = ['', 'fvs', 'add'];
        expect(fvs.add).to.throw('No filename specified');
      });

      it('creates a blob object that contains the content of test1.txt', function () {
        process.argv = ['', 'fvs', 'add', 'test1.txt'];
        fvs.add();
        let file = fs.readFileSync('./.fvs/objects/' + blobDir + '/' + blobFile, 'utf8');
        expect(file).to.be.equal('test1 content');
      });

      it('adds an index entry that points at the blob', function () {
        process.argv = ['', 'fvs', 'add', 'test1.txt'];
        fvs.add();
        let index = fs.readFileSync('./.fvs/index', 'utf8');

        expect(index).to.be.equal('test1.txt' + ' ' + blobRef);
      });

      it('updates the index entry after making a correction', function () {
        fs.writeFileSync('./test1.txt', 'test1 content edited', 'utf8');
        blobRef = getSha1('test1 content edited');
        blobDir = blobRef.slice(0, 2);
        blobFile = blobRef.slice(2);

        process.argv = ['', 'fvs', 'add', 'test1.txt'];
        fvs.add();
        let index = fs.readFileSync('./.fvs/index', 'utf8');

        expect(index).to.be.equal('test1.txt' + ' ' + blobRef);
      });
    });

    describe ('accepts "commit" as a command', function () {

      let blobHash,
          blobDir,
          blobFile,
          treeContent,
          treeHash,
          treeDir,
          treeFile,
          commitContent,
          commitHash,
          commitDir,
          commitFile,
          index;

      beforeEach(function () {
        fs.mkdirSync('.fvs');
        fs.mkdirSync('.fvs/objects');
        fs.writeFileSync('./test1.txt', 'test1 content', 'utf8');
        fs.mkdirSync('.fvs/refs');
        fs.writeFileSync('./.fvs/HEAD', 'ref: refs/master');
        fs.writeFileSync('./.fvs/refs/master');

        blobHash = getSha1('test1 content');
        blobDir = blobHash.slice(0, 2);
        blobFile = blobHash.slice(2);

        treeContent = 'blob' + ' ' + blobHash + '  ' + 'test1.txt';
        treeHash = getSha1(treeContent);
        treeDir = treeHash.slice(0, 2);
        treeFile = treeHash.slice(2);

        commitContent = '' +
          'tree ' + treeHash + '\n' +
          'author ' + YOUR_NAME + '\n' +
          'testing';

        commitHash = getSha1(commitContent);
        commitDir = commitHash.slice(0, 2);
        commitFile = commitHash.slice(2);

        index = 'test1.txt' + ' ' + blobHash;
        fs.writeFileSync('.fvs/index', index, 'utf8')
      });

      afterEach(function () { rmdir('test1.txt') });

      it('throws an error if a message is not defined', function () {
        process.argv = ['', 'fvs', 'commit'];
        expect(fvs.commit).to.throw('No commit message');
      });

      it('creates a tree graph to represent the content of the version of the project being committed', function () {
        process.argv = ['', 'fvs', 'commit', 'testing'];
        fvs.commit();

        let file = fs.readFileSync('./.fvs/objects/' + treeDir + '/' + treeFile, 'utf8');
        expect(file).to.be.equal(treeContent);
      });

      it('creates a commit object with a message, author, tree', function () {
        process.argv = ['', 'fvs', 'commit', 'testing'];
        fvs.commit();
        let file = fs.readFileSync('./.fvs/objects/' + commitDir + '/' + commitFile, 'utf8');
        expect(file).to.be.equal(commitContent);
      });

      it('points the current branch at the new commit object', function () {
        process.argv = ['', 'fvs', 'commit', 'testing'];
        fvs.commit();
        let file = fs.readFileSync('./.fvs/refs/master', 'utf8');
        expect(file).to.be.equal(commitHash);
      });

      it('includes the parent in the commit object if it is not the first commit', function () {
        process.argv = ['', 'fvs', 'commit', 'testing'];
        fvs.commit();

        fs.writeFileSync('./test1.txt', 'test1 content edited', 'utf8');
        process.argv = ['', 'fvs', 'add', 'test1.txt'];
        fvs.add();

        process.argv = ['', 'fvs', 'commit', 'testing2'];
        let matchString = 'parent ' + commitHash;
        let regexp = new RegExp(matchString);

        let hash = fvs.commit();
        commitDir = hash.slice(0, 2);
        commitFile = hash.slice(2);

        console.log('test', commitContent)
        let file = fs.readFileSync('./.fvs/objects/' + commitDir + '/' + commitFile, 'utf8');
        expect(regexp.test(file)).to.be.true;
      });
    });

  });
});
